import { ServiceCard } from "@/components/cards";

export default function ServicesCategoriesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Services</h1>
        <p className="mt-3 text-lg text-[#b9c7e8]">
          Codex services are built for collectors who need sourcing, trading, grading guidance, and structured liquidity options.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCard title="SlabHunter" href="/slabhunter" summary="Targeted slab sourcing for specific grails and grades." cta="Open" />
        <ServiceCard title="SlabTrader" href="/slabtrader" summary="Trade existing inventory into stronger collector positions." cta="Open" />
        <ServiceCard title="We Buy Cards" href="/we-buy-cards" summary="Get a transparent valuation and sale process for your cards." cta="Open" />
        <ServiceCard title="Slabbing" href="/slabbing" summary="Submission support and grading prep for better outcomes." cta="Open" />
        <ServiceCard title="Loan Broker" href="/loan-broker" summary="Info-only guidance for card-backed liquidity pathways." cta="Open" />
      </div>
    </div>
  );
}
