"use client";

import { useState, useMemo, useRef } from 'react';
import { Market, OrderSide, WalletState } from '@/types/trading';
import { toast } from 'sonner';

interface TradingPanelProps {
  market: Market;
  wallet: WalletState;
  onPlaceOrder: (side: OrderSide, size: number, leverage: number) => Promise<void>;
}

const LEVERAGE_OPTIONS = [1, 5, 10, 25, 50];

export function TradingPanel({ market, wallet, onPlaceOrder }: TradingPanelProps) {
  const [size, setSize] = useState('');
  const [leverage, setLeverage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const sizeNum = parseFloat(size) || 0;
  const notionalValue = sizeNum * market.price;
  const requiredMargin = notionalValue / leverage;

  const validationError = useMemo(() => {
    if (!wallet.isConnected) return 'Connect wallet to trade';
    if (!size || sizeNum <= 0) return 'Enter a valid size';
    if (requiredMargin > wallet.balance) return 'Insufficient balance';
    return null;
  }, [wallet.isConnected, size, sizeNum, requiredMargin, wallet.balance]);

  const handlePlaceOrder = async (side: OrderSide) => {
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setIsLoading(true);
    try {
      await onPlaceOrder(side, sizeNum, leverage);
      setSize('');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slider drag
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newLeverage = Math.max(1, Math.round(percent * 50));
    setLeverage(newLeverage);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid number input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSize(value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[11px] text-[#6b7280] uppercase tracking-widest mb-6">Position Controls</h3>

      {/* Position Size */}
      <div className="mb-6">
        <label className="text-[10px] text-[#6b7280] uppercase tracking-wider block mb-2">
          Position Size
        </label>
        <div className="relative">
          <input
            type="text"
            value={size}
            onChange={handleSizeChange}
            placeholder="0.00"
            className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2.5 text-sm placeholder:text-[#444] focus:outline-none focus:border-[#333]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#6b7280]">
            {market.baseAsset}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-[#6b7280]">
          <span>≈ ${sizeNum > 0 ? notionalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
        </div>
      </div>

      {/* Leverage */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] text-[#6b7280] uppercase tracking-wider">Leverage</label>
          <span className="text-sm">{leverage}x</span>
        </div>
        
        {/* Leverage slider - clickable */}
        <div 
          ref={sliderRef}
          onClick={handleSliderClick}
          className="relative h-2 bg-[#222] mb-3 cursor-pointer rounded"
        >
          <div 
            className="absolute h-full bg-white rounded-l" 
            style={{ width: `${(leverage / 50) * 100}%` }}
          />
          <div 
            className="absolute w-3 h-3 bg-white rounded-full -top-0.5 transform -translate-x-1/2"
            style={{ left: `${(leverage / 50) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[11px] text-[#6b7280]">
          {LEVERAGE_OPTIONS.map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`hover:text-white transition-colors ${leverage === lev ? 'text-white' : ''}`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Available Balance */}
      <div className="mb-6 p-3 border border-[#222]">
        <div className="flex justify-between text-sm">
          <span className="text-[#6b7280]">Available Balance</span>
          <span>${wallet.isConnected ? wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '--'}</span>
        </div>
        {sizeNum > 0 && wallet.isConnected && (
          <div className="flex justify-between text-[11px] mt-2">
            <span className="text-[#6b7280]">Required Margin</span>
            <span className={requiredMargin > wallet.balance ? 'text-[#ff4444]' : ''}>
              ${requiredMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {validationError && wallet.isConnected && size && (
        <div className="mb-4 text-[11px] text-[#ff4444]">
          {validationError}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Connect Wallet or Trade Buttons */}
      {!wallet.isConnected ? (
        <div className="mt-auto">
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6b7280] mb-3">
            <span>Connect your wallet to start trading</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePlaceOrder('LONG')}
            disabled={!!validationError || isLoading}
            className="py-2.5 bg-[#00ff00] text-black text-[11px] uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Long
          </button>
          <button
            onClick={() => handlePlaceOrder('SHORT')}
            disabled={!!validationError || isLoading}
            className="py-2.5 bg-[#ff4444] text-white text-[11px] uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Short
          </button>
        </div>
      )}
    </div>
  );
}