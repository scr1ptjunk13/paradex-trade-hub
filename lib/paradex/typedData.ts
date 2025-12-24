import { UnixTime } from './types';

const DOMAIN_TYPES = {
  StarkNetDomain: [
    { name: "name", type: "felt" },
    { name: "chainId", type: "felt" },
    { name: "version", type: "felt" },
  ],
};

export function buildParadexDomain(starknetChainId: string) {
  return {
    name: "Paradex",
    chainId: starknetChainId,
    version: "1",
  };
}

export function buildOnboardingTypedData(starknetChainId: string) {
  const paradexDomain = buildParadexDomain(starknetChainId);
  return {
    domain: paradexDomain,
    primaryType: "Constant",
    types: {
      ...DOMAIN_TYPES,
      Constant: [{ name: "action", type: "felt" }],
    },
    message: {
      action: "Onboarding",
    },
  };
}

export interface AuthRequest extends Record<string, unknown> {
  method: string;
  path: string;
  body: string;
  timestamp: UnixTime;
  expiration: UnixTime;
}

export function buildAuthTypedData(
  message: Record<string, unknown>,
  starknetChainId: string
) {
  const paradexDomain = buildParadexDomain(starknetChainId);
  return {
    domain: paradexDomain,
    primaryType: "Request",
    types: {
      ...DOMAIN_TYPES,
      Request: [
        { name: "method", type: "felt" },
        { name: "path", type: "felt" },
        { name: "body", type: "felt" },
        { name: "timestamp", type: "felt" },
        { name: "expiration", type: "felt" },
      ],
    },
    message,
  };
}

export function buildOrderTypedData(
  message: Record<string, unknown>,
  starknetChainId: string
) {
  const paradexDomain = buildParadexDomain(starknetChainId);
  return {
    domain: paradexDomain,
    primaryType: "Order",
    types: {
      ...DOMAIN_TYPES,
      Order: [
        { name: "timestamp", type: "felt" },
        { name: "market", type: "felt" },
        { name: "side", type: "felt" },
        { name: "orderType", type: "felt" },
        { name: "size", type: "felt" },
        { name: "price", type: "felt" },
      ],
    },
    message,
  };
}
