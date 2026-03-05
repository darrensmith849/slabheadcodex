type TrustBadgeProps = {
  label: string;
};

export function TrustBadge({ label }: TrustBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-[#d8def4]">
      {label}
    </span>
  );
}
