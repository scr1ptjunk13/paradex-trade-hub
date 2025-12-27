# paradex-trade-hub

a minimal trading interface for paradex perpetual futures. connects your evm wallet, derives starknet keys automatically, and lets you trade directly on paradex l2.

## what it does

- wallet connection via rainbowkit (metamask, rabby, etc.)
- automatic starknet key derivation from eth signature (no manual key entry)
- real-time market data (price, funding rate, volume)
- place market orders with leverage
- view open positions with entry, value, liq price, pnl

## stack

next.js 14 · tailwindcss · rainbowkit · wagmi · starknet.js · paradex rest api

## setup

```bash
# clone
git clone https://github.com/scr1ptjunk13/paradex-trade-hub.git
cd paradex-trade-hub

# install
npm install

# env (get project id from cloud.walletconnect.com)
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id" > .env.local

# run
npm run dev
```

open http://localhost:3000

## usage

1. click "connect wallet"
2. sign the paradex key derivation message
3. your balance loads automatically
4. select market, enter size, pick leverage
5. click long/short to place order

## notes

- connects to paradex production (real money)
- you need usdc deposited on paradex first (app.paradex.trade)
- market orders only, no limit orders yet
- chart is placeholder

## license

mit
