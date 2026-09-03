"use client";

import { useEffect, useMemo, useState } from "react";

type Coin = {
  name: string;
  symbol: string;
  image: string;
  change30d: number;
};

type AltseasonData = {
  index: number;
  phase: "altseason" | "bitcoinSeason" | "rotation";
  summary: string;
  btcChange30d: number;
  totalAltcoinsChecked: number;
  outperformCount: number;
  btcDominance: number;
  ethDominance: number;
  leaders: Coin[];
  laggards: Coin[];
  updatedAt: string;
};

function pct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function label(t: any, key: string, fallback: string) {
  return t?.marketCap?.altseason?.[key] || fallback;
}

export default function AltseasonIndex({ t }: { t: any }) {
  const [data, setData] = useState<AltseasonData | null>(null);
  const [activeTab, setActiveTab] = useState<"leaders" | "laggards">("leaders");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/altseason", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      }
    }

    load();
    const timer = setInterval(load, 300000);
    return () => clearInterval(timer);
  }, []);

  const index = data?.index ?? 0;
  const btc30d = data?.btcChange30d ?? 0;

  const phaseConfig = useMemo(() => {
    if (index >= 75) {
      return {
        label: label(t, "altseason", "Altseason"),
        textColor: "text-emerald-400",
        bgGlow: "rgba(52,211,153,0.15)",
        badgeBorder: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        barColor: "from-cyan-400 to-emerald-400",
      };
    }
    if (index <= 25) {
      return {
        label: label(t, "bitcoinSeason", "Bitcoin Season"),
        textColor: "text-orange-400",
        bgGlow: "rgba(251,146,60,0.15)",
        badgeBorder: "border-orange-400/30 bg-orange-400/10 text-orange-300",
        barColor: "from-orange-500 to-amber-400",
      };
    }
    return {
      label: label(t, "rotation", "Rotation Phase"),
      textColor: "text-cyan-300",
      bgGlow: "rgba(34,211,238,0.15)",
      badgeBorder: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
      barColor: "from-orange-400 via-cyan-400 to-emerald-400",
    };
  }, [index, t]);

  const outperformanceRatio = data
    ? Math.round(
        (data.outperformCount / Math.max(data.totalAltcoinsChecked, 1)) * 100,
      )
    : 0;

  return (
    <section
      id="altcoin-index"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20"
    >
      <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.05] via-slate-950/80 to-slate-950 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              {label(t, "badge", "Altseason Radar")}
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {label(t, "title", "Altcoin vs. Bitcoin Cycle Index")}
            </h2>
          </div>

          {data && (
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider ${phaseConfig.badgeBorder}`}
              >
                ● {phaseConfig.label}
              </span>
            </div>
          )}
        </div>

        {/* Core Layout Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* Left Column: Score Meter & Macro Matrix */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-inner">
              <div
                className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl pointer-events-none"
                style={{ background: phaseConfig.bgGlow }}
              />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {label(t, "score", "Cycle Intensity Score")}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-6xl font-black tracking-tight text-white sm:text-7xl">
                      {index}
                    </span>
                    <span className="text-xl font-bold text-slate-500">
                      /100
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {label(t, "status", "Current Regime")}
                  </p>
                  <p
                    className={`mt-2 text-2xl font-black ${phaseConfig.textColor}`}
                  >
                    {phaseConfig.label}
                  </p>
                </div>
              </div>

              {/* Advanced Multi-Threshold Meter */}
              <div className="mt-7">
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-900 border border-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${phaseConfig.barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.max(index, 4)}%` }}
                  />
                </div>

                {/* Threshold Markers */}
                <div className="relative mt-2 flex justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex flex-col items-start">
                    <span className="text-orange-400/90">0 – 25</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      BTC Season
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-cyan-300/90">26 – 74</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      Rotation
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-emerald-400/90">75 – 100</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      Altseason
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-slate-300">
                {data?.summary ||
                  label(
                    t,
                    "loadingText",
                    "Synthesizing 30-day cross-market performance...",
                  )}
              </p>
            </div>

            {/* 4-Metric Diagnostic Matrix */}
            {data && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {label(t, "outperforming", "Beating BTC")}
                  </p>
                  <p className="mt-2 font-mono text-xl font-black text-white">
                    {data.outperformCount}{" "}
                    <span className="text-xs text-slate-500">
                      / {data.totalAltcoinsChecked}
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-bold text-cyan-300">
                    {outperformanceRatio}% of Market
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {label(t, "btc30d", "BTC 30D Base")}
                  </p>
                  <p
                    className={`mt-2 font-mono text-xl font-black ${
                      btc30d >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {pct(btc30d)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">Benchmark</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t.marketCap.btcDominance || "BTC Dominance"}
                  </p>
                  <p className="mt-2 font-mono text-xl font-black text-white">
                    {data.btcDominance.toFixed(2)}%
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">Total Share</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t.marketCap.ethDominance || "ETH Dominance"}
                  </p>
                  <p className="mt-2 font-mono text-xl font-black text-white">
                    {data.ethDominance.toFixed(2)}%
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Smart Contracts
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Relative Alpha Radar */}
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {label(t, "relativeStrength", "Relative Alpha Radar")}
                </h3>
                <p className="text-xs text-slate-400">
                  Performance spread measured against Bitcoin ({pct(btc30d)})
                </p>
              </div>

              {/* Segmented View Switcher */}
              <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                <button
                  onClick={() => setActiveTab("leaders")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    activeTab === "leaders"
                      ? "bg-emerald-400 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Leading (+α)
                </button>
                <button
                  onClick={() => setActiveTab("laggards")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    activeTab === "laggards"
                      ? "bg-rose-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Lagging (-α)
                </button>
              </div>
            </div>

            {/* Coin Performance List with Relative Alpha Bars */}
            <div className="mt-4 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {activeTab === "leaders" ? (
                <AlphaList
                  coins={data?.leaders || []}
                  btc30d={btc30d}
                  isLeader
                  emptyText="No major altcoins currently outperforming BTC."
                />
              ) : (
                <AlphaList
                  coins={data?.laggards || []}
                  btc30d={btc30d}
                  isLeader={false}
                  emptyText="No major laggards detected."
                />
              )}
            </div>

            {data?.updatedAt && (
              <p className="pt-3 text-right text-[11px] text-slate-500 border-t border-white/5">
                {t.marketCap.updated || "Last Calculated"}:{" "}
                {new Date(data.updatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AlphaList({
  coins,
  btc30d,
  isLeader,
  emptyText,
}: {
  coins: Coin[];
  btc30d: number;
  isLeader: boolean;
  emptyText: string;
}) {
  if (coins.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">{emptyText}</p>
    );
  }

  return (
    <>
      {coins.map((coin) => {
        const alpha = coin.change30d - btc30d;
        const absAlpha = Math.min(Math.abs(alpha), 100);

        return (
          <div
            key={coin.symbol}
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition-all hover:border-white/15 hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-7 w-7 rounded-full border border-white/10"
                  onError={(e) => {
                    // Fallback to placeholder on broken image
                    (e.target as HTMLImageElement).src =
                      "https://assets.coingecko.com/coins/images/1/small/bitcoin.png";
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{coin.name}</p>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                      {coin.symbol}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    30D Gain:{" "}
                    <span className="font-mono text-slate-200">
                      {pct(coin.change30d)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Alpha vs BTC callout */}
              <div className="text-right">
                <p
                  className={`font-mono text-sm font-black ${
                    alpha >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {pct(alpha)} α
                </p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {alpha >= 0 ? "Spread over BTC" : "Behind BTC"}
                </p>
              </div>
            </div>

            {/* Visual Alpha Intensity Meter */}
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isLeader
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                    : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                }`}
                style={{ width: `${Math.max(absAlpha, 6)}%` }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
