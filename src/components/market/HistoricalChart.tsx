"use client";

import { useEffect, useState } from "react";

type Point = {
  time: number;
  value: number;
};



export default function HistoricalChart({ t }: any) {

  const ranges = ["1Y", "3Y", "5Y", "ALL"] as const;

  type Range = (typeof ranges)[number];

  const [data, setData] = useState<Point[]>([]);
  const [range, setRange] = useState<Range>("1Y");

  async function loadData(selected:  Range) {
    try {
      const res = await fetch(
        `/api/crypto/market-cap/history?range=${selected}`
      );

      if (!res.ok) {
        setData([]);
        return;
      }

      const json = await res.json();
      setData(Array.isArray(json.chart) ? json.chart : []);
    } catch {
      setData([]);
    }
  }

  useEffect(() => {
    loadData(range);
  }, [range]);

  function buildPath(points: Point[]) {
    if (points.length < 2) return "";

    const values = points.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        const y = 90 - ((p.value - min) / range) * 80;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

  const path = buildPath(data);

  return (
    <section
      id="historical-data"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-5"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              {t.marketCap.chartTitle}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {t.marketCap.chartDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  range === r
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-slate-950 text-slate-300 hover:border-emerald-400/40"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 h-64 rounded-2xl bg-slate-950 p-3 sm:h-80 sm:p-5">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <path
              d={path}
              fill="none"
              stroke="rgb(52 211 153)"
              strokeWidth="2"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(52,211,153,0.7)] transition-all duration-500"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}