"use client";

import { useState } from "react";

type Result = {
  tokenAddress: string;
  chainId: string;
  chainName: string;
  riskScore: number;
  level: string;
  isHoneypot: boolean | null;
  sellable: boolean | null;
  buyTax: string;
  sellTax: string;
  transferTax: string;
  tokenName: string;
  tokenSymbol: string;
  redFlags: string[];
  positiveSigns: string[];
  recommendations: string[];
  sourceNote: string;
};

const fallback = {
  badge: "Advanced Token Security Tool",
  title: "Honeypot Checker",
  descriptionLong:
    "Check if a token may be a honeypot by analyzing sellability, buy tax, sell tax, blacklist functions, mint risk, ownership, and token security signals.",
  tokenAddress: "Token Contract Address",
  placeholder: "Paste token contract address, for example 0x...",
  chain: "Blockchain Network",
  button: "Check Honeypot Risk",
  checking: "Checking...",
  resultTitle: "Honeypot Risk Result",
  riskScore: "Risk Score",
  sellable: "Sellable",
  buyTax: "Buy Tax",
  sellTax: "Sell Tax",
  transferTax: "Transfer Tax",
  token: "Token",
  redFlags: "Red Flags",
  positiveSigns: "Positive Signs",
  recommendations: "Safety Recommendations",
  yes: "Yes",
  no: "No",
  unknown: "Unknown",
  disclaimer:
    "Educational purposes only. Honeypot checks can return false positives or miss hidden risks. Always verify manually before interacting with a token.",
  error:
    "Unable to check this token. Please verify the contract address and chain.",
  faqTitle: "Honeypot Checker FAQ",
  faq1Q: "What is a honeypot token?",
  faq1A:
    "A honeypot token is a scam token that may allow users to buy but blocks or restricts selling, trapping buyers inside the contract.",
  faq2Q: "How does a honeypot checker work?",
  faq2A:
    "A honeypot checker reviews token sellability, buy and sell taxes, ownership permissions, blacklist functions, mint functions, and contract risk signals.",
  faq3Q: "Can a honeypot checker guarantee a token is safe?",
  faq3A:
    "No. A checker can highlight risk signals, but token contracts can contain hidden logic. Manual research is still required.",
  faq4Q: "Which chains does this checker support?",
  faq4A:
    "This version focuses on EVM chains such as Ethereum, BNB Chain, Base, Polygon, Arbitrum, Optimism, and Avalanche.",
};

const chains = [
  { id: "1", name: "Ethereum" },
  { id: "56", name: "BNB Chain" },
  { id: "8453", name: "Base" },
  { id: "137", name: "Polygon" },
  { id: "42161", name: "Arbitrum" },
  { id: "10", name: "Optimism" },
  { id: "43114", name: "Avalanche" },
];

export default function HoneypotChecker({ t }: { t: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.honeypotChecker || {}),
  };

  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState("1");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkToken() {
    if (!address.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/honeypot-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenAddress: address.trim(),
          chainId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-300">
                  {copy.tokenAddress}
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={copy.placeholder}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.chain}
                </label>
                <select
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                >
                  {chains.map((chain) => (
                    <option
                      key={chain.id}
                      value={chain.id}
                      className="bg-slate-950"
                    >
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={checkToken}
              disabled={loading || !address.trim()}
              className="mt-5 w-full rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
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

                <div className="mt-5">
                  <p className="text-sm text-slate-400">{copy.riskScore}</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-300"
                      style={{ width: `${Math.min(result.riskScore, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xl font-black text-white">
                    {result.riskScore}/100
                  </p>
                </div>

                <p className="mt-5 text-sm text-slate-400">{copy.token}</p>
                <p className="mt-1 font-bold text-white">
                  {result.tokenName || copy.unknown} (
                  {result.tokenSymbol || copy.unknown})
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {result.chainName} · {result.tokenAddress}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">{copy.sellable}</p>
                    <p className="mt-1 font-bold text-white">
                      {result.sellable === null
                        ? copy.unknown
                        : result.sellable
                          ? copy.yes
                          : copy.no}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Honeypot</p>
                    <p className="mt-1 font-bold text-white">
                      {result.isHoneypot === null
                        ? copy.unknown
                        : result.isHoneypot
                          ? copy.yes
                          : copy.no}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">{copy.buyTax}</p>
                    <p className="mt-1 font-bold text-white">{result.buyTax}</p>
                  </div>

                  <div>
                    <p className="text-slate-400">{copy.sellTax}</p>
                    <p className="mt-1 font-bold text-white">
                      {result.sellTax}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">{copy.transferTax}</p>
                    <p className="mt-1 font-bold text-white">
                      {result.transferTax}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs text-slate-500">
                  {result.sourceNote}
                </p>
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

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:col-span-2">
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
