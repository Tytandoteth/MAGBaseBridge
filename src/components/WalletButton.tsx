import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="w-full"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="w-full py-3 px-4 bg-primary text-text-primary rounded-lg hover:opacity-90 transition-colors font-medium"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="w-full py-3 px-4 bg-error text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex flex-col space-y-3 w-full">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="w-full py-3 px-4 bg-background-input text-text-primary rounded-lg hover:bg-background-input/80 transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="w-full py-3 px-4 bg-primary text-text-primary rounded-lg hover:opacity-90 transition-colors font-medium"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default WalletButton;