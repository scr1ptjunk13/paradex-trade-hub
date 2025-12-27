export interface SystemConfig {
  readonly apiBaseUrl: string;
  readonly starknet: {
    readonly chainId: string;
  };
}

export interface ParadexAccount {
  address: string;        // Paradex L2 account address
  publicKey: string;      // Starknet public key
  privateKey: string;     // Starknet private key (from Paradex UI)
  ethereumAccount: string; // Connected EVM wallet address
  jwtToken?: string;      // JWT token for authenticated requests
}

export interface ParadexPosition {
  id: string;
  market: string;
  side: 'LONG' | 'SHORT';
  size: string;
  average_entry_price: string;
  average_entry_price_usd: string;  // This is what Paradex UI displays
  unrealized_pnl: string;
  realized_pnl: string;
  leverage: string;
  liquidation_price: string;
  updated_at: number;
}

export interface ParadexBalance {
  token: string;
  size: string;
  last_updated_at: number;
}

export interface ParadexOrder {
  id: string;
  market: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  size: string;
  price?: string;
  status: string;
  created_at: number;
}

export interface OrderRequest {
  market: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  size: string;
  price?: string;
  instruction?: 'GTC' | 'IOC' | 'POST_ONLY';
}

export type UnixTime = number;
