import { useState, useMemo } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Market, OrderSide, WalletState } from '@/types/trading';
import { LEVERAGE_OPTIONS } from '@/data/mockData';
import { toast } from 'sonner';

interface TradingPanelProps {
  market: Market;
  wallet: WalletState;
  onPlaceOrder: (side: OrderSide, size: number, leverage: number) => Promise<void>;
}

export function TradingPanel({ market, wallet, onPlaceOrder }: TradingPanelProps) {
  const [size, setSize] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSide, setActiveSide] = useState<OrderSide>('LONG');

  const sizeNum = parseFloat(size) || 0;
  const notionalValue = sizeNum * market.price;
  const requiredMargin = notionalValue / leverage;

  const validationError = useMemo(() => {
    if (!wallet.isConnected) {
      return 'Connect wallet to trade';
    }
    if (!size || sizeNum <= 0) {
      return 'Enter a valid size';
    }
    if (requiredMargin > wallet.balance) {
      return 'Insufficient balance';
    }
    return null;
  }, [wallet.isConnected, size, sizeNum, requiredMargin, wallet.balance]);

  const handlePlaceOrder = async (side: OrderSide) => {
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    setActiveSide(side);
    try {
      await onPlaceOrder(side, sizeNum, leverage);
      toast.success(`${side} order placed for ${sizeNum} ${market.baseAsset}`);
      setSize('');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="label-uppercase text-xs">Position Controls</h3>

      {/* Position Size */}
      <div className="flex flex-col gap-2">
        <label className="label-uppercase text-[10px]">Size</label>
        <div className="relative">
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="0.00"
            className="input-trading w-full pr-16"
            step="0.001"
            min="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
            {market.baseAsset}
          </span>
        </div>
        {sizeNum > 0 && (
          <span className="text-xs text-muted-foreground font-mono">
            ≈ ${notionalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )}
      </div>

      {/* Leverage */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="label-uppercase text-[10px]">Leverage</label>
          <span className="font-mono text-sm">{leverage}x</span>
        </div>
        <div className="flex gap-2">
          {LEVERAGE_OPTIONS.map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`leverage-btn flex-1 ${leverage === lev ? 'leverage-btn-active' : ''}`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Balance & Margin Info */}
      <div className="flex flex-col gap-3 p-4 trading-surface">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Available</span>
          <span className="font-mono">
            ${wallet.isConnected ? wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </span>
        </div>
        {sizeNum > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Required Margin</span>
            <span className="font-mono">
              ${requiredMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {validationError && wallet.isConnected && size && (
        <div className="flex items-center gap-2 text-short text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Trade Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handlePlaceOrder('LONG')}
          disabled={!!validationError || isLoading}
          className="btn-long flex items-center justify-center gap-2"
        >
          {isLoading && activeSide === 'LONG' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          Long
        </button>
        <button
          onClick={() => handlePlaceOrder('SHORT')}
          disabled={!!validationError || isLoading}
          className="btn-short flex items-center justify-center gap-2"
        >
          {isLoading && activeSide === 'SHORT' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          Short
        </button>
      </div>

      {!wallet.isConnected && (
        <p className="text-center text-sm text-muted-foreground">
          Connect wallet to trade
        </p>
      )}
    </div>
  );
}