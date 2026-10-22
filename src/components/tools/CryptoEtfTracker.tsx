"use client";

import { useEffect, useMemo, useState } from "react";

type Fund = {
  ticker: string;
  name: string;
  status: string;
  asset: string;
  issuer: string;
  category: string;
};

type Data = {
  updatedAt: string;
  sourceNote: string;
  signal: string;
  metrics: {
    dailyNetFlowUsdM: number;
    sevenDayNetFlowUsdM: number;
    thirtyDayNetFlowUsdM: number;
    approvedFunds: number;
  };
  flows: { date: string; netFlow: number }[];
  funds: Fund[];
};

function usdM(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}$${value.toLocaleString()}M`;
}

export default function CryptoEtfTracker({ t }: { t?: any }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tools/crypto-etf-tracker", {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load live data", err);
      }
    }
    load();
  }, []);

  const signal = data?.signal || "neutral";
  const dailyFlowText = usdM(data?.metrics?.dailyNetFlowUsdM || 0);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)]">
        {/* Header Hero */}
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%)] p-6 sm:p-10">
          <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
            ETF Flow Intelligence
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Crypto ETF Tracker
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Track Bitcoin ETF inflows, crypto ETF flow, ETF approval status,
            institutional demand, and the best cryptocurrency ETF list in one
            place.
          </p>

          {/* Social Share Bar */}
          <ShareBar dailyFlow={dailyFlowText} signal={signal} />

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
            ⚠️ ETF data can change quickly. Always verify official issuer and
            exchange data before making financial decisions.
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <Metric label="Daily Net Flow" value={dailyFlowText} />
          <Metric
            label="7D Net Flow"
            value={usdM(data?.metrics?.sevenDayNetFlowUsdM || 0)}
          />
          <Metric
            label="30D Net Flow"
            value={usdM(data?.metrics?.thirtyDayNetFlowUsdM || 0)}
          />
          <Metric
            label="Approved ETFs"
            value={String(data?.metrics?.approvedFunds || 0)}
          />
        </div>

        {/* Signal & Chart */}
        <div className="grid gap-6 p-4 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm font-black text-slate-300">ETF Flow Signal</p>
            <h2 className="mt-3 text-4xl font-black capitalize text-emerald-300">
              {signal}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Source Note: {data?.sourceNote || "Loading ETF source note..."}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="text-2xl font-black">Bitcoin ETF Inflows Chart</h2>
            <div className="mt-5 space-y-4">
              {(data?.flows || []).map((flow) => {
                const width = Math.min(Math.abs(flow.netFlow) / 35, 100);
                const isPositive = flow.netFlow >= 0;

                return (
                  <div key={flow.date}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold">{flow.date}</span>
                      <span
                        className={
                          isPositive ? "text-emerald-300" : "text-red-300"
                        }
                      >
                        {usdM(flow.netFlow)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          isPositive ? "bg-emerald-400" : "bg-red-400"
                        }`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {!data?.flows?.length && (
                <p className="text-sm text-slate-500">
                  Loading ETF flow data...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fund Tables */}
        <div className="grid gap-6 p-4 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-2">
          <Table
            title="Best Cryptocurrency ETF List"
            funds={data?.funds || []}
          />
          <Table title="ETF Approval Crypto List" funds={data?.funds || []} />
        </div>
      </div>
    </section>
  );
}

function ShareBar({
  dailyFlow,
  signal,
}: {
  dailyFlow: string;
  signal: string;
}) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () =>
    typeof window !== "undefined"
      ? window.location.href
      : "https://kryptonal.com/tools/crypto-etf-tracker";

  const shareText = `🚨 Spot Bitcoin ETF Flows Update:\n\n• Today's Net Flow: ${dailyFlow}\n• Institutional Signal: ${signal.toUpperCase()}\n\nTrack institutional Bitcoin & Ethereum ETF flows live:`;

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
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/10"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>

      <button
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/20"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.17 8.17 0 0 1-5.82 2.41h-.01c-1.42 0-2.82-.38-4.04-1.1l-.29-.17-3.11.82.83-3.03-.19-.31a8.177 8.177 0 0 1-1.25-4.46c0-4.54 3.7-8.24 8.25-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29" />
        </svg>
        WhatsApp
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10"
      >
        {copied ? "✓ Copied to Clipboard" : "🔗 Copy Share Link"}
      </button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}

function Table({ title, funds }: { title: string; funds: Fund[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-2xl font-black">{title}</h2>
      </div>

      <div className="divide-y divide-white/10">
        {funds.length ? (
          funds.map((fund) => (
            <div
              key={fund.ticker}
              className="grid gap-3 p-5 text-sm sm:grid-cols-[0.5fr_1.5fr_1fr]"
            >
              <div className="font-black text-emerald-300">{fund.ticker}</div>
              <div>
                <p className="font-bold">{fund.name}</p>
                <p className="mt-1 text-slate-500">{fund.category}</p>
              </div>
              <div className="text-slate-300">
                {fund.status} • {fund.asset}
              </div>
            </div>
          ))
        ) : (
          <p className="p-5 text-sm text-slate-500">Loading ETF list...</p>
        )}
      </div>
    </div>
  );
}
