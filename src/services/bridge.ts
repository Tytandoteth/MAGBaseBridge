import { type PublicClient, type Hash, parseEther, encodeFunctionData } from 'viem';
import { BridgeError } from '../utils/errors';
import { contracts } from '../config/contracts';

const BRIDGE_ABI = [
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_minGasLimit', type: 'uint32' }
    ],
    name: 'bridgeETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;

export class BridgeService {
  constructor(
    private readonly publicClient: PublicClient,
    private readonly bridgeAddress: string,
    private readonly isL1: boolean
  ) {}

  async bridgeTokens(
    from: string,
    amount: string,
    onSubmitted?: (hash: Hash) => void
  ): Promise<Hash> {
    try {
      const value = parseEther(amount);
      const config = this.isL1 ? contracts.sepolia : contracts.baseSepolia;

      const data = encodeFunctionData({
        abi: BRIDGE_ABI,
        functionName: 'bridgeETH',
        args: [from, config.minGasLimit]
      });

      const hash = await this.publicClient.sendTransaction({
        account: from,
        to: this.bridgeAddress,
        value,
        data,
        gas: 300000n,
      });

      onSubmitted?.(hash);
      return hash;
    } catch (error) {
      console.error('Bridge transaction failed:', error);
      throw new BridgeError(
        'BRIDGE_FAILED',
        error instanceof Error ? error.message : 'Failed to bridge tokens',
        error
      );
    }
  }

  async getTransactionStatus(hash: Hash): Promise<'success' | 'failed' | 'pending'> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({ hash });
      if (!receipt) return 'pending';
      return receipt.status === 'success' ? 'success' : 'failed';
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw new BridgeError(
        'STATUS_CHECK_FAILED',
        'Failed to check transaction status',
        error
      );
    }
  }
}