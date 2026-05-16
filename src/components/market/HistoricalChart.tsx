"use client";

import { useEffect, useMemo, useState } from "react";

type YearData = {
  year: number;
  marketCapPeak: number | null;
  btcPeak: number;
};

type ApiData = {
  currentMarketCap: number;
  years: YearData[];
  updatedAt: string;
};

function formatUsd(value?: number | null) {
  if (!value) return "—";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  return `$${value.toLocaleString()}`;
}

function pct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function label(t: any, key: string, fallback: string) {
  return t?.marketCap?.historical?.[key] || fallback;
}

export default function HistoricalChart({ t }: any) {
  const [data, setData] = useState<ApiData | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
useEffect(() => {
  let mounted = true;

  async function loadData() {
    try {
      const res = await fetch("/api/crypto/market-cap/history", {
        cache: "no-store",
      });

      if (!res.ok) {
        if (mounted) setData(null);
        return;
      }

      const json = await res.json();
      console.log("Historical API response:", json);

      if (!mounted) return;

      setData(json);

      if (json?.years?.[0]?.year) {
        setSelectedYear(json.years[0].year);
      }
    } catch {
      if (mounted) setData(null);
    }
  }

  loadData();

  return () => {
    mounted = false;
  };
}, []);

  const selected = useMemo(() => {
    return data?.years?.find((item) => item.year === selectedYear) || null;
  }, [data, selectedYear]);

  const currentMarketCap = data?.currentMarketCap || 0;

  const changeVsNow =
    selected?.marketCapPeak && currentMarketCap
      ? ((currentMarketCap - selected.marketCapPeak) / selected.marketCapPeak) * 100
      : null;

  const currentHigher = (changeVsNow || 0) >= 0;

  const maxMarketCap = Math.max(
    ...((data?.years || [])
      .map((item) => item.marketCapPeak || 0)
      .filter(Boolean)),
    currentMarketCap,
    1
  );

  return (
    <section id="historical-data" className="mx-auto max-w-7xl px-4 py-20 sm:px-5">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              {label(t, "badge", "Historical Market Map")}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t.marketCap.chartTitle}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {label(
                t,
                "description",
                "Select a year to compare its crypto market-cap peak, Bitcoin yearly peak, and how far today’s market is from that period."
              )}
            </p>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {(data?.years || []).map((item) => (
              <button
                key={item.year}
                onClick={() => setSelectedYear(item.year)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-black transition ${
                  selectedYear === item.year
                    ? "bg-emerald-400 text-slate-950"
                    : "border border-white/10 bg-slate-950 text-slate-300 hover:border-emerald-400/40"
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        {data && data.years?.length === 0 ? (
  <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-red-200">
    Historical data is unavailable right now.
  </div>
) : selected ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">
                {label(t, "selectedYear", "Selected year")}
              </p>

              <h3 className="mt-2 text-5xl font-black text-white">
                {selected.year}
              </h3>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {label(t, "marketCapPeak", "Crypto market-cap peak")}
                  </p>
                  <p className="mt-2 font-mono text-2xl font-black text-white">
                    {formatUsd(selected.marketCapPeak)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {label(t, "btcPeak", "Bitcoin yearly peak")}
                  </p>
                  <p className="mt-2 font-mono text-2xl font-black text-white">
                    {formatUsd(selected.btcPeak)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {label(t, "vsNow", "Current market cap vs that year")}
                  </p>
                  <p
                    className={`mt-2 font-mono text-2xl font-black ${
                      currentHigher ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {changeVsNow === null ? "—" : pct(changeVsNow)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">
                    {label(t, "chartLabel", "Yearly market-cap peaks")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {label(t, "greenRed", "Green means today is higher. Red means today is lower.")}
                  </p>
                </div>

                <p className="font-mono text-sm font-black text-white">
                  {formatUsd(currentMarketCap)}
                </p>
              </div>

              <div className="space-y-3">
                {(data?.years || []).slice().reverse().map((item) => {
                  const value = item.marketCapPeak || 0;
                  const width = Math.max((value / maxMarketCap) * 100, 3);
                  const diff =
                    value && currentMarketCap
                      ? ((currentMarketCap - value) / value) * 100
                      : null;

                  const positive = (diff || 0) >= 0;

                  return (
                    <button
                      key={item.year}
                      onClick={() => setSelectedYear(item.year)}
                      className="grid w-full grid-cols-[52px_1fr_82px] items-center gap-3 text-left"
                    >
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {item.year}
                      </span>

                      <span className="h-3 overflow-hidden rounded-full bg-white/10">
                        <span
                          className={`block h-full rounded-full ${
                            selectedYear === item.year
                              ? "bg-cyan-300"
                              : positive
                                ? "bg-emerald-300"
                                : "bg-red-300"
                          }`}
                          style={{ width: `${width}%` }}
                        />
                      </span>

                      <span
                        className={`text-right font-mono text-xs font-black ${
                          positive ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {diff === null ? "—" : pct(diff)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-slate-400">
            {label(t, "loading", "Loading historical market data...")}
          </div>
        )}

        {data?.updatedAt ? (
          <p className="mt-5 text-xs text-slate-500">
            {t.marketCap.updated}: {new Date(data.updatedAt).toLocaleTimeString()}
          </p>
        ) : null}
      </div>
    </section>
  );
}