"use client";

import type { ToolCategory } from "@/lib/tools/tools";

type Props = {
  categories: ToolCategory[];
  active: ToolCategory;
  labels: Record<string, string>;
  onChange: (category: ToolCategory) => void;
};

export default function ToolFilters({
  categories,
  active,
  labels,
  onChange,
}: Props) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const selected = active === category;

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              selected
                ? "border-emerald-300 bg-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.25)]"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-emerald-300/40 hover:bg-white/[0.08]"
            }`}
          >
            {labels[category] || category}
          </button>
        );
      })}
    </div>
  );
}