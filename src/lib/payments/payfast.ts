import { createHash } from "node:crypto";
import type { Order } from "@/lib/orders/types";

export type PayfastPayload = Record<string, string>;

export const PAYFAST_ENDPOINTS = {
  live: "https://www.payfast.co.za/eng/process",
  sandbox: "https://sandbox.payfast.co.za/eng/process",
} as const;

function phpUrlEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

export function signatureString(payload: Record<string, string>, passphrase?: string) {
  const pairs = Object.entries(payload)
    .filter(([key, value]) => key !== "signature" && value !== undefined && value !== null && String(value) !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${phpUrlEncode(String(value).trim())}`);

  if (passphrase && passphrase.trim()) {
    pairs.push(`passphrase=${phpUrlEncode(passphrase.trim())}`);
  }

  return pairs.join("&");
}

export function signPayfastPayload(payload: Record<string, string>, passphrase?: string) {
  return createHash("md5").update(signatureString(payload, passphrase)).digest("hex");
}

export function verifyPayfastITN(formBody: Record<string, string>, passphrase?: string) {
  const incomingSignature = formBody.signature;
  if (!incomingSignature) return false;

  const calculated = signPayfastPayload(formBody, passphrase);
  return incomingSignature.toLowerCase() === calculated.toLowerCase();
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "Customer", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
}

export function buildPayfastPayload(order: Order, siteUrl: string, merchantId: string, merchantKey: string): PayfastPayload {
  const { first, last } = splitName(order.customer.fullName);
  const returnUrl = `${siteUrl}/checkout/success?orderId=${encodeURIComponent(order.id)}`;
  const cancelUrl = `${siteUrl}/checkout/cancel?orderId=${encodeURIComponent(order.id)}`;
  const notifyUrl = `${siteUrl}/api/payfast/itn`;

  return {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    name_first: first,
    name_last: last,
    email_address: order.customer.email,
    m_payment_id: order.id,
    amount: order.total.toFixed(2),
    item_name: `Slabhead Order ${order.id}`,
    item_description: `${order.items.length} item(s)`,
    custom_str1: order.id,
  };
}

export function getPayfastEndpoint(useSandbox: boolean) {
  return useSandbox ? PAYFAST_ENDPOINTS.sandbox : PAYFAST_ENDPOINTS.live;
}
