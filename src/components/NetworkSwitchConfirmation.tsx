import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface NetworkSwitchConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NetworkSwitchConfirmation({ isOpen, onConfirm, onCancel }: NetworkSwitchConfirmationProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
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
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-error" />
                  </div>
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-medium text-text-primary">
                      Switch Network?
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-text-secondary">
                      Switching networks will reset your current bridge transaction status. Are you sure you want to continue?
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-md border border-transparent bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none"
                    onClick={onConfirm}
                  >
                    Yes, Switch Network
                  </button>
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-50 focus:outline-none"
                    onClick={onCancel}
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