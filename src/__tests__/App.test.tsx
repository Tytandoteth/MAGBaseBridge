import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';
import App from '../App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}

describe('App', () => {
  it('renders the app title', () => {
    render(<App />, { wrapper });
    expect(screen.getByText('MAG Token Bridge')).toBeInTheDocument();
  });

  it('shows connect wallet button when not connected', () => {
    render(<App />, { wrapper });
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
  });
});