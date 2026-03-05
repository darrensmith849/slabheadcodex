import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getOrderStore } from "@/lib/orders/store";
import { buildPayfastPayload, getPayfastEndpoint, signPayfastPayload } from "@/lib/payments/payfast";

type PageParams = {
  params: Promise<{ orderId: string }>;
};

export const dynamic = "force-dynamic";

export default async function PayfastRedirectPage({ params }: PageParams) {
  const { orderId } = await params;
  const store = getOrderStore();
  const order = await store.getOrder(orderId);

  if (!order) {
    notFound();
  }

  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const sandbox = String(process.env.PAYFAST_SANDBOX).toLowerCase() === "true";

  if (!merchantId || !merchantKey) {
    throw new Error("PayFast merchant credentials are missing.");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl;
  const payload = buildPayfastPayload(order, siteUrl, merchantId, merchantKey);
  const signature = signPayfastPayload(payload, passphrase);
  const action = getPayfastEndpoint(sandbox);

  return (
    <main className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#101524] p-8 text-[#e8eeff]">
      <h1 className="font-heading text-3xl uppercase tracking-[0.12em]">Redirecting to PayFast</h1>
      <p className="mt-3 text-[#b7c4e8]">Please wait while we redirect you to the secure PayFast checkout page.</p>

      <form id="payfast-form" className="mt-6" method="post" action={action}>
        {Object.entries({ ...payload, signature }).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <noscript>
          <button type="submit" className="rounded-md bg-[#385dff] px-4 py-2 font-semibold text-white">
            Continue to PayFast
          </button>
        </noscript>
      </form>

      <script
        dangerouslySetInnerHTML={{
          __html: "document.getElementById('payfast-form')?.submit();",
        }}
      />
    </main>
  );
}
