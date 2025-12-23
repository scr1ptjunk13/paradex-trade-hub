"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Market } from '@/types/trading';

interface MarketBarProps {
  markets: Market[];
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
}

export function MarketBar({ markets, selectedMarket, onSelectMarket }: MarketBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-8 px-4 py-3 border-b border-[#1f1f1f] bg-[#0a0a0a]">
      {/* Market Selector */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-2 h-2 rounded-full bg-[#f97316]" />
          <span className="text-sm font-medium">{selectedMarket.symbol}</span>
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-[#111] border border-[#222] z-50 min-w-[200px]">
            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => {
                  onSelectMarket(market);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] text-sm ${
                  market.id === selectedMarket.id ? 'bg-[#1a1a1a]' : ''
                }`}
              >
                <span>{market.symbol}</span>
                <span className={market.change24h >= 0 ? 'text-[#00ff00]' : 'text-[#ff4444]'}>
                  {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Price */}
      <div className="flex flex-col">
        <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">Current Price</span>
        <span className="text-sm">
          ${selectedMarket.price.toLocaleString('en-US', { minimumFractionDigits: 4 })}
        </span>
      </div>

      {/* Long Funding Rate */}
      <div className="flex flex-col">
        <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">Long Funding Rate</span>
        <span className="text-sm text-[#00ff00]">
          {(selectedMarket.fundingRate * 100).toFixed(2)}%
        </span>
      </div>

      {/* Short Funding Rate */}
      <div className="flex flex-col">
        <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">Short Funding Rate</span>
        <span className="text-sm text-[#ff4444]">
          {(selectedMarket.fundingRate * 100 * 1.05).toFixed(2)}%
        </span>
      </div>

      {/* Net APR */}
      <div className="flex flex-col">
        <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">Net APR</span>
        <span className="text-sm text-[#00ff00]">+0.46%</span>
      </div>
    </div>
  );
}