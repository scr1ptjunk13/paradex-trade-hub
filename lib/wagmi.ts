import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  phantomWallet,
  ledgerWallet,
  rabbyWallet,
  trustWallet,
  argentWallet,
  braveWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { mainnet } from 'wagmi/chains';
import { cookieStorage, createStorage, http } from 'wagmi';

// Lazy load config to prevent WalletConnect's indexedDB initialization on server
let wagmiConfig: ReturnType<typeof getDefaultConfig> | null = null;

export function getConfig() {
  if (!wagmiConfig) {
    wagmiConfig = getDefaultConfig({
      appName: 'Paradex Trade Hub',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
      chains: [mainnet],
      ssr: true,
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [mainnet.id]: http(),
      },
      wallets: [
        {
          groupName: 'Installed',
          wallets: [
            injectedWallet,
            braveWallet,
            metaMaskWallet,
            phantomWallet,
          ],
        },
        {
          groupName: 'Suggested',
          wallets: [
            rainbowWallet,
            walletConnectWallet,
            ledgerWallet,
            rabbyWallet,
            coinbaseWallet,
            trustWallet,
            argentWallet,
          ],
        },
      ],
    });
  }
  return wagmiConfig;
}

// For static imports that need the config type
export const config = typeof window !== 'undefined' 
  ? getConfig() 
  : (null as unknown as ReturnType<typeof getDefaultConfig>);
