"use client";

import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
  cookie?: string | null;
}

export function Providers({ children, cookie }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only initialize config on client side
  if (!mounted) {
    return null;
  }

  const config = getConfig();
  const initialState = cookieToInitialState(config, cookie);
  
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#ffffff',
            accentColorForeground: '#000000',
            borderRadius: 'small',
            fontStack: 'system',
          })}
        >
          {children}
          <Toaster position="top-right" theme="dark" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
