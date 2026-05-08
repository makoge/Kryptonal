"use client";

import { useEffect, useState } from "react";

type Chain = {
  name: string;
  tvl: number;
  change1d: number;
  change7d: number;
  change1m: number;
  protocols: number;
  score: number;
  signal: string;
};

type Data = {
  chains: Chain[];
};

function formatTvl(value: number) {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  return `$${(value / 1_000_000).toFixed(2)}M`;
}

function getNarrative(chain: Chain) {
  if (chain.score >= 75) {
    return "This ecosystem has strong liquidity and positive momentum. It may be attracting serious DeFi activity.";
  }

  if (chain.score >= 55) {
    return "This chain looks healthy, with meaningful TVL and decent ecosystem strength.";
  }

  if (chain.score >= 35) {
    return "This ecosystem has moderate activity. It may need stronger TVL growth before becoming a clear leader.";
  }

  return "This chain currently looks weaker compared with stronger ecosystems. Watch for TVL growth before assuming strength.";
}

function getBarColor(score: number) {
  if (score >= 75) return "bg-emerald-400";
  if (score >= 55) return "bg-lime-400";
  if (score >= 35) return "bg-amber-400";
  return "bg-red-400";
}

export default function ChainStrengthTracker({ t }: any) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analysis/chains", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();
        setData(json);
      } catch {
        // keep UI safe
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
            {t.analysis.chainStrength.badge}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {t.analysis.chainStrength.title}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            {t.analysis.chainStrength.description}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {data?.chains?.map((chain) => (
            <div
              key={chain.name}
              className="rounded-2xl border border-white/10 bg-slate-950 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black">{chain.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {chain.protocols} {t.analysis.chainStrength.protocols}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {chain.signal}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">TVL</p>
                  <p className="mt-2 text-xl font-black">
                    {formatTvl(chain.tvl)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">7D</p>
                  <p
                    className={`mt-2 text-xl font-black ${
                      chain.change7d >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {chain.change7d.toFixed(2)}%
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">1M</p>
                  <p
                    className={`mt-2 text-xl font-black ${
                      chain.change1m >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {chain.change1m.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    {t.analysis.chainStrength.score}
                  </span>
                  <span className="font-black text-white">{chain.score}/100</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-2 rounded-full ${getBarColor(chain.score)}`}
                    style={{ width: `${chain.score}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {t.analysis.chainStrength.soWhat}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {getNarrative(chain)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
          {t.analysis.chainStrength.disclaimer}
        </div>
      </div>
    </section>
  );
}