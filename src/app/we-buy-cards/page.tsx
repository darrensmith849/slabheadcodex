import { ServiceFlow } from "@/components/services/service-flow";

export default function WeBuyCardsPage() {
  return (
    <ServiceFlow
      eyebrow="Codex Service"
      title="We Buy Cards"
      intro="Sell singles, slabs, or collections with a clear valuation path and no template fluff."
      steps={[
        "Submit item photos and key card details.",
        "Receive a valuation response and offer range.",
        "Confirm sale terms and finalize secure handover.",
      ]}
    />
  );
}
