type GradeBadgeProps = {
  company?: string;
  score?: string | number;
};

export function GradeBadge({ company, score }: GradeBadgeProps) {
  if (!company && !score) {
    return null;
  }

  return (
    <span className="inline-flex items-center rounded-full border border-[#385dff]/40 bg-[#0f1a3f] px-2.5 py-1 text-xs font-bold tracking-wide text-[#c9d6ff]">
      {[company, score].filter(Boolean).join(" ")}
    </span>
  );
}
