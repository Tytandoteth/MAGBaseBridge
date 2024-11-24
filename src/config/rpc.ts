import { sepolia, baseSepolia } from 'wagmi/chains';

export const RPC_CONFIG = {
  [sepolia.network]: {
    urls: [
      'https://rpc.sepolia.org',
      'https://sepolia.gateway.tenderly.co',
      'https://ethereum-sepolia.publicnode.com',
    ],
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000,
  },
  [baseSepolia.network]: {
    urls: [
      'https://sepolia.base.org',
      'https://base-sepolia.blockpi.network/v1/rpc/public',
      'https://1rpc.io/base-sepolia',
    ],
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000,
  },
};