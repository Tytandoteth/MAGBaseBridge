import { useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { toast } from 'react-hot-toast';
import { connectors } from '../config/wagmi';

export function useWalletConnection() {
  const { 
    connect: wagmiConnect, 
    error, 
    isLoading, 
    pendingConnector,
    reset: resetConnect,
  } = useConnect({
    onSuccess: (data) => {
      toast.success(`Connected to ${data.connector?.name || 'wallet'}`, {
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('Wallet connection error:', error);
      toast.error(error.message || 'Failed to connect wallet', {
        duration: 5000,
      });
    },
  });

  const { 
    disconnect: wagmiDisconnect,
    reset: resetDisconnect,
  } = useDisconnect({
    onSuccess: () => {
      toast.success('Wallet disconnected', {
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('Wallet disconnect error:', error);
      toast.error('Failed to disconnect wallet', {
        duration: 5000,
      });
    },
  });

  const connect = useCallback(async (connector: typeof connectors[number]) => {
    try {
      if (!connector.ready) {
        throw new Error(`${connector.name} is not installed or available`);
      }
      
      await wagmiConnect({ connector });
    } catch (err) {
      console.error('Wallet connection error:', err);
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      toast.error(message, {
        duration: 5000,
      });
    }
  }, [wagmiConnect]);

  const disconnect = useCallback(async () => {
    try {
      await wagmiDisconnect();
      resetConnect();
      resetDisconnect();
    } catch (err) {
      console.error('Wallet disconnect error:', err);
      toast.error('Failed to disconnect wallet', {
        duration: 5000,
      });
    }
  }, [wagmiDisconnect, resetConnect, resetDisconnect]);

  return {
    connect,
    disconnect,
    connectors: connectors.filter(c => c.ready),
    error,
    isLoading,
    pendingConnector,
  };
}