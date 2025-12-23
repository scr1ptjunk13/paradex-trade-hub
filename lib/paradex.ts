// Paradex API service
const PARADEX_API_URL = 'https://api.prod.paradex.trade/v1';

export interface ParadexMarket {
  symbol: string;
  base_currency: string;
  quote_currency: string;
  asset_kind: string;
  settlement_currency: string;
  price_tick_size: string;
  order_size_increment: string;
  max_order_size: string;
  min_notional: string;
  position_limit: string;
}

export interface ParadexMarketsResponse {
  results: ParadexMarket[];
}

export async function fetchMarkets(): Promise<ParadexMarket[]> {
  try {
    const response = await fetch(`${PARADEX_API_URL}/markets`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Don't cache on client
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch markets: ${response.status}`);
    }

    const data: ParadexMarketsResponse = await response.json();
    
    // Filter only PERP markets and sort by symbol
    const perpMarkets = data.results.filter(market => market.asset_kind === 'PERP');
    
    // Sort: BTC first, then ETH, then SOL, then alphabetically
    const priority = ['BTC-USD-PERP', 'ETH-USD-PERP', 'SOL-USD-PERP'];
    return perpMarkets.sort((a, b) => {
      const aIdx = priority.indexOf(a.symbol);
      const bIdx = priority.indexOf(b.symbol);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.symbol.localeCompare(b.symbol);
    });
  } catch (error) {
    console.error('Error fetching Paradex markets:', error);
    return [];
  }
}

// Convert Paradex market to our Market type
export function toMarket(paradexMarket: ParadexMarket, index: number): {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  fundingRate: number;
  volume24h: string;
  change24h: number;
} {
  return {
    id: paradexMarket.symbol.toLowerCase(),
    symbol: paradexMarket.symbol,
    baseAsset: paradexMarket.base_currency,
    quoteAsset: paradexMarket.quote_currency,
    price: 0, // Will be fetched separately or hardcoded
    fundingRate: 0,
    volume24h: '--',
    change24h: 0,
  };
}
