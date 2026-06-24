"use client";

import { useState } from "react";

type Result = {
  riskScore: number;
  level: "Low" | "Medium" | "High" | "Critical";
  redFlags: string[];
  positiveSigns: string[];
  recommendations: string[];
  summary: string;
};

const fallback = {
  badge: "Crypto Security Tool",
  title: "Crypto Scam Risk Checker",
  descriptionLong:
    "Check crypto projects, websites, wallet addresses, and tokens for common scam warning signs before making research decisions.",
  inputLabel:
    "Enter a project name, website URL, wallet address, or token contract",
  placeholder: "Example: https://example.com, 0x..., or project name",
  button: "Check Risk",
  checking: "Checking...",
  resultTitle: "Risk Analysis Result",
  riskScore: "Risk Score",
  redFlags: "Red Flags",
  positiveSigns: "Positive Signs",
  recommendations: "Safety Recommendations",
  disclaimer:
    "This tool is for educational purposes only. It does not guarantee that a project is safe or unsafe.",
  error: "Unable to check this input. Please try again.",
  faqTitle: "Crypto Scam Risk Checker FAQ",
  faq1Q: "How to check crypto scam?",
  faq1A:
    "You can check a crypto scam by reviewing the project website, token contract, liquidity, team transparency, social activity, and security audits.",
  faq2Q: "What is the current crypto scam?",
  faq2A:
    "Common crypto scams include fake investment platforms, phishing websites, fake token launches, rug pulls, giveaway scams, and fraudulent recovery services.",
  faq3Q: "Can you get your money back if you get scammed on crypto?",
  faq3A:
    "Recovering crypto after a scam is difficult because blockchain transactions are usually irreversible. Victims should report quickly and collect transaction records.",
  faq4Q: "How can I verify a scammer?",
  faq4A:
    "You can verify potential scammers by checking wallet addresses, website domains, social profiles, project documents, and community warnings.",
};

export default function CryptoScamRiskChecker({ t }: { t: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.cryptoScamRiskChecker || {}),
  };

  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkRisk() {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/crypto-scam-risk-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed");
      }

      setResult(json);
    } catch {
      setError(copy.error);
    } finally {
      setLoading(false);
    }
  }

  const faqs = [
    [copy.faq1Q, copy.faq1A],
    [copy.faq2Q, copy.faq2A],
    [copy.faq3Q, copy.faq3A],
    [copy.faq4Q, copy.faq4A],
  ];

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur md:p-10">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            {copy.badge}
          </p>

          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {copy.descriptionLong}
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <label className="text-sm font-semibold text-slate-200">
              {copy.inputLabel}
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.placeholder}
              className="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            />

            <button
              onClick={checkRisk}
              disabled={loading || !input.trim()}
              className="mt-4 w-full rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              {loading ? copy.checking : copy.button}
            </button>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          {result && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm text-slate-400">{copy.resultTitle}</p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {result.level}
                </h2>
                <p className="mt-2 text-slate-300">{result.summary}</p>

                <div className="mt-5">
                  <p className="text-sm text-slate-400">{copy.riskScore}</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-300"
                      style={{
                        width: `${Math.min(result.riskScore, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xl font-black text-white">
                    {result.riskScore}/100
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <h3 className="font-black text-white">{copy.redFlags}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.redFlags.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <h3 className="font-black text-white">{copy.positiveSigns}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.positiveSigns.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <h3 className="font-black text-white">
                  {copy.recommendations}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.recommendations.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <p className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            {copy.disclaimer}
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">{copy.faqTitle}</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map(([question, answer], index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"
              >
                <h3 className="font-bold text-white">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
