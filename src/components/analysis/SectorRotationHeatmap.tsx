"use client";

import { useEffect, useState } from "react";

type Sector = {
  name: string;
  tvl: number;
  change7d: number;
  protocols: number;
  score: number;
  signal: string;
};

type Data = {
  sectors: Sector[];
};

function formatTvl(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  return `$${(value / 1_000_000).toFixed(2)}M`;
}

function getNarrative(sector: Sector) {
  if (sector.signal === "Hot") {
    return "This sector is showing strong weekly momentum. Capital and attention may be rotating into this narrative.";
  }

  if (sector.signal === "Rising") {
    return "This sector is improving. It may be worth watching for stronger continuation.";
  }

  if (sector.signal === "Neutral") {
    return "This sector is stable. It is not showing strong rotation yet.";
  }

  return "This sector is cooling. Capital may be moving away or activity may be slowing.";
}

function getSignalClass(signal: string) {
  if (signal === "Hot") return "bg-emerald-400 text-slate-950";
  if (signal === "Rising") return "bg-lime-400/10 text-lime-300";
  if (signal === "Neutral") return "bg-slate-700 text-slate-200";
  return "bg-red-400/10 text-red-300";
}

function getScoreClass(score: number) {
  if (score >= 75) return "bg-emerald-400";
  if (score >= 55) return "bg-lime-400";
  if (score >= 35) return "bg-amber-400";
  return "bg-red-400";
}

export default function SectorRotationHeatmap({ t }: any) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analysis/sectors", {
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
    <section id="sector-rotation" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20">
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
            {t.sectorRotation.badge}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {t.sectorRotation.title}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            {t.sectorRotation.description}
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {data?.sectors?.map((sector) => (
            <div
              key={sector.name}
              className="rounded-2xl border border-white/10 bg-slate-950 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black">{sector.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {sector.protocols} {t.sectorRotation.protocols}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-black ${getSignalClass(
                    sector.signal
                  )}`}
                >
                  {sector.signal}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">TVL</p>
                  <p className="mt-2 text-xl font-black">{formatTvl(sector.tvl)}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">7D</p>
                  <p
                    className={`mt-2 text-xl font-black ${
                      sector.change7d >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {sector.change7d.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    {t.sectorRotation.score}
                  </span>
                  <span className="font-black text-white">
                    {sector.score}/100
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-2 rounded-full ${getScoreClass(sector.score)}`}
                    style={{ width: `${sector.score}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {t.sectorRotation.soWhat}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {getNarrative(sector)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
          {t.sectorRotation.disclaimer}
        </div>
      </div>
    </section>
  );
}