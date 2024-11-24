import { useState } from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { toast } from 'react-hot-toast';
import { useBridge } from '../hooks/useBridge';
import { useBridgeStore } from '../stores/bridgeStore';
import { contracts } from '../config/contracts';
import NetworkSelector from './NetworkSelector';
import BridgeStatus from './BridgeStatus';
import TransactionToast from './TransactionToast';

export default function BridgeInterface() {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { txHash, isPending, isSuccess, error, setTxHash, setStatus } = useBridgeStore();

  const { bridgeTokens, isL1 } = useBridge({
    onSubmitted: (hash) => {
      setTxHash(hash);
      setStatus({ isPending: true, isSuccess: false, error: null });
      toast.success('Transaction submitted! Waiting for confirmation...', {
        duration: 5000,
      });
    },
    onSuccess: (hash) => {
      setStatus({ isPending: false, isSuccess: true });
      toast((t) => (
        <TransactionToast
          txHash={hash}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ), {
        duration: 10000,
      });
    },
    onError: (error) => {
      setStatus({ isPending: false, error: error.message });
      toast.error(error.message || 'Transaction failed', {
        duration: 8000,
      });
    },
  });

  const { data: l1Balance } = useBalance({
    address,
    chainId: sepolia.id,
    watch: true,
  });

  const { data: l2Balance } = useBalance({
    address,
    chainId: baseSepolia.id,
    watch: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const currentBalance = isL1 ? l1Balance : l2Balance;
    if (currentBalance && Number(amount) > Number(currentBalance.formatted)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await bridgeTokens(amount);
    } catch (err) {
      console.error('Bridge submission error:', err);
      toast.error('Failed to submit bridge transaction. Please try again.');
    }
  };

  const handleDismissStatus = () => {
    useBridgeStore.getState().reset();
  };

  return (
    <div className="bg-background-card rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <NetworkSelector />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-text-primary">
          {isL1 ? 'Bridge ETH from Sepolia to Base Sepolia' : 'Bridge ETH from Base Sepolia to Sepolia'}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-background-input rounded-lg">
            <div className="text-sm text-text-secondary">Sepolia Balance</div>
            <div className="text-xl font-medium text-text-primary">
              {l1Balance ? `${Number(l1Balance.formatted).toFixed(4)} ${l1Balance.symbol}` : '0.00 ETH'}
            </div>
          </div>
          <div className="p-4 bg-background-input rounded-lg">
            <div className="text-sm text-text-secondary">Base Sepolia Balance</div>
            <div className="text-xl font-medium text-text-primary">
              {l2Balance ? `${Number(l2Balance.formatted).toFixed(4)} ${l2Balance.symbol}` : '0.00 ETH'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Amount to Bridge
            </label>
            <div className="relative rounded-lg">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-background-input border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                placeholder="0.0"
                pattern="^[0-9]*[.,]?[0-9]*$"
                disabled={isPending}
              />
              <div className="absolute right-3 top-3 text-text-secondary">ETH</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!amount || isPending}
            className={`w-full py-3 px-4 rounded-lg text-text-primary font-medium transition-colors ${
              isPending ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary hover:opacity-90'
            }`}
          >
            {isPending ? 'Processing...' : `Bridge to ${isL1 ? 'Base Sepolia' : 'Sepolia'}`}
          </button>
        </form>

        {(isPending || isSuccess || error) && (
          <BridgeStatus 
            onDismiss={handleDismissStatus}
          />
        )}
      </div>
    </div>
  );
}