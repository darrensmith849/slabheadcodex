export default function SlabtraderPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-[#101524] p-8">
        <p className="font-heading text-xs uppercase tracking-[0.24em] text-[#97adff]">Slabhead Service</p>
        <h1 className="mt-2 font-heading text-4xl uppercase tracking-[0.08em] text-[#f2f5ff]">SlabTrader</h1>
        <p className="mt-4 max-w-3xl text-lg text-[#b9c7e8]">
          Upgrade your collection through structured trades. Slabhead reviews condition, grading, and current demand so every trade conversation starts
          from a fair value baseline.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">Trade Enquiry Flow</h2>
        <ol className="mt-4 grid gap-3">
          {[
            "Share the cards you want to trade and what you are targeting.",
            "We assess grade reports, market context, and practical swap options.",
            "You approve final terms before any handover is arranged.",
          ].map((step, index) => (
            <li key={step} className="rounded-lg border border-white/10 bg-[#111a2d] p-4 text-[#ced8f2]">
              <span className="mr-2 font-semibold text-[#95acff]">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0f1422] p-7">
        <h2 className="font-heading text-2xl uppercase tracking-[0.1em]">Start a Trade Enquiry</h2>
        <form action="/api/contact" method="post" className="mt-5 space-y-4">
          <input type="hidden" name="subject" value="SlabTrader enquiry" />
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
              placeholder="List the cards you are trading, desired cards, and your timeline."
            />
          </label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <button type="submit" className="rounded-md bg-[#385dff] px-5 py-2.5 font-semibold text-white hover:brightness-110">
            Send Trade Enquiry
          </button>
        </form>
      </section>
    </div>
  );
}
