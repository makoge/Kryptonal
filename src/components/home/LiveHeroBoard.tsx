"use client";

import { useEffect, useState } from "react";

type Tone = "green" | "red" | "neutral" | "amber";

type MarketItem = {
  label: string;
  value: string;
  change?: string;
  changeValue?: number;
  subtitle?: string;
  type?: "price" | "market" | "phase";
};

function getTone(item: MarketItem): Tone {
  if (item.type === "phase") return "amber";

  const value =
    typeof item.changeValue === "number"
      ? item.changeValue
      : Number(String(item.change || "").replace("%", ""));

  if (value > 0) return "green";
  if (value < 0) return "red";
  return "neutral";
}

const toneStyles: Record<Tone, string> = {
  green:
    "border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_35px_rgba(16,185,129,0.12)]",
  red:
    "border-red-400/30 bg-red-400/10 shadow-[0_0_35px_rgba(248,113,113,0.10)]",
  neutral:
    "border-slate-400/20 bg-white/[0.06]",
  amber:
    "border-amber-400/30 bg-amber-400/10 shadow-[0_0_35px_rgba(251,191,36,0.10)]",
};

const textStyles: Record<Tone, string> = {
  green: "text-emerald-300",
  red: "text-red-300",
  neutral: "text-slate-300",
  amber: "text-amber-300",
};

export default function LiveHeroBoard({
  panelTitle,
  panelNote,
}: {
  panelTitle: string;
  panelNote: string;
}) {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [updated, setUpdated] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadMarket() {
    try {
      const res = await fetch("/api/home/hero-market", {
        cache: "no-store",
      });

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
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarket();

    const timer = setInterval(loadMarket, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl sm:p-4">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">{panelTitle}</p>
            <p className="mt-1 text-xs text-slate-500">
              Live crypto market snapshot
            </p>
          </div>

          <span className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live {updated ? `· ${updated}` : ""}
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[88px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]"
                />
              ))
            : items.map((item) => {
                const tone = getTone(item);
                const isPositive =
                  tone === "green" &&
                  !String(item.change || "").startsWith("+");

                return (
                  <div
                    key={item.label}
                    className={`relative overflow-hidden rounded-2xl border p-4 transition hover:scale-[1.01] ${toneStyles[tone]}`}
                  >
                    <div
                      className={`absolute inset-y-0 left-0 w-1 ${textStyles[tone]} bg-current opacity-90`}
                    />

                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200">
                          {item.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.subtitle || "Live market data"}
                        </p>

                        {item.change ? (
                          <p className={`mt-2 text-xs font-bold ${textStyles[tone]}`}>
                            {isPositive ? "+" : ""}
                            {item.change}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-black text-white sm:text-2xl">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
          {panelNote}
        </div>
      </div>
    </div>
  );
}