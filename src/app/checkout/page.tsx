import type { Metadata } from "next";
import { CheckoutClient } from "@/components/commerce/checkout-client";
import { listProducts } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout via PayFast hosted payment page.",
  alternates: { canonical: "/checkout" },
};

export default async function CheckoutPage() {
  const products = await listProducts();
  const catalogue = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    price: product.offer.price,
    image: product.images[0]?.src,
  }));

  const sandbox = String(process.env.PAYFAST_SANDBOX).toLowerCase() === "true";

  return <CheckoutClient catalogue={catalogue} payfastSandbox={sandbox} />;
}
