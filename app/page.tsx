"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useDisconnect, useWalletClient } from "wagmi";
import { Header } from "@/components/trading/Header";
import { MarketBar } from "@/components/trading/MarketBar";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { WalletModal } from "@/components/WalletModal";
import { Market, Position, WalletState, OrderSide } from "@/types/trading";
import { toast } from "sonner";
import { fetchMarkets, toMarket } from "@/lib/paradex";
import { useParadex } from "@/lib/useParadex";
import { fetchMarketSummary } from "@/lib/paradex";

// Fallback markets if API fails
const FALLBACK_MARKETS: Market[] = [
  {
    id: "btc-usd-perp",
    symbol: "BTC-USD-PERP",
    baseAsset: "BTC",
    quoteAsset: "USD",
    price: 87987.9,
    fundingRate: 0.1092,
    volume24h: "--",
    change24h: 0,
    sizeIncrement: 0.00001,
  },
];


export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [markets, setMarkets] = useState<Market[]>(FALLBACK_MARKETS);
  const [selectedMarket, setSelectedMarket] = useState<Market>(FALLBACK_MARKETS[0]);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true);
  const [hasManuallyConnected, setHasManuallyConnected] = useState(false);

  // Paradex integration - auto-connects when wallet connects
  const paradex = useParadex();

  // Fetch markets from Paradex API on mount
  useEffect(() => {
    async function loadMarkets() {
      try {
        const paradexMarkets = await fetchMarkets();
        if (paradexMarkets.length > 0) {
          // Convert markets with price data (async)
          const convertedMarkets = await Promise.all(
            paradexMarkets.map(toMarket)
          );
          setMarkets(convertedMarkets);
          setSelectedMarket(convertedMarkets[0]);
        }
      } catch (error) {
        console.error('Failed to load markets:', error);
      } finally {
        setIsLoadingMarkets(false);
      }
    }
    loadMarkets();
  }, []);

  // Derive wallet state
  const wallet: WalletState = {
    isConnected: isConnected,
    address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    balance: paradex.isConnected ? paradex.balance : 0,
  };

  // Convert Paradex positions to our Position type
  const positions: Position[] = paradex.positions.map((p) => ({
    id: p.id,
    market: p.market,
    side: p.side,
    size: parseFloat(p.size),
    entryPrice: parseFloat(p.average_entry_price),
    markPrice: parseFloat(p.average_entry_price), // Will be updated with live price
    pnl: parseFloat(p.unrealized_pnl),
    pnlPercent: 0, // Calculate if needed
    leverage: parseFloat(p.leverage),
  }));

  // Get wallet client for Paradex initialization
  const { data: walletClient } = useWalletClient();
  
  // Initialize Paradex only after wallet client is ready
  useEffect(() => {
    // Wait for ALL conditions:
    // 1. Wallet is connected (isConnected)
    // 2. User manually clicked connect (hasManuallyConnected)
    // 3. Wallet client is available (walletClient)
    // 4. Paradex not already connected
    // 5. Not currently connecting
    if (isConnected && hasManuallyConnected && walletClient && !paradex.isConnected && !paradex.isConnecting) {
      console.log('🔄 Wallet client ready, initializing Paradex...');
      // Auto-initialize Paradex
      paradex.initializeParadex().then(() => {
        console.log('✅ Paradex initialization complete');
        setHasManuallyConnected(false);
      }).catch((err) => {
        console.error('❌ Failed to initialize Paradex:', err);
        toast.error('Failed to connect to Paradex: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setHasManuallyConnected(false);
      });
    }
  }, [isConnected, hasManuallyConnected, walletClient, paradex.isConnected, paradex.isConnecting, paradex]);

  const handleConnectWallet = useCallback(() => {
    setHasManuallyConnected(true);
    setShowWalletModal(true);
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    paradex.disconnect();
    disconnect();
    // Silent disconnect - no toast
  }, [disconnect, paradex]);

  // Auto-enable trading after Paradex connection
  useEffect(() => {
    if (paradex.isConnected && !paradex.isTradingEnabled && !paradex.isConnecting) {
      // Enable trading automatically (will prompt for STARK key signature)
      paradex.enableTrading().catch(err => {
        console.error('Failed to enable trading:', err);
        toast.error('Failed to enable trading. Please try reconnecting.');
      });
    }
  }, [paradex.isConnected, paradex.isTradingEnabled, paradex.isConnecting, paradex]);

  const handlePlaceOrder = useCallback(
    async (side: OrderSide, size: number, leverage: number) => {
      try {
        // Check if trading is enabled
        if (!paradex.isTradingEnabled) {
          toast.error('Trading not enabled. Please reconnect wallet.');
          return;
        }

        // Get current market price for the order
        const summary = await fetchMarketSummary(selectedMarket.symbol);
        const currentPrice = summary ? parseFloat(summary.mark_price) : 0;

        if (currentPrice === 0) {
          toast.error("Could not fetch current price");
          throw new Error("Price unavailable");
        }

        const orderValue = (size * currentPrice) / leverage;
        if (orderValue > paradex.balance) {
          toast.error("Insufficient balance");
          throw new Error("Insufficient balance");
        }

        try {
          // Round size to market's size increment
          const increment = selectedMarket.sizeIncrement || 0.00001;
          const roundedSize = Math.floor(size / increment) * increment;
          
          if (roundedSize <= 0) {
            toast.error(`Size too small. Minimum increment is ${increment} ${selectedMarket.baseAsset}`);
            throw new Error('Size too small');
          }

          // Place real order via Paradex API
          await paradex.placeOrder({
            market: selectedMarket.symbol,
            side: side === 'LONG' ? 'BUY' : 'SELL',
            type: 'MARKET',
            size: roundedSize.toFixed(8).replace(/\.?0+$/, ''),
          });

          toast.success(`${side} ${roundedSize} ${selectedMarket.baseAsset} order placed!`);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Order failed';
          toast.error(message);
          throw error;
        }
      } catch (error) {
        console.error('Failed to place order:', error);
      }
    },
    [selectedMarket, paradex]
  );

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      <Header
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <MarketBar
        markets={markets}
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Chart + Positions */}
        <div className="flex-1 flex flex-col">
          {/* Chart Area (placeholder) */}
          <div className="flex-1 border-b border-[#1f1f1f] relative">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
          </div>

          {/* Positions Table */}
          <PositionsTable positions={positions} isConnected={wallet.isConnected} />
        </div>

        {/* Right side - Trading Panel */}
        <div className="w-[320px] border-l border-[#1f1f1f] p-4 overflow-y-auto">
          <TradingPanel
            market={selectedMarket}
            wallet={wallet}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
      {/* Wallet Connection Modal */}
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </div>
  );
}
