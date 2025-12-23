import { ChevronDown } from 'lucide-react';
import { Market } from '@/types/trading';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MarketBarProps {
  markets: Market[];
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
}

export function MarketBar({ markets, selectedMarket, onSelectMarket }: MarketBarProps) {
  const isPositive = selectedMarket.change24h >= 0;

  return (
    <div className="flex items-center gap-6 px-6 py-4 border-b border-border bg-background">
      {/* Market Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-semibold">{selectedMarket.symbol}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-popover border-border">
          {markets.map((market) => (
            <DropdownMenuItem
              key={market.id}
              onClick={() => onSelectMarket(market)}
              className={`flex items-center justify-between cursor-pointer ${
                market.id === selectedMarket.id ? 'bg-muted' : ''
              }`}
            >
              <span className="font-medium">{market.symbol}</span>
              <span className={`text-sm font-mono ${market.change24h >= 0 ? 'text-long' : 'text-short'}`}>
                {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-8 w-px bg-border" />

      {/* Mark Price */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-mono font-semibold">
          ${selectedMarket.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`text-sm font-mono ${isPositive ? 'text-long' : 'text-short'}`}>
          {isPositive ? '+' : ''}{selectedMarket.change24h.toFixed(2)}%
        </span>
      </div>

      <div className="h-8 w-px bg-border" />

      {/* Funding Rate */}
      <div className="flex flex-col">
        <span className="label-uppercase text-[10px]">Funding</span>
        <span className={`font-mono text-sm ${selectedMarket.fundingRate >= 0 ? 'text-long' : 'text-short'}`}>
          {(selectedMarket.fundingRate * 100).toFixed(4)}%
        </span>
      </div>

      <div className="h-8 w-px bg-border" />

      {/* 24h Volume */}
      <div className="flex flex-col">
        <span className="label-uppercase text-[10px]">24h Volume</span>
        <span className="font-mono text-sm">${selectedMarket.volume24h}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      {/* Open Interest */}
      <div className="flex flex-col">
        <span className="label-uppercase text-[10px]">Open Interest</span>
        <span className="font-mono text-sm">$2.1B</span>
      </div>
    </div>
  );
}