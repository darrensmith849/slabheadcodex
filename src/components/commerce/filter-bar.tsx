import { Search } from "lucide-react";

type FilterBarProps = {
  query?: string;
  onQueryChange?: (value: string) => void;
  categoryOptions?: string[];
};

export function FilterBar({ query = "", onQueryChange, categoryOptions = [] }: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-[#101524] p-4 md:grid-cols-[1fr_auto]">
      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b0f1b] px-3 py-2">
        <Search size={16} className="text-[#96a5cc]" />
        <input
          value={query}
          onChange={(event) => onQueryChange?.(event.target.value)}
          placeholder="Search card name, set, grade..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6f7ea4]"
        />
      </label>
      <select className="rounded-lg border border-white/15 bg-[#0b0f1b] px-3 py-2 text-sm text-white outline-none">
        <option value="">All categories</option>
        {categoryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
