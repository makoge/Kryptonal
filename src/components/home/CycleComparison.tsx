"use client";

import { useEffect, useState } from "react";

const cycleRefs: Record<string, { marketCap: number; btcPrice: number }> = {
  "2017": { marketCap: 830_000_000_000, btcPrice: 19_700 },
  "2021": { marketCap: 2_900_000_000_000, btcPrice: 69_000 },
  "2024": { marketCap: 2_700_000_000_000, btcPrice: 73_000 },
};

function formatDiff(current: number, oldValue: number) {
  if (!current || !oldValue) return "—";
  const diff = ((current - oldValue) / oldValue) * 100;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}%`;
}

function MiniChart({ data, positive }: { data?: number[]; positive: boolean }) {
  if (!data?.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * 100;
      const y = ((max - v) / Math.max(max - min, 1)) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 40" className="mt-4 h-12 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={positive ? "#34d399" : "#f87171"}
        strokeWidth="3"
        points={points}
      />
    </svg>
  );
}

export default function CycleComparison({ data }: any) {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/home/cycle-comparison", { cache: "no-store" });
      const json = await res.json();
      setLive(json);
    }

    load();
    const timer = setInterval(load, 300000);
    return () => clearInterval(timer);
  }, []);

  const current = data.items[active];
  const isCurrent = active === data.items.length - 1;
  const ref = cycleRefs[current.year];

  const metrics = current.metrics.map((metric: any, index: number) => {
    if (!live || live.error) return metric;

    if (isCurrent) {
      if (index === 0) {
        return {
          ...metric,
          value: live.totalMarketCapFormatted,
          change: live.marketChangeFormatted,
          chart: live.marketCapChart,
          positive: live.marketChange24h >= 0,
        };
      }

      if (index === 1) {
        return {
          ...metric,
          value: live.btcPriceFormatted,
          change: live.btcDominanceFormatted,
          chart: live.btcChart,
          positive: live.marketChange24h >= 0,
        };
      }

      if (index === 2) {
        return { ...metric, value: live.cycleMood };
      }

      if (index === 3) {
        return { ...metric, value: live.riskView };
      }
    }

    if (!isCurrent && index === current.metrics.length - 1 && ref) {
      return {
        ...metric,
        value: formatDiff(live.totalMarketCap, ref.marketCap),
      };
    }

    return metric;
  });

  return (
    <section id="cycle-comparison" className="px-4 py-20 sm:px-6">
      
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-black md:text-5xl">{data.title}</h2>
        <p className="mt-5 max-w-3xl leading-8 text-slate-300">{data.text}</p>

        <div className="mt-8 flex gap-3 overflow-x-auto">
          {data.items.map((item: any, index: number) => (
            <button
              key={item.year}
              onClick={() => setActive(index)}
              className={`rounded-2xl px-5 py-3 font-black transition ${
                active === index
                  ? "bg-emerald-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {metrics.map((metric: any) => (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/30"
            >
              {isCurrent && (
                <span
                  className={`absolute right-4 top-4 h-2.5 w-2.5 animate-pulse rounded-full ${
                    metric.positive === false ? "bg-red-400" : "bg-emerald-400"
                  }`}
                />
              )}

              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-3 text-2xl font-black text-white">{metric.value}</p>

              {isCurrent && metric.change && (
                <p
                  className={`mt-2 text-sm font-bold ${
                    metric.positive === false ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {metric.change}
                </p>
              )}

              {isCurrent && metric.chart && (
                <MiniChart data={metric.chart} positive={metric.positive !== false} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-emerald-50">
          {isCurrent && live?.insight ? live.insight : current.insight}
        </div>
      </div>
    </section>
  );
}