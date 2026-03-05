import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/orders/store";
import { verifyPayfastITN } from "@/lib/payments/payfast";

function parseBody(body: string) {
  const parsed = new URLSearchParams(body);
  const out: Record<string, string> = {};

  for (const [key, value] of parsed.entries()) {
    out[key] = value;
  }

  return out;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const formBody = parseBody(rawBody);
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  const validSignature = verifyPayfastITN(formBody, passphrase);
  if (!validSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const orderId = formBody.m_payment_id || formBody.custom_str1;
  if (!orderId) {
    return new NextResponse("Missing order reference", { status: 400 });
  }

  const store = getOrderStore();
  const order = await store.getOrder(orderId);
  if (!order) {
    return new NextResponse("Order not found", { status: 404 });
  }

  const receivedAmount = Number(formBody.amount_gross ?? formBody.amount ?? "0");
  if (!Number.isFinite(receivedAmount) || receivedAmount.toFixed(2) !== order.total.toFixed(2)) {
    return new NextResponse("Amount mismatch", { status: 400 });
  }

  const paymentStatus = (formBody.payment_status ?? "").toUpperCase();

  if (paymentStatus === "COMPLETE") {
    const providerRef = formBody.pf_payment_id || formBody.payment_id || formBody.m_payment_id;
    await store.markPaid(order.id, providerRef ?? order.id);
  } else if (paymentStatus === "CANCELLED" || paymentStatus === "FAILED") {
    await store.markCancelled(order.id);
  }

  return new NextResponse("OK", { status: 200 });
}
