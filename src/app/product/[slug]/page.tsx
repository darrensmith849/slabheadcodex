import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/cards";
import { Gallery } from "@/components/commerce/gallery";
import { siteConfig } from "@/config/site";
import { getProductBySlug, listProducts } from "@/lib/commerce/provider";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ${siteConfig.siteName}`,
      description: product.description,
      images: product.images.map((image) => ({ url: image.src, alt: image.alt })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), listProducts()]);

  if (!product) {
    notFound();
  }

  const related = allProducts.filter((item) => item.slug !== product.slug && item.game === product.game).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images.map((item) => `${siteConfig.siteUrl}${item.src}`),
    offers: {
      "@type": "Offer",
      priceCurrency: product.offer.currency,
      price: product.offer.price,
      availability:
        product.offer.availability === "in_stock"
          ? "https://schema.org/InStock"
          : product.offer.availability === "preorder"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/OutOfStock",
      url: `${siteConfig.siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr]">
        <Gallery images={product.images} />
        <div className="space-y-5">
          <p className="font-heading text-xs uppercase tracking-[0.26em] text-[#8ea2d6]">{product.game}</p>
          <h1 className="font-heading text-4xl text-[#f2f5ff]">{product.name}</h1>
          <p className="text-lg text-[#bac6e6]">{product.description}</p>
          <div className="rounded-xl border border-white/10 bg-[#101524] p-5">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: product.offer.currency,
                maximumFractionDigits: 0,
              }).format(product.offer.price)}
            </p>
            <p className="mt-3 text-sm text-[#9eb0d8]">Availability: {product.offer.availability.replaceAll("_", " ")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#101524] p-5 text-sm text-[#b9c7e8]">
            <h2 className="mb-2 font-semibold text-[#e8edff]">Spec Sheet</h2>
            <p>Category: {product.category}</p>
            <p>Grade Company: {product.gradeCompany ?? "Unspecified"}</p>
            <p>Grade Score: {product.gradeScore ?? "Unspecified"}</p>
          </div>
          <Link href="/shop" className="inline-flex rounded-md border border-white/20 px-4 py-2 font-semibold hover:bg-white/5">
            Back to Shop
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl uppercase tracking-[0.14em]">Related Items</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <ProductCard
              key={item.id}
              slug={item.slug}
              name={item.name}
              image={item.images[0]?.src ?? "/assets/legacy/placeholders/5c96d5785be55911.svg"}
              price={item.offer.price}
              company={item.gradeCompany}
              score={item.gradeScore}
              game={item.game}
            />
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
