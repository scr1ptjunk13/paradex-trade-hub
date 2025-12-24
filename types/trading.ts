export interface Market {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  fundingRate: number;
  volume24h: string;
  change24h: number;
  sizeIncrement: number;
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
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
}

export type OrderSide = 'LONG' | 'SHORT';
