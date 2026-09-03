"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {
  t: any;
  isLoggedIn?: boolean; // <-- Pass this from your parent component or auth provider
};

type Coin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  sentiment: number;
  trendKey?: "strongMomentum" | "improving" | "neutral" | "cooling" | "weak";
  sparkline: number[];
};

type StickyData = {
  updatedAt: string;
  fearGreed: {
    value: number;
    label: string;
  };
  gas: {
    ethUsd?: number;
    btcUsd?: number;
    solUsd?: number;
  };
  coins: Coin[];
  bestNetworkNow?: "bitcoin" | "ethereum" | "solana" | "bnb" | "none";
};

// Distinct colors for up to 4 comparison lines
const CHART_COLORS = [
  "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.65)]",
  "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]",
  "text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.65)]",
  "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]",
];

function formatPrice(value: number) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 100 ? 0 : 2,
  }).format(value);
}

function formatGasUsd(value?: number) {
  if (value === undefined || !Number.isFinite(value)) return "—";
  if (value < 0.01) return "< $0.01";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function fallbackLabel(t: any, key: string, fallback: string) {
  return t?.marketCap?.[key] || fallback;
}

function buildSparkline(points: number[]) {
  if (!points || points.length < 2) return "";
  const sliced = points.slice(-40);
  const min = Math.min(...sliced);
  const max = Math.max(...sliced);
  const range = max - min || 1;

  return sliced
    .map((value, index) => {
      const x = (index / (sliced.length - 1)) * 126;
      const y = 36 - ((value - min) / range) * 32;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function normalize(points: number[]) {
  if (!points || points.length < 2 || !points[0]) return [];
  const sliced = points.slice(-40);
  const first = sliced[0];
  return sliced.map((value) => (value / first) * 100);
}

function buildComparePath(points: number[]) {
  if (!points || points.length < 2) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 88 - ((value - min) / range) * 76;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function performance(points: number[]) {
  if (!points || points.length < 2 || !points[0]) return 0;
  const first = points[0];
  const last = points[points.length - 1];
  return ((last - first) / first) * 100;
}

export default function MarketStickyTools({ t }: Props) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [data, setData] = useState<StickyData | null>(null);

  // Default to comparing BTC and ETH
  const [compareSymbols, setCompareSymbols] = useState<string[]>([
    "BTC",
    "ETH",
  ]);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const networkKey = data?.bestNetworkNow || "none";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/sticky-tools", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        setData(json);
      } catch {
        // keep old state
      }
    }
    load();
    const timer = setInterval(load, 120000);
    return () => clearInterval(timer);
  }, []);

  const selectedCoins = data?.coins || [];
  const fearValue = data?.fearGreed?.value ?? 50;
  const fearLabel =
    data?.fearGreed?.label || fallbackLabel(t, "neutral", "Neutral");

  // Handle multi-select logic
  function toggleCoin(symbol: string) {
    setShowAuthWarning(false);

    setCompareSymbols((prev) => {
      // If already selected, remove it (but keep at least 1)
      if (prev.includes(symbol)) {
        if (prev.length > 1) return prev.filter((s) => s !== symbol);
        return prev;
      }

      // If not selected, check limits
      const maxAllowed = isLoggedIn ? 4 : 2;

      if (prev.length < maxAllowed) {
        return [...prev, symbol];
      } else {
        if (!isLoggedIn) setShowAuthWarning(true);
        return prev;
      }
    });
  }

  const comparisonData = useMemo(() => {
    if (!selectedCoins.length || !compareSymbols.length) return null;

    const activeCoins = compareSymbols
      .map((sym) => selectedCoins.find((c) => c.symbol === sym))
      .filter(Boolean) as Coin[];

    if (activeCoins.length === 0) return null;

    const mappedData = activeCoins.map((coin, idx) => {
      const normalized = normalize(coin.sparkline);
      const perf = performance(coin.sparkline.slice(-40));
      return {
        ...coin,
        colorClass: CHART_COLORS[idx % CHART_COLORS.length],
        path: buildComparePath(normalized),
        perf,
      };
    });

    // Find the absolute best performer among selected
    const leader = [...mappedData].sort((a, b) => b.perf - a.perf)[0];

    return {
      lines: mappedData,
      leader,
    };
  }, [compareSymbols, selectedCoins]);

  return (
    <section className="px-4 py-10 sm:px-5">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* GAS TRACKER (Now in USD) */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="flex gap-4 overflow-x-auto px-4 py-3 text-sm font-bold text-slate-300 sm:justify-center">
            <span className="shrink-0 text-emerald-300">
              {t.marketCap.gasTracker || "Network Fees:"}
            </span>
            <span className="shrink-0">
              ETH:{" "}
              <span className="text-white">
                {formatGasUsd(data?.gas?.ethUsd)}
              </span>
            </span>
            <span className="shrink-0">
              SOL:{" "}
              <span className="text-white">
                {formatGasUsd(data?.gas?.solUsd)}
              </span>
            </span>
            <span className="shrink-0">
              BTC:{" "}
              <span className="text-white">
                {formatGasUsd(data?.gas?.btcUsd)}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-3 text-center text-sm font-bold text-emerald-300">
          {t.marketCap.bestNetworkNow || "Optimal Network"}:{" "}
          <span className="text-white uppercase">
            {t.marketCap.networkLabels?.[networkKey] || networkKey}
          </span>
        </div>

        {/* 2-COLUMN LAYOUT: FEAR/GREED & COIN CARDS (LEFT) | DYNAMIC COMPARISON (RIGHT) */}
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* Fear & Greed */}
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-5 backdrop-blur-xl sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                {t.marketCap.fearGreedLabel || "Market Sentiment"}
              </p>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-5xl font-black text-white">
                    {fearValue}
                  </p>
                  <p className="mt-2 font-bold text-emerald-300">{fearLabel}</p>
                </div>

                <div
                  className="grid h-24 w-24 place-items-center rounded-full border-[10px] border-emerald-300/70 border-l-white/10 border-t-white/10 transition-transform duration-1000 ease-out"
                  style={{
                    rotate: `${Math.max(0, Math.min(100, fearValue)) * 1.8}deg`,
                  }}
                >
                  <span className="-rotate-90 font-mono text-xs font-black text-white">
                    {fearValue}/100
                  </span>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                {t.marketCap.fearGreedText ||
                  "Tracking volatility, momentum, and volume."}
              </p>
            </div>

            {/* Individual Coin Mini-Cards */}
            <div className="grid gap-3">
              {selectedCoins.slice(0, 4).map((coin) => {
                const isPositive = coin.change24h >= 0;
                return (
                  <div
                    key={coin.symbol}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div>
                      <p className="font-black text-white">{coin.name}</p>
                      <p className="text-xs font-bold text-slate-500">
                        {coin.symbol} · {formatPrice(coin.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-mono text-lg font-black ${isPositive ? "text-emerald-300" : "text-red-300"}`}
                      >
                        {isPositive ? "+" : ""}
                        {coin.change24h.toFixed(2)}%
                      </p>
                      <p className="text-xs font-bold text-slate-400">
                        24h Change
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: MULTI-COIN COMPARISON RADAR */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  {t.marketCap.sentimentLabel || "Relative Strength Radar"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {t.marketCap.sentimentTitle || "Compare Asset Momentum"}
                </h2>
              </div>
            </div>

            {/* Multi-Select Toggles */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold text-slate-500">
                Select up to {isLoggedIn ? 4 : 2} assets to compare:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCoins.map((coin) => {
                  const isActive = compareSymbols.includes(coin.symbol);
                  return (
                    <button
                      key={coin.symbol}
                      onClick={() => toggleCoin(coin.symbol)}
                      className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                        isActive
                          ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                          : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {coin.symbol}
                    </button>
                  );
                })}
              </div>

              {/* Paywall / Auth Prompt */}
              {showAuthWarning && !isLoggedIn && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                  <span>🔒</span>
                  <p>
                    Sign in to compare up to 4 assets simultaneously.{" "}
                    <Link
                      href="/api/auth/signin"
                      className="font-bold text-white underline underline-offset-2 hover:text-emerald-300 transition"
                    >
                      {t?.signInBtn || "Sign In"}
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Chart Rendering */}
            {comparisonData && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Top Performer (7D)
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      Leader:{" "}
                      <span className="text-emerald-300">
                        {comparisonData.leader.symbol}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-right text-sm">
                    {comparisonData.lines.map((line) => (
                      <div key={line.symbol}>
                        <p className="text-slate-500">{line.symbol}</p>
                        <p
                          className={`font-mono font-black ${line.perf >= 0 ? "text-emerald-300" : "text-red-300"}`}
                        >
                          {line.perf >= 0 ? "+" : ""}
                          {line.perf.toFixed(2)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="mt-6 h-48 w-full sm:h-56"
                >
                  {comparisonData.lines.map((line) => (
                    <path
                      key={line.symbol}
                      d={line.path}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`transition-all duration-500 ${line.colorClass}`}
                    />
                  ))}
                </svg>
              </div>
            )}

            {data?.updatedAt && (
              <p className="mt-5 text-right text-xs text-slate-500">
                {t.marketCap.updated || "Last Updated"}:{" "}
                {new Date(data.updatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
