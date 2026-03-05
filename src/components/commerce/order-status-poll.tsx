"use client";

import { useEffect, useState } from "react";

type OrderStatusPollProps = {
  orderId: string;
};

type OrderStatusResponse = {
  status: "CREATED" | "PAYMENT_PENDING" | "PAID" | "CANCELLED" | "FAILED";
};

export function OrderStatusPoll({ orderId }: OrderStatusPollProps) {
  const [status, setStatus] = useState<OrderStatusResponse["status"] | "LOADING">("LOADING");

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
      if (!response.ok) return;
      const body = (await response.json()) as OrderStatusResponse;
      if (!cancelled) {
        setStatus(body.status);
      }
    }

    poll();
    const timer = window.setInterval(poll, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [orderId]);

  if (status === "LOADING" || status === "PAYMENT_PENDING") {
    return <p className="mt-3 text-[#b9c7e8]">Payment received. Waiting for PayFast confirmation (ITN)...</p>;
  }

  if (status === "PAID") {
    return <p className="mt-3 rounded-md border border-green-500/40 bg-green-900/20 p-3 text-green-200">Payment confirmed. Your order is marked as paid.</p>;
  }

  if (status === "CANCELLED" || status === "FAILED") {
    return <p className="mt-3 rounded-md border border-red-500/40 bg-red-900/20 p-3 text-red-200">Payment was not completed.</p>;
  }

  return <p className="mt-3 text-[#b9c7e8]">Current order status: {status}</p>;
}
