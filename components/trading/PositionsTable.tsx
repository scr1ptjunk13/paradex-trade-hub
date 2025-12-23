"use client";

import { useState } from 'react';
import { Position } from '@/types/trading';

interface PositionsTableProps {
  positions: Position[];
  isConnected: boolean;
}

export function PositionsTable({ positions, isConnected }: PositionsTableProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'closed'>('positions');

  return (
    <div className="border-t border-[#1f1f1f]">
      {/* Tabs */}
      <div className="flex gap-6 px-4 border-b border-[#1f1f1f]">
        <button
          onClick={() => setActiveTab('positions')}
          className={`py-3 text-sm uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'positions' 
              ? 'border-white text-white' 
              : 'border-transparent text-[#6b7280] hover:text-white'
          }`}
        >
          Positions
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`py-3 text-sm uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'closed' 
              ? 'border-white text-white' 
              : 'border-transparent text-[#6b7280] hover:text-white'
          }`}
        >
          Closed
        </button>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'positions' ? (
          <>
            {!isConnected ? (
              <div className="flex items-center justify-center py-12 text-[#6b7280] text-sm">
                Connect wallet to view positions
              </div>
            ) : positions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-[#6b7280] text-sm">
                No open arbitrage positions
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1f1f1f]">
                    <th className="text-left py-3 text-[10px] text-[#6b7280] uppercase tracking-wider font-normal">Market</th>
                    <th className="text-right py-3 text-[10px] text-[#6b7280] uppercase tracking-wider font-normal">Size</th>
                    <th className="text-right py-3 text-[10px] text-[#6b7280] uppercase tracking-wider font-normal">Entry</th>
                    <th className="text-right py-3 text-[10px] text-[#6b7280] uppercase tracking-wider font-normal">PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.id} className="border-b border-[#1f1f1f]/50">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{position.market}</span>
                          <span className={`text-[10px] uppercase ${
                            position.side === 'LONG' ? 'text-[#00ff00]' : 'text-[#ff4444]'
                          }`}>
                            {position.side}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm">
                        {position.size} <span className="text-[#6b7280]">{position.leverage}x</span>
                      </td>
                      <td className="py-4 text-right text-sm">
                        ${position.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-right">
                        <span className={position.pnl >= 0 ? 'text-[#00ff00]' : 'text-[#ff4444]'}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-12 text-[#6b7280] text-sm">
            No closed positions
          </div>
        )}
      </div>
    </div>
  );
}