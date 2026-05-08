"use client";

import { useEffect, useState } from "react";

type Data = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
};

type Props = {
  t: any;
};

function format(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  return `$${value.toLocaleString()}`;
}

export default function MarketOverview({ t }: Props) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/crypto/market-cap");
      const json = await res.json();
      setData(json);
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: t.marketCap.totalMarketCap,
      value: data ? format(data.totalMarketCap) : "...",
      change: data
        ? `${data.marketCapChange24h.toFixed(2)}%`
        : "...",
    },
    {
      label: t.marketCap.btcDominance,
      value: data ? `${data.btcDominance.toFixed(2)}%` : "...",
      change: "",
    },
    {
      label: t.marketCap.ethDominance,
      value: data ? `${data.ethDominance.toFixed(2)}%` : "...",
      change: "",
    },
    {
      label: t.marketCap.marketPhase,
      value: data
        ? data.totalMarketCap > 2_500_000_000_000
          ? "Expansion"
          : "Accumulation"
        : "...",
      change: "",
    },
  ];

  return (
    <section
      id="overview"
      className="border-y border-white/10 bg-slate-900/40 px-4 py-10 sm:px-5"
    >
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
          >
            <p className="text-sm text-slate-400">{metric.label}</p>

            <p className="mt-3 text-2xl font-black sm:text-3xl">
              {metric.value}
            </p>

            {metric.change && (
              <p
                className={`mt-2 text-sm font-semibold ${
                  metric.change.includes("-")
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {metric.change}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}