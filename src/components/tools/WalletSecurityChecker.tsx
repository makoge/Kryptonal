"use client";

import { useState } from "react";

type Network = {
  name: string;
  explorerUrl: string;
};

type Result = {
  score: number;
  level: string;
  walletType: string;
  networks: Network[];
  warnings: string[];
  strengths: string[];
  recommendations: string[];
};

export default function WalletSecurityChecker() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkWallet() {
    setLoading(true);
    setResult(null);
    setValid(null);

    const res = await fetch("/api/tools/wallet-security", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const json = await res.json();

    setValid(json.valid);
    setResult(json.result);
    setLoading(false);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%)] p-6 sm:p-10">
          <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
            Wallet Risk Tool
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Wallet Security Checker
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Analyze EVM wallet format, basic risk signals, compatible networks,
            and safety recommendations before interacting with a wallet.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
            ⚠️ This tool does not guarantee wallet safety. Always verify
            transaction history, approvals, and contract interactions.
          </div>
        </div>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <label className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              Wallet Address
            </label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paste 0x wallet address..."
              className="mt-4 min-h-36 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-300/50"
            />

            <button
              onClick={checkWallet}
              disabled={loading || !address.trim()}
              className="mt-4 w-full rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking Wallet..." : "Check Wallet Security"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            {!result ? (
              <div className="flex h-full min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-slate-500">
                Wallet security report will appear here.
              </div>
            ) : (
              <div>
                <div
                  className={`rounded-2xl border p-5 ${
                    valid
                      ? "border-emerald-300/20 bg-emerald-300/10"
                      : "border-red-300/20 bg-red-300/10"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-300">
                    Security Score
                  </p>
                  <h2 className="mt-2 text-5xl font-black">
                    {result.score}/100
                  </h2>
                  <p className="mt-2 text-lg font-bold">{result.level}</p>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Wallet Type
                  </p>
                  <p className="mt-2 font-black">{result.walletType}</p>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-black text-slate-300">
                    Compatible Networks
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.networks.map((network) => (
                      <a
                        key={network.name}
                        href={network.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-300/20"
                      >
                        {network.name}
                      </a>
                    ))}
                  </div>
                </div>

                <ReportList
                  title="Strengths"
                  items={result.strengths}
                  tone="good"
                />
                <ReportList
                  title="Warnings"
                  items={result.warnings}
                  tone="warn"
                />
                <ReportList
                  title="Recommendations"
                  items={result.recommendations}
                  tone="info"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn" | "info";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
      : tone === "warn"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

  if (!items.length) return null;

  return (
    <div className={`mt-5 rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-sm font-black">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
