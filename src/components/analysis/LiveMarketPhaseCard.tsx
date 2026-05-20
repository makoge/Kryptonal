"use client";

import { useEffect, useState } from "react";

type MarketData = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  totalTvl: number;
  tvlChange1d: number;
  tvlChange7d: number;
  stableChange1d: number;
  marketPhase: string;
  riskLevel: string;
  trendStrength: string;
  marketHint: string;
  summary: string;
  updatedAt: string;
};

function formatUsd(value: number) {
  if (!value) return "$0";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  return `$${value.toLocaleString()}`;
}

function formatPct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function riskTone(risk: string) {
  if (risk === "High") return "text-red-300 bg-red-400/10";
  if (risk === "Elevated") return "text-amber-300 bg-amber-400/10";
  if (risk === "Medium") return "text-yellow-300 bg-yellow-400/10";
  return "text-emerald-300 bg-emerald-400/10";
}

export default function LiveMarketPhaseCard({ t }: any) {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/market-cap", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        setData(json);
      } catch {}
    }

    load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const points = data
    ? [
        `Total market cap: ${formatUsd(data.totalMarketCap)} (${formatPct(data.marketCapChange24h)} 24h).`,
        `Bitcoin dominance: ${data.btcDominance.toFixed(2)}%.`,
        `DeFi TVL: ${formatUsd(data.totalTvl)} (${formatPct(data.tvlChange7d)} 7d).`,
        `Stablecoin supply change: ${formatPct(data.stableChange1d)} 24h.`,
      ]
    : Array.isArray(t.analysis.heroCard.points)
      ? t.analysis.heroCard.points
      : [];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur sm:p-5">
      <div className="rounded-2xl bg-slate-900 p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">{t.analysis.heroCard.label}</p>
            <h2 className="mt-2 text-3xl font-black">
              {data ? data.marketPhase : t.common.loading}
            </h2>
          </div>

          {data && (
            <span className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${riskTone(data.riskLevel)}`}>
              {data.riskLevel} Risk
            </span>
          )}
        </div>

        {data && (
          <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Market Hint
            </p>
            <p className="mt-2 text-lg font-black text-white">{data.marketHint}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{data.summary}</p>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Educational signal only. Not financial advice.
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {points.map((point: string) => (
            <div
              key={point}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"
            >
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}