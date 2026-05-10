"use client";

import { useEffect, useState } from "react";

type Alert = {
  chain: string;
  tvl: number;
  stablecoins: number;
  change7d: number;
  protocols: number;
  score: number;
  level: string;
  title: string;
  summary: string;
};

type Data = {
  alerts: Alert[];
};

type Props = {
  t: any;
};

const fallback = {
  badge: "Smart Money Alerts",
  title: "Smart Money Alert Board",
  description:
    "Track chains where liquidity, TVL, and weekly growth suggest stronger capital activity.",
  score: "Signal Score",
  tvl: "TVL",
  stablecoins: "Stablecoins",
  weeklyChange: "7D Change",
  protocols: "Protocols",
  soWhat: "So what?",
  disclaimer:
    "Smart-money alerts are educational signals only. They do not guarantee price movement and are not financial advice.",
  loading: "Loading alerts...",
};

function copy(v: any, key: keyof typeof fallback) {
  return v?.analysis?.smartMoney?.[key] || fallback[key];
}

function formatMoney(value: number) {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  return `$${(value / 1_000_000).toFixed(2)}M`;
}

function getLevelClass(level: string) {
  if (level === "Strong") return "bg-emerald-400 text-slate-950";
  if (level === "Watch") return "bg-cyan-400/10 text-cyan-300";
  if (level === "Neutral") return "bg-slate-700 text-slate-200";
  return "bg-red-400/10 text-red-300";
}

function getScoreBar(score: number) {
  if (score >= 75) return "bg-emerald-400";
  if (score >= 55) return "bg-cyan-400";
  if (score >= 35) return "bg-amber-400";
  return "bg-red-400";
}

export default function SmartMoneyAlerts({ t }: Props) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analysis/smart-money", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();
        setData(json);
      } catch {
        // keep safe
      }
    }

    load();
    const interval = window.setInterval(load, 300_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20">
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
            {copy(t, "badge")}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {copy(t, "title")}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            {copy(t, "description")}
          </p>
        </div>

        {!data ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950 p-5 text-sm text-slate-400">
            {copy(t, "loading")}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {data.alerts.map((alert) => (
              <div
                key={alert.chain}
                className="rounded-2xl border border-white/10 bg-slate-950 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black">{alert.chain}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {alert.title}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-black ${getLevelClass(
                      alert.level
                    )}`}
                  >
                    {alert.level}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">{copy(t, "tvl")}</p>
                    <p className="mt-2 text-lg font-black">
                      {formatMoney(alert.tvl)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">
                      {copy(t, "stablecoins")}
                    </p>
                    <p className="mt-2 text-lg font-black">
                      {formatMoney(alert.stablecoins)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">
                      {copy(t, "weeklyChange")}
                    </p>
                    <p
                      className={`mt-2 text-lg font-black ${
                        alert.change7d >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {alert.change7d.toFixed(2)}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">
                      {copy(t, "protocols")}
                    </p>
                    <p className="mt-2 text-lg font-black">
                      {alert.protocols}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{copy(t, "score")}</span>
                    <span className="font-black text-white">
                      {alert.score}/100
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${getScoreBar(alert.score)}`}
                      style={{ width: `${alert.score}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {copy(t, "soWhat")}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {alert.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
          {copy(t, "disclaimer")}
        </div>
      </div>
    </section>
  );
}