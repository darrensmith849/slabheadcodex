import Link from "next/link";

type CtaBlockProps = {
  title: string;
  copy: string;
  href: string;
  cta: string;
};

export function CtaBlock({ title, copy, href, cta }: CtaBlockProps) {
  return (
    <section className="rounded-2xl border border-[#385dff]/30 bg-[radial-gradient(circle_at_top_right,#385dff26,transparent_55%),#0f1424] p-8">
      <h2 className="font-heading text-3xl uppercase tracking-[0.08em] text-[#f2f5ff]">{title}</h2>
      <p className="mt-3 max-w-3xl text-[#b7c5e6]">{copy}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-md bg-[#385dff] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        {cta}
      </Link>
    </section>
  );
}
