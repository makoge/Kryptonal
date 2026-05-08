"use client";

import { useState } from "react";

type Props = {
  locale: string;
  t: any;
};

const years = ["2017", "2021", "2024", "current"];

export default function MarketAnalysis({ locale, t }: Props) {
  const [year, setYear] = useState("2021");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateAnalysis() {
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          year,
          locale
        })
      });

      const json = await res.json();

      if (json.analysis) {
        setAnalysis(json.analysis);
      }
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
    a.download = "cryptonal-market-analysis.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-2xl sm:p-6 md:p-8">
      <p className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-400">
        {t.analysisTool.badge}
      </p>

      <h2 className="text-2xl font-black sm:text-3xl">
        {t.analysisTool.title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
        {t.analysisTool.description}
      </p>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-300">
          {t.analysisTool.compareLabel}
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {years.map((item) => (
            <button
              key={item}
              onClick={() => setYear(item)}
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                year === item
                  ? "border-emerald-400 bg-emerald-400 text-slate-950"
                  : "border-white/10 bg-slate-950 text-slate-300 hover:border-emerald-400/50"
              }`}
            >
              {item === "current" ? t.analysisTool.current : item}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generateAnalysis}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
      >
        {loading ? t.analysisTool.generating : t.analysisTool.generate}
      </button>

      <div className="mt-6 min-h-64 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
          {analysis || t.analysisTool.placeholder}
        </pre>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          onClick={copyAnalysis}
          disabled={!analysis}
          className="rounded-xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15 disabled:opacity-40"
        >
          {copied ? t.analysisTool.copied : t.analysisTool.copy}
        </button>

        <button
          onClick={downloadTxt}
          disabled={!analysis}
          className="rounded-xl border border-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:opacity-40"
        >
          {t.analysisTool.download}
        </button>
      </div>

      <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
        {t.analysisTool.disclaimer}
      </p>
    </div>
  );
}