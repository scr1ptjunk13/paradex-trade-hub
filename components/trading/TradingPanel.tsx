"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Market, OrderSide, WalletState } from '@/types/trading';
import { toast } from 'sonner';

interface TradingPanelProps {
  market: Market;
  wallet: WalletState;
  onPlaceOrder: (side: OrderSide, size: number, leverage: number) => Promise<void>;
}

const LEVERAGE_OPTIONS = [1, 5, 10, 25, 50];
const MIN_LEVERAGE = 1;
const MAX_LEVERAGE = 50;

export function TradingPanel({ market, wallet, onPlaceOrder }: TradingPanelProps) {
  const [size, setSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState<'USD' | 'BASE'>('BASE'); // BASE = BTC, ETH, etc.
  const [leverage, setLeverage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const sizeNum = parseFloat(size) || 0;
  
  // Convert size based on unit selection
  const sizeInBase = sizeUnit === 'USD' ? sizeNum / market.price : sizeNum;
  const sizeInUSD = sizeUnit === 'USD' ? sizeNum : sizeNum * market.price;
  
  const notionalValue = sizeInUSD;
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
      // Always pass size in base asset (BTC, ETH, etc.) to the order
      await onPlaceOrder(side, sizeInBase, leverage);
      setSize('');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate leverage from mouse/touch position
  const calculateLeverageFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newLeverage = Math.round(MIN_LEVERAGE + percent * (MAX_LEVERAGE - MIN_LEVERAGE));
    setLeverage(Math.max(MIN_LEVERAGE, Math.min(MAX_LEVERAGE, newLeverage)));
  }, []);

  // Handle mouse events for smooth dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    calculateLeverageFromPosition(e.clientX);
  }, [calculateLeverageFromPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    calculateLeverageFromPosition(e.clientX);
  }, [isDragging, calculateLeverageFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle slider click (for clicking anywhere on track)
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateLeverageFromPosition(e.clientX);
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
      <h3 className="text-[13px] text-[#6b7280] uppercase tracking-widest mb-6">Position Controls</h3>

      {/* Position Size */}
      <div className="mb-6">
        <label className="text-[12px] text-[#6b7280] uppercase tracking-wider block mb-2">
          Size
        </label>
        <div className="relative">
          <input
            type="text"
            value={size}
            onChange={handleSizeChange}
            placeholder="0.00"
            className="w-full bg-[#0a0a0a] border border-[#222] px-4 py-3 pr-28 text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#333]"
          />
          {/* Unit Toggle */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex bg-[#1a1a1a] rounded overflow-hidden border border-[#333]">
            <button
              onClick={() => setSizeUnit('BASE')}
              className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
                sizeUnit === 'BASE' 
                  ? 'bg-white text-black' 
                  : 'text-[#6b7280] hover:text-white'
              }`}
            >
              {market.baseAsset}
            </button>
            <button
              onClick={() => setSizeUnit('USD')}
              className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
                sizeUnit === 'USD' 
                  ? 'bg-white text-black' 
                  : 'text-[#6b7280] hover:text-white'
              }`}
            >
              USD
            </button>
          </div>
        </div>
        {/* Conversion display */}
        <div className="flex justify-between mt-2 text-[13px] text-[#6b7280]">
          {sizeUnit === 'BASE' ? (
            <span>≈ ${sizeInUSD > 0 ? sizeInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} USD</span>
          ) : (
            <span>≈ {sizeInBase > 0 ? sizeInBase.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 }) : '0.000000'} {market.baseAsset}</span>
          )}
        </div>
      </div>

      {/* Leverage */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[12px] text-[#6b7280] uppercase tracking-wider">Leverage</label>
          <span className="text-[14px] font-medium">{leverage}x</span>
        </div>
        
        {/* Leverage slider - smooth draggable */}
        <div 
          ref={sliderRef}
          onClick={handleSliderClick}
          className="relative h-1.5 bg-[#333] mb-3 cursor-pointer rounded-full select-none"
        >
          {/* Filled track */}
          <div 
            className="absolute h-full bg-white rounded-full transition-none" 
            style={{ width: `${((leverage - MIN_LEVERAGE) / (MAX_LEVERAGE - MIN_LEVERAGE)) * 100}%` }}
          />
          {/* Thumb/handle - white border, black inside */}
          <div 
            onMouseDown={handleMouseDown}
            className={`absolute w-3 h-3 bg-black border border-white -top-[3px] transform -translate-x-1/2 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{ left: `${((leverage - MIN_LEVERAGE) / (MAX_LEVERAGE - MIN_LEVERAGE)) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[13px] text-[#6b7280]">
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
      <div className="mb-6 px-4 py-3 border border-[#222]">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#6b7280]">Available Balance</span>
          <span>${wallet.isConnected ? wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '--'}</span>
        </div>
        {sizeNum > 0 && wallet.isConnected && (
          <div className="flex justify-between text-[13px] mt-2">
            <span className="text-[#6b7280]">Required Margin</span>
            <span className={requiredMargin > wallet.balance ? 'text-[#ff4444]' : ''}>
              ${requiredMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {validationError && wallet.isConnected && size && (
        <div className="mb-4 text-[13px] text-[#ff4444]">
          {validationError}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Connect Wallet or Trade Buttons */}
      {!wallet.isConnected ? (
        <div className="mt-auto">
          <div className="flex items-center justify-center gap-2 text-[13px] text-[#6b7280] mb-3">
            <span>Connect your wallet to start trading</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePlaceOrder('LONG')}
            disabled={!!validationError || isLoading}
            className="py-3 bg-[#00ff00] text-black text-[13px] uppercase tracking-wider font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Long
          </button>
          <button
            onClick={() => handlePlaceOrder('SHORT')}
            disabled={!!validationError || isLoading}
            className="py-3 bg-[#ff4444] text-white text-[13px] uppercase tracking-wider font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Short
          </button>
        </div>
      )}
    </div>
  );
}