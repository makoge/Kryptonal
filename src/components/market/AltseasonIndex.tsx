"use client";

import { useEffect, useState } from "react";

type Coin = {
  name: string;
  symbol: string;
  image: string;
  change30d: number;
};

type AltseasonData = {
  index: number;
  phase: "altseason" | "bitcoinSeason" | "rotation";
  summary: string;
  btcChange30d: number;
  totalAltcoinsChecked: number;
  outperformCount: number;
  btcDominance: number;
  ethDominance: number;
  leaders: Coin[];
  laggards: Coin[];
  updatedAt: string;
};

function pct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function label(t: any, key: string, fallback: string) {
  return t?.marketCap?.altseason?.[key] || fallback;
}

export default function AltseasonIndex({ t }: { t: any }) {
  const [data, setData] = useState<AltseasonData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/altseason", {
          cache: "no-store",
        });

        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      }
    }

    load();
    const timer = setInterval(load, 300000);
    return () => clearInterval(timer);
  }, []);

  const index = data?.index ?? 0;
  const phaseLabel = data
    ? label(t, data.phase, data.phase)
    : label(t, "loading", "Loading...");

  return (
    <section id="altseason-index" className="mx-auto max-w-7xl px-4 py-20 sm:px-5">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              {label(t, "badge", "Altseason Index")}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              {label(t, "title", "Is it Bitcoin season or altcoin season?")}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {data?.summary ||
                label(t, "loadingText", "Loading live altseason data...")}
            </p>

            <div className="mt-7 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">
                    {label(t, "score", "Altseason Score")}
                  </p>
                  <p className="mt-2 font-mono text-6xl font-black text-white">
                    {index}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    {label(t, "phase", "Current phase")}
                  </p>
                  <p className="mt-2 text-2xl font-black text-emerald-300">
                    {phaseLabel}
                  </p>
                </div>
              </div>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    index >= 75
                      ? "bg-emerald-300"
                      : index <= 25
                        ? "bg-orange-300"
                        : "bg-cyan-300"
                  }`}
                  style={{ width: `${Math.max(index, 3)}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs font-bold text-slate-500">
                <span>{label(t, "bitcoinSeason", "Bitcoin Season")}</span>
                <span>{label(t, "rotation", "Rotation")}</span>
                <span>{label(t, "altseason", "Altseason")}</span>
              </div>
            </div>

            {data ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">
                    {label(t, "outperforming", "Outperforming BTC")}
                  </p>
                  <p className="mt-2 font-mono text-xl font-black text-white">
                    {data.outperformCount}/{data.totalAltcoinsChecked}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">
                    {label(t, "btc30d", "BTC 30D")}
                  </p>
                  <p
                    className={`mt-2 font-mono text-xl font-black ${
                      data.btcChange30d >= 0 ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {pct(data.btcChange30d)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">
                    {t.marketCap.btcDominance}
                  </p>
                  <p className="mt-2 font-mono text-xl font-black text-white">
                    {data.btcDominance.toFixed(2)}%
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">
                    {t.marketCap.ethDominance}
                  </p>
                  <p className="mt-2 font-mono text-xl font-black text-white">
                    {data.ethDominance.toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-5">
            <CoinList
              title={label(t, "leaders", "Altcoins leading BTC")}
              coins={data?.leaders || []}
              positive
            />

            <CoinList
              title={label(t, "laggards", "Weakest large altcoins")}
              coins={data?.laggards || []}
            />

            {data?.updatedAt ? (
              <p className="text-xs text-slate-500">
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

function CoinList({
  title,
  coins,
  positive,
}: {
  title: string;
  coins: Coin[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
      <h3 className="text-xl font-black text-white">{title}</h3>

      <div className="mt-4 grid gap-3">
        {coins.length === 0 ? (
          <p className="text-sm text-slate-500">—</p>
        ) : (
          coins.map((coin) => (
            <div
              key={coin.symbol}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-7 w-7 rounded-full"
                />
                <div>
                  <p className="font-bold text-white">{coin.name}</p>
                  <p className="text-xs font-bold text-slate-500">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <p
                className={`font-mono text-sm font-black ${
                  coin.change30d >= 0 || positive
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {pct(coin.change30d)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}