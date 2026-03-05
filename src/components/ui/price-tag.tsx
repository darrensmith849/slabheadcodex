type PriceTagProps = {
  value: number;
  currency?: string;
};

export function PriceTag({ value, currency = "ZAR" }: PriceTagProps) {
  const formatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return (
    <span className="inline-flex items-center rounded-md bg-[#385dff] px-3 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(56,93,255,0.35)]">
      {formatter.format(value)}
    </span>
  );
}
