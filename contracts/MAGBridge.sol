// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@layerzerolabs/solidity-examples/contracts/interfaces/ILayerZeroEndpoint.sol";

contract MAGBridge is Pausable, AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    
    uint256 public constant RATE_LIMIT = 50 ether;
    uint256 public constant TIMELOCK_THRESHOLD = 100 ether;
    uint256 public constant TIMELOCK_PERIOD = 24 hours;
    
    ILayerZeroEndpoint public immutable lzEndpoint;
    AggregatorV3Interface public immutable ethPriceFeed;
    
    mapping(address => bool) public blacklist;
    mapping(uint256 => mapping(address => uint256)) public hourlyVolume;
    mapping(bytes32 => TimelockTransfer) public timelockTransfers;
    
    struct TimelockTransfer {
        address sender;
        address recipient;
        uint256 amount;
        uint256 unlockTime;
        bool executed;
    }
    
    event BridgeInitiated(address indexed sender, uint256 amount, uint16 destChainId);
    event TimelockTransferCreated(bytes32 indexed transferId, address sender, uint256 amount);
    event TimelockTransferExecuted(bytes32 indexed transferId);
    
    constructor(
        address _lzEndpoint,
        address _ethPriceFeed
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        ethPriceFeed = AggregatorV3Interface(_ethPriceFeed);
    }
    
    function bridge(
        address _token,
        uint256 _amount,
        uint16 _destChainId
    ) external nonReentrant whenNotPaused {
        require(!blacklist[msg.sender], "Sender is blacklisted");
        require(_checkRateLimit(msg.sender, _amount), "Rate limit exceeded");
        
        if (_amount > TIMELOCK_THRESHOLD) {
            _createTimelockTransfer(_token, msg.sender, _amount, _destChainId);
        } else {
            _executeBridge(_token, msg.sender, _amount, _destChainId);
        }
    }
    
    function _checkRateLimit(address _sender, uint256 _amount) internal returns (bool) {
        uint256 currentHour = block.timestamp / 1 hours;
        uint256 newAmount = hourlyVolume[currentHour][_sender] + _amount;
        require(newAmount <= RATE_LIMIT, "Hourly rate limit exceeded");
        
        hourlyVolume[currentHour][_sender] = newAmount;
        return true;
    }
    
    function _createTimelockTransfer(
        address _token,
        address _sender,
        uint256 _amount,
        uint16 _destChainId
    ) internal {
        bytes32 transferId = keccak256(
            abi.encodePacked(_sender, _amount, _destChainId, block.timestamp)
        );
        
        timelockTransfers[transferId] = TimelockTransfer({
            sender: _sender,
            recipient: _sender,
            amount: _amount,
            unlockTime: block.timestamp + TIMELOCK_PERIOD,
            executed: false
        });
        
        emit TimelockTransferCreated(transferId, _sender, _amount);
    }
    
    function executeTimelockTransfer(bytes32 _transferId) external nonReentrant {
        TimelockTransfer storage transfer = timelockTransfers[_transferId];
        require(!transfer.executed, "Transfer already executed");
        require(block.timestamp >= transfer.unlockTime, "Transfer still locked");
        
        transfer.executed = true;
        _executeBridge(
            address(0), // Replace with actual token address
            transfer.sender,
            transfer.amount,
            0 // Replace with actual destination chain ID
        );
        
        emit TimelockTransferExecuted(_transferId);
    }
    
    function _executeBridge(
        address _token,
        address _sender,
        uint256 _amount,
        uint16 _destChainId
    ) internal {
        // Implementation will vary based on specific bridge requirements
        // This is a placeholder for the actual bridge logic
    }
    
    function addToBlacklist(address _account) external onlyRole(GUARDIAN_ROLE) {
        blacklist[_account] = true;
    }
    
    function removeFromBlacklist(address _account) external onlyRole(GUARDIAN_ROLE) {
        blacklist[_account] = false;
    }
    
    function pause() external onlyRole(GUARDIAN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(GUARDIAN_ROLE) {
        _unpause();
    }
}