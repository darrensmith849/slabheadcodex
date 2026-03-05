export default function WeBuyCardsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <p className="font-heading text-xs uppercase tracking-[0.24em] text-[#97adff]">Slabhead Service</p>
        <h1 className="mt-2 font-heading text-4xl uppercase tracking-[0.08em] text-[#f2f5ff]">We Buy Cards</h1>
        <p className="mt-4 max-w-3xl text-lg text-[#b9c7e8]">
          Selling singles, slabs, or full collections? Slabhead provides a straightforward valuation and purchase flow built for South African collectors.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">Sell Enquiry Flow</h2>
        <ol className="mt-4 grid gap-3">
          {[
            "Submit the cards you want to sell with clear photos and grades where available.",
            "We review market demand and return a transparent offer range.",
            "If accepted, we confirm handover and payout details.",
          ].map((step, index) => (
            <li key={step} className="rounded-lg border border-white/10 bg-[#111a2d] p-4 text-[#ced8f2]">
              <span className="mr-2 font-semibold text-[#95acff]">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">Start a Sell Enquiry</h2>
        <form action="/api/contact" method="post" className="mt-5 space-y-4">
          <input type="hidden" name="subject" value="We Buy Cards enquiry" />
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
            Message
            <textarea
              name="message"
              required
              minLength={20}
              rows={6}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 py-2"
              placeholder="Include card list, condition notes, and whether items are graded."
            />
          </label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <button type="submit" className="rounded-md bg-[#385dff] px-5 py-2.5 font-semibold text-white hover:brightness-110">
            Send Sell Enquiry
          </button>
        </form>
      </section>
    </div>
  );
}
