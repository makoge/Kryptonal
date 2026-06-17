"use client";

import { useEffect, useState } from "react";

const toneStyle: Record<string, string> = {
  green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  red: "border-red-400/30 bg-red-400/10 text-red-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

export default function LiveMarketSummary({ h }: { h: any }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/home/market-pulse", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    }

    load();
    const timer = setInterval(load, 300000);
    return () => clearInterval(timer);
  }, []);

  const labels = h.summary.dynamic;

  const phaseDescription =
  labels.phaseDescriptions?.[data?.marketPhase] ||
  labels.phaseDescriptions?.consolidation ||
  "";

  const cards = [
    {
      label: labels.marketPhase,
      value: labels.values?.[data?.marketPhase] || "Loading",
      note: `${labels.marketCap24h}: ${data?.marketCapChange24h || "—"}`,
      tone: data?.tones?.marketPhase || "amber",
    },
    {
      label: labels.riskLevel,
      value: labels.values?.[data?.riskLevel] || "Loading",
      note: `${labels.tvl7d}: ${data?.tvlChange7d || "—"}`,
      tone: data?.tones?.riskLevel || "amber",
    },
    {
      label: labels.trendStrength,
      value: labels.values?.[data?.trendStrength] || "Loading",
      note: `${labels.stablecoins1d}: ${data?.stableChange1d || "—"}`,
      tone: data?.tones?.trendStrength || "amber",
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-300">
              {h.summary.badge}
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              {h.summary.title}
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
              {h.summary.text}
            </p>

            {data?.totalTvl && (
              <p className="mt-5 text-sm text-slate-400">
                {labels.liveContext}:{" "}
                <span className="font-bold text-white">{data.totalTvl}</span>
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`relative overflow-hidden rounded-2xl border p-4 shadow-xl ${
                  toneStyle[card.tone]
                }`}
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-current opacity-80" />
                <div className="absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full bg-current" />

                <p className="text-xs text-slate-400">{card.label}</p>

                <p className="mt-2 text-xl font-black text-current">
                  {card.value}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-400">
  {card.note}
</p>

{card.label === labels.marketPhase && phaseDescription && (
  <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
    <p className="text-xs leading-6 text-emerald-100">
      {phaseDescription}
    </p>
  </div>
)}
                
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-orange-400/20 bg-orange-400/10 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-orange-300">
                {labels.halvingBadge}
              </p>

              <h3 className="mt-2 text-2xl font-black text-white">
                {labels.halvingTitle}
              </h3>

              <p className="mt-2 text-sm text-orange-100">
                {labels.currentBlock}:{" "}
                {data?.halving?.currentBlock?.toLocaleString() ||
                  labels.loading}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-2xl bg-black/25 p-4">
                <p className="text-xs text-slate-400">{labels.blocksLeft}</p>
                <p className="mt-1 text-2xl font-black text-orange-300">
                  {data?.halving?.blocksRemaining?.toLocaleString() || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-black/25 p-4">
                <p className="text-xs text-slate-400">{labels.daysLeft}</p>
                <p className="mt-1 text-2xl font-black text-orange-300">
                  {data?.halving?.daysRemaining?.toLocaleString() || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}