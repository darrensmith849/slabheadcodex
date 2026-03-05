import Image from "next/image";
import Link from "next/link";
import { CategoryCard, ProductCard, ServiceCard } from "@/components/cards";
import { CtaBlock, TrustBadge } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { listCategories, listProducts } from "@/lib/commerce/provider";

const heroPinkImages = {
  main: "/assets/legacy/brand/screenshot-2025-01-16-at-14-34-44.jpg",
  top: "/assets/legacy/brand/screenshot-2025-01-16-at-14-34-54.jpg",
  bottom: "/assets/legacy/brand/dall-c2-b7e-2025-02-25-13-00-07-a-cyberpunk-inspired-scene-featuring-a-nerdy-character-in-a-futuristic-neon-lit-room-overlooking-a-sprawling-cyberpunk-cityscape-through-a-large-wind.webp",
};

const trustStats = [
  { label: "Inventory", value: "200+" },
  { label: "Collector Requests", value: "1.2k" },
  { label: "Support Window", value: "7 Days" },
  { label: "Avg. Response", value: "< 12h" },
];

export default async function Home() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const featured = products.slice(0, 4);
  const hotNow = products.slice(2, 8);

  return (
    <div className="space-y-12 pb-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(56,93,255,0.32),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(236,109,255,0.18),transparent_32%),#0f1422] p-7 lg:grid lg:min-h-[540px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:p-10">
        <span className="pointer-events-none absolute -right-16 -top-14 h-56 w-56 rounded-full bg-[#ec6dff]/20 blur-3xl" />
        <span className="pointer-events-none absolute left-[30%] top-[72%] h-40 w-40 rounded-full bg-[#20c8ff]/15 blur-3xl" />
        <div className="space-y-5">
          <p className="font-heading text-xs uppercase tracking-[0.28em] text-[#95acff]">Codex Elite Vault</p>
          <h1 className="font-heading hero-title text-[#f3f6ff]">
            Premium TCG cards with collector-grade trust and high-energy aesthetics.
          </h1>
          <p className="hero-subtitle max-w-2xl text-[#b6c4ea]">
            {siteConfig.siteName} combines slabbed grails, verified listing notes, and concierge-style card services for Pokemon, Yu-Gi-Oh, and MTG.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-lg bg-[#385dff] px-5 py-3 font-semibold text-white hover:brightness-110">
              Shop Cards
            </Link>
            <Link href="/collectables" className="rounded-lg border border-[#1fd7ff]/35 bg-[#1fd7ff]/10 px-5 py-3 font-semibold text-[#d7f6ff] hover:bg-[#1fd7ff]/20">
              Browse Collectables
            </Link>
          </div>
        </div>
        <div className="relative mt-6 grid min-h-[410px] grid-cols-2 gap-3 lg:mt-0 lg:min-h-[460px]">
          <div className="relative col-span-1 row-span-2 overflow-hidden rounded-2xl border border-white/15 bg-[#0f1422]">
            <Image src={heroPinkImages.main} alt="Codex pink edit collector lineup" fill sizes="(max-width: 1024px) 52vw, 34vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0f1422]">
            <Image src={heroPinkImages.top} alt="Codex pink edit slab desk visual" fill sizes="(max-width: 1024px) 48vw, 22vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0f1422]">
            <Image src={heroPinkImages.bottom} alt="Codex pink edit cyberpunk scene" fill sizes="(max-width: 1024px) 48vw, 22vw" className="object-cover" />
          </div>
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

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#11192f,#0f1426)] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-heading section-title uppercase text-[#ebf0ff]">Start With Collectables</h2>
          <p className="mt-2 max-w-3xl text-[#b8c7e8]">
            Enter by game category first, then drill into grade and price filters for fast collector decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/collectables" className="rounded-lg bg-[#ec6dff]/20 px-4 py-2 font-semibold text-[#ffd8ff] ring-1 ring-[#ec6dff]/35 hover:bg-[#ec6dff]/28">
            Open Collectables
          </Link>
          <Link href="/shop" className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-[#dce6ff] hover:bg-white/5">
            Browse Shop
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trustStats.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-[linear-gradient(145deg,#111a2f,#10243e)] p-5">
            <p className="text-sm text-[#9fafd8]">{item.label}</p>
            <p className="mt-1 font-heading text-3xl text-[#e8eeff]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">New Drops</h2>
          <Link href="/shop" className="text-sm font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Category Cards</h2>
          <Link href="/collectables" className="text-sm font-semibold text-[#95acff] hover:text-[#b3c3ff]">
            Explore all collectables
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

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_80%_5%,rgba(183,65,255,0.16),transparent_38%),#101524] p-7 lg:grid-cols-2">
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
