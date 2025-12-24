import { getUnixTime } from "date-fns";
import { shortString, ec, typedData as starkTypedData, TypedData } from "starknet";
import BigNumber from "bignumber.js";

import { AuthRequest, buildAuthTypedData, buildOnboardingTypedData, buildOrderTypedData } from "./typedData";
import { ParadexAccount, SystemConfig, UnixTime } from "./types";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Convert to quantums (smallest unit)
export function toQuantums(amount: BigNumber | string, precision: number): string {
  const bnAmount = typeof amount === "string" ? new BigNumber(amount) : amount;
  const bnQuantums = bnAmount.dividedBy(`1e-${precision}`);
  return bnQuantums.integerValue(BigNumber.ROUND_FLOOR).toString();
}

function signatureFromTypedData(account: ParadexAccount, typedData: TypedData): string {
  const msgHash = starkTypedData.getMessageHash(typedData, account.address);
  const { r, s } = ec.starkCurve.sign(msgHash, account.privateKey);
  return JSON.stringify([r.toString(), s.toString()]);
}

export function generateTimestamps(): {
  timestamp: UnixTime;
  expiration: UnixTime;
} {
  const dateNow = new Date();
  const dateExpiration = new Date(dateNow.getTime() + SEVEN_DAYS_MS);

  return {
    timestamp: getUnixTime(dateNow),
    expiration: getUnixTime(dateExpiration),
  };
}

export function signOnboardingRequest(
  config: SystemConfig,
  account: ParadexAccount
): string {
  const typedData = buildOnboardingTypedData(config.starknet.chainId);
  return signatureFromTypedData(account, typedData as TypedData);
}

export function signAuthRequest(
  config: SystemConfig,
  account: ParadexAccount
): {
  signature: string;
  timestamp: UnixTime;
  expiration: UnixTime;
} {
  const { timestamp, expiration } = generateTimestamps();

  const request: AuthRequest = {
    method: "POST",
    path: "/v1/auth",
    body: "",
    timestamp,
    expiration,
  };

  const typedData = buildAuthTypedData(request, config.starknet.chainId);
  const signature = signatureFromTypedData(account, typedData as TypedData);

  return { signature, timestamp, expiration };
}

export function signOrder(
  config: SystemConfig,
  account: ParadexAccount,
  orderDetails: Record<string, string>,
  timestamp: UnixTime
): string {
  const sideForSigning = orderDetails.side === "BUY" ? "1" : "2";

  const priceForSigning = toQuantums(orderDetails.price ?? "0", 8);
  const sizeForSigning = toQuantums(orderDetails.size, 8);
  const orderTypeForSigning = shortString.encodeShortString(orderDetails.type);
  const marketForSigning = shortString.encodeShortString(orderDetails.market);

  const message = {
    timestamp: timestamp,
    market: marketForSigning,
    side: sideForSigning,
    orderType: orderTypeForSigning,
    size: sizeForSigning,
    price: priceForSigning,
  };

  const typedData = buildOrderTypedData(message, config.starknet.chainId);
  return signatureFromTypedData(account, typedData as TypedData);
}
