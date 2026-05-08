"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/getDictionary";



type ChartPoint = {
  time: number;
  value: number;
};

type MarketData = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  chart: ChartPoint[];
  updatedAt: string;
};

type Props = {
  t: Dictionary;
};

function formatUsd(value: number) {
  if (!value) return "$0";

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  return `$${value.toLocaleString()}`;
}

function buildPath(points: ChartPoint[] = []) {
  if (points.length < 2) return "";

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return points
    .map((point, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 90 - ((point.value - min) / range) * 80;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function MarketCapChart({ t }: Props) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const res = await fetch("/api/crypto/market-cap", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const json = await res.json();
      setData(json);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const path = data?.chart?.length ? buildPath(data.chart) : "";
  const isPositive = (data?.marketCapChange24h ?? 0) >= 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur sm:p-6">
      <p className="text-sm text-slate-400">{t.marketCap.liveLabel}</p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-3xl font-black sm:text-4xl">
          {loading ? t.common.loading : formatUsd(data?.totalMarketCap ?? 0)}
        </h2>

        {data && (
          <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              isPositive
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-red-400/10 text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {data.marketCapChange24h.toFixed(2)}% {t.marketCap.change24h}
          </span>
        )}
      </div>

      <div className="mt-6 h-48 sm:h-64 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d={path}
            fill="none"
            stroke="rgb(52 211 153)"
            strokeWidth="2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-700"
          />
        </svg>
      </div>

      {data && (
        <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-slate-300 sm:grid-cols-3">
          <div>
            {t.marketCap.btcDominance}: {data.btcDominance.toFixed(2)}%
          </div>
          <div>
            {t.marketCap.ethDominance}: {data.ethDominance.toFixed(2)}%
          </div>
          <div>
            {t.marketCap.updated}:{" "}
            {new Date(data.updatedAt).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}