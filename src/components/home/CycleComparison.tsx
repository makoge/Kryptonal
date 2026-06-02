"use client";

import { useEffect, useMemo, useState } from "react";

const cycleRefs: Record<string, { marketCap: number }> = {
  "2017": { marketCap: 830_000_000_000 },
  "2021": { marketCap: 2_900_000_000_000 },
  "2024": { marketCap: 2_700_000_000_000 },
};

function formatDiff(current: number, oldValue: number) {
  if (!current || !oldValue) return "—";
  const diff = ((current - oldValue) / oldValue) * 100;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}%`;
}

function compactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function createProjection(currentPrice: number, targetPct: number, days: number) {
  const target = currentPrice * (1 + targetPct / 100);
  const today = new Date();

  return Array.from({ length: 9 }).map((_, index) => {
    const progress = index / 8;
    const date = new Date(today);
    date.setDate(today.getDate() + Math.round(days * progress));

    return {
      date: date.toISOString().slice(0, 10),
      price: currentPrice + (target - currentPrice) * progress,
      projected: true,
    };
  });
}

function PathChart({ history, projection, ui }: any) {
  const data = [...history.slice(-180), ...projection];

  if (!data.length) return null;

  const width = 1100;
  const height = 320;
  const padding = 34;

  const prices = data.map((p: any) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const point = (p: any, i: number) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y =
      padding +
      ((max - p.price) / Math.max(max - min, 1)) * (height - padding * 2);

    return `${x},${y}`;
  };

  const historyPoints = data
    .filter((p: any) => !p.projected)
    .map(point)
    .join(" ");

  const projectionStart = data.findIndex((p: any) => p.projected);
  const projectionPoints = data
    .slice(Math.max(projectionStart - 1, 0))
    .map(point)
    .join(" ");

  return (
    <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <div className="mb-4 flex flex-wrap gap-3 text-xs font-bold text-slate-400">
        <span>{ui.historicalPrice}</span>
        <span className="text-emerald-300">{ui.futureScenario}</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-[320px] min-w-[900px]">
        <polyline
          fill="none"
          stroke="#94a3b8"
          strokeWidth="3"
          points={historyPoints}
        />
        <polyline
          fill="none"
          stroke="#34d399"
          strokeWidth="4"
          strokeDasharray="10 8"
          points={projectionPoints}
        />
      </svg>
    </div>
  );
}

export default function CycleComparison({ data }: any) {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState<any>(null);
  const [targetPct, setTargetPct] = useState(50);
  const [projectionDays, setProjectionDays] = useState(180);

  const ui = data.ui || {};
  const phases = ui.phases || {};
  const risks = ui.risks || {};
  const insights = ui.insights || {};

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/home/cycle-comparison", {
        cache: "no-store",
      });
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

  const projection = useMemo(() => {
    if (!live?.btcPrice) return [];
    return createProjection(live.btcPrice, targetPct, projectionDays);
  }, [live, targetPct, projectionDays]);

  const projectedPrice = live?.btcPrice
    ? live.btcPrice * (1 + targetPct / 100)
    : 0;

  const metrics = useMemo(() => {
    return current.metrics.map((metric: any, index: number) => {
      if (!live || live.error) return metric;

      if (isCurrent) {
        if (index === 0) {
          return {
            ...metric,
            value: live.totalMarketCapFormatted,
            change: live.marketChangeFormatted,
          };
        }

        if (index === 1) {
          return {
            ...metric,
            value: live.btcPriceFormatted,
            change: live.btcChange7dFormatted,
          };
        }

        if (index === 2) {
          return {
            ...metric,
            value: phases[live.phaseKey] || live.phaseKey,
          };
        }

        if (index === 3) {
          return {
            ...metric,
            value: risks[live.riskKey] || live.riskKey,
          };
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
  }, [current, isCurrent, live, ref, phases, risks]);

  const scoreColor =
    live?.cycleScore >= 75
      ? "text-amber-300"
      : live?.cycleScore >= 50
      ? "text-emerald-300"
      : "text-slate-300";

  return (
    <section id="cycle-comparison" className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-300">
                {ui.badge}
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
                {data.title}
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-slate-300">
                {data.text}
              </p>
            </div>

            {live && !live.error && (
              <div className="rounded-3xl border border-emerald-300/20 bg-slate-950/60 p-5">
                <p className="text-sm font-bold text-slate-400">
                  {ui.currentCycleScore}
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <p className={`text-5xl font-black ${scoreColor}`}>
                    {live.cycleScore}
                  </p>
                  <p className="pb-2 text-sm font-bold text-slate-400">/ 100</p>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${live.cycleScore}%` }}
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {ui.daysSinceHalving}:{" "}
                  <span className="font-black text-white">
                    {live.daysSinceHalving}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {data.items.map((item: any, index: number) => (
              <button
                key={item.year}
                onClick={() => setActive(index)}
                className={`shrink-0 rounded-2xl px-5 py-3 font-black transition ${
                  active === index
                    ? "bg-emerald-400 text-slate-950"
                    : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric: any) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur sm:p-6"
              >
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-3 text-2xl font-black text-white">
                  {metric.value}
                </p>

                {isCurrent && metric.change && (
                  <p className="mt-2 text-sm font-bold text-emerald-300">
                    {metric.change}
                  </p>
                )}
              </div>
            ))}
          </div>

          {isCurrent && live && !live.error && (
            <>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {ui.pathTitle}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                      {ui.pathText}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-400/10 px-5 py-4">
                    <p className="text-xs font-bold text-slate-400">
                      {ui.projectedPrice}
                    </p>
                    <p className="text-2xl font-black text-emerald-300">
                      {compactUsd(projectedPrice)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label>
                    <div className="mb-2 flex justify-between text-sm font-bold">
                      <span>{ui.targetGrowth}</span>
                      <span className="text-emerald-300">+{targetPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={targetPct}
                      onChange={(e) => setTargetPct(Number(e.target.value))}
                      className="w-full"
                    />
                  </label>

                  <label>
                    <div className="mb-2 flex justify-between text-sm font-bold">
                      <span>{ui.futureWindow}</span>
                      <span className="text-emerald-300">
                        {projectionDays} {ui.days}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="30"
                      value={projectionDays}
                      onChange={(e) => setProjectionDays(Number(e.target.value))}
                      className="w-full"
                    />
                  </label>
                </div>

                <PathChart
                  history={live.btcTimeline || []}
                  projection={projection}
                  ui={ui}
                />

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {ui.simulatorDisclaimer}
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-400">{ui.btcDominance}</p>
                  <p className="mt-2 text-2xl font-black">
                    {live.btcDominanceFormatted}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-400">{ui.stablecoinFlow}</p>
                  <p className="mt-2 text-2xl font-black">
                    {live.stableFlow7dFormatted}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-sm text-slate-400">{ui.volatility}</p>
                  <p className="mt-2 text-2xl font-black">
                    {live.btcVolatilityFormatted}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-emerald-50">
            {isCurrent && live?.insightKey
              ? insights[live.insightKey] || current.insight
              : current.insight}
          </div>
        </div>
      </div>
    </section>
  );
}