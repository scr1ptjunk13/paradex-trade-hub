// Ticker to CoinGecko ID mapping for 90%+ coverage
// Based on simplr-sh/coin-logos (16,119 active crypto logos)
export const tickerToCoinGeckoId: Record<string, string> = {
  // Major coins
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'AVAX': 'avalanche-2',
  'DOGE': 'dogecoin',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'SHIB': 'shiba-inu',
  'TRX': 'tron',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LINK': 'chainlink',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'XLM': 'stellar',
  'ICP': 'internet-computer',
  'FIL': 'filecoin',
  'APT': 'aptos',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'INJ': 'injective-protocol',
  'NEAR': 'near',
  'VET': 'vechain',
  'HBAR': 'hedera-hashgraph',
  'IMX': 'immutable-x',
  'TIA': 'celestia',
  'SEI': 'sei-network',
  'SUI': 'sui',
  'RUNE': 'thorchain',
  
  // DeFi & Exchange tokens
  'AAVE': 'aave',
  'MKR': 'maker',
  'CRV': 'curve-dao-token',
  'LDO': 'lido-dao',
  'COMP': 'compound-governance-token',
  'SNX': 'synthetix-network-token',
  'FTM': 'fantom',
  'ALGO': 'algorand',
  'SAND': 'the-sandbox',
  'MANA': 'decentraland',
  'AXS': 'axie-infinity',
  'GALA': 'gala',
  'FLOW': 'flow',
  'CHZ': 'chiliz',
  'EOS': 'eos',
  'XTZ': 'tezos',
  'THETA': 'theta-token',
  'EGLD': 'elrond-erd-2',
  'CFX': 'conflux-token',
  'KAVA': 'kava',
  'KAS': 'kaspa',
  'ZIL': 'zilliqa',
  'MINA': 'mina-protocol',
  'FXS': 'frax-share',
  'ZEC': 'zcash',
  'XMR': 'monero',
  'DASH': 'dash',
  
  // Stablecoins
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'DAI': 'dai',
  'BUSD': 'binance-usd',
  'TUSD': 'true-usd',
  'FRAX': 'frax',
  
  // Meme coins
  'PEPE': 'pepe',
  'FLOKI': 'floki',
  'WIF': 'dogwifcoin',
  'BONK': 'bonk',
  'MEME': 'memecoin-2',
  
  // Layer 2 & Scaling
  'STRK': 'starknet',
  'METIS': 'metis-token',
  'BOBA': 'boba-network',
  
  // Gaming & Metaverse
  'BEAM': 'beam-2',
  'PRIME': 'echelon-prime',
  'MAGIC': 'magic',
  'YGG': 'yield-guild-games',
  'ALICE': 'my-neighbor-alice',
  
  // AI & Data tokens
  'FET': 'fetch-ai',
  'OCEAN': 'ocean-protocol',
  'RNDR': 'render-token',
  'GRT': 'the-graph',
  'ROSE': 'oasis-network',
  
  // DeFi tokens
  'SUSHI': 'sushi',
  '1INCH': '1inch',
  'DYDX': 'dydx-chain',
  'GMX': 'gmx',
  'BAL': 'balancer',
  'YFI': 'yearn-finance',
  'UMA': 'uma',
  'PERP': 'perpetual-protocol',
  'SYN': 'synapse-2',
  
  // Infrastructure
  'QNT': 'quant-network',
  'GNO': 'gnosis',
  'LRC': 'loopring',
  'BAND': 'band-protocol',
  'API3': 'api3',
  
  // Paradex specific tokens (may need updates)
  'OG': 'og-fan-token', // OG Fan Token
  'APEX': 'apex-token-2',
  'AERO': 'aerodrome-finance',
  'AIXBT': 'aixbt-by-virtuals', // New AI token
  'XPL': 'x-protocol',
  'ZORA': 'zora',
  'ZRO': 'layerzero',
  'ZK': 'zksync',
  'TON': 'the-open-network',
  'WLFI': 'world-liberty-financial', // Trump's token - might not exist in CoinGecko yet
  
  // Additional major tokens
  'ENS': 'ethereum-name-service',
  'BLUR': 'blur',
  'PYTH': 'pyth-network',
  'JUP': 'jupiter-exchange-solana',
  'W': 'wormhole',
  'PIXEL': 'pixels',
  'PORTAL': 'portal-gaming',
  'MAVIA': 'heroes-of-mavia',
  'AI': 'sleepless-ai',
  'XAI': 'xai-games',
  'DYM': 'dymension',
  'ALT': 'altlayer',
  'MANTA': 'manta-network',
  'ONDO': 'ondo-finance',
  'PENDLE': 'pendle',
  'ENA': 'ethena',
  'REZ': 'renzo',
  'ETHFI': 'ether-fi',
  'OMNI': 'omni-network',
  'MERL': 'merlin-chain',
  'LISTA': 'lista',
  'IO': 'io-net',
  'BLAST': 'blast',
  'EIGEN': 'eigenlayer',
};

// Get logo URL with fallback chain
export function getCryptoLogoUrl(ticker: string): string[] {
  const upperTicker = ticker.toUpperCase();
  const lowerTicker = ticker.toLowerCase();
  const coinGeckoId = tickerToCoinGeckoId[upperTicker];
  
  const urls: string[] = [];
  
  // 1. Primary: simplr-sh CDN with CoinGecko ID (16,000+ logos)
  if (coinGeckoId) {
    urls.push(`https://cdn.jsdelivr.net/gh/simplr-sh/coin-logos@main/images/${coinGeckoId}/standard.png`);
  }
  
  // 2. Secondary: VadimMalykhin binance-icons (good coverage)
  urls.push(`https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons@latest/crypto/${lowerTicker}.svg`);
  
  // 3. Tertiary: spothq cryptocurrency-icons (200+ major coins)
  urls.push(`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@latest/32/color/${lowerTicker}.png`);
  
  // 4. Quaternary: Cryptologos direct link
  urls.push(`https://cryptologos.cc/logos/${lowerTicker}-${lowerTicker}-logo.png`);
  
  return urls;
}
