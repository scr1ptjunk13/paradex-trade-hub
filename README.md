# Paradex Trade Hub

A minimal, functional trading interface for Paradex perpetual futures exchange built with Next.js 14, RainbowKit, and the Paradex SDK.

## Features

- ✅ **Wallet Connection** - Connect EVM wallets (MetaMask, Rabby, etc.) via RainbowKit
- ✅ **Real Markets** - Fetch and display live markets from Paradex testnet API
- ✅ **Trading Panel** - Place market orders with position size and leverage controls
- ✅ **Balance Display** - View available USDC balance from connected Paradex account
- ✅ **Active Positions** - Real-time display of open positions with PnL
- ✅ **Error Handling** - Comprehensive validation and user-friendly error messages
- ✅ **Loading States** - Clear feedback during wallet connection and order placement

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS with custom trading UI components
- **Wallet**: RainbowKit + Wagmi + viem
- **Trading**: Paradex SDK (@paradex/sdk)
- **State**: React hooks with real-time data fetching
- **Notifications**: Sonner for toast messages

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **An EVM wallet** (MetaMask, Rabby, etc.)
3. **Testnet funds** - Your wallet needs:
   - Sepolia ETH for gas fees
   - A funded Paradex testnet account with USDC

### Getting Testnet Funds

1. Get Sepolia ETH from a faucet: https://sepoliafaucet.com/
2. Visit Paradex testnet: https://testnet.paradex.trade/
3. Connect your wallet and onboard to create a Paradex account
4. Use the testnet faucet to get USDC

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
3. Wait for Paradex initialization (this derives your Starknet key pair)
4. Select a market from the dropdown
5. Enter position size and choose leverage
6. Click "Long" or "Short" to place a market order
7. View your active positions in the table below

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
│   ├── paradex.ts           # Paradex SDK service wrapper
│   └── utils.ts             # Utility functions
├── types/
│   └── trading.ts           # TypeScript interfaces
├── data/
│   └── mockData.ts          # Mock data for development
└── tailwind.config.ts       # Tailwind configuration
```

## Key Implementation Details

### Paradex Integration

The app uses the official Paradex SDK to:

1. **Initialize Account** - Derives Starknet key pair from Ethereum wallet signature
2. **Fetch Markets** - Retrieves available trading pairs from REST API
3. **Get Balance** - Fetches USDC balance using SDK's `getTokenBalance()`
4. **Fetch Positions** - Retrieves open positions from REST API
5. **Place Orders** - Submits market orders via REST API

### Wallet Connection Flow

1. User clicks "Connect Wallet" (RainbowKit)
2. Wallet provider is passed to Paradex SDK
3. SDK derives Starknet key pair (requires signature)
4. App fetches balance and positions
5. User can now trade

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

1. **Testnet Only** - App connects to Paradex testnet (Sepolia)
2. **USDC Balance** - Assumes user has USDC in their Paradex account
3. **Market Orders Only** - No limit orders or advanced order types
4. **Hardcoded Market Data** - Price, funding rate, volume are placeholders (not live)
5. **No Chart** - Chart component is a placeholder (TradingView integration not implemented)

## Known Limitations

- Market prices are not live (would need WebSocket integration)
- No order book display
- No trade history
- No position management (close, modify)
- No liquidation price calculation
- Chart is a placeholder

## Troubleshooting

### "Failed to initialize Paradex account"

- Ensure you're connected to Sepolia network
- Check that you have Sepolia ETH for gas
- Try disconnecting and reconnecting your wallet

### "Insufficient balance"

- Visit https://testnet.paradex.trade/ to get testnet USDC
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
