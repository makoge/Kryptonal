"use client";

import { useEffect, useState } from "react";

type MarketData = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
};

function formatUsd(value: number) {
  if (!value) return "$0";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  return `$${value.toLocaleString()}`;
}

function getPhase(data: MarketData) {
  const cap = data.totalMarketCap;
  const change = data.marketCapChange24h;
  const btc = data.btcDominance;

  if (change < -3) {
    return {
      phase: "Contraction",
      risk: "High Risk",
      hint: "Best to wait",
      tone: "text-red-400 bg-red-400/10",
      points: [
        "Market momentum is weakening.",
        "Many users reduce exposure or wait for stronger confirmation.",
        "Risk management matters more than chasing entries.",
        `BTC dominance is ${btc.toFixed(2)}%, showing where capital is concentrated.`,
      ],
    };
  }

  if (cap < 1_500_000_000_000) {
    return {
      phase: "Accumulation",
      risk: "Lower Risk",
      hint: "Best time to research",
      tone: "text-cyan-300 bg-cyan-400/10",
      points: [
        "Market activity is quieter and sentiment is usually cautious.",
        "Long-term users often research, dollar-cost average, or build watchlists.",
        "This phase can offer opportunity, but confirmation is still important.",
        `Current market cap is ${formatUsd(cap)}.`,
      ],
    };
  }

  if (cap < 2_400_000_000_000) {
    return {
      phase: "Early Expansion",
      risk: "Moderate Risk",
      hint: "Best time to hold carefully",
      tone: "text-emerald-300 bg-emerald-400/10",
      points: [
        "Liquidity is returning and market structure is improving.",
        "Bitcoin often leads before broader altcoin strength appears.",
        "Users usually watch trend confirmation and manage position size.",
        `24h market cap change is ${change.toFixed(2)}%.`,
      ],
    };
  }

  if (cap < 3_000_000_000_000) {
    return {
      phase: "Expansion",
      risk: "Moderate Risk",
      hint: "Best time to ride trend",
      tone: "text-emerald-300 bg-emerald-400/10",
      points: [
        "Market cap is growing and momentum is improving.",
        "Users often hold winners, rotate carefully, and avoid over-leverage.",
        "Risk is rising because more people are entering the market.",
        `BTC dominance is ${btc.toFixed(2)}%, so Bitcoin still influences market direction.`,
      ],
    };
  }

  return {
    phase: "Late Cycle",
    risk: "High Risk",
    hint: "Best time to take caution",
    tone: "text-amber-300 bg-amber-400/10",
    points: [
      "The market may be close to overheated conditions.",
      "Users often reduce risk, take partial profits, or avoid emotional buying.",
      "Upside can continue, but downside risk becomes larger.",
      `Current market cap is ${formatUsd(cap)}.`,
    ],
  };
}

export default function LiveMarketPhaseCard({ t }: any) {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/market-cap", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();

        setData({
          totalMarketCap: json.totalMarketCap,
          marketCapChange24h: json.marketCapChange24h,
          btcDominance: json.btcDominance,
        });
      } catch {
        // silent fail
      }
    }

    load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const card = data ? getPhase(data) : null;

  const fallbackPoints = Array.isArray(t.analysis.heroCard.points)
  ? t.analysis.heroCard.points
  : [];

const points = card?.points || fallbackPoints;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur sm:p-5">
      <div className="rounded-2xl bg-slate-900 p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              {t.analysis.heroCard.label}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {card ? card.phase : t.common.loading}
            </h2>
          </div>

          {card && (
            <span className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${card.tone}`}>
              {card.risk}
            </span>
          )}
        </div>

        {card && (
          <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Market Hint
            </p>
            <p className="mt-2 text-lg font-black text-white">{card.hint}</p>
            <p className="mt-2 text-xs leading-6 text-slate-400">
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