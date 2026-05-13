"use client";

import { useState } from "react";

export default function CycleComparison({ data }: any) {
  const [active, setActive] = useState(0);
  const current = data.items[active];

  return (
    <section className="px-4 py-20 sm:px-6">
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
          {current.metrics.map((metric: any) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/30"
            >
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-3 text-2xl font-black text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-emerald-50">
          {current.insight}
        </div>
      </div>
    </section>
  );
}