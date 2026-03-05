import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryCard, ProductCard } from "@/components/cards";
import { listCategories, listProducts } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Collectables",
  description: "Shop Slabhead collectables across Pokemon, Yu-Gi-Oh, Magic: The Gathering, and accessories.",
  alternates: {
    canonical: "/collectables",
  },
};

export default async function CollectablesPage() {
  const [categories, products] = await Promise.all([listCategories(), listProducts()]);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,93,255,0.32),transparent_40%),#101524] p-7 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Collectables</h1>
          <p className="mt-3 max-w-2xl text-lg text-[#b8c6e8]">
            From slabbed grails to sealed product and everyday collector accessories, we&apos;ve got it all.
          </p>
          <Link href="/shop" className="mt-5 inline-flex rounded-md bg-[#385dff] px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            Open full shop
          </Link>
        </div>
        <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-white/10">
          <Image src="/assets/legacy/brand/scene-02.jpg" alt="Slabhead collectables hero" fill sizes="(max-width: 1024px) 100vw, 35vw" className="object-cover" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Category Hubs</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              title={category.name}
              href={`/${category.slug}`}
              image={category.heroImage}
              description={category.description}
            />
          ))}
          <Link
            href="/shop?category=accessories"
            className="interactive-card group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#11172b] p-5 hover:border-[#5a76ff]/70"
          >
            <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/assets/legacy/categories/pokemon-sealed.jpg"
                alt="Accessories"
                fill
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 24vw"
                className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
              />
            </div>
            <h3 className="font-heading text-xl uppercase tracking-[0.12em] text-[#f4f7ff]">Accessories</h3>
            <p className="mt-2 text-sm text-[#b8c3e0]">Sleeves, binders, storage, and collector essentials.</p>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Featured Collectables</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => (
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
    </div>
  );
}
