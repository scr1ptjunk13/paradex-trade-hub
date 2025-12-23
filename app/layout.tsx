import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Paradex Trade Hub",
  description: "Decentralized perpetual trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = headers().get("cookie");
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers cookie={cookie}>{children}</Providers>
      </body>
    </html>
  );
}
