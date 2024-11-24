import React from 'react';
import { useNetwork } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { contracts } from '../config/contracts';

interface TransactionToastProps {
  txHash: string;
  onDismiss: () => void;
}

export default function TransactionToast({ txHash, onDismiss }: TransactionToastProps) {
  const { chain } = useNetwork();

  const getExplorerUrl = () => {
    const config = chain?.id === sepolia.id 
      ? contracts.sepolia 
      : contracts.baseSepolia;
    return `${config.explorer}/tx/${txHash}`;
  };

  return (
    <div className="flex items-center space-x-3 bg-background-card rounded-lg shadow-lg p-4 min-w-[300px]">
      <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
      <div className="flex-1">
        <p className="text-text-primary font-medium">Transaction Confirmed!</p>
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:opacity-80 text-sm"
        >
          View on {chain?.id === baseSepolia.id ? 'Base Scan' : 'Etherscan'}
        </a>
      </div>
      <button
        onClick={() => {
          onDismiss();
          toast.dismiss();
        }}
        className="text-text-secondary hover:text-text-primary"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}