import Link from "next/link";

type ServiceFlowProps = {
  eyebrow: string;
  title: string;
  intro: string;
  steps: string[];
  note?: string;
};

export function ServiceFlow({ eyebrow, title, intro, steps, note }: ServiceFlowProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <p className="font-heading text-xs uppercase tracking-[0.24em] text-[#97adff]">{eyebrow}</p>
        <h1 className="mt-2 font-heading text-4xl uppercase tracking-[0.08em] text-[#f2f5ff]">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-[#b9c7e8]">{intro}</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">How It Works</h2>
        <ol className="mt-4 grid gap-3">
          {steps.map((step, index) => (
            <li key={step} className="rounded-lg border border-white/10 bg-[#111a2d] p-4 text-[#ced8f2]">
              <span className="mr-2 font-semibold text-[#95acff]">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
        {note ? <p className="mt-5 rounded-md border border-[#385dff]/35 bg-[#111a36] p-3 text-sm text-[#c5d3fb]">{note}</p> : null}
      </section>

      <section className="rounded-xl border border-white/10 bg-[#101524] p-6">
        <h2 className="font-heading text-xl uppercase tracking-[0.1em]">Start an Enquiry</h2>
        <p className="mt-2 text-[#bac6e7]">Use our secure enquiry form to start this service.</p>
        <Link href="/contact-us" className="mt-4 inline-flex rounded-md bg-[#385dff] px-4 py-2 font-semibold text-white hover:brightness-110">
          Contact Slabhead
        </Link>
      </section>
    </div>
  );
}
