"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  slug: string;
  disabled?: boolean;
};

export function AddToCartButton({ slug, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm text-[#d8e0f8]">
        Qty
        <input
          type="number"
          min={1}
          max={20}
          value={quantity}
          onChange={(event) => setQuantity(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
          className="ml-2 w-20 rounded-md border border-white/15 bg-[#0b1020] px-2 py-1"
        />
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addToCart(slug, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1400);
        }}
        className="rounded-md bg-[#385dff] px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#2a3354]"
      >
        {disabled ? "Out of stock" : added ? "Added" : "Add to cart"}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addToCart(slug, quantity);
          window.location.href = "/checkout";
        }}
        className="rounded-md border border-[#4d6fff]/55 bg-[#4d6fff]/15 px-4 py-2 font-semibold text-[#dce6ff] transition hover:bg-[#4d6fff]/30 disabled:cursor-not-allowed disabled:border-[#2a3354] disabled:bg-[#202842] disabled:text-[#8391b8]"
      >
        Buy now
      </button>
      <Link href="/checkout" className="rounded-md border border-white/20 px-4 py-2 font-semibold text-[#d9e5ff] hover:bg-white/5">
        Go to checkout
      </Link>
    </div>
  );
}
