"use client";

import { useEffect, useMemo, useState } from "react";

type Chain = {
  chain: string;
  value: number;
};

type Data = {
  chains: Chain[];
  updatedAt?: string;
};

type Props = {
  t: any;
};

function formatBillions(value: number) {
  return `$${(value / 1_000_000_000).toFixed(2)}B`;
}

function getPercent(value: number, total: number) {
  if (!total) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function getSignal(value: number, t: any) {
  if (value > 40_000_000_000) return t.analysis.stablecoins.veryStrong;
  if (value > 15_000_000_000) return t.analysis.stablecoins.healthy;
  if (value > 5_000_000_000) return t.analysis.stablecoins.moderate;
  return t.analysis.stablecoins.lower;
}

function getNarrative(chain: string, t: any) {
  const narratives: Record<string, string> = {
    Ethereum: t.analysis.stablecoins.narratives.ethereum,
    Tron: t.analysis.stablecoins.narratives.tron,
    Solana: t.analysis.stablecoins.narratives.solana,
    Base: t.analysis.stablecoins.narratives.base,
    Arbitrum: t.analysis.stablecoins.narratives.arbitrum,
    BSC: t.analysis.stablecoins.narratives.bsc,
  };

  return narratives[chain] || t.analysis.stablecoins.narratives.default;
}

function getSimpleMeaning(total: number, t: any) {
  if (total > 250_000_000_000) {
    return t.analysis.stablecoins.meaning.high;
  }

  if (total > 100_000_000_000) {
    return t.analysis.stablecoins.meaning.medium;
  }

  return t.analysis.stablecoins.meaning.low;
}

export default function StablecoinFlows({ t }: Props) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analysis/stablecoins", {
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

  const totalStablecoins = useMemo(() => {
    return data?.chains?.reduce((sum, item) => sum + item.value, 0) || 0;
  }, [data]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20">
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              {t.analysis.stablecoins.badge}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t.analysis.stablecoins.title}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {t.analysis.stablecoins.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
              {t.analysis.stablecoins.totalLabel}
            </p>

            <p className="mt-4 break-words text-4xl font-black text-white sm:text-5xl">
              {data ? formatBillions(totalStablecoins) : t.common.loading}
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {getSimpleMeaning(totalStablecoins, t)}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {t.analysis.stablecoins.newbieTitle}
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {t.analysis.stablecoins.newbieText}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-5">
              <p className="text-sm font-bold text-slate-400">
                {t.analysis.stablecoins.increaseTitle}
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {t.analysis.stablecoins.increaseText}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950 p-5">
              <p className="text-sm font-bold text-slate-400">
                {t.analysis.stablecoins.decreaseTitle}
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {t.analysis.stablecoins.decreaseText}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data?.chains?.map((item) => (
            <div
              key={item.chain}
              className="rounded-2xl border border-white/10 bg-slate-950 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-2xl font-black">{item.chain}</h3>

                <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {t.analysis.stablecoins.stablecoinsLabel}
                </span>
              </div>

              <p className="mt-5 break-words text-4xl font-black text-white">
                {formatBillions(item.value)}
              </p>

              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-emerald-400"
                    style={{
                      width: `${Math.min(
                        (item.value / Math.max(totalStablecoins, 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  {getPercent(item.value, totalStablecoins)}{" "}
                  {t.analysis.stablecoins.ofTrackedLiquidity}
                </p>
              </div>

              <p className="mt-4 text-sm font-bold text-emerald-400">
                {getSignal(item.value, t)}
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {t.analysis.stablecoins.soWhat}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {getNarrative(item.chain, t)}{" "}
                  {t.analysis.stablecoins.chainExplanation}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
          {t.analysis.stablecoins.disclaimer}
        </div>
      </div>
    </section>
  );
}