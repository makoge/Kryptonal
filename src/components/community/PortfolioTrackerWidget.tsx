// src/components/community/PortfolioTrackerWidget.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type DurationOption = "DAY" | "WEEK" | "MONTH" | "LONG_TERM";

export interface PortfolioTrackerDict {
  title?: string;
  subtitle?: string;
  oneDay?: string;
  oneWeek?: string;
  oneMonth?: string;
  longTerm?: string;
  selectCoin?: string;
  addHoldingBtn?: string;
  noHoldings?: string;
}

interface PortfolioTrackerWidgetProps {
  session?: any;
  dict?: PortfolioTrackerDict;
}

export default function PortfolioTrackerWidget({
  session,
  dict,
}: PortfolioTrackerWidgetProps) {
  const [selectedDuration, setSelectedDuration] =
    useState<DurationOption>("LONG_TERM");
  const [symbolInput, setSymbolInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DURATIONS: { id: DurationOption; label: string; badge: string }[] = [
    {
      id: "DAY",
      label: dict?.oneDay || "24 Hours",
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      id: "WEEK",
      label: dict?.oneWeek || "1 Week",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      id: "MONTH",
      label: dict?.oneMonth || "1 Month",
      badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    {
      id: "LONG_TERM",
      label: dict?.longTerm || "Long Term (HODL)",
      badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ];

  const handleAddCoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      signIn("google");
      return;
    }
    if (!symbolInput.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/community/holdings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: symbolInput.trim().toUpperCase(),
          duration: selectedDuration,
        }),
      });

      if (res.ok) {
        setSymbolInput("");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span>💼</span> {dict?.title || "Log Your High-Conviction Bags"}
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        {dict?.subtitle ||
          "Tell the community which coins you are holding for specific time horizons."}
      </p>

      {/* Timeframe Selector Tabs */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DURATIONS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedDuration(tab.id)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              selectedDuration === tab.id
                ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                : "border-white/5 bg-slate-800/40 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddCoin} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
            $
          </span>
          <input
            type="text"
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
            placeholder={dict?.selectCoin || "e.g. BTC, SOL, PEPE..."}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-7 pr-4 py-2.5 text-sm font-semibold text-white uppercase placeholder:normal-case placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {isSubmitting ? "..." : dict?.addHoldingBtn || "Add Position"}
        </button>
      </form>
    </div>
  );
}
