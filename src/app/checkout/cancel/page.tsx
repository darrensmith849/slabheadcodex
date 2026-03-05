import Link from "next/link";

type CancelPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSingle(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function CheckoutCancelPage({ searchParams }: CancelPageProps) {
  const params = await searchParams;
  const orderId = readSingle(params.orderId);

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Payment Cancelled</h1>
        <p className="mt-3 text-[#b9c7e8]">Your PayFast payment was cancelled. You can review your cart and try again.</p>
        {orderId ? <p className="mt-3 text-sm text-[#9fb1dc]">Order reference: {orderId}</p> : null}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/checkout" className="inline-flex rounded-md bg-[#385dff] px-4 py-2 font-semibold text-white hover:brightness-110">
          Back to Checkout
        </Link>
        <Link href="/shop" className="inline-flex rounded-md border border-white/20 px-4 py-2 font-semibold hover:bg-white/5">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
