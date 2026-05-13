"use client";

import { useEffect, useMemo, useState } from "react";

type Pool = {
  id: string;
  protocol: string;
  chain: string;
  token: string;
  apy: number;
  tvlUsd: number;
  stablecoin: boolean;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatApy(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function HighYieldFinder({ t }: { t: any }) {
  const copy = t.tools.highYieldFinder;

  const [pools, setPools] = useState<Pool[]>([]);
  const [search, setSearch] = useState("");
  const [stableOnly, setStableOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set("stableOnly", String(stableOnly));
    if (search.trim()) params.set("search", search.trim());
    return `/api/tools/high-yield-finder?${params.toString()}`;
  }, [search, stableOnly]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(url);
        const data = await res.json();

        if (!cancelled) {
          setPools(data.pools || []);
        }
      } catch {
        if (!cancelled) setError(copy.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(load, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [url, copy.error]);

  return (
    <main className="bg-slate-950 px-4 py-20 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            {copy.badge}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-5 leading-8 text-slate-300">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50 md:max-w-md"
            />

            <button
              onClick={() => setStableOnly((v) => !v)}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                stableOnly
                  ? "bg-emerald-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {copy.stableOnly}: {stableOnly ? copy.on : copy.off}
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                {copy.loading}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-amber-300">{error}</div>
            ) : pools.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {copy.empty}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-900 text-xs uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-4 py-4">{copy.table.protocol}</th>
                      <th className="px-4 py-4">{copy.table.chain}</th>
                      <th className="px-4 py-4">{copy.table.token}</th>
                      <th className="px-4 py-4">{copy.table.tvl}</th>
                      <th className="px-4 py-4 text-right">{copy.table.apy}</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {pools.map((pool) => (
                      <tr
                        key={pool.id}
                        className="bg-slate-950/60 transition hover:bg-white/[0.04]"
                      >
                        <td className="px-4 py-4 font-bold text-white">
                          {pool.protocol}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {pool.chain}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-200">
                            {pool.token}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {formatUsd(pool.tvlUsd)}
                        </td>
                        <td className="px-4 py-4 text-right text-lg font-black text-emerald-300">
                          {formatApy(pool.apy)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm leading-7 text-amber-200">
            {copy.disclaimer}
          </p>
        </div>
      </section>
    </main>
  );
}