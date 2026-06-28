"use client";

import { useState } from "react";

type ValidationResult = {
  valid: boolean;
  network: string;
  family: string;
  addressType: string;
  confidence: string;
  compatibleNetworks: string[];
  warnings: string[];
  explorerUrl?: string;
  checksum?: string;
};

const fallback = {
  badge: "Wallet Safety Tool",
  title: "Crypto Address Validator",
  descriptionLong:
    "Check wallet address format, detect possible networks, review checksum status, and reduce transfer mistakes before sending crypto.",
  warning:
    "A valid address format does not guarantee ownership, safety, or the correct destination network. Always verify with the receiver.",
  inputLabel: "Paste wallet address",
  placeholder: "0x..., bc1..., T..., r..., addr1..., Solana address...",
  checking: "Checking...",
  button: "Validate Address",
  emptyResult: "Validation result will appear here.",
  status: "Status",
  validFormat: "Valid Format",
  invalidUnsupported: "Invalid / Unsupported",
  detectedNetwork: "Detected Network",
  addressType: "Address Type",
  confidence: "Confidence",
  checksum: "Checksum",
  notChecked: "not checked",
  compatibleNetworks: "Compatible Networks",
  noneDetected: "None detected",
  warnings: "Warnings",
  openExplorer: "Open Explorer",
};

export default function AddressValidator({ t }: { t?: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.addressValidator || {}),
  };

  const [address, setAddress] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function validate() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/address-validator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const json = await res.json();
      setResult(json.result || null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%)] p-6 sm:p-10">
          <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
            {copy.badge}
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {copy.descriptionLong}
          </p>

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
            ⚠️ {copy.warning}
          </div>
        </div>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <label className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              {copy.inputLabel}
            </label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={copy.placeholder}
              className="mt-4 min-h-40 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-300/50"
            />

            <button
              onClick={validate}
              disabled={loading || !address.trim()}
              className="mt-4 w-full rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? copy.checking : copy.button}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            {!result ? (
              <div className="flex h-full min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-slate-500">
                {copy.emptyResult}
              </div>
            ) : (
              <div>
                <div
                  className={`rounded-2xl border p-5 ${
                    result.valid
                      ? "border-emerald-300/20 bg-emerald-300/10"
                      : "border-red-300/20 bg-red-300/10"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-300">
                    {copy.status}
                  </p>
                  <h2 className="mt-2 text-3xl font-black">
                    {result.valid ? copy.validFormat : copy.invalidUnsupported}
                  </h2>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Info label={copy.detectedNetwork} value={result.network} />
                  <Info label={copy.addressType} value={result.addressType} />
                  <Info label={copy.confidence} value={result.confidence} />
                  <Info
                    label={copy.checksum}
                    value={result.checksum || copy.notChecked}
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-black text-slate-300">
                    {copy.compatibleNetworks}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.compatibleNetworks.length ? (
                      result.compatibleNetworks.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-200"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        {copy.noneDetected}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <p className="text-sm font-black text-amber-100">
                    {copy.warnings}
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-100">
                    {result.warnings.map((warning) => (
                      <li key={warning}>• {warning}</li>
                    ))}
                  </ul>
                </div>

                {result.explorerUrl && (
                  <a
                    href={result.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-4 font-black text-slate-950"
                  >
                    {copy.openExplorer}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
