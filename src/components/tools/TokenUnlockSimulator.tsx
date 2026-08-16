"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle,
  TrendingDown,
  Info,
  Share2,
  ShieldAlert,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface Dict {
  [key: string]: any;
}

interface TokenOption {
  symbol: string;
  name: string;
  price: number;
  dailyVolume: number;
  liquidity: number;
  defaultUnlock: number;
}

const PRESET_TOKENS: TokenOption[] = [
  {
    symbol: "KAITO",
    name: "Kaito AI",
    price: 1.02,
    dailyVolume: 80900000,
    liquidity: 18500000,
    defaultUnlock: 12500000,
  },
  {
    symbol: "BEAT",
    name: "Audiera (BEAT)",
    price: 3.08,
    dailyVolume: 62900000,
    liquidity: 14200000,
    defaultUnlock: 22000000,
  },
  {
    symbol: "APT",
    name: "Aptos",
    price: 6.85,
    dailyVolume: 145000000,
    liquidity: 35000000,
    defaultUnlock: 11310000,
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    price: 0.54,
    dailyVolume: 180000000,
    liquidity: 42000000,
    defaultUnlock: 92600000,
  },
  {
    symbol: "OP",
    name: "Optimism",
    price: 1.72,
    dailyVolume: 95000000,
    liquidity: 28000000,
    defaultUnlock: 31400000,
  },
  {
    symbol: "SUI",
    name: "Sui Network",
    price: 1.88,
    dailyVolume: 310000000,
    liquidity: 65000000,
    defaultUnlock: 64000000,
  },
  {
    symbol: "CUSTOM",
    name: "Custom Token...",
    price: 1.0,
    dailyVolume: 10000000,
    liquidity: 2000000,
    defaultUnlock: 5000000,
  },
];

export default function TokenUnlockSimulator({ dict }: { dict: Dict }) {
  // Safe dictionary lookup helper
  const d = (key: string, fallback: string) => dict?.[key] || fallback;

  const [selectedSymbol, setSelectedSymbol] = useState<string>("APT");
  const [unlockAmount, setUnlockAmount] = useState<number>(11310000);
  const [price, setPrice] = useState<number>(6.85);
  const [dailyVolume, setDailyVolume] = useState<number>(145000000);
  const [liquidity, setLiquidity] = useState<number>(35000000);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  // Fetch live market data from API
  const fetchLiveMarketData = async (symbol: string) => {
    if (symbol === "CUSTOM") return;

    setIsLoadingLive(true);
    try {
      const res = await fetch(`/api/tools/unlock-impact?symbol=${symbol}`);
      const json = await res.json();

      if (json.success && json.data) {
        if (json.data.price) setPrice(json.data.price);
        if (json.data.dailyVolume) setDailyVolume(json.data.dailyVolume);
        if (json.data.estimatedLiquidity)
          setLiquidity(json.data.estimatedLiquidity);
      }
    } catch (err) {
      console.warn("Using preset fallback data due to network error.");
    } finally {
      setIsLoadingLive(false);
    }
  };

  const handleSelectCoin = (symbol: string) => {
    setSelectedSymbol(symbol);
    const coin = PRESET_TOKENS.find((t) => t.symbol === symbol);
    if (coin) {
      setPrice(coin.price);
      setDailyVolume(coin.dailyVolume);
      setLiquidity(coin.liquidity);
      setUnlockAmount(coin.defaultUnlock);
    }
    fetchLiveMarketData(symbol);
  };

  const metrics = useMemo(() => {
    const unlockUsdValue = unlockAmount * price;
    const volRatio = dailyVolume > 0 ? (unlockUsdValue / dailyVolume) * 100 : 0;
    const daysToAbsorb =
      dailyVolume > 0
        ? (unlockUsdValue / (dailyVolume * 0.15)).toFixed(1)
        : "0";
    const slippagePct =
      liquidity > 0
        ? Math.min(((unlockUsdValue * 0.25) / liquidity) * 100, 85)
        : 0;

    let score = Math.min(
      (unlockUsdValue / (dailyVolume + liquidity * 0.5)) * 40,
      100,
    );
    score = Math.round(score);

    let riskKey = "riskLow";
    let defaultLabel = "Low Selling Risk";
    let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    let progressColor = "bg-emerald-500";

    if (score > 70) {
      riskKey = "riskCritical";
      defaultLabel = "Critical Liquidity Overhang Alert";
      badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
      progressColor = "bg-rose-500";
    } else if (score > 40) {
      riskKey = "riskHigh";
      defaultLabel = "High Dump Risk";
      badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      progressColor = "bg-amber-500";
    } else if (score > 20) {
      riskKey = "riskMedium";
      defaultLabel = "Moderate Selling Pressure";
      badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      progressColor = "bg-yellow-500";
    }

    return {
      unlockUsdValue,
      volRatio: volRatio.toFixed(1),
      daysToAbsorb,
      slippagePct: slippagePct.toFixed(2),
      score,
      riskLabel: d(riskKey, defaultLabel),
      badgeColor,
      progressColor,
    };
  }, [unlockAmount, price, dailyVolume, liquidity]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = d("title", "Token Unlock Price Impact Simulator");
    const text = `Check out ${selectedSymbol} unlock risk analysis on Kryptonal! Score: ${metrics.score}/100`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {}
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        return;
      } catch (err) {}
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link copied to clipboard!");
    } catch (err) {
      alert(`Copy URL: ${url}`);
    }
  };

  const rawAnalysis = d(
    "analysisText",
    "An unlock of {amount} tokens valued at {usdVal} represents {pctVol}% of daily volume. Liquidity absorption takes ~{days} days of average trading volume.",
  );

  const formattedAnalysis = rawAnalysis
    .replace("{amount}", unlockAmount.toLocaleString())
    .replace("{usdVal}", `$${metrics.unlockUsdValue.toLocaleString()}`)
    .replace("{pctVol}", metrics.volRatio)
    .replace("{days}", metrics.daysToAbsorb);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#0B0E14] text-slate-100 rounded-2xl border border-slate-800/80 shadow-2xl font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {d("title", "Token Unlock Price Impact Simulator")}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {d(
                  "subtitle",
                  "Calculate market dilution risk and sell pressure before major token unlocks.",
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchLiveMarketData(selectedSymbol)}
            disabled={isLoadingLive || selectedSymbol === "CUSTOM"}
            title="Fetch live market data"
            className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all disabled:opacity-40"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingLive ? "animate-spin text-cyan-400" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Section */}
        <div className="lg:col-span-5 space-y-5 bg-[#151A23] p-5 sm:p-6 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("selectCoin", "Select Token")}
            </label>
            <select
              value={selectedSymbol}
              onChange={(e) => handleSelectCoin(e.target.value)}
              className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-medium"
            >
              {PRESET_TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.name} ({t.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("unlockAmount", "Upcoming Unlock Amount (Tokens)")}
            </label>
            <input
              type="number"
              value={unlockAmount}
              onChange={(e) => setUnlockAmount(Number(e.target.value))}
              className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {d("tokenPrice", "Current Token Price ($)")}
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {d("dailyVolume", "30-Day Avg Daily Volume ($)")}
              </label>
              <input
                type="number"
                value={dailyVolume}
                onChange={(e) => setDailyVolume(Number(e.target.value))}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("liquidityPool", "DEX/CEX Liquidity Depth ($)")}
            </label>
            <input
              type="number"
              value={liquidity}
              onChange={(e) => setLiquidity(Number(e.target.value))}
              className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-[#151A23] p-5 sm:p-6 rounded-xl border border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-semibold text-white">
                {d("resultsTitle", "Simulated Risk Analysis")}
              </h2>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${metrics.badgeColor}`}
              >
                {metrics.riskLabel}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {d("impactScore", "Overhang Impact Score")}
                </span>
                <span className="text-xl font-mono font-bold text-white">
                  {metrics.score} / 100
                </span>
              </div>
              <div className="w-full h-3 bg-[#0B0E14] rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${metrics.progressColor}`}
                  style={{ width: `${metrics.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0B0E14] p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  {d("projectedSlippage", "Projected Price Slippage")}
                </span>
                <span className="text-xl font-mono font-bold text-rose-400 mt-1 block">
                  ~{metrics.slippagePct}%
                </span>
              </div>

              <div className="bg-[#0B0E14] p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  {d("dilutionRatio", "Volume-to-Unlock Ratio")}
                </span>
                <span className="text-xl font-mono font-bold text-cyan-400 mt-1 block">
                  {metrics.volRatio}%
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>{formattedAnalysis}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            <Share2 className="w-4 h-4" />
            {d("shareCard", "Share Analysis")}
          </button>
        </div>
      </div>
    </div>
  );
}
