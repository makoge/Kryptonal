"use client";

import { useEffect, useState } from "react";

type Data = {
  totalMarketCap: number;
};

function format(value: number) {
  return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
}

export default function MarketComparison({ t }: any) {
  const [cap, setCap] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/crypto/market-cap");
      const json = await res.json();
      setCap(json.totalMarketCap);
    }

    load();
  }, []);

  const comparisons = [
    {
      year: "2017",
      value: "$0.83T",
      note: t.marketCap.notes2017,
    },
    {
      year: "2021",
      value: "$3.00T",
      note: t.marketCap.notes2021,
    },
    {
      year: "Current",
      value: cap ? format(cap) : "...",
      note: t.marketCap.notesCurrent,
    },
  ];

  return (
    <section className="bg-slate-900/40 px-4 py-20 sm:px-5">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-black md:text-4xl">
          {t.marketCap.comparisonTitle}
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {comparisons.map((item) => (
            <div
              key={item.year}
              className="rounded-2xl border border-white/10 bg-slate-950 p-6"
            >
              <p className="text-sm text-slate-400">{item.year}</p>

              <h3 className="mt-3 text-3xl font-black">
                {item.value}
              </h3>

              <p className="mt-3 text-sm font-semibold text-emerald-400">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}