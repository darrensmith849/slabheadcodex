export default function AboutUsPage() {
  return (
    <article className="space-y-6 rounded-2xl border border-white/10 bg-[#101524] p-8">
      <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">About Slabhead</h1>
      <p className="text-[#b9c7e8]">
        Slabhead is a South African collector platform built around trading cards, graded slabs, and a safer local buying experience for serious hobbyists.
      </p>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-[#eef3ff]">Mission</h2>
        <p className="text-[#b9c7e8]">Grow the local TCG market by making rare cards more accessible, better verified, and easier to buy with confidence.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-[#eef3ff]">What We Stock</h2>
        <p className="text-[#b9c7e8]">
          Pokemon-focused inventory, Japanese exclusives, selected Yu-Gi-Oh and Magic products, plus collector accessories that support long-term card care.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-[#eef3ff]">How We Help</h2>
        <p className="text-[#b9c7e8]">
          SlabHunter sources hard-to-find cards, SlabTrader supports value-aware trade decisions, and We Buy Cards gives collectors a clean route to sell.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-[#eef3ff]">Trust and Safety</h2>
        <p className="text-[#b9c7e8]">
          We prioritise transparent listing details, realistic pricing, responsive communication, and clear policy pages so collectors know exactly where they stand.
        </p>
      </section>
    </article>
  );
}
