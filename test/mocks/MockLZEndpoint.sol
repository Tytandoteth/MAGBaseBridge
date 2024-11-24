// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@layerzerolabs/solidity-examples/contracts/interfaces/ILayerZeroEndpoint.sol";

contract MockLZEndpoint is ILayerZeroEndpoint {
    uint16 public constant ENDPOINT_VERSION = 1;
    
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable override {
        // Mock implementation
    }
    
    function receivePayload(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        address _dstAddress,
        uint64 _nonce,
        uint256 _gasLimit,
        bytes calldata _payload
    ) external override {
        // Mock implementation
    }
    
    function getInboundNonce(uint16 _srcChainId, bytes calldata _srcAddress) external view override returns (uint64) {
        return 0;
    }
    
    function getOutboundNonce(uint16 _dstChainId, address _srcAddress) external view override returns (uint64) {
        return 0;
    }
    
    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParam
    ) external view override returns (uint256 nativeFee, uint256 zroFee) {
        return (0, 0);
    }
    
    function getChainId() external view override returns (uint16) {
        return 1;
    }
    
    function retryPayload(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        bytes calldata _payload
    ) external override {
        // Mock implementation
    }
    
    function hasStoredPayload(uint16 _srcChainId, bytes calldata _srcAddress) external view override returns (bool) {
        return false;
    }
    
    function getSendLibraryAddress(address _userApplication) external view override returns (address) {
        return address(0);
    }
    
    function getReceiveLibraryAddress(address _userApplication) external view override returns (address) {
        return address(0);
    }
    
    function isSendingPayload() external view override returns (bool) {
        return false;
    }
    
    function isReceivingPayload() external view override returns (bool) {
        return false;
    }
    
    function getConfig(
        uint16 _version,
        uint16 _chainId,
        address _userApplication,
        uint256 _configType
    ) external view override returns (bytes memory) {
        return "";
    }
    
    function getSendVersion(address _userApplication) external view override returns (uint16) {
        return 1;
    }
    
    function getReceiveVersion(address _userApplication) external view override returns (uint16) {
        return 1;
    }
}