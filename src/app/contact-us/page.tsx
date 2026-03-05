import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Slabhead for card sourcing, trade enquiries, and support.",
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
        <h1 className="font-heading text-4xl uppercase tracking-[0.08em]">Contact Slabhead</h1>
        <p className="mt-3 text-lg text-[#b9c7e8]">Reach us for SlabHunter, SlabTrader, We Buy Cards, order support, or policy queries.</p>
        <div className="mt-5 grid gap-2 text-sm text-[#d4def8] md:grid-cols-2">
          <p>
            Email: <a className="text-[#95acff] hover:text-[#bfd0ff]" href={`mailto:${siteConfig.primaryEmail}`}>{siteConfig.primaryEmail}</a>
          </p>
          <p>{siteConfig.hours.weekday}</p>
          <p>{siteConfig.hours.saturday}</p>
          <p>{siteConfig.hours.sunday}</p>
        </div>
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
            placeholder="Include card names, grades, quantity, and timeline where relevant."
          />
        </label>

        <fieldset className="rounded-lg border border-white/10 bg-[#111a2d] p-4">
          <legend className="px-1 text-sm text-[#d8e0f8]">May we contact you on WhatsApp about this enquiry?</legend>
          <div className="mt-3 flex gap-5 text-sm text-[#d8e0f8]">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="whatsappConsent" value="yes" required />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="whatsappConsent" value="no" required />
              No
            </label>
          </div>
        </fieldset>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <button type="submit" className="rounded-md bg-[#385dff] px-5 py-2.5 font-semibold text-white hover:brightness-110">
          Send enquiry
        </button>
      </form>

      <section className="rounded-xl border border-white/10 bg-[#101524] p-6 text-sm text-[#bac6e7]">
        <h2 className="font-heading text-xl uppercase tracking-[0.08em] text-[#eef3ff]">Refund Policy Reminder</h2>
        <p className="mt-2">
          Refunds are only available when an item is damaged in shipping or the wrong item was sent. Due to collectible market volatility and product
          nature, all other sales are final.
        </p>
      </section>
    </div>
  );
}
