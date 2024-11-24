import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { config, chains } from './config/wagmi';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5000,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider 
          chains={chains} 
          theme={darkTheme({
            accentColor: '#2DFFF9',
            accentColorForeground: 'black',
          })}
        >
          <App />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#363636',
                color: '#DAEFFF',
                borderRadius: '8px',
                border: '1px solid #2DFFF9',
              },
              success: {
                duration: 5000,
                iconTheme: {
                  primary: '#2DFFF9',
                  secondary: '#363636',
                },
              },
              error: {
                duration: 7000,
                iconTheme: {
                  primary: '#FF7777',
                  secondary: '#363636',
                },
              },
            }}
          />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);