import Image from "next/image";
import Link from "next/link";
import { CategoryCard, ProductCard, ServiceCard } from "@/components/cards";
import { CtaBlock, TrustBadge } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { listCategories, listProducts } from "@/lib/commerce/provider";

export default async function Home() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const featured = products.slice(0, 3);
  const hotNow = products.slice(1, 4);

  return (
    <div className="space-y-12 pb-10">
      <section className="grid gap-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(56,93,255,0.22),transparent_35%),#0f1422] p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div className="space-y-4">
          <p className="font-heading text-xs uppercase tracking-[0.28em] text-[#95acff]">Codex Elite Vault</p>
          <h1 className="font-heading text-4xl leading-tight text-[#f3f6ff] sm:text-5xl">
            Premium TCG cards for collectors who verify everything.
          </h1>
          <p className="max-w-2xl text-lg text-[#b6c4ea]">
            Codex curates high-trust slab listings, transparent pricing, and concierge card services across Pokemon, Yu-Gi-Oh, and MTG.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-lg bg-[#385dff] px-5 py-3 font-semibold text-white hover:brightness-110">
              Shop Cards
            </Link>
            <Link href="/slabhunter" className="rounded-lg border border-white/20 px-5 py-3 font-semibold text-[#d9e2ff] hover:bg-white/5">
              Start SlabHunter
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/10">
          <Image
            src="/assets/legacy/brand/scene-02.jpg"
            alt="Codex neon TCG culture visual"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#101524] p-4">
        <div className="flex flex-wrap gap-2">
          <TrustBadge label="South Africa-based" />
          <TrustBadge label="Secure checkout" />
          <TrustBadge label="Real condition notes" />
          <TrustBadge label="Collector support" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">New Drops</h2>
          <Link href="/shop" className="text-sm font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0]?.src ?? "/assets/legacy/placeholders/5c96d5785be55911.svg"}
              price={product.offer.price}
              company={product.gradeCompany}
              score={product.gradeScore}
              game={product.game}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Hot Right Now</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {hotNow.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0]?.src ?? "/assets/legacy/placeholders/5c96d5785be55911.svg"}
              price={product.offer.price}
              company={product.gradeCompany}
              score={product.gradeScore}
              game={product.game}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Category Cards</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              title={category.name}
              href={`/${category.slug}`}
              image={category.heroImage}
              description={category.description}
            />
          ))}
        </div>
      </section>

      <CtaBlock
        title="Grail Vault"
        copy="Looking for an exact card and grade combo? Codex sources grails discreetly through vetted collector channels and transparent offer workflows."
        href="/slabhunter"
        cta="Request Grail Hunt"
      />

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Services Strip</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ServiceCard
            title="SlabHunter"
            href="/slabhunter"
            summary="Commission us to source specific slabs and rarity targets."
            cta="Start"
          />
          <ServiceCard
            title="SlabTrader"
            href="/slabtrader"
            summary="Trade and upgrade value across verified collector inventory."
            cta="Trade"
          />
          <ServiceCard
            title="We Buy Cards"
            href="/we-buy-cards"
            summary="Fast valuation path for collections and premium singles."
            cta="Sell"
          />
          <ServiceCard
            title="Slabbing"
            href="/slabbing"
            summary="Preparation and submission guidance for grading pipelines."
            cta="Submit"
          />
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-[#101524] p-7 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Culture Teaser</h2>
          <p className="mt-3 text-[#b8c6e8]">
            Codex bridges TCG commerce with collector culture: set lore, collecting strategy, and grading education made practical.
          </p>
          <Link href="/culture" className="mt-4 inline-flex font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            Explore culture stories
          </Link>
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-lg">
          <Image
            src="/assets/legacy/brand/003-sh-neon-03-1024x585.jpg"
            alt="Codex culture neon scene"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#0e1321] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Story</h2>
        <p className="mt-3 max-w-4xl text-[#b8c6e8]">
          {siteConfig.siteName} exists to make local TCG collecting feel premium, credible, and community-driven. Every listing page, every service flow,
          and every policy page is designed to replace template noise with trust signals collectors can verify.
        </p>
      </section>
    </div>
  );
}
