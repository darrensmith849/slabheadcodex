import Image from "next/image";
import Link from "next/link";
import { CategoryCard, ProductCard, ServiceCard } from "@/components/cards";
import { CtaBlock, TrustBadge } from "@/components/ui";
import { listCategories, listProducts } from "@/lib/commerce/provider";

const heroPinkImages = {
  main: "/assets/legacy/brand/screenshot-2025-01-16-at-14-34-44.jpg",
  top: "/assets/legacy/brand/screenshot-2025-01-16-at-14-34-54.jpg",
  bottom:
    "/assets/legacy/brand/dall-c2-b7e-2025-02-25-13-00-07-a-cyberpunk-inspired-scene-featuring-a-nerdy-character-in-a-futuristic-neon-lit-room-overlooking-a-sprawling-cyberpunk-cityscape-through-a-large-wind.webp",
};

export default async function Home() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const featured = products.slice(0, 4);

  return (
    <div className="space-y-12 pb-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(56,93,255,0.32),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(236,109,255,0.18),transparent_32%),#0f1422] p-7 lg:grid lg:min-h-[540px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:p-10">
        <span className="pointer-events-none absolute -right-16 -top-14 h-56 w-56 rounded-full bg-[#ec6dff]/20 blur-3xl" />
        <span className="pointer-events-none absolute left-[30%] top-[72%] h-40 w-40 rounded-full bg-[#20c8ff]/15 blur-3xl" />

        <div className="space-y-5">
          <p className="font-heading text-xs uppercase tracking-[0.28em] text-[#95acff]">Slabhead Collectables</p>
          <h1 className="font-heading hero-title text-[#f3f6ff]">Rare Pokemon cards and Japanese exclusives for serious South African collectors.</h1>
          <p className="hero-subtitle max-w-2xl text-[#b6c4ea]">
            Slabhead combines premium inventory, expert sourcing guidance, and collector-first service for buyers, traders, and long-term card investors.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-lg bg-[#385dff] px-5 py-3 font-semibold text-white hover:brightness-110">
              Shop Now
            </Link>
            <Link href="/collectables" className="rounded-lg border border-[#1fd7ff]/35 bg-[#1fd7ff]/10 px-5 py-3 font-semibold text-[#d7f6ff] hover:bg-[#1fd7ff]/20">
              Explore Collectables
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <TrustBadge label="South Africa based" />
            <TrustBadge label="Japanese exclusives" />
            <TrustBadge label="Collector guidance" />
          </div>
        </div>

        <div className="relative mt-6 grid min-h-[410px] grid-cols-2 gap-3 lg:mt-0 lg:min-h-[460px]">
          <div className="relative col-span-1 row-span-2 overflow-hidden rounded-2xl border border-white/15 bg-[#0f1422]">
            <Image src={heroPinkImages.main} alt="Slabhead neon collector visual" fill priority sizes="(max-width: 1024px) 52vw, 34vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0f1422]">
            <Image src={heroPinkImages.top} alt="Slabhead pink slab desk scene" fill priority sizes="(max-width: 1024px) 48vw, 22vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0f1422]">
            <Image
              src={heroPinkImages.bottom}
              alt="Slabhead cyberpunk card room visual"
              fill
              priority
              sizes="(max-width: 1024px) 48vw, 22vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Collectables</h2>
          <Link href="/collectables" className="text-sm font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            View all categories
          </Link>
        </div>
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

      <section className="grid gap-5 lg:grid-cols-2">
        <ServiceCard
          title="We Buy Cards"
          href="/we-buy-cards"
          summary="Sell singles, slabs, or full collections through a clear valuation flow and secure handover process."
          cta="Sell to Slabhead"
        />
        <ServiceCard
          title="SlabTrader"
          href="/slabtrader"
          summary="Trade into stronger positions using grade-aware comparisons and transparent value discussions."
          cta="Start Trading"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Featured Cards</h2>
          <Link href="/shop" className="text-sm font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            Browse shop
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
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

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_80%_5%,rgba(183,65,255,0.16),transparent_38%),#101524] p-7 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Culture</h2>
          <p className="mt-3 text-[#b8c6e8]">
            Slabhead connects commerce with culture through collecting strategy, set history, and practical grading education built for local collectors.
          </p>
          <Link href="/culture" className="mt-4 inline-flex font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            Explore culture stories
          </Link>
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-lg">
          <Image
            src="/assets/legacy/brand/003-sh-neon-03-1024x585.jpg"
            alt="Slabhead culture neon scene"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            loading="lazy"
            className="object-cover"
          />
        </div>
      </section>

      <CtaBlock
        title="SlabHunter"
        copy="Need a specific card and grade? Send your target, budget, and timeline, and Slabhead will source vetted options through trusted channels."
        href="/slabhunter"
        cta="Request a Hunt"
      />
    </div>
  );
}
