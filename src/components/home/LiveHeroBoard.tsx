"use client";

import { useEffect, useState } from "react";

type MarketItem = {
  label: string;
  value: string;
  change: string;
  tone: "emerald" | "cyan" | "amber" | "red";
};

const toneStyles = {
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  red: "border-red-400/25 bg-red-400/10 text-red-300",
};

export default function LiveHeroBoard({ panelTitle, panelNote }: {
  panelTitle: string;
  panelNote: string;
}) {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [updated, setUpdated] = useState("");

  async function loadMarket() {
    const res = await fetch("/api/home/hero-market", { cache: "no-store" });
    const data = await res.json();

    setItems(data.items || []);
    setUpdated(
      data.updatedAt
        ? new Date(data.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""
    );
  }

  useEffect(() => {
    loadMarket();
    const timer = setInterval(loadMarket, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
      <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-300">{panelTitle}</p>

          <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live {updated ? `· ${updated}` : ""}
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-2xl border p-4 ${toneStyles[item.tone]}`}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-current opacity-80" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <p className="mt-1 text-xs text-slate-500">{item.change}</p>
                </div>

                <span className="text-right text-lg font-black text-white">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
          {panelNote}
        </div>
      </div>
    </div>
  );
}