import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [sepolia, baseSepolia],
  [publicProvider()],
  {
    pollingInterval: 5000,
    retryCount: 3,
    stallTimeout: 5000,
  }
);

const { connectors } = getDefaultWallets({
  appName: 'MAG ETH Bridge',
  projectId,
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains, config };