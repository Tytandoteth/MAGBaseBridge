import { useMemo } from 'react';
import { useNetwork } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { ResilientRpcProvider } from '../services/RpcProvider';
import { RPC_CONFIG } from '../config/rpc';

export function useRpcProvider() {
  const { chain } = useNetwork();

  const rpcProvider = useMemo(() => {
    return new ResilientRpcProvider(
      RPC_CONFIG,
      [sepolia, baseSepolia]
    );
  }, []);

  const getChainProvider = async () => {
    if (!chain) throw new Error('No chain selected');
    return rpcProvider.getClient(chain.network);
  };

  return {
    getChainProvider,
    rpcProvider,
  };
}