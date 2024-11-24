import React from 'react';
import { useAccount, useBalance } from 'wagmi';

export default function WalletInfo() {
  const { address, connector } = useAccount();
  const { data: balance } = useBalance({ address });

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!address) return null;

  return (
    <div className="bg-background-card rounded-lg p-4 mb-4 shadow-md">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-text-secondary">Connected Wallet</p>
          <p className="font-mono text-sm text-text-primary">{shortenAddress(address)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Wallet Type</p>
          <p className="font-medium text-text-primary">{connector?.name || 'Unknown'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Balance</p>
          <p className="font-medium text-text-primary">
            {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.00 ETH'}
          </p>
        </div>
      </div>
    </div>
  );
}