"use client";

import { useEffect, useState } from "react";

type Data = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
};

function formatCap(value: number) {
  return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
}

function getTrend(change: number) {
  if (change > 3) return "Strong";
  if (change > 0) return "Positive";
  if (change > -3) return "Weak";
  return "Bearish";
}

function getRisk(cap: number) {
  if (cap < 1_500_000_000_000) return "Lower";
  if (cap < 3_000_000_000_000) return "Moderate";
  return "High";
}

function getPhase(cap: number) {
  if (cap < 1_200_000_000_000) return "Accumulation";
  if (cap < 2_300_000_000_000) return "Early Expansion";
  if (cap < 3_000_000_000_000) return "Expansion";
  return "Late Cycle";
}

function MiniSparkline({ negative = false }: { negative?: boolean }) {
  const path = negative
    ? "M2 24 C10 10, 18 32, 26 20 S42 36, 52 24 S68 30, 78 36 S92 32, 98 40"
    : "M2 34 C10 26, 18 38, 26 24 S42 32, 52 18 S68 26, 78 14 S92 28, 98 20";

  return (
    <svg viewBox="0 0 100 50" className="mt-5 h-12 w-full">
      <path
        d={path}
        fill="none"
        stroke={negative ? "rgb(248 113 113)" : "rgb(52 211 153)"}
        strokeWidth="3"
        strokeLinecap="round"
        className="drop-shadow-[0_0_8px_rgba(52,211,153,0.45)]"
      />
    </svg>
  );
}

function RiskBar({ risk }: { risk: string }) {
  const score = risk === "High" ? 78 : risk === "Moderate" ? 52 : 25;

  return (
    <div className="mt-5">
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="w-1/3 bg-emerald-400" />
        <div className="w-1/3 bg-yellow-400" />
        <div className="w-1/3 bg-red-400" />
      </div>
      <div className="relative mt-1 h-3">
        <span
          className="absolute top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-white"
          style={{ left: `${score}%` }}
        />
      </div>
    </div>
  );
}

function PhaseBar({ phase }: { phase: string }) {
  const score =
    phase === "Accumulation"
      ? 18
      : phase === "Early Expansion"
      ? 38
      : phase === "Expansion"
      ? 58
      : 82;

  return (
    <div className="mt-5">
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-emerald-400"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="relative mt-1 h-3">
        <span
          className="absolute top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-300"
          style={{ left: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function LiveSignals({ t }: any) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/crypto/market-cap", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();

        setData({
          totalMarketCap: json.totalMarketCap,
          marketCapChange24h: json.marketCapChange24h,
          btcDominance: json.btcDominance,
          ethDominance: json.ethDominance,
        });
      } catch {
        // silent fail
      }
    }

    load();
    const interval = window.setInterval(load, 60000);
    return () => window.clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <section className="border-y border-white/10 bg-slate-900/40 px-4 py-10 sm:px-5">
        <div className="mx-auto max-w-7xl text-slate-400">
          {t.common.loading}
        </div>
      </section>
    );
  }

  const phase = getPhase(data.totalMarketCap);
  const risk = getRisk(data.totalMarketCap);
  const changePositive = data.marketCapChange24h >= 0;

  const cards = [
    {
      icon: "$",
      label: "Market Cap",
      value: formatCap(data.totalMarketCap),
      note: "Live crypto valuation",
      footer: "24h Change",
      footerValue: `${data.marketCapChange24h.toFixed(2)}%`,
      negative: !changePositive,
      type: "sparkline",
    },
    {
      icon: "〽",
      label: "24h Trend",
      value: `${data.marketCapChange24h.toFixed(2)}%`,
      note: "Market momentum",
      footer: "Trend Strength",
      footerValue: getTrend(data.marketCapChange24h),
      negative: !changePositive,
      type: "sparkline",
    },
    {
      icon: "₿",
      label: "BTC Dominance",
      value: `${data.btcDominance.toFixed(2)}%`,
      note: "Bitcoin market influence",
      footer: "Change (24h)",
      footerValue: changePositive ? "+0.31%" : "-0.31%",
      negative: false,
      type: "sparkline",
    },
    {
      icon: "◆",
      label: "ETH Dominance",
      value: `${data.ethDominance.toFixed(2)}%`,
      note: "Ethereum market share",
      footer: "Change (24h)",
      footerValue: changePositive ? "+0.12%" : "-0.12%",
      negative: false,
      type: "sparkline",
    },
    {
      icon: "↻",
      label: "Market Phase",
      value: phase,
      note: "Cycle positioning",
      footer: "Phase Strength",
      footerValue: phase === "Expansion" ? "Moderate" : "Watch",
      type: "phase",
    },
    {
      icon: "🛡",
      label: "Risk Level",
      value: risk,
      note: "Current market conditions",
      footer: "Risk Score",
      footerValue: risk === "High" ? "78/100" : risk === "Moderate" ? "52/100" : "25/100",
      type: "risk",
    },
  ];

  return (
    <section className="border-y border-white/10 bg-slate-900/40 px-4 py-12 sm:px-5">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur transition hover:border-emerald-400/30 hover:bg-white/[0.075]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-lg font-black text-emerald-300">
                {card.icon}
              </span>
              <p className="text-sm font-semibold text-slate-300">{card.label}</p>
            </div>

            <p className="mt-5 text-3xl font-black tracking-tight text-white">
              {card.value}
            </p>

            <p className="mt-2 text-sm font-bold text-emerald-400">
              {card.note}
            </p>

            {card.type === "sparkline" && (
              <MiniSparkline negative={card.negative} />
            )}

            {card.type === "phase" && <PhaseBar phase={phase} />}
            {card.type === "risk" && <RiskBar risk={risk} />}

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-slate-400">{card.footer}</span>
              <span
                className={`font-black ${
                  card.negative ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {card.footerValue}
              </span>
            </div>
          </div>
        ))}
      </div>

      
    </section>
  );
}