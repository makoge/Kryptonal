"use client";

import { useState } from "react";

const modes = ["all", "market", "stablecoins", "chains", "sectors", "leverage"] as const;

type Mode = (typeof modes)[number];

type Props = {
  t: any;
};

const fallback = {
  badge: "Intelligence Engine",
  title: "Deep Crypto Analysis Engine",
  description:
    "Generate a deeper market read covering cycles, Bitcoin dominance, risk management, altcoin rotation, and a plain-English “So what?” takeaway.",
  focusLabel: "Analysis Focus",
  generate: "Generate Deep Analysis",
  generating: "Generating...",
  outputTitle: "Generated Intelligence Brief",
  placeholder:
    "Choose an analysis focus and generate a deeper Kryptonal market brief.",
  copied: "Copied",
  copy: "Copy Analysis",
  download: "Download TXT",
  copyFailed: "Copy failed. Please select the text manually.",
  disclaimer:
    "Educational content only. Not financial advice. Always verify important financial information independently.",

  "modes": {
    "all": "Full Market Analysis",
    "market": "Market",
    "stablecoins": "Stablecoins",
    "chains": "Chains",
    "sectors": "Sectors",
    "leverage": "Leverage"
},
  checklist: [
    "Market cycle context",
    "Bitcoin dominance read",
    "Risk management summary",
    "So what? explanation",
  ],
  tags: ["Deep Market Read", "So What? Included", "Risk Aware"],
};

function tx(t: any, key: keyof typeof fallback) {
  return t?.analysis?.deepEngine?.[key] || fallback[key];
}

function modeLabel(t: any, mode: Mode) {
  return t?.analysis?.deepEngine?.modes?.[mode] || fallback.modes[mode];
}

export default function DeepAnalysisEngine({ t }: Props) {
  const [mode, setMode] = useState<Mode>("all");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const checklist =
    Array.isArray(t?.analysis?.deepEngine?.checklist) &&
    t.analysis.deepEngine.checklist.length
      ? t.analysis.deepEngine.checklist
      : fallback.checklist;

  const tags =
    Array.isArray(t?.analysis?.deepEngine?.tags) &&
    t.analysis.deepEngine.tags.length
      ? t.analysis.deepEngine.tags
      : fallback.tags;

  async function generate() {
  setLoading(true);
  setCopied(false);

  try {
    const res = await fetch("/api/analysis/engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });

    const json = await res.json();

    if (!res.ok) {
      setAnalysis("Analysis failed. Please try again.");
      return;
    }

  const generatedAt = new Date().toLocaleString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const text = [
  "Kryptonal Market Analysis",
  `Generated: ${generatedAt}`,
  "",
      ...(json.sections || []).flatMap((section: any, index: number) => [
        `${index + 1}. ${section.title}`,
        section.summary,
        "",
        `What is happening: ${section.what}`,
        "",
        `Why it matters: ${section.why}`,
        "",
        `Possible outcome: ${section.outcomes}`,
        "",
        `Takeaway: ${section.takeaway}`,
        "",
      ]),
      "Final View",
      json.conclusion,
      "",
      t.analysisTool.disclaimer,
    ].join("\n");

    setAnalysis(text);
  } catch {
    setAnalysis("Analysis failed. Please try again.");
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
      alert(tx(t, "copyFailed"));
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
    <section
      id="analysis-engine"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20"
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
            {tx(t, "badge")}
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {tx(t, "title")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            {tx(t, "description")}
          </p>

          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 sm:text-sm">
              {tx(t, "focusLabel")}
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
                  {modeLabel(t, item)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {checklist.map((item: string) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-300"
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
            {loading ? tx(t, "generating") : tx(t, "generate")}
          </button>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-2xl backdrop-blur sm:p-6">
          <div className="mb-5 flex flex-wrap gap-2">
            {tags.map((tag: string, index: number) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  index === 1
                    ? "bg-cyan-400/10 text-cyan-300"
                    : index === 2
                    ? "bg-amber-400/10 text-amber-300"
                    : "bg-emerald-400/10 text-emerald-300"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            {tx(t, "outputTitle")}
          </h2>

          <div className="mt-6 min-h-[320px] rounded-2xl border border-white/10 bg-slate-950 p-4 sm:min-h-[420px]">
            <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
              {analysis || tx(t, "placeholder")}
            </pre>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={copyAnalysis}
              disabled={!analysis}
              className="rounded-xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15 disabled:opacity-40"
            >
              {copied ? tx(t, "copied") : tx(t, "copy")}
            </button>

            <button
              onClick={downloadTxt}
              disabled={!analysis}
              className="rounded-xl border border-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              {tx(t, "download")}
            </button>
          </div>

          <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
            {tx(t, "disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}