import Image from "next/image";
import Link from "next/link";
import { CategoryCard, ProductCard, ServiceCard } from "@/components/cards";
import { CtaBlock, TrustBadge } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { listCategories, listProducts } from "@/lib/commerce/provider";

const vaultImages = [
  "/assets/legacy/brand/43b6c8f5-f1f2-426f-b414-3d6a1e7249f3-2-300x400.jpg",
  "/assets/legacy/brand/53f19380-3969-48dd-b7e5-950ab2344a27-300x400.jpg",
  "/assets/legacy/brand/f82c5a72-d79f-46b1-a800-9a9b294dcc2b-300x400.jpg",
  "/assets/legacy/brand/f9904291-4ff7-431b-94dc-00c4a3e7bfa5-300x400.jpg",
];

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
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_16%_10%,rgba(56,93,255,0.34),transparent_36%),radial-gradient(circle_at_87%_18%,rgba(14,219,196,0.18),transparent_30%),#0f1422] p-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-10">
        <div className="space-y-5">
          <p className="font-heading text-xs uppercase tracking-[0.28em] text-[#95acff]">Codex Elite Vault</p>
          <h1 className="font-heading text-4xl leading-tight text-[#f3f6ff] sm:text-5xl">
            Premium TCG cards with collector-grade trust and high-energy aesthetics.
          </h1>
          <p className="max-w-2xl text-lg text-[#b6c4ea]">
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
        <div className="relative mt-8 grid min-h-[380px] gap-3 sm:grid-cols-2 lg:mt-0">
          {vaultImages.map((src) => (
            <div key={src} className="relative overflow-hidden rounded-xl border border-white/15">
              <Image src={src} alt="Codex featured slab" fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover" />
            </div>
          ))}
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

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <div className="relative min-h-[180px] overflow-hidden rounded-xl border border-white/10">
          <Image src="/assets/legacy/brand/dall-c2-b7e-2025-02-25-13-00-07-a-cyberpunk-inspired-scene-featuring-a-nerdy-character-in-a-futuristic-neon-lit-room-overlooking-a-sprawling-cyberpunk-cityscape-through-a-large-wind.webp" alt="Codex neon workspace" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
        </div>
        <div className="relative min-h-[180px] overflow-hidden rounded-xl border border-white/10">
          <Image src="/assets/legacy/brand/screenshot-2025-01-16-at-14-34-44.jpg" alt="Codex featured card desk" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
        </div>
        <div className="relative min-h-[180px] overflow-hidden rounded-xl border border-white/10">
          <Image src="/assets/legacy/brand/screenshot-2025-01-16-at-14-34-54.jpg" alt="Codex collector lineup" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
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
