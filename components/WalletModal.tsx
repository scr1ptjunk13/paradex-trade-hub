"use client";

import { useConnectModal } from '@rainbow-me/rainbowkit';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { openConnectModal } = useConnectModal();

  if (!isOpen) return null;

  const handleEthereumWallet = () => {
    onClose();
    if (openConnectModal) {
      openConnectModal(); // Opens RainbowKit modal with all wallet options
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#111] border border-[#222] p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] uppercase tracking-widest">Connect Wallet</h2>
          <button 
            onClick={onClose}
            className="text-[#6b7280] hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="text-[11px] text-[#6b7280] mb-6 leading-relaxed">
          Choose your wallet type to get started.<br />
          You'll use this wallet for all exchange connections.
        </p>

        {/* Wallet Options */}
        <div className="space-y-3">
          {/* Ethereum Wallet Option */}
          <button
            onClick={handleEthereumWallet}
            className="w-full flex items-center gap-4 p-4 border border-[#222] hover:border-[#444] transition-colors text-left"
          >
            <div className="w-10 h-10 bg-[#627eea] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="white" fillOpacity="0.6"/>
                <path d="M127.962 0L0 212.32L127.962 287.959V154.158V0Z" fill="white"/>
                <path d="M127.961 312.187L126.386 314.107V412.306L127.961 416.905L255.999 236.587L127.961 312.187Z" fill="white" fillOpacity="0.6"/>
                <path d="M127.962 416.905V312.187L0 236.587L127.962 416.905Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider">Ethereum Wallet</div>
              <div className="text-[10px] text-[#6b7280] uppercase tracking-wider mt-0.5">
                MetaMask, Rainbow, etc.
              </div>
            </div>
          </button>

          {/* Starknet Option (disabled - not needed per plan.md) */}
          <button
            disabled
            className="w-full flex items-center gap-4 p-4 border border-[#222] opacity-40 cursor-not-allowed text-left"
          >
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6b7280]">Starknet Wallet</div>
              <div className="text-[10px] text-[#6b7280] uppercase tracking-wider mt-0.5">
                Coming Soon
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
