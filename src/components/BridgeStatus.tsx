import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useNetwork } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useBridgeStore } from '../stores/bridgeStore';
import { contracts } from '../config/contracts';
import { useBridgeStatus } from '../hooks/useBridgeStatus';

interface BridgeStatusProps {
  onDismiss?: () => void;
}

export default function BridgeStatus({ onDismiss }: BridgeStatusProps) {
  const { chain } = useNetwork();
  const { txHash } = useBridgeStore();
  const isL1 = chain?.id === sepolia.id;
  
  const status = useBridgeStatus(txHash);

  const getExplorerUrl = (hash: string, isSource: boolean) => {
    const chainConfig = isSource
      ? (isL1 ? contracts.sepolia : contracts.baseSepolia)
      : (isL1 ? contracts.baseSepolia : contracts.sepolia);
    return `${chainConfig.explorer}/tx/${hash}`;
  };

  if (!txHash) return null;

  return (
    <div className="relative p-4 bg-background-card border border-primary rounded-lg space-y-4">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-primary hover:opacity-80"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-text-primary">Bridge Status</h4>
        
        <div className="space-y-4">
          {/* Source Chain Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {status.sourceChain.error ? (
                <ExclamationCircleIcon className="h-5 w-5 text-error" />
              ) : status.sourceChain.confirmed ? (
                <CheckCircleIcon className="h-5 w-5 text-primary" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              )}
              <span className="text-sm font-medium text-text-primary">
                {isL1 ? 'Sepolia (Source)' : 'Base Sepolia (Source)'}
              </span>
            </div>
            {txHash && (
              <a
                href={getExplorerUrl(txHash, true)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:opacity-80"
              >
                View transaction →
              </a>
            )}
          </div>

          {/* Destination Chain Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {status.destinationChain.error ? (
                <ExclamationCircleIcon className="h-5 w-5 text-error" />
              ) : status.destinationChain.confirmed ? (
                <CheckCircleIcon className="h-5 w-5 text-primary" />
              ) : status.sourceChain.confirmed ? (
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
              )}
              <span className="text-sm font-medium text-text-primary">
                {isL1 ? 'Base Sepolia (Destination)' : 'Sepolia (Destination)'}
              </span>
            </div>
            {status.destinationChain.txHash && (
              <a
                href={getExplorerUrl(status.destinationChain.txHash, false)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:opacity-80"
              >
                View transaction →
              </a>
            )}
          </div>

          {/* Status Messages */}
          {status.sourceChain.error && (
            <div className="p-3 bg-error/10 rounded-lg">
              <p className="text-sm text-error">{status.sourceChain.error}</p>
            </div>
          )}
          {status.destinationChain.error && (
            <div className="p-3 bg-error/10 rounded-lg">
              <p className="text-sm text-error">{status.destinationChain.error}</p>
            </div>
          )}
          {status.sourceChain.confirmed && !status.destinationChain.confirmed && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-text-primary">
                Transaction confirmed on source chain. Waiting for confirmation on destination chain...
              </p>
            </div>
          )}
          {status.destinationChain.confirmed && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-text-primary">
                Bridge transaction completed successfully! 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}