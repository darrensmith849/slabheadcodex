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
    <article className="interactive-card group relative overflow-hidden rounded-2xl border border-white/10 bg-[#11172b] hover:border-[#5a76ff]/70 hover:shadow-[0_24px_60px_rgba(5,10,26,0.68)]">
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="motion-safe:animate-[shimmer_2.4s_linear_infinite] motion-reduce:animate-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.16)_40%,transparent_60%)] bg-[length:200%_100%]" />
      </span>
      <Link href={`/product/${slug}`} className="relative block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
            className="motion-safe:group-hover:scale-[1.035] object-cover transition duration-500"
          />
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
