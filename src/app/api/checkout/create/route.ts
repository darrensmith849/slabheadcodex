import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/commerce/provider";
import { getOrderStore } from "@/lib/orders/store";
import type { CustomerDetails, ShippingAddress } from "@/lib/orders/types";

type CheckoutRequest = {
  items?: Array<{ slug?: string; qty?: number }>;
  customer?: Partial<CustomerDetails>;
  shippingAddress?: Partial<ShippingAddress>;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCustomer(customer?: Partial<CustomerDetails>): customer is CustomerDetails {
  if (!customer) return false;
  if (!customer.fullName || customer.fullName.trim().length < 2) return false;
  if (!customer.email || !isValidEmail(customer.email.trim())) return false;
  return true;
}

function validateShippingAddress(address?: Partial<ShippingAddress>): address is ShippingAddress {
  if (!address) return false;
  if (!address.line1 || address.line1.trim().length < 3) return false;
  if (!address.city || address.city.trim().length < 2) return false;
  if (!address.postalCode || address.postalCode.trim().length < 3) return false;
  if (!address.country || address.country.trim().length < 2) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutRequest;
    const cartItems = payload.items ?? [];

    if (!cartItems.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!validateCustomer(payload.customer)) {
      return NextResponse.json({ error: "Invalid customer details." }, { status: 400 });
    }

    if (!validateShippingAddress(payload.shippingAddress)) {
      return NextResponse.json({ error: "Invalid shipping address." }, { status: 400 });
    }

    const repricedItems = [] as Array<{
      productSlug: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      image?: string;
    }>;

    for (const line of cartItems) {
      const slug = String(line.slug ?? "").trim();
      const quantity = Number(line.qty ?? 0);

      if (!slug || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json({ error: "Invalid cart line." }, { status: 400 });
      }

      const product = await getProductBySlug(slug);
      if (!product || product.offer.availability === "out_of_stock") {
        return NextResponse.json({ error: `Product unavailable: ${slug}` }, { status: 400 });
      }

      const unitPrice = product.offer.price;
      repricedItems.push({
        productSlug: product.slug,
        productName: product.name,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
        image: product.images[0]?.src,
      });
    }

    const subtotal = repricedItems.reduce((sum, line) => sum + line.lineTotal, 0);

    const store = getOrderStore();
    const order = await store.createOrder({
      status: "PAYMENT_PENDING",
      currency: "ZAR",
      items: repricedItems,
      subtotal,
      total: subtotal,
      customer: {
        fullName: payload.customer.fullName.trim(),
        email: payload.customer.email.trim().toLowerCase(),
        phone: payload.customer.phone?.trim() || undefined,
      },
      shippingAddress: {
        line1: payload.shippingAddress.line1.trim(),
        line2: payload.shippingAddress.line2?.trim() || undefined,
        city: payload.shippingAddress.city.trim(),
        province: payload.shippingAddress.province?.trim() || undefined,
        postalCode: payload.shippingAddress.postalCode.trim(),
        country: payload.shippingAddress.country.trim(),
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }
}
