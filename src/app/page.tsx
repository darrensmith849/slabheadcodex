import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-8 rounded-2xl border border-white/10 bg-card p-8 shadow-[0_20px_70px_rgba(0,0,0,0.45)] lg:grid-cols-2">
      <div className="space-y-4">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-primary">Codex</p>
        <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
          Premium Trading Card Culture.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Codex is rebuilding the collector experience with a modern TCG storefront, trust-first
          service flows, and premium card presentation.
        </p>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Enter Shop
          </Link>
          <Link
            href="/services-categories"
            className="rounded-lg border border-white/20 px-5 py-3 font-semibold transition hover:bg-white/5"
          >
            Explore Services
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#1e2132] via-[#131724] to-[#0b0e16] p-6">
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-[#385dff]">Build Milestone</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Next.js App Router + TypeScript + Tailwind initialized</li>
          <li>shadcn/ui baseline integrated</li>
          <li>Codex branding and metadata configured</li>
          <li>Foundation ready for card system and commerce adapters</li>
        </ul>
      </div>
    </section>
  );
}
