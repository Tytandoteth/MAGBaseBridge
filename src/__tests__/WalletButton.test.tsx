import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, chains } from '../config/wagmi';
import WalletButton from '../components/WalletButton';

// Mock RainbowKit hooks
vi.mock('@rainbow-me/rainbowkit', async () => {
  const actual = await vi.importActual('@rainbow-me/rainbowkit');
  return {
    ...actual,
    ConnectButton: {
      Custom: ({ children }: any) => children({
        account: null,
        chain: null,
        openAccountModal: vi.fn(),
        openChainModal: vi.fn(),
        openConnectModal: vi.fn(),
        authenticationStatus: 'authenticated',
        mounted: true,
      }),
    },
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

describe('WalletButton', () => {
  it('renders connect button when not connected', () => {
    render(<WalletButton />, { wrapper });
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
  });

  it('handles click on connect button', () => {
    render(<WalletButton />, { wrapper });
    const connectButton = screen.getByText(/Connect Wallet/i);
    fireEvent.click(connectButton);
    // Modal opening is handled by RainbowKit
  });
});