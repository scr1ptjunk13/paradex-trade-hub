"use client";

import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import * as Paradex from '@paradex/sdk';
import { ethers } from 'ethers';
import { hash, CallData } from 'starknet';
import { keyDerivation } from '@starkware-industries/starkware-crypto-utils';

import { 
  getDefaultConfig,
  authenticate,
  getPositions as getPositionsAPI,
  createOrder as createOrderAPI,
  getUSDCBalance,
  type ParadexAccount,
  type ParadexPosition,
  type OrderRequest,
  type SystemConfig
} from './paradex/api';

export interface UseParadexReturn {
  // Connection state
  isConnecting: boolean;
  isConnected: boolean;
  isTradingEnabled: boolean;
  
  // Data
  balance: number;
  positions: ParadexPosition[];
  paradexAddress: string | null;
  
  // Actions
  initializeParadex: () => Promise<void>;
  enableTrading: () => Promise<void>;
  placeOrder: (order: OrderRequest) => Promise<any>;
  refreshBalance: () => Promise<void>;
  refreshPositions: () => Promise<void>;
  disconnect: () => void;
  
  // Errors
  error: string | null;
}

export function useParadex(): UseParadexReturn {
  const { data: walletClient } = useWalletClient();
  
  // SDK account for balance and account info
  const [paradexAccount, setParadexAccount] = useState<any>(null);
  
  // REST API account for trading
  const [tradingAccount, setTradingAccount] = useState<ParadexAccount | null>(null);
  const [config] = useState<SystemConfig>(getDefaultConfig());
  
  // State
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [positions, setPositions] = useState<ParadexPosition[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initializeParadex = useCallback(async () => {
    if (!walletClient || paradexAccount) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const ethersSigner = await provider.getSigner();
      const ethAddress = await ethersSigner.getAddress();
      
      // EIP-712 typed data for STARK key derivation (matches real Paradex)
      const starkKeyMessage = {
        domain: {
          name: 'Paradex',
          chainId: 1, // Ethereum Mainnet
          version: '1',
        },
        types: {
          Constant: [
            { name: 'action', type: 'string' },
          ],
        },
        primaryType: 'Constant',
        message: {
          action: 'STARK Key',
        },
      };
      
      const starkSignature = await ethersSigner.signTypedData(
        starkKeyMessage.domain,
        { Constant: starkKeyMessage.types.Constant },
        starkKeyMessage.message
      );
      const privateKey = keyDerivation.getPrivateKeyFromEthSignature(starkSignature);
      const publicKey = keyDerivation.privateToStarkKey(privateKey);
      const derivedPrivateKey = `0x${privateKey}`;
      const publicKeyHex = `0x${publicKey}`;
      
      // Get Paradex config to compute account address
      const paradexConfig = await Paradex.Config.fetch('prod');
      const accountClassHash = paradexConfig.paraclearAccountHash;
      const accountProxyClassHash = paradexConfig.paraclearAccountProxyHash;
      
      // Compute account address using Paradex's exact method (proxy pattern)
      const callData = CallData.compile({
        implementation: accountClassHash,
        selector: hash.getSelectorFromName('initialize'),
        calldata: CallData.compile({
          signer: publicKeyHex,
          guardian: '0',
        }),
      });
      const accountAddress = hash.calculateContractAddressFromHash(
        publicKeyHex,
        accountProxyClassHash,
        callData,
        0
      );
      
      // Use REST API config
      const apiConfig = getDefaultConfig();
      
      // Create trading account with derived key and computed address
      const tradingAcc: ParadexAccount = {
        address: accountAddress,
        publicKey: publicKeyHex,
        privateKey: derivedPrivateKey,
        ethereumAccount: ethAddress,
      };
      
      try {
        const { onboardUser } = await import('./paradex/api');
        await onboardUser(apiConfig, tradingAcc);
      } catch {
        // Already onboarded - continue
      }
      
      const jwtToken = await authenticate(apiConfig, tradingAcc);
      tradingAcc.jwtToken = jwtToken;
      
      setParadexAccount({ connected: true, ethAddress } as any);
      setTradingAccount(tradingAcc);
      
      const usdcBalance = await getUSDCBalance(apiConfig, tradingAcc);
      setBalance(usdcBalance);
      
      const userPositions = await getPositionsAPI(apiConfig, tradingAcc);
      setPositions(userPositions);
      
    } catch (e) {
      console.error('Paradex connection failed:', e);
      setError(e instanceof Error ? e.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [walletClient, paradexAccount]);

  const enableTrading = useCallback(async () => {
    if (!paradexAccount) throw new Error('Not connected');
  }, [paradexAccount]);

  const refreshBalance = useCallback(async () => {
    if (!tradingAccount) return;
    try {
      const usdcBalance = await getUSDCBalance(config, tradingAccount);
      setBalance(usdcBalance);
    } catch (e) {
      console.error('Balance refresh failed:', e);
    }
  }, [config, tradingAccount]);

  const refreshPositions = useCallback(async () => {
    if (!tradingAccount) return;
    try {
      setPositions(await getPositionsAPI(config, tradingAccount));
    } catch (e) {
      console.error('Positions refresh failed:', e);
    }
  }, [config, tradingAccount]);

  const placeOrder = useCallback(async (order: OrderRequest) => {
    if (!tradingAccount) throw new Error('Not connected');
    const result = await createOrderAPI(config, tradingAccount, order);
    await Promise.all([refreshBalance(), refreshPositions()]);
    return result;
  }, [config, tradingAccount, refreshBalance, refreshPositions]);

  const disconnect = useCallback(() => {
    setParadexAccount(null);
    setTradingAccount(null);
    setBalance(0);
    setPositions([]);
    setError(null);
  }, []);

  return {
    isConnecting,
    isConnected: !!paradexAccount,
    isTradingEnabled: !!tradingAccount,
    balance,
    positions,
    paradexAddress: paradexAccount?.ethAddress ?? null,
    initializeParadex,
    enableTrading,
    placeOrder,
    refreshBalance,
    refreshPositions,
    disconnect,
    error,
  };
}
