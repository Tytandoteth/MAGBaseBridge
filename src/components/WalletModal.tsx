import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useWalletConnection } from '../hooks/useWalletConnection';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, connectors, isLoading, pendingConnector, error } = useWalletConnection();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-text-primary"
                >
                  Connect Wallet
                </Dialog.Title>

                {error && (
                  <div className="mt-4 p-3 bg-error/10 rounded-lg">
                    <p className="text-sm text-error">{error.message}</p>
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  {connectors.map((connector) => {
                    const isInstalled = connector.ready;
                    const isPending = isLoading && pendingConnector?.id === connector.id;

                    return (
                      <button
                        key={connector.id}
                        onClick={() => {
                          connect(connector);
                          if (!isPending) onClose();
                        }}
                        disabled={!isInstalled || isLoading}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${
                          !isInstalled || isLoading
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                            : 'hover:bg-primary/10 text-text-primary hover:border-primary border-gray-200 transition-colors'
                        }`}
                      >
                        <span className="flex items-center space-x-3">
                          <span className="text-base font-medium">
                            {connector.name}
                          </span>
                        </span>
                        {isPending && (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            <span className="text-sm text-primary">Connecting...</span>
                          </div>
                        )}
                        {!isInstalled && (
                          <span className="text-sm text-error">Not Installed</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-text-primary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}