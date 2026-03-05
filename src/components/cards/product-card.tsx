import Image from "next/image";
import Link from "next/link";
import { GradeBadge } from "@/components/ui/grade-badge";
import { PriceTag } from "@/components/ui/price-tag";

type ProductCardProps = {
  slug: string;
  name: string;
  image: string;
  price: number;
  company?: string;
  score?: string | number;
  game: string;
};

export function ProductCard({ slug, name, image, price, company, score, game }: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#11172b] transition duration-300 hover:-translate-y-1 hover:border-[#385dff]/70 hover:shadow-[0_24px_60px_rgba(5,10,26,0.7)]">
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.16)_40%,transparent_60%)] bg-[length:200%_100%] animate-[shimmer_2.2s_linear_infinite]" />
      </span>
      <Link href={`/product/${slug}`} className="relative block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image src={image} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-3 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8ea2d6]">{game}</p>
          <h3 className="line-clamp-2 text-lg font-bold text-[#eef2ff]">{name}</h3>
          <div className="flex items-center justify-between gap-3">
            <GradeBadge company={company} score={score} />
            <PriceTag value={price} />
          </div>
        </div>
      </Link>
    </article>
  );
}
