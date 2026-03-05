import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  href: string;
  image: string;
  description: string;
};

export function CategoryCard({ title, href, image, description }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#11172b] transition duration-300 hover:border-[#385dff]/70"
    >
      <div className="relative aspect-[16/10]">
        <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-heading text-xl uppercase tracking-[0.12em] text-[#f4f7ff]">{title}</h3>
        <p className="text-sm text-[#b8c3e0]">{description}</p>
      </div>
    </Link>
  );
}
