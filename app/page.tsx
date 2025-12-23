"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Header } from "@/components/trading/Header";
import { MarketBar } from "@/components/trading/MarketBar";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { WalletModal } from "@/components/WalletModal";
import { Market, Position, WalletState, OrderSide } from "@/types/trading";
import { toast } from "sonner";

// Hardcoded markets as per plan.md
const MARKETS: Market[] = [
  {
    id: "btc-usd-perp",
    symbol: "BTC-USD-PERP",
    baseAsset: "BTC",
    quoteAsset: "USD",
    price: 87987.9,
    fundingRate: 0.1092,
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
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market>(MARKETS[0]);
  const [positions, setPositions] = useState<Position[]>([]);

  // Derive wallet state from wagmi
  const wallet: WalletState = {
    isConnected,
    address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    balance: isConnected ? 10000 : 0, // Mock balance for now
  };

  // Load mock positions when connected
  useEffect(() => {
    if (isConnected) {
      setPositions(MOCK_POSITIONS);
      toast.success("Wallet connected");
    } else {
      setPositions([]);
    }
  }, [isConnected]);

  const handleConnectWallet = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    disconnect();
    toast.success("Wallet disconnected");
  }, [disconnect]);

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

      toast.success(`${side} ${size} ${selectedMarket.baseAsset} at ${leverage}x`);

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

      setPositions((prev: Position[]) => [...prev, newPosition]);
      // Note: In real implementation, balance would be fetched from Paradex API
    },
    [selectedMarket, wallet]
  );

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
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

      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Chart + Positions */}
        <div className="flex-1 flex flex-col">
          {/* Chart Area (placeholder) */}
          <div className="flex-1 border-b border-[#1f1f1f] relative">
            {/* Chart placeholder - empty dark space like in the screenshots */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
              {/* Price scale on right */}
              <div className="absolute right-0 top-0 bottom-0 w-20 border-l border-[#1f1f1f] flex flex-col justify-between py-4 text-[11px] text-[#6b7280] text-right pr-2">
                <span>$89533.00</span>
                <span>$89918.53</span>
                <span>$89304.06</span>
                <span>$88689.59</span>
                <span>$88075.12</span>
                <span className="text-white">$87460.65</span>
                <span>$86846.18</span>
                <span>$86231.71</span>
                <span>$85617.24</span>
                <span>$85002.77</span>
              </div>
            </div>
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
