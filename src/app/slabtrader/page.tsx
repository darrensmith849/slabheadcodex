import { ServiceFlow } from "@/components/services/service-flow";

export default function SlabtraderPage() {
  return (
    <ServiceFlow
      eyebrow="Codex Service"
      title="SlabTrader"
      intro="Exchange cards with a structured trade flow that prioritizes grading standards, market context, and transparent value deltas."
      steps={[
        "Share your current slabs and trade objectives.",
        "Codex assesses grade reports, demand, and fair-trade range.",
        "Approve and execute a documented trade path.",
      ]}
    />
  );
}
