import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Codex for collector support, service enquiries, and policy questions.",
  alternates: { canonical: "/contact-us" },
};

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error === "1";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Contact Codex</h1>
        <p className="mt-3 text-lg text-[#b9c7e8]">
          Reach our team for card sourcing, trade support, collection valuations, or policy clarification.
        </p>
      </section>

      {sent ? <p className="rounded-md border border-green-500/40 bg-green-900/20 p-3 text-green-200">Your enquiry was sent successfully.</p> : null}
      {error ? <p className="rounded-md border border-red-500/40 bg-red-900/20 p-3 text-red-200">Please complete all required fields with valid details.</p> : null}

      <form action="/api/contact" method="post" className="space-y-4 rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[#d8e0f8]">
            Name
            <input name="name" required minLength={2} className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2" />
          </label>
          <label className="text-sm text-[#d8e0f8]">
            Email
            <input name="email" type="email" required className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2" />
          </label>
        </div>
        <label className="text-sm text-[#d8e0f8]">
          Subject
          <input name="subject" required minLength={4} className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2" />
        </label>
        <label className="text-sm text-[#d8e0f8]">
          Message
          <textarea
            name="message"
            required
            minLength={20}
            rows={7}
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
            placeholder="Include card names, grades, and timeline where relevant."
          />
        </label>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <button type="submit" className="rounded-md bg-[#385dff] px-5 py-2.5 font-semibold text-white hover:brightness-110">
          Send enquiry
        </button>
      </form>
    </div>
  );
}
