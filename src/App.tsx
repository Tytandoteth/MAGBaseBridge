import React from 'react';
import { useAccount } from 'wagmi';
import BridgeInterface from './components/BridgeInterface';
import WalletButton from './components/WalletButton';
import WalletInfo from './components/WalletInfo';

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background-dark py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-text-light">
          MAG Token Bridge
        </h1>
        <div className="max-w-xl mx-auto">
          {isConnected ? (
            <>
              <WalletInfo />
              <WalletButton />
              <div className="mt-8">
                <BridgeInterface />
              </div>
            </>
          ) : (
            <WalletButton />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;