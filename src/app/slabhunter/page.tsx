import { ServiceFlow } from "@/components/services/service-flow";

export default function SlabhunterPage() {
  return (
    <ServiceFlow
      eyebrow="Codex Service"
      title="SlabHunter"
      intro="Tell Codex exactly what card, set, grade, and budget you want. We source through collector channels and present clear options with pricing context."
      steps={[
        "Submit your target card profile and budget range.",
        "Codex validates sourcing options and condition evidence.",
        "You approve a sourced option before checkout.",
      ]}
    />
  );
}
