import { Position } from '@/types/trading';

interface PositionsTableProps {
  positions: Position[];
  isConnected: boolean;
}

export function PositionsTable({ positions, isConnected }: PositionsTableProps) {
  if (!isConnected) {
    return (
      <div className="trading-card p-6">
        <h3 className="label-uppercase text-xs mb-6">Active Positions</h3>
        <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
          Connect wallet to view positions
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="trading-card p-6">
        <h3 className="label-uppercase text-xs mb-6">Active Positions</h3>
        <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
          No open positions
        </div>
      </div>
    );
  }

  return (
    <div className="trading-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="label-uppercase text-xs">Active Positions</h3>
        <span className="text-xs text-muted-foreground">{positions.length} open</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 label-uppercase text-[10px] font-medium">Market</th>
              <th className="text-right py-3 px-4 label-uppercase text-[10px] font-medium">Size</th>
              <th className="text-right py-3 px-4 label-uppercase text-[10px] font-medium">Entry Price</th>
              <th className="text-right py-3 px-4 label-uppercase text-[10px] font-medium">PnL</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{position.market}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      position.side === 'LONG' 
                        ? 'bg-long/20 text-long' 
                        : 'bg-short/20 text-short'
                    }`}>
                      {position.side}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-mono text-sm">
                  {position.size} <span className="text-muted-foreground">{position.leverage}x</span>
                </td>
                <td className="py-4 px-4 text-right font-mono text-sm">
                  ${position.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`font-mono text-sm ${position.pnl >= 0 ? 'text-long' : 'text-short'}`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    <span className="text-xs opacity-70 ml-1">
                      ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}