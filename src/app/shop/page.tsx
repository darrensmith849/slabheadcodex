import type { Metadata } from "next";
import { ProductCard } from "@/components/cards";
import { siteConfig } from "@/config/site";
import { listProducts, searchProducts } from "@/lib/commerce/provider";
import type { SearchFilters } from "@/lib/commerce/types";

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Slabhead graded cards and sealed products with transparent filters.",
  alternates: {
    canonical: "/shop",
  },
};

function readSingle(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const filters: SearchFilters = {
    query: readSingle(params.q),
    category: readSingle(params.category),
    game: readSingle(params.game) as SearchFilters["game"],
    gradeCompany: readSingle(params.gradeCompany),
    gradeScore: readSingle(params.gradeScore),
    minPrice: readSingle(params.minPrice) ? Number(readSingle(params.minPrice)) : undefined,
    maxPrice: readSingle(params.maxPrice) ? Number(readSingle(params.maxPrice)) : undefined,
  };

  const [results, allProducts] = await Promise.all([searchProducts(filters), listProducts()]);

  const categories = [...new Set(allProducts.map((product) => product.category))];
  const gradeCompanies = [...new Set(allProducts.map((product) => product.gradeCompany).filter(Boolean))] as string[];
  const gradeScores = [...new Set(allProducts.map((product) => product.gradeScore).filter(Boolean))] as string[];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[#7d95ff]/35 bg-[linear-gradient(140deg,rgba(16,24,44,0.84),rgba(20,28,52,0.8))] p-6 shadow-[0_0_0_1px_rgba(110,135,255,0.22),0_24px_55px_rgba(4,9,24,0.45)]">
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ec6dff]/20 blur-3xl" />
        <span className="pointer-events-none absolute left-[35%] top-[68%] h-40 w-40 rounded-full bg-[#20c8ff]/17 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.24em] text-[#a6b7ff]">Slabhead Shop Grid</p>
            <h1 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em] text-[#f4f7ff]">Shop</h1>
            <p className="mt-2 max-w-2xl text-[#c0cdef]">
              Browse live inventory with grading, category, and pricing filters tuned for fast collector decisions.
            </p>
          </div>
          <div className="rounded-lg border border-[#90a5ff]/30 bg-white/6 px-3 py-2 text-sm text-[#d2dcf8]">Verified local catalogue</div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101524] p-6">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Filter Inventory</h2>
        <p className="mt-2 text-[#b7c4e7]">
          Filter {siteConfig.siteName} inventory by category, grade, and price to find collector-fit listings quickly.
        </p>
      </section>

      <form className="grid gap-3 rounded-xl border border-white/10 bg-[#101524] p-4 md:grid-cols-3 xl:grid-cols-7" action="/shop" method="get">
        <input
          name="q"
          defaultValue={filters.query}
          placeholder="Search card or set"
          className="rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm"
        />
        <select name="game" defaultValue={filters.game ?? ""} className="rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm">
          <option value="">All games</option>
          <option value="pokemon">Pokemon</option>
          <option value="yugioh">Yu-Gi-Oh</option>
          <option value="mtg">MTG</option>
        </select>
        <select name="category" defaultValue={filters.category ?? ""} className="rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          name="gradeCompany"
          defaultValue={filters.gradeCompany ?? ""}
          className="rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm"
        >
          <option value="">All graders</option>
          {gradeCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
        <select
          name="gradeScore"
          defaultValue={filters.gradeScore ?? ""}
          className="rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm"
        >
          <option value="">All scores</option>
          {gradeScores.map((score) => (
            <option key={score} value={score}>
              {score}
            </option>
          ))}
        </select>
        <input
          name="minPrice"
          defaultValue={filters.minPrice}
          type="number"
          min={0}
          step={50}
          placeholder="Min"
          className="rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="maxPrice"
            defaultValue={filters.maxPrice}
            type="number"
            min={0}
            step={50}
            placeholder="Max"
            className="w-full rounded-md border border-white/10 bg-[#0c1220] px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-md bg-[#385dff] px-4 py-2 text-sm font-semibold text-white">
            Go
          </button>
        </div>
      </form>

      <section className="space-y-4">
        <p className="text-sm text-[#9fb1dc]">{results.length} products found</p>
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {results.map((product) => (
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
