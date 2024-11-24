import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletModal from './WalletModal';

export default function WalletSwitcher() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();

  const handleSwitchWallet = async () => {
    if (activeConnector) {
      await disconnect();
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleSwitchWallet}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#DAEFFF] border border-[#2DFFF9]/20 rounded-md hover:bg-[#DAEFFF]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DFFF9]"
      >
        Switch Wallet
      </button>
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}