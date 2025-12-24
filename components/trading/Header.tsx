"use client";

import { WalletState } from "@/types/trading";

interface HeaderProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export function Header({ wallet, onConnectWallet, onDisconnectWallet }: HeaderProps) {
  return (
    <header className="h-12 border-b border-[#1f1f1f] bg-[#0a0a0a] flex items-center justify-end px-4 gap-3">
      {wallet.isConnected ? (
        <button
          onClick={onDisconnectWallet}
          className="flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-[13px] tracking-wide"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" />
          <span>{wallet.address}</span>
        </button>
      ) : (
        <button
          onClick={onConnectWallet}
          className="px-5 py-2 border border-[#333] hover:bg-[#111] transition-colors text-[13px] tracking-widest uppercase"
        >
          Connect Wallet
        </button>
      )}
    </header>
  );
}