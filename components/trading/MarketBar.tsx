"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Market } from '@/types/trading';
import { fetchMarketSummary, formatVolume, formatFundingRate, ParadexMarketSummary } from '@/lib/paradex';
import { getCryptoLogoUrl } from '@/lib/logoMapping';
import { Spinner } from '@/components/ui/Spinner';

interface MarketBarProps {
  markets: Market[];
  selectedMarket: Market;
  onSelectMarket: (market: Market) => void;
}

// Smart icon component with multi-source fallback
function AssetIcon({ baseAsset }: { baseAsset: string }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const urls = useMemo(() => getCryptoLogoUrl(baseAsset), [baseAsset]);

  // Reset when baseAsset changes
  useEffect(() => {
    setCurrentUrlIndex(0);
    setImageLoaded(false);
  }, [baseAsset]);

  // If all URLs failed or no URLs available, show letter badge
  if (currentUrlIndex >= urls.length) {
    return (
      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center text-[10px] font-medium text-white">
        {baseAsset.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <>
      {/* Hidden preloader for next URL */}
      {!imageLoaded && currentUrlIndex < urls.length && (
        <img
          src={urls[currentUrlIndex]}
          alt=""
          width={1}
          height={1}
          style={{ position: 'absolute', visibility: 'hidden' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            // Try next URL
            if (currentUrlIndex < urls.length - 1) {
              setCurrentUrlIndex(prev => prev + 1);
            } else {
              setCurrentUrlIndex(urls.length); // Show badge
            }
          }}
        />
      )}
      
      {/* Visible image once loaded */}
      {imageLoaded && (
        <img
          src={urls[currentUrlIndex]}
          alt={baseAsset}
          className="w-4 h-4 rounded-sm object-contain"
        />
      )}
      
      {/* Loading placeholder while image loads */}
      {!imageLoaded && currentUrlIndex < urls.length && (
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center text-[10px] font-medium text-white animate-pulse">
          {baseAsset.slice(0, 1).toUpperCase()}
        </div>
      )}
    </>
  );
}

export function MarketBar({ markets, selectedMarket, onSelectMarket }: MarketBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [marketSummary, setMarketSummary] = useState<ParadexMarketSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Fetch market summary when selected market changes
  useEffect(() => {
    async function loadSummary() {
      setIsLoadingSummary(true);
      const summary = await fetchMarketSummary(selectedMarket.symbol);
      setMarketSummary(summary);
      setIsLoadingSummary(false);
    }
    loadSummary();
  }, [selectedMarket.symbol]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter markets by search
  const filteredMarkets = markets.filter(market => 
    market.symbol.toLowerCase().includes(search.toLowerCase()) ||
    market.baseAsset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center gap-8 px-4 py-3 border-b border-[#1f1f1f] bg-[#0a0a0a]">
      {/* Market Selector */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <AssetIcon baseAsset={selectedMarket.baseAsset} />
          <span className="text-[14px] font-medium">{selectedMarket.baseAsset}-PERP</span>
          <ChevronDown className={`w-3 h-3 text-[#6b7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-[#111] border border-[#222] z-50 min-w-[280px] max-h-[400px] flex flex-col">
            {/* Search */}
            <div className="p-2 border-b border-[#222]">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-[#0a0a0a] border border-[#222]">
                <Search className="w-3 h-3 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs outline-none flex-1 placeholder:text-[#6b7280]"
                  autoFocus
                />
              </div>
            </div>
            
            {/* Markets list */}
            <div className="overflow-y-auto flex-1">
              {filteredMarkets.length === 0 ? (
                <div className="px-3 py-4 text-xs text-[#6b7280] text-center">No markets found</div>
              ) : (
                filteredMarkets.map((market) => (
                  <button
                    key={market.id}
                    onClick={() => {
                      onSelectMarket(market);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#1a1a1a] text-[12px] ${
                      market.id === selectedMarket.id ? 'bg-[#1a1a1a]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AssetIcon baseAsset={market.baseAsset} />
                      <span className="font-medium">{market.baseAsset}</span>
                      <span className="text-[10px] text-[#6b7280] uppercase">PERP</span>
                    </div>
                    <span className="text-xs text-[#6b7280]">
                      ${market.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mark Price */}
      <div className="flex flex-col">
        <span className="text-[12px] text-[#6b7280] uppercase tracking-wider">Mark Price</span>
        <span className="text-[14px]">
          {isLoadingSummary ? (
            <Spinner size={14} />
          ) : marketSummary ? (
            `$${parseFloat(marketSummary.mark_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          ) : '--'}
        </span>
      </div>

      {/* Funding Rate */}
      <div className="flex flex-col">
        <span className="text-[12px] text-[#6b7280] uppercase tracking-wider">Funding Rate</span>
        <span className={`text-[14px] ${marketSummary && parseFloat(marketSummary.funding_rate) >= 0 ? 'text-[#00ff00]' : 'text-[#ff4444]'}`}>
          {isLoadingSummary ? (
            <Spinner size={14} />
          ) : marketSummary ? (
            formatFundingRate(marketSummary.funding_rate)
          ) : '--'}
        </span>
      </div>

      {/* 24h Volume */}
      <div className="flex flex-col">
        <span className="text-[12px] text-[#6b7280] uppercase tracking-wider">24h Volume</span>
        <span className="text-[14px]">
          {isLoadingSummary ? (
            <Spinner size={14} />
          ) : marketSummary ? (
            formatVolume(marketSummary.volume_24h)
          ) : '--'}
        </span>
      </div>
    </div>
  );
}