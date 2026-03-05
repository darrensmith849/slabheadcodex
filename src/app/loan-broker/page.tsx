import { ServiceFlow } from "@/components/services/service-flow";

export default function LoanBrokerPage() {
  return (
    <ServiceFlow
      eyebrow="Codex Information"
      title="Loan Broker"
      intro="Codex provides educational guidance around card-backed financing pathways and partner introductions."
      steps={[
        "Discuss portfolio profile and financing objective.",
        "Review indicative structures and required documentation.",
        "Receive referral options to accredited third-party providers.",
      ]}
      note="Disclaimer: Codex is not a bank or licensed lender. This page is informational and enquiry-only; all lending decisions are made by third-party providers under their own compliance frameworks."
    />
  );
}
