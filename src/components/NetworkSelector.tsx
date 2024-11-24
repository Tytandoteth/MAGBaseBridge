import React, { useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { toast } from 'react-hot-toast';
import { useBridgeStore } from '../stores/bridgeStore';
import NetworkSwitchConfirmation from './NetworkSwitchConfirmation';

const chains = [sepolia, baseSepolia];

export default function NetworkSelector() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChainId, setPendingChainId] = useState<number | null>(null);
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork({
    onSuccess: () => {
      useBridgeStore.getState().reset();
      toast.success('Network switched successfully', {
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error(`Failed to switch network: ${error.message}`, {
        duration: 5000,
      });
    },
  });

  const handleNetworkChange = (chainId: number) => {
    const bridgeStore = useBridgeStore.getState();
    if (bridgeStore.isPending || bridgeStore.isSuccess) {
      setPendingChainId(chainId);
      setShowConfirmation(true);
    } else {
      switchNetwork?.(chainId);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingChainId !== null) {
      switchNetwork?.(pendingChainId);
      setPendingChainId(null);
    }
    setShowConfirmation(false);
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Network
        </label>
        <select
          value={chain?.id ?? ''}
          onChange={(e) => handleNetworkChange(Number(e.target.value))}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-text-primary"
        >
          <option value="" disabled>Select Network</option>
          {chains.map((option) => (
            <option 
              key={option.id} 
              value={option.id}
            >
              {option.name} {isLoading && pendingChainId === option.id ? '(Switching...)' : ''}
            </option>
          ))}
        </select>
        {isLoading && (
          <p className="mt-1 text-sm text-text-secondary">
            Switching network...
          </p>
        )}
      </div>

      <NetworkSwitchConfirmation
        isOpen={showConfirmation}
        onConfirm={handleConfirmSwitch}
        onCancel={() => {
          setShowConfirmation(false);
          setPendingChainId(null);
        }}
      />
    </>
  );
}