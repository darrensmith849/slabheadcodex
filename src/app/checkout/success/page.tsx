import Link from "next/link";
import { OrderStatusPoll } from "@/components/commerce/order-status-poll";

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSingle(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = readSingle(params.orderId);

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Thank You</h1>
        <p className="mt-3 text-[#b9c7e8]">Your payment flow completed. We are waiting for final PayFast confirmation.</p>
        {orderId ? <OrderStatusPoll orderId={orderId} /> : <p className="mt-3 text-[#b9c7e8]">Missing order reference.</p>}
      </section>

      <Link href="/shop" className="inline-flex rounded-md border border-white/20 px-4 py-2 font-semibold hover:bg-white/5">
        Continue Shopping
      </Link>
    </main>
  );
}
