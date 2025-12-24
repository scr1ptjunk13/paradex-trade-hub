import axios, { AxiosError } from "axios";
import { shortString } from "starknet";

import { ParadexAccount, SystemConfig, OrderRequest, ParadexPosition, ParadexBalance } from "./types";
import { signAuthRequest, signOnboardingRequest, signOrder } from "./signature";

// Re-export types for consumers
export type { ParadexAccount, SystemConfig, OrderRequest, ParadexPosition, ParadexBalance };

// Production API URL
const PARADEX_API_URL = "https://api.prod.paradex.trade/v1";

// Production chain ID
const PARADEX_CHAIN_ID = shortString.encodeShortString("PRIVATE_SN_PARACLEAR_MAINNET");

// Default config for production
export function getDefaultConfig(): SystemConfig {
  return {
    apiBaseUrl: PARADEX_API_URL,
    starknet: { chainId: PARADEX_CHAIN_ID },
  };
}

function handleError(error: AxiosError): never {
  console.error("Paradex API Error:", error.response?.data || error.message);
  throw new Error(
    (error.response?.data as any)?.message || 
    (error.response?.data as any)?.error || 
    error.message || 
    "Unknown API error"
  );
}

// Onboarding - Register account with Paradex
export async function onboardUser(config: SystemConfig, account: ParadexAccount): Promise<void> {
  const timestamp = Date.now();
  const signature = signOnboardingRequest(config, account);

  const inputBody = JSON.stringify({
    public_key: account.publicKey,
  });

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "PARADEX-ETHEREUM-ACCOUNT": account.ethereumAccount,
    "PARADEX-STARKNET-ACCOUNT": account.address,
    "PARADEX-STARKNET-SIGNATURE": signature,
    "PARADEX-TIMESTAMP": timestamp.toString(),
  };

  try {
    await axios.post(`${config.apiBaseUrl}/onboarding`, inputBody, { headers });
  } catch (e) {
    // Onboarding may fail if already onboarded - that's OK
    const error = e as AxiosError;
    if ((error.response?.data as any)?.error?.includes("already")) {
      return;
    }
    handleError(error);
  }
}

// Authenticate and get JWT token
export async function authenticate(config: SystemConfig, account: ParadexAccount): Promise<string> {
  const { signature, timestamp, expiration } = signAuthRequest(config, account);
  
  const headers = {
    Accept: "application/json",
    "PARADEX-STARKNET-ACCOUNT": account.address,
    "PARADEX-STARKNET-SIGNATURE": signature,
    "PARADEX-TIMESTAMP": timestamp.toString(),
    "PARADEX-SIGNATURE-EXPIRATION": expiration.toString(),
  };

  try {
    const response = await axios.post(`${config.apiBaseUrl}/auth`, {}, { headers });
    return response.data.jwt_token;
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Get account balances
export async function getBalances(config: SystemConfig, account: ParadexAccount): Promise<ParadexBalance[]> {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  try {
    const response = await axios.get(`${config.apiBaseUrl}/balance`, { headers });
    return response.data.results || [];
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Get USDC balance specifically
export async function getUSDCBalance(config: SystemConfig, account: ParadexAccount): Promise<number> {
  const balances = await getBalances(config, account);
  const usdcBalance = balances.find(b => b.token === "USDC");
  return usdcBalance ? parseFloat(usdcBalance.size) : 0;
}

// Get open positions
export async function getPositions(config: SystemConfig, account: ParadexAccount): Promise<ParadexPosition[]> {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  try {
    const response = await axios.get(`${config.apiBaseUrl}/positions`, { headers });
    return response.data.results || [];
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Get open orders
export async function getOpenOrders(config: SystemConfig, account: ParadexAccount, market?: string): Promise<any[]> {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  const url = market 
    ? `${config.apiBaseUrl}/orders?market=${market}`
    : `${config.apiBaseUrl}/orders`;

  try {
    const response = await axios.get(url, { headers });
    return response.data.results || [];
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Place an order
export async function createOrder(
  config: SystemConfig,
  account: ParadexAccount,
  order: OrderRequest
): Promise<any> {
  const timestamp = Date.now();
  
  const orderDetails: Record<string, string> = {
    market: order.market,
    side: order.side,
    type: order.type,
    size: order.size,
    price: order.price || "0",
  };

  const signature = signOrder(config, account, orderDetails, timestamp);

  const inputBody = JSON.stringify({
    market: order.market,
    side: order.side,
    type: order.type,
    size: order.size,
    ...(order.price && { price: order.price }),
    ...(order.instruction && { instruction: order.instruction }),
    signature: signature,
    signature_timestamp: timestamp,
  });

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  try {
    const response = await axios.post(`${config.apiBaseUrl}/orders`, inputBody, { headers });
    return response.data;
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Cancel an order
export async function cancelOrder(config: SystemConfig, account: ParadexAccount, orderId: string): Promise<void> {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  try {
    await axios.delete(`${config.apiBaseUrl}/orders/${orderId}`, { headers });
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Cancel all orders for a market
export async function cancelAllOrders(config: SystemConfig, account: ParadexAccount, market?: string): Promise<void> {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  const url = market
    ? `${config.apiBaseUrl}/orders?market=${market}`
    : `${config.apiBaseUrl}/orders`;

  try {
    await axios.delete(url, { headers });
  } catch (e) {
    handleError(e as AxiosError);
  }
}

// Get account summary
export async function getAccountSummary(config: SystemConfig, account: ParadexAccount): Promise<any> {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${account.jwtToken}`,
  };

  try {
    const response = await axios.get(`${config.apiBaseUrl}/account/summary`, { headers });
    return response.data;
  } catch (e) {
    handleError(e as AxiosError);
  }
}
