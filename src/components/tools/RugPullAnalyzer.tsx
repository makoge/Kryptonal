"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Dict {
  [key: string]: any;
}

interface SecurityAuditResult {
  score: number;
  isHoneypot: boolean;
  buyTax: number;
  sellTax: number;
  bundledSupplyPct: number;
  lpBurnedOrLocked: boolean;
  ownerRenounced: boolean;
  top10Concentration: number;
  redFlags: string[];
  positiveSignals: string[];
  tokenName: string;
  tokenSymbol: string;
}

export default function RugPullAnalyzer({ dict }: { dict: Dict }) {
  const d = (key: string, fallback: string) => dict?.[key] || fallback;

  const [address, setAddress] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>("solana");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<SecurityAuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/tools/rugpull-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, chain: selectedChain }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
      } else {
        setErrorMsg(
          json.error ||
            d(
              "error",
              "Unable to analyze token. Please verify contract address.",
            ),
        );
      }
    } catch (err) {
      setErrorMsg(
        d("error", "Unable to analyze token. Please verify contract address."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#0B0E14] text-slate-100 rounded-2xl border border-slate-800/80 shadow-2xl font-sans">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {d("title", "Bundled Sniper & Rug Pull Risk Analyzer")}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {d(
                "subtitle",
                "Scan token contracts for linked wallet clusters, honeypot sell taxes, and unlocked liquidity.",
              )}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleScan}
        className="bg-[#151A23] p-5 sm:p-6 rounded-xl border border-slate-800 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("chain", "Select Blockchain")}
            </label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="solana">Solana (SOL)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="bsc">BNB Smart Chain (BSC)</option>
              <option value="base">Base L2</option>
              <option value="arbitrum">Arbitrum One</option>
            </select>
          </div>

          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {d("tokenAddress", "Token Contract Address")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={d(
                  "placeholder",
                  "Paste token address (0x... or Solana Mint)",
                )}
                className="w-full bg-[#0B0E14] text-white border border-slate-700 rounded-lg pl-3.5 pr-10 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm font-mono"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {d("checking", "Scanning On-Chain Traces & Wallet Clusters...")}
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              {d("button", "Analyze Security Risks")}
            </>
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {report && (
        <div className="bg-[#151A23] p-5 sm:p-6 rounded-xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <span className="text-xs text-slate-400 uppercase block">
                {d("token", "Token Overview")}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {report.tokenName}{" "}
                <span className="text-cyan-400">({report.tokenSymbol})</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase block">
                  {d("riskScore", "Overall Scam / Rug Score")}
                </span>
                <span
                  className={`text-2xl font-mono font-extrabold ${report.score > 50 ? "text-rose-400" : "text-emerald-400"}`}
                >
                  {report.score} / 100
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0B0E14] p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                {d("sellable", "Can Be Sold (No Honeypot)")}
              </span>
              <div className="flex items-center gap-1.5">
                {!report.isHoneypot ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm font-bold text-emerald-400">
                      {d("yes", "Passed / Safe")}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-sm font-bold text-rose-400">
                      {d("no", "Failed / Danger")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                {d("buyTax", "Buy Tax")} / {d("sellTax", "Sell Tax")}
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {report.buyTax}% / {report.sellTax}%
              </span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                {d("transferTax", "Bundled Insiders Supply")}
              </span>
              <span
                className={`text-sm font-mono font-bold ${report.bundledSupplyPct > 20 ? "text-rose-400" : "text-emerald-400"}`}
              >
                {report.bundledSupplyPct}%
              </span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                LP Lock Status
              </span>
              <span
                className={`text-sm font-bold ${report.lpBurnedOrLocked ? "text-emerald-400" : "text-amber-400"}`}
              >
                {report.lpBurnedOrLocked ? "Locked / Burned" : "Unlocked"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0B0E14] p-4 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {d("redFlags", "High Security Risks Detected")}
              </h3>
              {report.redFlags.length > 0 ? (
                <ul className="space-y-2">
                  {report.redFlags.map((flag, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No major red flags detected.
                </p>
              )}
            </div>

            <div className="bg-[#0B0E14] p-4 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {d("positiveSigns", "Safety Verification Signals")}
              </h3>
              {report.positiveSignals.length > 0 ? (
                <ul className="space-y-2">
                  {report.positiveSignals.map((sig, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No positive safety verifications.
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800 pt-4">
            {d(
              "disclaimer",
              "This tool scans on-chain smart contract data and wallet behavior. While it catches major scam patterns, bad actors constantly evolve techniques. Always manage risk carefully.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
