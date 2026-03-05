import Image from "next/image";
import { ProductCard } from "@/components/cards";
import type { Product } from "@/lib/commerce/types";

type CategoryHubProps = {
  title: string;
  description: string;
  image: string;
  products: Product[];
};

export function CategoryHub({ title, description, image, products }: CategoryHubProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#11182e_0%,#0d1224_65%,#113259_100%)] p-7 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-[#bbcaeb]">{description}</p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-white/10">
          <Image src={image} alt={title} fill sizes="(max-width: 1024px) 100vw, 35vw" className="object-cover" />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm text-[#9eb2df]">{products.length} listings currently visible.</p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
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
