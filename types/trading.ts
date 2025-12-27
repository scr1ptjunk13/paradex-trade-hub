export interface Market {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  fundingRate: number;
  volume24h: string;
  change24h: number;
  // Trading restrictions (from API - never hardcode)
  sizeIncrement: number;  // Minimum size step (e.g., 0.00001 BTC)
  minNotional: number;    // Minimum order value in USD (e.g., $10)
  maxOrderSize: number;   // Maximum order size in base asset
}

export interface Position {
  id: string;
  market: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  leverage: number;
  //extra
  liquidationPrice: number;
  value: number;  // notional value in USD
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
}

export type OrderSide = 'LONG' | 'SHORT';
