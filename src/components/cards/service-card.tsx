import Link from "next/link";

type ServiceCardProps = {
  title: string;
  href: string;
  summary: string;
  cta: string;
};

export function ServiceCard({ title, href, summary, cta }: ServiceCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[linear-gradient(155deg,#10172b_0%,#0d1323_60%,#0c1a35_100%)] p-6 shadow-[0_16px_30px_rgba(0,0,0,0.28)]">
      <h3 className="font-heading text-2xl uppercase tracking-[0.1em] text-[#eff3ff]">{title}</h3>
      <p className="mt-3 text-[#b7c4e8]">{summary}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-md border border-[#385dff]/60 bg-[#385dff]/15 px-4 py-2 text-sm font-semibold text-[#dbe4ff] transition hover:bg-[#385dff]/30"
      >
        {cta}
      </Link>
    </article>
  );
}
