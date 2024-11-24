import { useState, useCallback } from 'react';
import { useAccount, useNetwork, usePublicClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { type Hash } from 'viem';
import { BridgeService } from '../services/bridge';
import { contracts } from '../config/contracts';
import { toast } from 'react-hot-toast';

interface UseBridgeOptions {
  onSubmitted?: (hash: Hash) => void;
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

export function useBridge(options?: UseBridgeOptions) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isL1 = chain?.id === sepolia.id;

  const bridgeTokens = useCallback(async (amount: string) => {
    if (!address || !publicClient || !chain) {
      const error = new Error('Wallet not connected properly');
      options?.onError?.(error);
      setError(error.message);
      return;
    }

    try {
      setError(null);
      setIsPending(true);
      setIsSuccess(false);

      const bridgeService = new BridgeService(
        publicClient,
        isL1 ? contracts.sepolia.bridge : contracts.baseSepolia.bridge,
        isL1
      );

      const hash = await bridgeService.bridgeTokens(
        address,
        amount,
        options?.onSubmitted
      );
      
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 2,
        timeout: 60_000,
      });

      if (receipt.status === 'success') {
        setIsSuccess(true);
        options?.onSuccess?.(hash);
        toast.success('Bridge transaction successful!');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Bridge error:', err);
      const error = err instanceof Error ? err : new Error('Failed to bridge tokens');
      setError(error.message);
      options?.onError?.(error);
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }, [address, chain, isL1, publicClient, options]);

  return {
    bridgeTokens,
    isPending,
    isSuccess,
    error,
    isL1,
  };
}