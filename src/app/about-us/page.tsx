import Image from "next/image";

const pillars = [
  {
    title: "Mission",
    body: "Grow the local TCG market by making rare cards more accessible, better verified, and easier to buy with confidence.",
  },
  {
    title: "What We Stock",
    body: "Pokemon-focused inventory, Japanese exclusives, selected Yu-Gi-Oh and Magic products, plus practical collector accessories.",
  },
  {
    title: "How We Help",
    body: "SlabHunter sources hard-to-find grails, SlabTrader supports fair trade decisions, and We Buy Cards gives sellers a clean exit route.",
  },
  {
    title: "Trust and Safety",
    body: "Transparent listing notes, realistic pricing context, responsive communication, and policy pages that are clear and enforceable.",
  },
];

export default function AboutUsPage() {
  return (
    <article className="space-y-8">
      <section className="grid gap-6 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_80%_10%,rgba(236,109,255,0.24),transparent_38%),radial-gradient(circle_at_12%_14%,rgba(56,93,255,0.26),transparent_36%),#101524] p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-9">
        <div className="space-y-4">
          <p className="font-heading text-xs uppercase tracking-[0.26em] text-[#98aeff]">South African Collector Platform</p>
          <h1 className="font-heading text-4xl uppercase tracking-[0.08em] text-[#f3f6ff] lg:text-5xl">About Slabhead</h1>
          <p className="max-w-2xl text-lg text-[#c2cff0]">
            Slabhead is built for serious collectors who want premium cards, safer local trading, and real support from people who understand TCG markets.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full border border-[#5f7fff]/45 bg-[#5f7fff]/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#dce5ff]">
              Rare Cards
            </span>
            <span className="rounded-full border border-[#1fd7ff]/35 bg-[#1fd7ff]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#d7f6ff]">
              Japanese Exclusives
            </span>
            <span className="rounded-full border border-[#ec6dff]/40 bg-[#ec6dff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffdfff]">
              Collector Services
            </span>
          </div>
        </div>
        <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-white/15 shadow-[0_20px_40px_rgba(3,7,18,0.45)] lg:min-h-[340px]">
          <Image src="/assets/legacy/brand/scene-02.jpg" alt="Slabhead collector environment" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {pillars.map((item) => (
          <div key={item.title} className="rounded-xl border border-white/10 bg-[linear-gradient(145deg,#111a2f,#0f1426)] p-6">
            <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-[#eef3ff]">{item.title}</h2>
            <p className="mt-3 text-[#b9c7e8]">{item.body}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
