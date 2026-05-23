"use client";

const categories = ["all", "crypto", "politics", "web3", "gaming", "regulation", "macro"];

export default function BlogFilters({
  active,
  setActive,
  search,
  setSearch,
  t,
}: any) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 md:max-w-sm"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              active === cat
                ? "bg-emerald-400 text-slate-950"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {t.filters?.[cat] || cat}
          </button>
        ))}
      </div>
    </div>
  );
}