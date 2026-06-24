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

const fallback = {
  badge: "ETF Flow Intelligence",
  title: "Crypto ETF Tracker",
  descriptionLong:
    "Track Bitcoin ETF inflows, crypto ETF flow, ETF approval status, institutional demand, and the best cryptocurrency ETF list in one place.",
  sourceWarning:
    "ETF data can change quickly. Always verify official issuer and exchange data before making financial decisions.",
  dailyFlow: "Daily Net Flow",
  sevenDayFlow: "7D Net Flow",
  thirtyDayFlow: "30D Net Flow",
  approvedEtfs: "Approved ETFs",
  flowSignal: "ETF Flow Signal",
  leaderboard: "Best Cryptocurrency ETF List",
  approvalList: "ETF Approval Crypto List",
  bitcoinInflowsChart: "Bitcoin ETF Inflows Chart",
  sourceNote: "Source Note",
  signals: {
    strongAccumulation: "Strong Accumulation",
    accumulation: "Accumulation",
    neutral: "Neutral",
    distribution: "Distribution",
    heavyOutflows: "Heavy Outflows",
  },
  faqTitle: "Crypto ETF Tracker FAQ",
  faq1Q: "What is the best crypto ETF tracker?",
  faq1A:
    "A good crypto ETF tracker should monitor Bitcoin ETF inflows, crypto ETF flow, fund rankings, ETF approval status, and institutional demand.",
  faq2Q: "Can I track Bitcoin ETF inflows daily?",
  faq2A:
    "Yes. A Bitcoin ETF inflows tracker daily view helps investors monitor whether capital is entering or leaving Bitcoin ETF products.",
  faq3Q: "What is crypto ETF flow?",
  faq3A:
    "Crypto ETF flow measures money entering or leaving exchange-traded funds linked to crypto assets such as Bitcoin or Ethereum.",
  faq4Q: "What is crypto ETF approval?",
  faq4A:
    "Crypto ETF approval means a regulator has allowed an exchange-traded fund to list and trade under specific rules.",
  faq5Q: "What is the best cryptocurrency ETF list?",
  faq5A:
    "Popular cryptocurrency ETFs include BlackRock IBIT, Fidelity FBTC, ARKB, Bitwise BITB, VanEck HODL, and other regulated spot Bitcoin ETFs.",
};

function usdM(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}$${value.toLocaleString()}M`;
}

export default function CryptoEtfTracker({ t }: { t?: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.cryptoEtfTracker || {}),
    signals: {
      ...fallback.signals,
      ...(t?.tools?.cryptoEtfTracker?.signals || {}),
    },
  };

  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tools/crypto-etf-tracker", {
        cache: "no-store",
      });

      const json = await res.json();
      setData(json);
    }

    load();
  }, []);

  const signal = data?.signal || "neutral";
  const signalLabel =
    copy.signals?.[signal as keyof typeof copy.signals] || signal;

  const faqs = useMemo(
    () => [
      [copy.faq1Q, copy.faq1A],
      [copy.faq2Q, copy.faq2A],
      [copy.faq3Q, copy.faq3A],
      [copy.faq4Q, copy.faq4A],
      [copy.faq5Q, copy.faq5A],
    ],
    [copy],
  );

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

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {copy.descriptionLong}
          </p>

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
            ⚠️ {copy.sourceWarning}
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <Metric
            label={copy.dailyFlow}
            value={usdM(data?.metrics?.dailyNetFlowUsdM || 0)}
          />
          <Metric
            label={copy.sevenDayFlow}
            value={usdM(data?.metrics?.sevenDayNetFlowUsdM || 0)}
          />
          <Metric
            label={copy.thirtyDayFlow}
            value={usdM(data?.metrics?.thirtyDayNetFlowUsdM || 0)}
          />
          <Metric
            label={copy.approvedEtfs}
            value={String(data?.metrics?.approvedFunds || 0)}
          />
        </div>

        <div className="grid gap-6 p-4 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm font-black text-slate-300">
              {copy.flowSignal}
            </p>

            <h2 className="mt-3 text-4xl font-black text-emerald-300">
              {signalLabel}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              {copy.sourceNote}:{" "}
              {data?.sourceNote || "Loading ETF source note..."}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="text-2xl font-black">{copy.bitcoinInflowsChart}</h2>

            <div className="mt-5 space-y-4">
              {(data?.flows || []).map((flow) => {
                const width = Math.min(Math.abs(flow.netFlow) / 35, 100);

                return (
                  <div key={flow.date}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold">{flow.date}</span>
                      <span
                        className={
                          flow.netFlow >= 0
                            ? "text-emerald-300"
                            : "text-red-300"
                        }
                      >
                        {usdM(flow.netFlow)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={
                          flow.netFlow >= 0
                            ? "h-full rounded-full bg-emerald-400"
                            : "h-full rounded-full bg-red-400"
                        }
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

        <div className="grid gap-6 p-4 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-2">
          <Table title={copy.leaderboard} funds={data?.funds || []} />
          <Table title={copy.approvalList} funds={data?.funds || []} />
        </div>

        <div className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h2 className="text-3xl font-black">{copy.faqTitle}</h2>

            <div className="mt-6 grid gap-4">
              {faqs.map(([question, answer]) => (
                <article
                  key={question}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <h3 className="text-lg font-black">{question}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
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
