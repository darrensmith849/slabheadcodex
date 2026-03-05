export type CartItem = {
  slug: string;
  qty: number;
};

const CART_KEY = "slabhead-cart-v1";

function clampQty(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(20, Math.max(1, Math.trunc(value)));
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const slug = typeof item?.slug === "string" ? item.slug : "";
        const qty = typeof item?.qty === "number" ? clampQty(item.qty) : 1;
        return slug ? { slug, qty } : null;
      })
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(slug: string, quantity: number) {
  const cart = readCart();
  const qty = clampQty(quantity);
  const existing = cart.find((item) => item.slug === slug);

  if (existing) {
    existing.qty = clampQty(existing.qty + qty);
  } else {
    cart.push({ slug, qty });
  }

  writeCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
}
