import { ServiceFlow } from "@/components/services/service-flow";

export default function SlabbingPage() {
  return (
    <ServiceFlow
      eyebrow="Slabhead Service"
      title="Slabbing"
      intro="Get practical prep and submission guidance to reduce avoidable grading mistakes and improve consistency."
      steps={[
        "Audit raw cards for condition and grading fit.",
        "Prepare and package submissions to grading requirements.",
        "Track submission progress and post-grade outcomes.",
      ]}
    />
  );
}
