import { useState, useEffect, useCallback } from 'react';
import { useMessageRelay } from './useMessageRelay';
import { type Hash } from 'viem';
import { toast } from 'react-hot-toast';

interface BridgeStatus {
  sourceChain: {
    confirmed: boolean;
    error?: string;
  };
  destinationChain: {
    confirmed: boolean;
    error?: string;
    txHash?: Hash;
  };
}

export function useBridgeStatus(txHash?: Hash) {
  const [status, setStatus] = useState<BridgeStatus>({
    sourceChain: { confirmed: false },
    destinationChain: { confirmed: false }
  });

  const messageRelay = useMessageRelay();

  const checkStatus = useCallback(async () => {
    if (!txHash || !messageRelay) return;

    try {
      const messageStatus = await messageRelay.monitorMessage(txHash);

      setStatus({
        sourceChain: {
          confirmed: messageStatus.sourceStatus === 'confirmed',
          error: messageStatus.sourceStatus === 'failed' ? 'Transaction failed on source chain' : undefined
        },
        destinationChain: {
          confirmed: messageStatus.destinationStatus === 'confirmed',
          error: messageStatus.destinationStatus === 'failed' ? 'Transaction failed on destination chain' : undefined,
          txHash: messageStatus.messageHash
        }
      });

      if (messageStatus.sourceStatus === 'failed' || messageStatus.destinationStatus === 'failed') {
        toast.error('Bridge transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Bridge status check failed:', error);
      setStatus(prev => ({
        ...prev,
        sourceChain: {
          ...prev.sourceChain,
          error: 'Failed to verify transaction status'
        }
      }));
    }
  }, [txHash, messageRelay]);

  useEffect(() => {
    if (!txHash) return;

    const interval = setInterval(checkStatus, 5000);
    checkStatus();

    return () => clearInterval(interval);
  }, [txHash, checkStatus]);

  return status;
}