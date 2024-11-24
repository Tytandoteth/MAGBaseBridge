import { createPublicClient, http, PublicClient, Chain } from 'viem';

interface RpcConfig {
  urls: string[];
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export class ResilientRpcProvider {
  private clients: Map<string, PublicClient> = new Map();

  constructor(
    private readonly config: Record<string, RpcConfig>,
    private readonly chains: Chain[]
  ) {
    this.initializeClients();
  }

  private initializeClients() {
    Object.entries(this.config).forEach(([chainKey, config]) => {
      const chain = this.chains.find(c => c.network === chainKey);
      if (!chain) return;

      const transport = http(config.urls[0], {
        timeout: config.timeout || 10000,
        retryCount: config.retryCount || 3,
        retryDelay: config.retryDelay || 1000,
      });

      const client = createPublicClient({
        chain,
        transport,
      });

      this.clients.set(chainKey, client);
    });
  }

  async getClient(chainKey: string): Promise<PublicClient> {
    const client = this.clients.get(chainKey);
    if (!client) {
      throw new Error(`No RPC client available for ${chainKey}`);
    }
    return client;
  }
}