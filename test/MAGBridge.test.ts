import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { MAGBridge } from "../typechain-types";

describe("MAGBridge", function () {
  async function deployBridgeFixture() {
    const [owner, operator1, operator2, operator3, operator4, operator5, user] = await ethers.getSigners();
    
    // Deploy mock LayerZero endpoint
    const MockLZEndpoint = await ethers.getContractFactory("MockLZEndpoint");
    const lzEndpoint = await MockLZEndpoint.deploy();
    
    // Deploy mock price feed
    const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
    const ethPriceFeed = await MockV3Aggregator.deploy(8, 200000000000); // $2000 with 8 decimals
    
    // Deploy bridge
    const MAGBridge = await ethers.getContractFactory("MAGBridge");
    const bridge = await MAGBridge.deploy(
      await lzEndpoint.getAddress(),
      await ethPriceFeed.getAddress()
    );
    
    // Setup operators
    await bridge.grantRole(await bridge.OPERATOR_ROLE(), operator1.address);
    await bridge.grantRole(await bridge.OPERATOR_ROLE(), operator2.address);
    await bridge.grantRole(await bridge.OPERATOR_ROLE(), operator3.address);
    await bridge.grantRole(await bridge.OPERATOR_ROLE(), operator4.address);
    await bridge.grantRole(await bridge.OPERATOR_ROLE(), operator5.address);
    
    return { 
      bridge, 
      lzEndpoint, 
      ethPriceFeed, 
      owner, 
      operators: [operator1, operator2, operator3, operator4, operator5],
      user 
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { bridge, owner } = await loadFixture(deployBridgeFixture);
      expect(await bridge.hasRole(await bridge.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should set the correct LayerZero endpoint", async function () {
      const { bridge, lzEndpoint } = await loadFixture(deployBridgeFixture);
      expect(await bridge.lzEndpoint()).to.equal(await lzEndpoint.getAddress());
    });
  });

  describe("Rate Limiting", function () {
    it("Should enforce hourly rate limit", async function () {
      const { bridge, user } = await loadFixture(deployBridgeFixture);
      const rateLimit = await bridge.RATE_LIMIT();
      
      // First transaction within limit should succeed
      await expect(bridge.connect(user).bridge(
        ethers.ZeroAddress,
        rateLimit,
        1 // destination chain ID
      )).to.not.be.reverted;
      
      // Second transaction exceeding limit should fail
      await expect(bridge.connect(user).bridge(
        ethers.ZeroAddress,
        1,
        1
      )).to.be.revertedWith("Hourly rate limit exceeded");
    });
  });

  describe("Timelock", function () {
    it("Should create timelock for large transfers", async function () {
      const { bridge, user } = await loadFixture(deployBridgeFixture);
      const amount = await bridge.TIMELOCK_THRESHOLD();
      
      await expect(bridge.connect(user).bridge(
        ethers.ZeroAddress,
        amount + 1n,
        1
      )).to.emit(bridge, "TimelockTransferCreated");
    });

    it("Should not allow execution before timelock period", async function () {
      const { bridge, user } = await loadFixture(deployBridgeFixture);
      const amount = await bridge.TIMELOCK_THRESHOLD();
      
      await bridge.connect(user).bridge(
        ethers.ZeroAddress,
        amount + 1n,
        1
      );
      
      // Try to execute immediately
      const transferId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256", "uint16", "uint256"],
          [user.address, amount + 1n, 1, await ethers.provider.getBlock("latest").then(b => b!.timestamp)]
        )
      );
      
      await expect(bridge.executeTimelockTransfer(transferId))
        .to.be.revertedWith("Transfer still locked");
    });
  });

  describe("Access Control", function () {
    it("Should allow guardians to pause", async function () {
      const { bridge, operators } = await loadFixture(deployBridgeFixture);
      await bridge.grantRole(await bridge.GUARDIAN_ROLE(), operators[0].address);
      
      await expect(bridge.connect(operators[0]).pause())
        .to.not.be.reverted;
    });

    it("Should prevent non-guardians from pausing", async function () {
      const { bridge, user } = await loadFixture(deployBridgeFixture);
      
      await expect(bridge.connect(user).pause())
        .to.be.reverted;
    });
  });
});