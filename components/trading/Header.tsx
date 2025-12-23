"use client";

import { Wallet } from "lucide-react";
import { WalletState } from "@/types/trading";

interface HeaderProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export function Header({ wallet, onConnectWallet, onDisconnectWallet }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Paradex Trade Hub</h1>

      {wallet.isConnected ? (
        <button
          onClick={onDisconnectWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-secondary hover:bg-muted transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono text-sm">{wallet.address}</span>
        </button>
      ) : (
        <button
          onClick={onConnectWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-200 transition-colors"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
      )}
    </header>
  );
}