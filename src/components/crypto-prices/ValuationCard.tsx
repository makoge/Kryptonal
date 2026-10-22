// src/components/crypto-prices/ValuationCard.tsx
import React from "react";
import { calculateEconomicValuation } from "@/lib/valuationEngine";

interface Props {
  currentPrice: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  volume24h?: number;
  symbol: string;
  nextUnlockDate?: string | null;
}

export default function ValuationCard({
  currentPrice,
  circulatingSupply,
  totalSupply,
  maxSupply,
  volume24h = 0,
  symbol,
  nextUnlockDate,
}: Props) {
  const v = calculateEconomicValuation(
    currentPrice,
    circulatingSupply,
    totalSupply,
    maxSupply,
    volume24h,
    nextUnlockDate,
  );

  const colors = {
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      bar: "bg-emerald-400",
    },
    blue: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      bar: "bg-blue-400",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      bar: "bg-amber-400",
    },
    rose: {
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      bar: "bg-rose-400",
    },
  }[v.badgeColor];

  return (
    <div
      className={`rounded-2xl border ${colors.border} bg-slate-900/60 p-5 backdrop-blur-sm`}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {symbol
            ? `${symbol} Fair Value & Liquidity`
            : "Economic Fair Value & Liquidity"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider border ${colors.border} ${colors.bg} ${colors.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${colors.bar}`} />
          {v.badgeLabel}
        </span>
      </div>

      {/* Main Prices Comparison */}
      <div className="mt-4 grid grid-cols-2 gap-4 border-y border-white/5 py-3">
        <div>
          <p className="text-[11px] text-slate-400">Market Spot Price</p>
          <p className="text-lg font-black font-mono text-white">
            $
            {currentPrice < 0.01
              ? currentPrice.toExponential(3)
              : currentPrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Implied Fair Absorption</p>
          <p className={`text-lg font-black font-mono ${colors.text}`}>
            $
            {v.fairPrice < 0.01
              ? v.fairPrice.toExponential(3)
              : v.fairPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Dual Gauges: Circulating Float & Liquidity Turnover */}
      <div className="mt-4 space-y-3">
        {/* Float Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
            <span>Circulating Float</span>
            <span className="font-mono font-bold text-white">
              {v.circulationRatio.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${colors.bar}`}
              style={{ width: `${v.circulationRatio}%` }}
            />
          </div>
        </div>

        {/* 24h Volume / FDV Turnover */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
            <span>24h Volume / FDV Turnover</span>
            <span
              className={`font-mono font-bold ${
                v.turnoverRatio < 0.5 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {v.turnoverRatio.toFixed(2)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                v.turnoverRatio < 0.5 ? "bg-rose-500" : "bg-emerald-400"
              }`}
              style={{ width: `${Math.min(100, v.turnoverRatio * 20)}%` }}
            />
          </div>
        </div>
      </div>

      {/* --- NEW: UNLOCK RUNWAY ESTIMATOR ALERT --- */}
      {v.unlockRunwayDays !== null && v.unlockRunwayDays <= 90 && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Imminent Supply Unlock
            </span>
          </div>
          <span className="font-mono text-sm font-black text-white">
            {v.unlockRunwayDays} {v.unlockRunwayDays === 1 ? "Day" : "Days"}
          </span>
        </div>
      )}

      {/* Narrative Synthesis */}
      <p className="mt-4 text-xs leading-relaxed text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/5">
        {v.analysisText}
      </p>
    </div>
  );
}
