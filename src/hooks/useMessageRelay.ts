import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { MessageRelayService } from '../services/MessageRelay';
import { contracts } from '../config/contracts';

export function useMessageRelay() {
  const l1Client = usePublicClient({ chainId: sepolia.id });
  const l2Client = usePublicClient({ chainId: baseSepolia.id });

  const messageRelay = useMemo(() => {
    if (!l1Client || !l2Client) return null;

    return new MessageRelayService(
      l1Client,
      l2Client,
      {
        l1Bridge: contracts.sepolia.bridge,
        l2Bridge: contracts.baseSepolia.bridge,
        messagePasser: contracts.sepolia.gateway
      }
    );
  }, [l1Client, l2Client]);

  return messageRelay;
}