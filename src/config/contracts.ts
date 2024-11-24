export const contracts = {
  sepolia: {
    bridge: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
    gateway: '0x0dE926fE2001B2c96e9cA6b79089CEB276325E9F',
    explorer: 'https://sepolia.etherscan.io',
    minGasLimit: 200000n,
  },
  baseSepolia: {
    bridge: '0x4200000000000000000000000000000000000010',
    gateway: '0x4200000000000000000000000000000000000016',
    explorer: 'https://sepolia.basescan.org',
    minGasLimit: 200000n,
  }
};

// Re-export for backward compatibility
export const BRIDGE_ADDRESSES = {
  sepolia: {
    l1Bridge: contracts.sepolia.bridge,
    l1Gateway: contracts.sepolia.gateway,
    l2Bridge: contracts.baseSepolia.bridge,
    l2Gateway: contracts.baseSepolia.gateway,
    explorer: contracts.sepolia.explorer
  },
  baseSepolia: {
    l1Bridge: contracts.sepolia.bridge,
    l1Gateway: contracts.sepolia.gateway,
    l2Bridge: contracts.baseSepolia.bridge,
    l2Gateway: contracts.baseSepolia.gateway,
    explorer: contracts.baseSepolia.explorer
  }
};