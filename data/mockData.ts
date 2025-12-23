import { Market, Position } from '@/types/trading';

export const MARKETS: Market[] = [
  {
    id: 'btc-usd',
    symbol: 'BTC-USD',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    price: 87614.20,
    fundingRate: 0.0107,
    volume24h: '4.2B',
    change24h: 2.34,
  },
  {
    id: 'eth-usd',
    symbol: 'ETH-USD',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    price: 3842.50,
    fundingRate: 0.0089,
    volume24h: '1.8B',
    change24h: -1.23,
  },
  {
    id: 'sol-usd',
    symbol: 'SOL-USD',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    price: 198.75,
    fundingRate: 0.0156,
    volume24h: '890M',
    change24h: 5.67,
  },
  {
    id: 'arb-usd',
    symbol: 'ARB-USD',
    baseAsset: 'ARB',
    quoteAsset: 'USD',
    price: 1.24,
    fundingRate: 0.0045,
    volume24h: '120M',
    change24h: -0.89,
  },
];

export const MOCK_POSITIONS: Position[] = [
  {
    id: '1',
    market: 'BTC-USD',
    side: 'LONG',
    size: 0.001,
    entryPrice: 85000,
    markPrice: 87614.20,
    pnl: 2.61,
    pnlPercent: 3.07,
    leverage: 5,
  },
  {
    id: '2',
    market: 'ETH-USD',
    side: 'SHORT',
    size: 0.5,
    entryPrice: 3900,
    markPrice: 3842.50,
    pnl: 28.75,
    pnlPercent: 1.47,
    leverage: 10,
  },
];

export const LEVERAGE_OPTIONS = [1, 2, 5, 10, 20, 50];

export const MOCK_BALANCE = 5000.00;
