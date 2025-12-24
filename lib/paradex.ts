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

export interface ParadexMarketSummary {
  symbol: string;
  mark_price: string;
  funding_rate: string;
  volume_24h: string;
  price_change_rate_24h: string;
  last_traded_price: string;
  open_interest: string;
}

export interface ParadexMarketSummaryResponse {
  results: ParadexMarketSummary[];
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

// Fetch market summary (price, funding rate, volume) for a specific market
export async function fetchMarketSummary(market: string): Promise<ParadexMarketSummary | null> {
  try {
    const response = await fetch(`${PARADEX_API_URL}/markets/summary?market=${market}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch market summary: ${response.status}`);
    }

    const data: ParadexMarketSummaryResponse = await response.json();
    return data.results[0] || null;
  } catch (error) {
    console.error('Error fetching market summary:', error);
    return null;
  }
}

// Format volume to human readable (e.g., 618871876 -> $618.9M)
export function formatVolume(volume: string): string {
  const num = parseFloat(volume);
  if (isNaN(num)) return '--';
  
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  }
  return `$${num.toFixed(0)}`;
}

// Format funding rate to percentage (e.g., 0.0001 -> 0.0100%)
export function formatFundingRate(rate: string): string {
  const num = parseFloat(rate);
  if (isNaN(num)) return '--';
  return `${(num * 100).toFixed(4)}%`;
}

export async function toMarket(paradexMarket: ParadexMarket): Promise<{
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  fundingRate: number;
  volume24h: string;
  change24h: number;
  sizeIncrement: number;
  minNotional: number;
  maxOrderSize: number;
}> {
  // Fetch summary data for price
  const summary = await fetchMarketSummary(paradexMarket.symbol);
  
  return {
    id: paradexMarket.symbol.toLowerCase(),
    symbol: paradexMarket.symbol,
    baseAsset: paradexMarket.base_currency,
    quoteAsset: paradexMarket.quote_currency,
    price: summary ? parseFloat(summary.mark_price) : 0,
    fundingRate: summary ? parseFloat(summary.funding_rate) : 0,
    volume24h: summary ? formatVolume(summary.volume_24h) : '--',
    change24h: summary ? parseFloat(summary.price_change_rate_24h) * 100 : 0,
    // Trading restrictions from API (never hardcode)
    sizeIncrement: parseFloat(paradexMarket.order_size_increment) || 0.00001,
    minNotional: parseFloat(paradexMarket.min_notional) || 10,
    maxOrderSize: parseFloat(paradexMarket.max_order_size) || 100,
  };
}
