"use client";

import { useState } from "react";

type Props = {
  locale: string;
  t: any;
};

const CYCLES = [
  { id: "current", label: "Current Market", tag: "Live Telemetry" },
  { id: "2024", label: "2024 Cycle", tag: "ETF & Halving" },
  { id: "2021", label: "2021 Cycle", tag: "DeFi & NFT Peak" },
  { id: "2017", label: "2017 Cycle", tag: "ICO Boom" },
];

type MacroDriver = {
  title: string;
  description: string;
};

type AnalysisPayload = {
  year: string;
  title: string;
  regime: string;
  sentimentSummary: string;
  macroDrivers: MacroDriver[];
  assetPerformance: {
    leaders: string;
    dynamics: string;
  };
  tacticalHints: string[];
  verdict: string;
  updatedAt: string;
};

export default function MarketAnalysis({ locale, t }: Props) {
  const [year, setYear] = useState("current");
  const [data, setData] = useState<AnalysisPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateAnalysis() {
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, locale }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch {
      alert("Failed to generate market intelligence. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getMarkdownOutput() {
    if (!data) return "";
    const lines = [
      `🏛️ **Kryptonal Market Intelligence: ${data.title} (${data.year.toUpperCase()})**`,
      `*Regime: ${data.regime}*`,
      "",
      `> 💡 **Executive Summary:** ${data.sentimentSummary}`,
      "",
      `### ⚡ Core Macro Drivers:`,
      ...data.macroDrivers.map((d) => `• **${d.title}:** ${d.description}`),
      "",
      `### 📊 Asset & Sector Behavior:`,
      `• **Market Leaders:** ${data.assetPerformance.leaders}`,
      `• **Dominance Dynamics:** ${data.assetPerformance.dynamics}`,
      "",
      `### 🎯 Tactical Investment Hints & Lessons:`,
      ...data.tacticalHints.map((h) => `• ${h}`),
      "",
      `📌 **Cycle Verdict:** ${data.verdict}`,
      "",
      `🔗 *Source: [Kryptonal Market Analysis](https://kryptonal.com/market-cap)*`,
    ];
    return lines.join("\n");
  }

  async function copyAnalysis() {
    const text = getMarkdownOutput();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Failed to copy text.");
    }
  }

  function downloadTxt() {
    const text = getMarkdownOutput();
    if (!text) return;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kryptonal-cycle-analysis-${year}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      id="marketcap-analysis"
      className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
          {t?.analysisTool?.badge || "Macro Cycle Intelligence"}
        </span>
        {data && (
          <span className="text-xs font-bold text-slate-400">
            {new Date(data.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
        {t?.analysisTool?.title || "Cycle Diagnostics & Comparative Analysis"}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {t?.analysisTool?.description ||
          "Select a historical market era or the live cycle to evaluate sentiment momentum, news drivers, and capital flow distribution."}
      </p>

      {/* Cycle Selectors */}
      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t?.analysisTool?.compareLabel || "Select Cycle Horizon"}
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CYCLES.map((item) => (
            <button
              key={item.id}
              onClick={() => setYear(item.id)}
              className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
                year === item.id
                  ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
                  : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-emerald-400/40 hover:bg-slate-900"
              }`}
            >
              <span className="text-sm font-black">{item.label}</span>
              <span
                className={`text-[10px] font-bold ${year === item.id ? "text-slate-900" : "text-slate-500"}`}
              >
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Trigger */}
      <button
        onClick={generateAnalysis}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-black text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300 disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin text-slate-950"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>
              {t?.analysisTool?.generating || "Analyzing cycle telemetry..."}
            </span>
          </>
        ) : (
          <span>
            {t?.analysisTool?.generate || "Generate Cycle Briefing"} →
          </span>
        )}
      </button>

      {/* Analysis Output Presentation */}
      <div className="mt-6 min-h-64 rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-inner">
        {data ? (
          <div className="space-y-5">
            {/* Title & Regime Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">{data.title}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {data.sentimentSummary}
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase text-emerald-300">
                {data.regime}
              </span>
            </div>

            {/* Macro Catalysts */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">
                Primary Macro Catalysts & News Flow
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {data.macroDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <p className="text-xs font-bold text-white">
                      {driver.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {driver.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Dynamics */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Asset & Dominance Distribution
              </h4>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                <strong className="text-white">Leaders: </strong>{" "}
                {data.assetPerformance.leaders}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                <strong className="text-white">Dynamics: </strong>{" "}
                {data.assetPerformance.dynamics}
              </p>
            </div>

            {/* Tactical Hints */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                Tactical Hints & Risk Management
              </h4>
              <div className="space-y-1.5">
                {data.tacticalHints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-5 text-slate-300"
                  >
                    <span className="text-amber-400 shrink-0">⚡</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3.5 text-xs font-medium text-emerald-200">
              🎯 <strong className="underline">Executive Takeaway:</strong>{" "}
              {data.verdict}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <span className="text-3xl">🏛️</span>
            <p className="mt-3 text-sm font-bold text-slate-400">
              {t?.analysisTool?.placeholder ||
                "Select a cycle above to generate a real-time or historical macro briefing."}
            </p>
          </div>
        )}
      </div>

      {/* Share / Export Bar */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          onClick={copyAnalysis}
          disabled={!data}
          className="rounded-xl bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/15 disabled:opacity-40"
        >
          {copied ? "Copied Markdown!" : "Copy Report"}
        </button>

        <button
          onClick={downloadTxt}
          disabled={!data}
          className="rounded-xl border border-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/10 disabled:opacity-40"
        >
          {t?.analysisTool?.download || "Download Report (.txt)"}
        </button>
      </div>

      <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs leading-6 text-amber-200/90">
        {t?.analysisTool?.disclaimer ||
          "Educational market analysis only. Not financial advice. Always verify important market indicators independently."}
      </p>
    </div>
  );
}
