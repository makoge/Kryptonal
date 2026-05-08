"use client";

import { useState } from "react";

const modes = ["Full", "Cycle", "Risk", "Altcoins"] as const;
type Mode = (typeof modes)[number];

export default function DeepAnalysisEngine({ t }: any) {
  const [mode, setMode] = useState<Mode>("Full");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch("/api/analysis/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: mode.toLowerCase() }),
      });

      const json = await res.json();
      setAnalysis(json.analysis || "");
    } finally {
      setLoading(false);
    }
  }

  async function copyAnalysis() {
    if (!analysis) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(analysis);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = analysis;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
    } catch {
      alert("Copy failed. Please select the text manually.");
    }
  }

  function downloadTxt() {
    if (!analysis) return;

    const blob = new Blob([analysis], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "kryptonal-deep-market-analysis.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section id="analysis-engine" className="mx-auto max-w-7xl px-4 py-20 sm:px-5">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur sm:p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            Intelligence Engine
          </p>

          <h2 className="mt-4 text-3xl font-black">
            Deep Crypto Analysis Engine
          </h2>

          <p className="mt-4 leading-8 text-slate-300">
            Generate a deeper market read covering cycles, Bitcoin dominance, risk management, altcoin rotation, and a plain-English “So what?” takeaway.
          </p>

          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Analysis Focus
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {modes.map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                    mode === item
                      ? "border-emerald-400 bg-emerald-400 text-slate-950"
                      : "border-white/10 bg-slate-950 text-slate-300 hover:border-emerald-400/40"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              "Market cycle context",
              "Bitcoin dominance read",
              "Risk management summary",
              "So what? explanation",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300"
              >
                ✓ {item}
              </div>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Deep Analysis"}
          </button>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-2xl backdrop-blur sm:p-6">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Deep Market Read
            </span>
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              So What? Included
            </span>
            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
              Risk Aware
            </span>
          </div>

          <h2 className="text-3xl font-black">Generated Intelligence Brief</h2>

          <div className="mt-6 min-h-[420px] rounded-2xl border border-white/10 bg-slate-950 p-4">
            <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
              {analysis ||
                "Choose an analysis focus and generate a deeper Kryptonal market brief."}
            </pre>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={copyAnalysis}
              disabled={!analysis}
              className="rounded-xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15 disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy Analysis"}
            </button>

            <button
              onClick={downloadTxt}
              disabled={!analysis}
              className="rounded-xl border border-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              Download TXT
            </button>
          </div>

          <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
            Educational content only. Not financial advice. Always verify important financial information independently.
          </p>
        </div>
      </div>
    </section>
  );
}