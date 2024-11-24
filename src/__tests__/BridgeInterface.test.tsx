import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, chains } from '../config/wagmi';
import BridgeInterface from '../components/BridgeInterface';

// Mock the bridge hook
vi.mock('../hooks/useBridge', () => ({
  useBridge: () => ({
    bridgeTokens: vi.fn(),
    isPending: false,
    isSuccess: false,
    error: null,
    isL1: true,
  }),
}));

// Mock wagmi hooks
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useAccount: () => ({
      address: '0x123',
      isConnected: true,
    }),
    useBalance: () => ({
      data: {
        formatted: '1.0',
        symbol: 'ETH',
      },
    }),
    useNetwork: () => ({
      chain: { id: 11155111 }, // Sepolia
    }),
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

describe('BridgeInterface', () => {
  it('renders bridge form when wallet is connected', () => {
    render(<BridgeInterface />, { wrapper });
    expect(screen.getByText(/Amount to Bridge/i)).toBeInTheDocument();
  });

  it('shows network selector', () => {
    render(<BridgeInterface />, { wrapper });
    expect(screen.getByText(/Network/i)).toBeInTheDocument();
  });

  it('shows balance information', () => {
    render(<BridgeInterface />, { wrapper });
    expect(screen.getByText(/1.0 ETH/i)).toBeInTheDocument();
  });

  it('validates input amount', async () => {
    render(<BridgeInterface />, { wrapper });
    
    const input = screen.getByPlaceholderText('0.0');
    fireEvent.change(input, { target: { value: '-1' } });
    
    const submitButton = screen.getByRole('button', { name: /Bridge to/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid amount/i)).toBeInTheDocument();
    });
  });
});