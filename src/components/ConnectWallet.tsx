import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import WalletSwitcher from './WalletSwitcher';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Connected Address</p>
          <p className="font-mono text-sm break-all">{address}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => disconnect()}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
          <WalletSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={!connector.ready || isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {connector.name}
            {!connector.ready && ' (not ready)'}
            {isLoading && ' (connecting...)'}
          </button>
        ))}
      </div>
      {connectError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{connectError.message}</p>
        </div>
      )}
    </div>
  );
}