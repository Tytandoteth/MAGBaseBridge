import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import ConnectWallet from '../components/ConnectWallet';

// Mock wagmi hooks
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useConnect: () => ({
      connect: vi.fn(),
      connectors: [{ id: 'mock', name: 'Mock Wallet', ready: true }],
      error: null,
      isLoading: false,
      pendingConnector: null
    })
  };
});

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: publicProvider(),
  },
});

describe('ConnectWallet', () => {
  it('renders connect button', () => {
    render(
      <WagmiConfig config={config}>
        <ConnectWallet />
      </WagmiConfig>
    );
    
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
  });
});