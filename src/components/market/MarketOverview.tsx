"use client";

import { useEffect, useState } from "react";

type Data = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  totalTvl: number;
  tvlChange7d: number;
  stableChange1d: number;
  marketPhase: string;
  riskLevel: string;
  trendStrength: string;
  summary: string;
  updatedAt: string;
};

type Props = {
  t: any;
};

function formatUsd(value: number) {
  if (!value) return "—";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  return `$${value.toLocaleString()}`;
}

function pct(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function MarketOverview({ t }: Props) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/crypto/market-cap", {
          cache: "no-store",
        });
        const json = await res.json();
        setData(json);
      } catch {
        // keep current state
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const isRed = (data?.marketCapChange24h ?? 0) < 0;

  const metrics = [
    {
      label: t.marketCap.totalMarketCap,
      value: data ? formatUsd(data.totalMarketCap) : "...",
      change: data ? pct(data.marketCapChange24h) : "...",
      negative: isRed,
    },
    {
      label: t.marketCap.btcDominance,
      value: data ? `${data.btcDominance.toFixed(2)}%` : "...",
      change:
        data && data.btcDominance >= 58
          ? "Bitcoin is leading"
          : "Rotation is broader",
      negative: false,
    },
    {
      label: t.marketCap.ethDominance,
      value: data ? `${data.ethDominance.toFixed(2)}%` : "...",
      change:
        data && data.ethDominance >= 11
          ? "ETH risk appetite rising"
          : "ETH still muted",
      negative: false,
    },
    {
      label: t.marketCap.marketPhase,
      value: data?.marketPhase || "...",
      change: data ? `${data.riskLevel} risk` : "...",
      negative: data?.riskLevel === "High" || data?.riskLevel === "Elevated",
    },
  ];

  return (
    <section
      id="overview"
      className="border-y border-white/10 bg-slate-900/40 px-4 py-10 sm:px-5"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                Market Intelligence
              </p>

              <h3 className="mt-3 text-2xl font-black text-white sm:text-4xl">
                {data?.marketPhase || t.marketCap.marketPhase}
              </h3>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {data?.summary || "Loading live market interpretation..."}
              </p>

              {data ? (
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                    TVL 7D: {pct(data.tvlChange7d)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                    Stablecoins 1D: {pct(data.stableChange1d)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                    Trend: {data.trendStrength}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <p className="text-sm text-slate-400">{metric.label}</p>

                  <p className="mt-3 text-2xl font-black text-white">
                    {metric.value}
                  </p>

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      metric.negative ? "text-red-300" : "text-emerald-300"
                    }`}
                  >
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {data?.updatedAt ? (
            <p className="mt-5 text-xs text-slate-500">
              {t.marketCap.updated}:{" "}
              {new Date(data.updatedAt).toLocaleTimeString()}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}