"use client";

import { useEffect, useState } from "react";

type Market = {
  symbol: string;
  fundingRate: number;
  fundingRatePct: number;
  markPrice: number;
  openInterestUsd: number;
  nextFundingTime: number;
};

type Data = {
  updatedAt: string;
  riskScore: number;
  riskLevel: "low" | "normal" | "heated" | "dangerous";
  positionBias: "longCrowded" | "shortCrowded" | "balanced";
  avgFundingRatePct: number;
  totalOpenInterestUsd: number;
  markets: Market[];
};

function formatUsd(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}

function formatPct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(4)}%`;
}

function getRiskColor(level: string) {
  if (level === "dangerous") return "text-red-300 bg-red-400/10 border-red-400/20";
  if (level === "heated") return "text-amber-300 bg-amber-400/10 border-amber-400/20";
  if (level === "normal") return "text-yellow-300 bg-yellow-400/10 border-yellow-400/20";
  return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
}

function getBarColor(score: number) {
  if (score >= 75) return "bg-red-400";
  if (score >= 55) return "bg-amber-400";
  if (score >= 35) return "bg-yellow-400";
  return "bg-emerald-400";
}

export default function LeverageRiskTracker({ t }: any) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analysis/leverage-risk", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();
        setData(json);
      } catch {}
    }

    load();
    const interval = window.setInterval(load, 60000);
    return () => window.clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20">
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              {t.leverageRisk.badge}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t.leverageRisk.title}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {t.leverageRisk.description}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${getRiskColor(
              data.riskLevel
            )}`}
          >
            {t.leverageRisk.levels[data.riskLevel]}
          </span>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 lg:col-span-1">
            <p className="text-sm font-bold text-slate-400">
              {t.leverageRisk.riskScore}
            </p>

            <p className="mt-4 text-5xl font-black text-white">
              {data.riskScore}
              <span className="text-2xl text-slate-500">/100</span>
            </p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-3 rounded-full ${getBarColor(data.riskScore)}`}
                style={{ width: `${data.riskScore}%` }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {t.leverageRisk.bias[data.positionBias]}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                {t.leverageRisk.avgFunding}
              </p>
              <p
                className={`mt-3 text-3xl font-black ${
                  data.avgFundingRatePct >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {formatPct(data.avgFundingRatePct)}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {t.leverageRisk.avgFundingHint}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                {t.leverageRisk.openInterest}
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {formatUsd(data.totalOpenInterestUsd)}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {t.leverageRisk.openInterestHint}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.markets.map((market) => (
            <div
              key={market.symbol}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-white">
                  {market.symbol.replace("USDT", "")}
                </p>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-black ${
                    market.fundingRatePct >= 0
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-red-400/10 text-red-300"
                  }`}
                >
                  {formatPct(market.fundingRatePct)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {t.leverageRisk.openInterestShort}
                </span>
                <span className="font-bold text-slate-200">
                  {formatUsd(market.openInterestUsd)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
          {t.leverageRisk.disclaimer}
        </div>
      </div>
    </section>
  );
}