"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { readCart, writeCart, type CartItem } from "@/lib/cart";

type CheckoutClientProps = {
  catalogue: Array<{ slug: string; name: string; price: number; image?: string }>;
  payfastSandbox: boolean;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

const defaultForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  province: "",
  postalCode: "",
  country: "South Africa",
};

export function CheckoutClient({ catalogue, payfastSandbox }: CheckoutClientProps) {
  const [cart, setCart] = useState<CartItem[]>(() => readCart());
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const map = useMemo(() => new Map(catalogue.map((item) => [item.slug, item])), [catalogue]);

  const rows = cart
    .map((item) => {
      const product = map.get(item.slug);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: product.price * item.qty,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const estTotal = rows.reduce((sum, row) => sum + row.lineTotal, 0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (rows.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    const response = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: rows.map((row) => ({ slug: row.slug, qty: row.qty })),
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          country: form.country,
        },
      }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Unable to start checkout.");
      setSubmitting(false);
      return;
    }

    const body = (await response.json()) as { orderId: string };
    writeCart([]);
    window.location.href = `/pay/payfast/${encodeURIComponent(body.orderId)}`;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Checkout</h1>
        <p className="mt-3 text-[#b9c7e8]">Secure hosted payment powered by PayFast.</p>
        {payfastSandbox ? (
          <p className="mt-4 rounded-md border border-amber-400/40 bg-amber-900/20 px-3 py-2 text-sm text-amber-200">
            PayFast Sandbox Mode is enabled. Use sandbox credentials for test payments.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">Cart</h2>
        {rows.length === 0 ? (
          <p className="mt-3 text-[#b9c7e8]">
            Your cart is empty. <Link className="text-[#95acff] hover:text-[#bfd0ff]" href="/shop">Browse the shop</Link>.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {rows.map((row) => (
              <div key={row.slug} className="flex items-center justify-between rounded-md border border-white/10 bg-[#111a2d] p-3">
                <div>
                  <p className="font-semibold text-[#eaf0ff]">{row.product.name}</p>
                  <p className="text-sm text-[#aebde3]">Qty: {row.qty}</p>
                </div>
                <p className="font-semibold text-[#eaf0ff]">R {row.lineTotal.toLocaleString("en-ZA")}</p>
              </div>
            ))}
            <p className="pt-2 text-right text-lg font-bold text-[#f3f6ff]">Estimated Total: R {estTotal.toLocaleString("en-ZA")}</p>
            <p className="text-right text-xs text-[#92a3cf]">Final amount is repriced server-side before payment.</p>
          </div>
        )}
      </section>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">Customer Details</h2>

        {error ? <p className="rounded-md border border-red-500/40 bg-red-900/20 p-3 text-red-200">{error}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[#d8e0f8]">
            Full Name
            <input
              required
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
            />
          </label>
          <label className="text-sm text-[#d8e0f8]">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
            />
          </label>
        </div>

        <label className="text-sm text-[#d8e0f8]">
          Phone
          <input
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
          />
        </label>

        <h3 className="pt-2 font-heading text-lg uppercase tracking-[0.08em] text-[#eef3ff]">Shipping Address</h3>

        <label className="text-sm text-[#d8e0f8]">
          Address Line 1
          <input
            required
            value={form.line1}
            onChange={(event) => setForm((prev) => ({ ...prev, line1: event.target.value }))}
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
          />
        </label>

        <label className="text-sm text-[#d8e0f8]">
          Address Line 2 (Optional)
          <input
            value={form.line2}
            onChange={(event) => setForm((prev) => ({ ...prev, line2: event.target.value }))}
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-[#d8e0f8]">
            City
            <input
              required
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
            />
          </label>
          <label className="text-sm text-[#d8e0f8]">
            Province
            <input
              value={form.province}
              onChange={(event) => setForm((prev) => ({ ...prev, province: event.target.value }))}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
            />
          </label>
          <label className="text-sm text-[#d8e0f8]">
            Postal Code
            <input
              required
              value={form.postalCode}
              onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
            />
          </label>
        </div>

        <label className="text-sm text-[#d8e0f8]">
          Country
          <input
            required
            value={form.country}
            onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={submitting || rows.length === 0}
          className="rounded-md bg-[#385dff] px-5 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#2a3354]"
        >
          {submitting ? "Redirecting..." : "Proceed to PayFast"}
        </button>
      </form>
    </div>
  );
}
