"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/trading/Header";
import { MarketBar } from "@/components/trading/MarketBar";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { Market, Position, WalletState, OrderSide } from "@/types/trading";
import { toast } from "sonner";

// Hardcoded markets as per plan.md
const MARKETS: Market[] = [
  {
    id: "btc-usd-perp",
    symbol: "BTC-USD-PERP",
    baseAsset: "BTC",
    quoteAsset: "USD",
    price: 96500,
    fundingRate: 0.0001,
    volume24h: "2.5B",
    change24h: 2.3,
  },
  {
    id: "eth-usd-perp",
    symbol: "ETH-USD-PERP",
    baseAsset: "ETH",
    quoteAsset: "USD",
    price: 3420,
    fundingRate: 0.00008,
    volume24h: "1.8B",
    change24h: 1.8,
  },
  {
    id: "sol-usd-perp",
    symbol: "SOL-USD-PERP",
    baseAsset: "SOL",
    quoteAsset: "USD",
    price: 185,
    fundingRate: 0.00012,
    volume24h: "450M",
    change24h: -0.5,
  },
];

// Mock positions
const MOCK_POSITIONS: Position[] = [
  {
    id: "1",
    market: "BTC-USD-PERP",
    side: "LONG",
    size: 0.5,
    entryPrice: 95000,
    markPrice: 96500,
    pnl: 750,
    pnlPercent: 1.58,
    leverage: 10,
  },
];

export default function Home() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
  });
  const [selectedMarket, setSelectedMarket] = useState<Market>(MARKETS[0]);
  const [positions, setPositions] = useState<Position[]>([]);

  const handleConnectWallet = useCallback(() => {
    // Mock wallet connection
    setWallet({
      isConnected: true,
      address: "0x1234...5678",
      balance: 10000,
    });
    setPositions(MOCK_POSITIONS);
    toast.success("Wallet connected");
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
    });
    setPositions([]);
    toast.success("Wallet disconnected");
  }, []);

  const handlePlaceOrder = useCallback(
    async (side: OrderSide, size: number, leverage: number) => {
      if (!wallet.isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      const orderValue = (size * selectedMarket.price) / leverage;
      if (orderValue > wallet.balance) {
        toast.error("Insufficient balance");
        throw new Error("Insufficient balance");
      }

      // Mock order placement
      toast.success(`${side} ${size} ${selectedMarket.baseAsset} at ${leverage}x`);

      // Add mock position
      const newPosition: Position = {
        id: Date.now().toString(),
        market: selectedMarket.symbol,
        side,
        size,
        entryPrice: selectedMarket.price,
        markPrice: selectedMarket.price,
        pnl: 0,
        pnlPercent: 0,
        leverage,
      };

      setPositions((prev) => [...prev, newPosition]);
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - orderValue,
      }));
    },
    [selectedMarket, wallet]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <MarketBar
        markets={MARKETS}
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-4">
          <PositionsTable positions={positions} isConnected={wallet.isConnected} />
        </div>

        <div className="w-full lg:w-[360px] p-5 border-l border-border">
          <TradingPanel
            market={selectedMarket}
            wallet={wallet}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
}
