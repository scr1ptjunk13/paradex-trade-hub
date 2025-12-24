# Paradex Trade Hub

A minimal, functional trading interface for Paradex perpetual futures exchange built with Next.js 14, RainbowKit, and direct Paradex REST API integration with Starknet signing.

## Features

- ✅ **Wallet Connection** - Connect EVM wallets (MetaMask, Rabby, etc.) via RainbowKit
- ✅ **Paradex Integration** - Full authentication with Starknet key signing
- ✅ **Real Markets** - Fetch and display live markets from Paradex production API
- ✅ **Live Market Data** - Real-time mark price, funding rate, and 24h volume
- ✅ **Trading Panel** - Place market orders with position size and leverage controls
- ✅ **Real Balance** - Fetch actual USDC balance from your Paradex account
- ✅ **Real Positions** - Display actual open positions from Paradex API
- ✅ **Real Trading** - Place actual market orders via signed API calls
- ✅ **Error Handling** - Comprehensive validation and user-friendly error messages
- ✅ **Loading States** - Clear feedback during wallet connection and order placement

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS with custom trading UI components
- **Wallet**: RainbowKit + Wagmi + viem
- **Trading**: Direct Paradex REST API with Starknet signing (starknet.js)
- **State**: React hooks with real-time data fetching
- **Notifications**: Sonner for toast messages

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **An EVM wallet** (MetaMask, Rabby, etc.)
3. **A Paradex account** with funds:
   - Visit https://app.paradex.trade/
   - Connect your EVM wallet and complete onboarding
   - Deposit USDC to your Paradex account

### Getting Your Paradex Credentials

To trade via this app, you need your Paradex L2 credentials:

1. Go to https://app.paradex.trade/
2. Connect your wallet
3. **Account Address**: Click your address (top right) to copy your L2 address
4. **Private Key**: Go to Wallet → Click "Copy Private Key"

⚠️ **Security Note**: Your private key is stored in memory only and never persisted. It is only sent to Paradex API for authentication.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd paradex-trade-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com/

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Connect Wallet & Trade

1. Click "Connect Wallet" in the top right
2. Select your wallet and approve the connection
3. A modal will appear asking for your **Paradex credentials**:
   - Enter your **Paradex Account Address** (L2)
   - Enter your **Paradex Private Key** (L2)
4. Click "Connect to Paradex" - this authenticates with Paradex API
5. Your real USDC balance will appear
6. Select a market from the dropdown
7. Enter position size and choose leverage
8. Click "Long" or "Short" to place a **real market order**
9. View your actual positions in the table below

## Project Structure

```
paradex-trade-hub/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx             # Main trading page
│   ├── providers.tsx        # RainbowKit, Wagmi, React Query providers
│   ├── globals.css          # Global styles and trading UI classes
│   ├── error.tsx            # Error boundary
│   └── not-found.tsx        # 404 page
├── components/
│   ├── trading/
│   │   ├── Header.tsx       # Header with RainbowKit connect button
│   │   ├── MarketBar.tsx    # Market selector and info bar
│   │   ├── TradingPanel.tsx # Order entry panel
│   │   ├── PositionsTable.tsx # Active positions display
│   │   └── PlaceholderChart.tsx # Chart placeholder
│   └── ui/
│       └── dropdown-menu.tsx # Radix UI dropdown component
├── lib/
│   ├── wagmi.ts             # Wagmi/RainbowKit configuration
│   ├── paradex.ts           # Paradex market data fetching
│   ├── paradex/             # Full Paradex trading integration
│   │   ├── api.ts           # REST API client (auth, orders, positions)
│   │   ├── signature.ts     # Starknet order/auth signing
│   │   ├── typedData.ts     # Typed data builders for signing
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── useParadex.ts    # React hook for state management
│   └── utils.ts             # Utility functions
├── types/
│   └── trading.ts           # TypeScript interfaces
├── data/
│   └── mockData.ts          # Mock data for development
└── tailwind.config.ts       # Tailwind configuration
```

## Key Implementation Details

### Paradex Integration

The app uses direct Paradex REST API calls with Starknet signing:

1. **Authentication** - Signs auth request with Starknet private key to get JWT token
2. **Fetch Markets** - Retrieves available trading pairs from `/v1/markets`
3. **Market Summary** - Fetches live price, funding, volume from `/v1/markets/summary`
4. **Get Balance** - Fetches USDC balance from `/v1/balance`
5. **Fetch Positions** - Retrieves open positions from `/v1/positions`
6. **Place Orders** - Signs and submits orders to `/v1/orders`

### Authentication Flow

1. User clicks "Connect Wallet" (RainbowKit)
2. After EVM wallet connects, Paradex auth modal appears
3. User enters their Paradex L2 address and private key
4. App signs auth request using starknet.js
5. JWT token is obtained from Paradex API
6. App fetches real balance and positions
7. User can now place real trades

### Error Handling

The app handles:

- ❌ Wallet not connected
- ❌ Insufficient balance
- ❌ Invalid position size
- ❌ Network errors
- ❌ Order placement failures

All errors display user-friendly toast notifications.

## Design Decisions

### Why Next.js 14 App Router?

- Server components for better performance
- Built-in API routes if needed
- Modern React patterns with RSC

### Why RainbowKit?

- Best-in-class wallet connection UX
- Supports all major EVM wallets
- Built-in wallet management UI

### Why Direct REST API Calls?

For some operations (markets, positions), the Paradex SDK doesn't expose all endpoints, so we use direct REST API calls to the testnet API.

### Assumptions Made

1. **Production API** - App connects to Paradex production (`api.prod.paradex.trade`)
2. **USDC Balance** - Assumes user has USDC in their Paradex account
3. **Market Orders Only** - No limit orders or advanced order types
4. **User Provides Credentials** - User must provide their Paradex L2 private key
5. **No Chart** - Chart component is a placeholder (TradingView integration not implemented)

## Known Limitations

- Market prices refresh on market selection (not real-time WebSocket)
- No order book display
- No trade history
- No position management (close, modify)
- No liquidation price calculation
- Chart is a placeholder
- User must manually enter Paradex credentials (no automatic key derivation)

## Troubleshooting

### "Failed to initialize Paradex account"

- Verify your Paradex account address is correct
- Verify your Paradex private key is correct
- Ensure your Paradex account exists (onboard at app.paradex.trade first)
- Try disconnecting and reconnecting your wallet

### "Insufficient balance"

- Visit https://app.paradex.trade/ to deposit USDC
- Ensure your Paradex account is funded

### "Failed to place order"

- Check that the market symbol is correct
- Verify position size meets minimum requirements
- Ensure you have sufficient balance

## API References

- **Paradex API Docs**: https://docs.paradex.trade/api/general-information/api-quick-start
- **Paradex JS SDK**: https://github.com/tradeparadex/paradex.js
- **RainbowKit Docs**: https://www.rainbowkit.com/docs/introduction
- **Wagmi Docs**: https://wagmi.sh/

## Build for Production

```bash
npm run build
npm start
```

## Deploy

The app can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting platform**

Make sure to set the `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` environment variable in your deployment platform.

## License

MIT

## Support

For questions about:
- **Paradex API**: https://discord.gg/paradex
- **This implementation**: Open an issue in this repository
