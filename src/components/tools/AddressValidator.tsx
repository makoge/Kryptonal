"use client";

import { useState } from "react";

interface AddressValidatorProps {
  t: any;
  defaultNetwork?: string;
}

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

export default function AddressValidator({
  t,
  defaultNetwork,
}: AddressValidatorProps) {
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
      <div
        data-network={defaultNetwork || "auto"}
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)]"
      >
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

          {/* Social Share Bar */}
          <AddressShareBar result={result} inputAddress={address} />

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

                {result.warnings?.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                    <p className="text-sm font-black text-amber-100">
                      {copy.warnings}
                    </p>

                    <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-100">
                      {result.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.explorerUrl && (
                  <a
                    href={result.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-4 font-black text-slate-950 transition hover:bg-slate-200"
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

function AddressShareBar({
  result,
  inputAddress,
}: {
  result: ValidationResult | null;
  inputAddress: string;
}) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () =>
    typeof window !== "undefined"
      ? window.location.href
      : "https://kryptonal.com/tools/address-validator";

  const truncated =
    inputAddress.length > 16
      ? `${inputAddress.slice(0, 6)}...${inputAddress.slice(-6)}`
      : inputAddress;

  // Viral/Educational copy depending on whether a result exists
  const shareText = result
    ? `🛡️ Crypto Address Verification Result:\n\n• Address: ${truncated}\n• Status: ${
        result.valid ? "✅ VALID FORMAT" : "❌ INVALID / UNSUPPORTED"
      }\n• Network: ${result.network}\n• Type: ${result.addressType}\n\nValidate wallet addresses and verify checksums before sending crypto:`
    : `🛡️ Never lose crypto to a bad address! Verify wallet network formats, checksums, and EVM compatibility before sending:`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppShare = () => {
    const text = `${shareText} ${getShareUrl()}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${getShareUrl()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {/* Twitter / X */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/10"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/20"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.17 8.17 0 0 1-5.82 2.41h-.01c-1.42 0-2.82-.38-4.04-1.1l-.29-.17-3.11.82.83-3.03-.19-.31a8.177 8.177 0 0 1-1.25-4.46c0-4.54 3.7-8.24 8.25-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29" />
        </svg>
        WhatsApp
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10"
      >
        {copied ? "✓ Copied to Clipboard" : "🔗 Copy Share Link"}
      </button>
    </div>
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
