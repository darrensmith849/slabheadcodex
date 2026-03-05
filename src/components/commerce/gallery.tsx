import Image from "next/image";

type GalleryProps = {
  images: Array<{ src: string; alt: string }>;
};

export function Gallery({ images }: GalleryProps) {
  const [hero, ...thumbs] = images;

  if (!hero) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#101524] p-8 text-sm text-muted-foreground">
        No gallery images available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-[#101524]">
        <Image src={hero.src} alt={hero.alt} fill className="object-cover" />
      </div>
      {thumbs.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {thumbs.slice(0, 4).map((image) => (
            <div key={image.src} className="relative aspect-square overflow-hidden rounded-md border border-white/10">
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
