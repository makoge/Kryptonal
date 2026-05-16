"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { t: any };

type Coin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  sparkline: number[];
  sentiment: number;
  mood: "bullish" | "bearish" | "neutral";
};

type StickyData = {
  updatedAt: string;
  fearGreed: { value: number; label: string };
  gas: { ethGwei: number; btcSatVb: number; solMicroLamports: number };
  coins: Coin[];
};

const compareOptions = ["BTC / ETH", "BTC / SOL", "ETH / SOL"];

function formatPrice(value: number) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 100 ? 0 : 2,
  }).format(value);
}

function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(digits);
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

function getCoin(coins: Coin[], symbol: string) {
  return coins.find((coin) => coin.symbol === symbol);
}

export default function MarketStickyTools({ t }: Props) {
  const [data, setData] = useState<StickyData | null>(null);
  const [compare, setCompare] = useState("BTC / ETH");

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

  const comparison = useMemo(() => {
    const [leftSymbol, rightSymbol] = compare.split(" / ");
    const left = getCoin(selectedCoins, leftSymbol);
    const right = getCoin(selectedCoins, rightSymbol);

    if (!left || !right) return null;

    const leftNormalized = normalize(left.sparkline);
    const rightNormalized = normalize(right.sparkline);

    const leftPerf = performance(left.sparkline.slice(-40));
    const rightPerf = performance(right.sparkline.slice(-40));

    const leader = leftPerf >= rightPerf ? left : right;
    const leaderPerf = Math.max(leftPerf, rightPerf);
    const gap = Math.abs(leftPerf - rightPerf);

    return {
      left,
      right,
      leftPath: buildComparePath(leftNormalized),
      rightPath: buildComparePath(rightNormalized),
      leftPerf,
      rightPerf,
      leader,
      leaderPerf,
      gap,
    };
  }, [compare, selectedCoins]);

  return (
    <section className="px-4 py-10 sm:px-5">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="flex gap-3 overflow-x-auto px-4 py-3 text-sm font-bold text-slate-300 sm:justify-center">
            <span className="shrink-0 text-emerald-300">
              {t.marketCap.gasTracker}
            </span>
            <span className="shrink-0">
              ETH: {formatNumber(data?.gas?.ethGwei ?? 0, 1)} Gwei
            </span>
            <span className="shrink-0">
              SOL: {formatNumber(data?.gas?.solMicroLamports ?? 0, 0)} μLamports
            </span>
            <span className="shrink-0">
              BTC: {formatNumber(data?.gas?.btcSatVb ?? 0, 0)} sat/vB
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-5 backdrop-blur-xl sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
              {t.marketCap.fearGreedLabel}
            </p>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-5xl font-black text-white">
                  {fearValue}
                </p>
                <p className="mt-2 font-bold text-emerald-300">{fearLabel}</p>
              </div>

              <div
                className="grid h-24 w-24 place-items-center rounded-full border-[10px] border-emerald-300/70 border-l-white/10 border-t-white/10"
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
              {t.marketCap.fearGreedText}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  {t.marketCap.sentimentLabel}
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  {t.marketCap.sentimentTitle}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white">
                {t.marketCap.compareButton}: {compare}
              </div>
            </div>

            {comparison ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Relative Strength
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      Leader:{" "}
                      <span className="text-emerald-300">
                        {comparison.leader.symbol}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-right text-xs sm:text-sm">
                    <div>
                      <p className="text-slate-500">
                        {comparison.left.symbol}
                      </p>
                      <p
                        className={`font-mono font-black ${
                          comparison.leftPerf >= 0
                            ? "text-emerald-300"
                            : "text-red-300"
                        }`}
                      >
                        {comparison.leftPerf >= 0 ? "+" : ""}
                        {comparison.leftPerf.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">
                        {comparison.right.symbol}
                      </p>
                      <p
                        className={`font-mono font-black ${
                          comparison.rightPerf >= 0
                            ? "text-cyan-300"
                            : "text-red-300"
                        }`}
                      >
                        {comparison.rightPerf >= 0 ? "+" : ""}
                        {comparison.rightPerf.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="mt-5 h-40 w-full"
                >
                  <path
                    d={comparison.leftPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.65)]"
                  />
                  <path
                    d={comparison.rightPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]"
                  />
                </svg>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {comparison.leader.symbol} is outperforming by{" "}
                  <span className="font-bold text-white">
                    {comparison.gap.toFixed(2)}%
                  </span>{" "}
                  over the latest 7-day sparkline.
                </p>
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {compareOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setCompare(item)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    compare === item
                      ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                      : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-300/40"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {selectedCoins.map((coin) => {
                const isPositive = coin.change24h >= 0;
                const moodLabel =
                  coin.mood === "bullish"
                    ? t.marketCap.bullish
                    : coin.mood === "bearish"
                      ? fallbackLabel(t, "bearish", "Bearish")
                      : t.marketCap.neutral;

                return (
                  <div
                    key={coin.symbol}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-[1fr_150px_auto]"
                  >
                    <div>
                      <p className="font-black text-white">{coin.name}</p>
                      <p className="text-xs font-bold text-slate-500">
                        {coin.symbol} · {formatPrice(coin.price)}
                      </p>
                    </div>

                    <svg
                      viewBox="0 0 126 40"
                      className="hidden h-10 w-36 sm:block"
                      fill="none"
                    >
                      <path
                        d={buildSparkline(coin.sparkline)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className={
                          isPositive ? "text-emerald-300" : "text-red-300"
                        }
                      />
                    </svg>

                    <div className="text-right">
                      <p
                        className={`font-mono text-lg font-black ${
                          isPositive ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {coin.sentiment}%
                      </p>
                      <p className="text-xs font-bold text-slate-400">
                        {moodLabel} · {isPositive ? "+" : ""}
                        {coin.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {data?.updatedAt ? (
              <p className="mt-4 text-xs text-slate-500">
                {t.marketCap.updated}:{" "}
                {new Date(data.updatedAt).toLocaleTimeString()}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}