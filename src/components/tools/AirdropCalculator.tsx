"use client";

import React, { useState, useMemo } from "react";
import { Coins, Share2, Info } from "lucide-react";

interface Dict {
  [key: string]: any;
}

interface ProtocolPreset {
  name: string;
  id: string;
  defaultUserPoints: number;
  totalPoints: number;
  defaultFdv: number;
  airdropPct: number;
  defaultGas: number;
}

const PRESET_PROTOCOLS: ProtocolPreset[] = [
  {
    name: "EigenLayer / Restaking",
    id: "eigen",
    defaultUserPoints: 150000,
    totalPoints: 2500000000,
    defaultFdv: 7000000000,
    airdropPct: 10,
    defaultGas: 120,
  },
  {
    name: "Symbiotic Vaults",
    id: "symbiotic",
    defaultUserPoints: 85000,
    totalPoints: 1200000000,
    defaultFdv: 3500000000,
    airdropPct: 8,
    defaultGas: 65,
  },
  {
    name: "Karak Network",
    id: "karak",
    defaultUserPoints: 50000,
    totalPoints: 800000000,
    defaultFdv: 2000000000,
    airdropPct: 12,
    defaultGas: 45,
  },
  {
    name: "Hyperliquid L1",
    id: "hyperliquid",
    defaultUserPoints: 12000,
    totalPoints: 350000000,
    defaultFdv: 4000000000,
    airdropPct: 15,
    defaultGas: 25,
  },
  {
    name: "Custom Points Protocol...",
    id: "custom",
    defaultUserPoints: 10000,
    totalPoints: 100000000,
    defaultFdv: 1000000000,
    airdropPct: 10,
    defaultGas: 50,
  },
];

export default function AirdropCalculator({ dict }: { dict: Dict }) {
  const d = (key: string, fallback: string) => dict?.[key] || fallback;

  const [selectedId, setSelectedId] = useState<string>("eigen");
  const [userPoints, setUserPoints] = useState<number>(150000);
  const [totalPoints, setTotalPoints] = useState<number>(2500000000);
  const [fdv, setFdv] = useState<number>(7000000000);
  const [airdropPct, setAirdropPct] = useState<number>(10);
  const [gasSpent, setGasSpent] = useState<number>(120);

  const handleSelectProtocol = (id: string) => {
    setSelectedId(id);
    const p = PRESET_PROTOCOLS.find((item) => item.id === id);
    if (p) {
      setUserPoints(p.defaultUserPoints);
      setTotalPoints(p.totalPoints);
      setFdv(p.defaultFdv);
      setAirdropPct(p.airdropPct);
      setGasSpent(p.defaultGas);
    }
  };

  const calculations = useMemo(() => {
    const userSharePct = totalPoints > 0 ? (userPoints / totalPoints) * 100 : 0;
    const baseAirdropPoolUsd = fdv * (airdropPct / 100);
    const grossRealistic =
      (userPoints / (totalPoints || 1)) * baseAirdropPoolUsd;
    const grossBearish = grossRealistic * 0.4;
    const grossBullish = grossRealistic * 2.2;
    const netRealistic = grossRealistic - gasSpent;
    const roiPct =
      gasSpent > 0 ? ((netRealistic / gasSpent) * 100).toFixed(0) : "0";
    const valuePerKPoints =
      userPoints > 0
        ? ((grossRealistic / userPoints) * 1000).toFixed(2)
        : "0.00";

    return {
      userSharePct: userSharePct.toFixed(4),
      grossBearish: Math.round(grossBearish),
      grossRealistic: Math.round(grossRealistic),
      grossBullish: Math.round(grossBullish),
      netRealistic: Math.round(netRealistic),
      roiPct,
      valuePerKPoints,
    };
  }, [userPoints, totalPoints, fdv, airdropPct, gasSpent]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = d("title", "Airdrop Points & Restaking ROI Calculator");
    const text = `Estimated Airdrop Value: $${calculations.grossRealistic.toLocaleString()} (${calculations.roiPct}% ROI) calculated on Kryptonal!`;

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
    "With {userPoints} points out of {totalPoints} total points, your pool share is {share}%. At a ${fdv} FDV with {alloc}% airdrop allocation, your gross payout is {grossVal}. After deducting ${gasSpent} in gas fees, your net return is {netVal} ({roi}% ROI).",
  );

  const formattedAnalysis = rawAnalysis
    .replace("{userPoints}", userPoints.toLocaleString())
    .replace("{totalPoints}", totalPoints.toLocaleString())
    .replace("{share}", calculations.userSharePct)
    .replace("{fdv}", (fdv / 1e9).toFixed(1) + "B")
    .replace("{alloc}", airdropPct.toString())
    .replace("{grossVal}", `$${calculations.grossRealistic.toLocaleString()}`)
    .replace("{gasSpent}", gasSpent.toString())
    .replace("{netVal}", `$${calculations.netRealistic.toLocaleString()}`)
    .replace("{roi}", calculations.roiPct);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#0B0E14] text-slate-100 rounded-2xl border border-slate-800/80 shadow-2xl font-sans">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {d("title", "Airdrop Points & Restaking ROI Calculator")}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {d(
                "subtitle",
                "Convert off-chain points into estimated TGE token value, net USD profit, and gas-adjusted ROI.",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4 bg-[#151A23] p-5 sm:p-6 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("selectProtocol", "Select Protocol / Network")}
            </label>
            <select
              value={selectedId}
              onChange={(e) => handleSelectProtocol(e.target.value)}
              className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-medium"
            >
              {PRESET_PROTOCOLS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {d("userPoints", "Your Total Points")}
              </label>
              <input
                type="number"
                value={userPoints}
                onChange={(e) => setUserPoints(Number(e.target.value))}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {d("totalPointsIssued", "Total Points Issued")}
              </label>
              <input
                type="number"
                value={totalPoints}
                onChange={(e) => setTotalPoints(Number(e.target.value))}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {d("estimatedFdv", "Estimated FDV ($)")}
              </label>
              <input
                type="number"
                value={fdv}
                onChange={(e) => setFdv(Number(e.target.value))}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {d("airdropAllocation", "Airdrop Pool %")}
              </label>
              <input
                type="number"
                value={airdropPct}
                onChange={(e) => setAirdropPct(Number(e.target.value))}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("gasSpent", "Gas & Fees Spent ($)")}
            </label>
            <input
              type="number"
              value={gasSpent}
              onChange={(e) => setGasSpent(Number(e.target.value))}
              className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
            />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-[#151A23] p-5 sm:p-6 rounded-xl border border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-semibold text-white">
                {d("resultsTitle", "Airdrop Valuation Scenarios")}
              </h2>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ${calculations.valuePerKPoints} / 1k pts
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0B0E14] p-3 sm:p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                  {d("conservative", "Bearish Scenario")}
                </span>
                <span className="text-sm sm:text-lg font-mono font-bold text-slate-300">
                  ${calculations.grossBearish.toLocaleString()}
                </span>
              </div>

              <div className="bg-cyan-950/20 p-3 sm:p-4 rounded-xl border border-cyan-500/30 text-center">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase block mb-1">
                  {d("realistic", "Base Case")}
                </span>
                <span className="text-base sm:text-xl font-mono font-extrabold text-cyan-300">
                  ${calculations.grossRealistic.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#0B0E14] p-3 sm:p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase block mb-1">
                  {d("bullish", "Bullish Scenario")}
                </span>
                <span className="text-sm sm:text-lg font-mono font-bold text-emerald-400">
                  ${calculations.grossBullish.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0B0E14] p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  {d("netProfit", "Gas-Adjusted Net Profit")}
                </span>
                <span
                  className={`text-xl font-mono font-bold mt-1 block ${calculations.netRealistic >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  ${calculations.netRealistic.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#0B0E14] p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  {d("roi", "Est. Return on Gas (ROI)")}
                </span>
                <span className="text-xl font-mono font-bold text-cyan-400 mt-1 block">
                  +{calculations.roiPct}%
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>{formattedAnalysis}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            <Share2 className="w-4 h-4" />
            {d("shareCard", "Share Estimate")}
          </button>
        </div>
      </div>
    </div>
  );
}
