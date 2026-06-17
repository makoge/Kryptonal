"use client";

import { useEffect, useMemo, useState } from "react";

type RiskLevel = "lower" | "medium" | "high";

type Pool = {
  id: string;
  protocol: string;
  chain: string;
  token: string;
  apy: number;
  apyBase: number;
  apyReward: number;
  tvlUsd: number;
  stablecoin: boolean;
  riskLevel: RiskLevel;
  safetyScore: number;
  yieldType: string;
  bestFor: string;
  warnings: string[];
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
  return `${Number(value || 0).toFixed(2)}%`;
}

export default function HighYieldFinder({ t }: { t: any }) {
  const copy = t.tools.highYieldFinder;

  const [pools, setPools] = useState<Pool[]>([]);
  const [chains, setChains] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [stableOnly, setStableOnly] = useState(true);
  const [chain, setChain] = useState("all");
  const [sort, setSort] = useState("safety");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const url = useMemo(() => {
    const params = new URLSearchParams();

    params.set("stableOnly", String(stableOnly));
    params.set("chain", chain);
    params.set("sort", sort);

    if (search.trim()) params.set("search", search.trim());

    return `/api/tools/high-yield-finder?${params.toString()}`;
  }, [search, stableOnly, chain, sort]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (!cancelled) {
          setPools(data.pools || []);
          setChains(data.chains || []);
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

          <p className="mt-5 leading-8 text-slate-300">{copy.description}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard label={copy.metrics?.poolsFound || "Pools Found"} value={String(pools.length)} />
          <StatCard
            label={copy.metrics?.avgSafety || "Average Safety"}
            value={
              pools.length
                ? `${Math.round(
                    pools.reduce((sum, p) => sum + p.safetyScore, 0) / pools.length
                  )}/100`
                : "—"
            }
          />
          <StatCard
            label={copy.metrics?.stableMode || "Stable Mode"}
            value={stableOnly ? copy.on : copy.off}
          />
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
            />

            <select
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
            >
              <option value="all">{copy.allChains || "All chains"}</option>
              {chains.map((item) => (
                <option key={item} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
            >
              <option value="safety">{copy.sort?.safety || "Best safety"}</option>
              <option value="apy">{copy.sort?.apy || "Highest APY"}</option>
              <option value="tvl">{copy.sort?.tvl || "Highest TVL"}</option>
              <option value="risk">{copy.sort?.risk || "Lower risk"}</option>
            </select>

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

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
            {copy.riskNote ||
              "High APY can come from token incentives, low liquidity, or unstable rewards. Always compare APY with TVL, safety score, and risk level."}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-white/10 p-8 text-center text-slate-400">
                {copy.loading}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-white/10 p-8 text-center text-amber-300">
                {error}
              </div>
            ) : pools.length === 0 ? (
              <div className="rounded-2xl border border-white/10 p-8 text-center text-slate-400">
                {copy.empty}
              </div>
            ) : (
              <>
                <div className="grid gap-4 lg:hidden">
                  {pools.map((pool) => (
                    <PoolCard key={pool.id} pool={pool} copy={copy} />
                  ))}
                </div>

                <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
                  <table className="w-full min-w-[1040px] text-left text-sm">
                    <thead className="bg-slate-900 text-xs uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-4 py-4">{copy.table.protocol}</th>
                        <th className="px-4 py-4">{copy.table.chain}</th>
                        <th className="px-4 py-4">{copy.table.token}</th>
                        <th className="px-4 py-4">{copy.table.tvl}</th>
                        <th className="px-4 py-4">{copy.table.apy}</th>
                        <th className="px-4 py-4">{copy.table.safety || "Safety"}</th>
                        <th className="px-4 py-4">{copy.table.risk || "Risk"}</th>
                        <th className="px-4 py-4 text-right">{copy.table.bestFor || "Best for"}</th>
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

                          <td className="px-4 py-4 text-slate-300">{pool.chain}</td>

                          <td className="px-4 py-4">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-200">
                              {pool.token}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-300">
                            {formatUsd(pool.tvlUsd)}
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-lg font-black text-emerald-300">
                              {formatApy(pool.apy)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {copy.base || "Base"} {formatApy(pool.apyBase)} ·{" "}
                              {copy.rewards || "Rewards"} {formatApy(pool.apyReward)}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <SafetyScore score={pool.safetyScore} />
                          </td>

                          <td className="px-4 py-4">
                            <RiskBadge risk={pool.riskLevel} copy={copy} />
                          </td>

                          <td className="px-4 py-4 text-right text-slate-300">
                            {copy.bestFor?.[pool.bestFor] || pool.bestFor}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SafetyScore({ score }: { score: number }) {
  return (
    <div>
      <p className="font-black text-white">{score}/100</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ risk, copy }: { risk: RiskLevel; copy: any }) {
  const cls =
    risk === "high"
      ? "border-red-400/20 bg-red-400/10 text-red-300"
      : risk === "medium"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${cls}`}>
      {copy.riskLevels?.[risk] || risk}
    </span>
  );
}

function PoolCard({ pool, copy }: { pool: Pool; copy: any }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-white">{pool.protocol}</h3>
          <p className="mt-1 text-sm text-slate-400">{pool.chain}</p>
        </div>

        <RiskBadge risk={pool.riskLevel} copy={copy} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-200">
          {pool.token}
        </span>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
          {copy.bestFor?.[pool.bestFor] || pool.bestFor}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniMetric label={copy.table.apy} value={formatApy(pool.apy)} strong />
        <MiniMetric label={copy.table.tvl} value={formatUsd(pool.tvlUsd)} />
        <MiniMetric label={copy.base || "Base"} value={formatApy(pool.apyBase)} />
        <MiniMetric label={copy.rewards || "Rewards"} value={formatApy(pool.apyReward)} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-bold text-slate-400">
          {copy.table.safety || "Safety"}
        </p>
        <SafetyScore score={pool.safetyScore} />
      </div>

      {pool.warnings?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {pool.warnings.slice(0, 3).map((warning) => (
            <span
              key={warning}
              className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200"
            >
              {copy.warnings?.[warning] || warning}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function MiniMetric({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`mt-1 font-black ${
          strong ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}