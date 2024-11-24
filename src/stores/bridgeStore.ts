import { create } from 'zustand';
import { Hash } from 'viem';

interface BridgeState {
  txHash?: Hash;
  isPending: boolean;
  isSuccess: boolean;
  error: string | null;
  sourceChainStatus: {
    confirmed: boolean;
    error?: string;
  };
  destinationChainStatus: {
    confirmed: boolean;
    error?: string;
  };
  reset: () => void;
  setTxHash: (hash?: Hash) => void;
  setSourceChainStatus: (status: { confirmed: boolean; error?: string }) => void;
  setDestinationChainStatus: (status: { confirmed: boolean; error?: string }) => void;
  setStatus: (status: { isPending?: boolean; isSuccess?: boolean; error?: string | null }) => void;
}

const initialState = {
  txHash: undefined,
  isPending: false,
  isSuccess: false,
  error: null,
  sourceChainStatus: {
    confirmed: false,
  },
  destinationChainStatus: {
    confirmed: false,
  },
};

export const useBridgeStore = create<BridgeState>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setTxHash: (hash) => set({ txHash: hash }),
  setSourceChainStatus: (status) => set({ sourceChainStatus: status }),
  setDestinationChainStatus: (status) => set({ destinationChainStatus: status }),
  setStatus: (status) => set((state) => ({ ...state, ...status })),
}));