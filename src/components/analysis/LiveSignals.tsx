import { headers } from "next/headers";

type Data = {
  totalMarketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  marketPhase: string;
  riskLevel: string;
  trendStrength: string;
  marketHint: string;
  riskScore?: number;
  phaseScore?: number;
  btcDominanceChange24h?: number;
  ethDominanceChange24h?: number;
};

function formatCap(value: number) {
  if (!value) return "$0";
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  return `$${(value / 1_000_000_000).toFixed(2)}B`;
}

function formatPct(value = 0) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}


async function getLiveSignals(): Promise<Data | null> {
  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) return null;

    const res = await fetch(`${protocol}://${host}/api/crypto/market-cap`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
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
      />
    </svg>
  );
}

function RiskBar({ score = 50 }: { score?: number }) {
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
          style={{ left: `${Math.min(Math.max(score, 5), 95)}%` }}
        />
      </div>
    </div>
  );
}

function PhaseBar({ score = 50 }: { score?: number }) {
  return (
    <div className="mt-5">
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-emerald-400"
          style={{ width: `${Math.min(Math.max(score, 5), 95)}%` }}
        />
      </div>
    </div>
  );
}

export default async function LiveSignals({ t }: any) {
  const data = await getLiveSignals();

  if (!data) {
    return (
      <section className="border-y border-white/10 bg-slate-900/40 px-4 py-10 sm:px-5">
        <div className="mx-auto max-w-7xl text-slate-400">
          {t.common.loading}
        </div>
      </section>
    );
  }

  const changePositive = data.marketCapChange24h >= 0;

  const cards = [
    {
      icon: "$",
      label: "Market Cap",
      value: formatCap(data.totalMarketCap),
      note: "Live crypto valuation",
      footer: "24h Change",
      footerValue: formatPct(data.marketCapChange24h),
      negative: !changePositive,
      type: "sparkline",
    },
    {
      icon: "〽",
      label: "24h Trend",
      value: formatPct(data.marketCapChange24h),
      note: "Market momentum",
      footer: "Trend Strength",
      footerValue: data.trendStrength,
      negative: !changePositive,
      type: "sparkline",
    },
    {
      icon: "₿",
      label: "BTC Dominance",
      value: `${data.btcDominance.toFixed(2)}%`,
      note: "Bitcoin market influence",
      footer: "24h Change",
      footerValue: formatPct(data.btcDominanceChange24h || 0),
      negative: false,
      type: "sparkline",
    },
    {
      icon: "◆",
      label: "ETH Dominance",
      value: `${data.ethDominance.toFixed(2)}%`,
      note: "Ethereum market share",
      footer: "24h Change",
      footerValue: formatPct(data.ethDominanceChange24h || 0),
      negative: false,
      type: "sparkline",
    },
    {
      icon: "↻",
      label: "Market Phase",
      value: data.marketPhase,
      note: data.marketHint,
      footer: "Phase Score",
      footerValue: `${data.phaseScore || 50}/100`,
      type: "phase",
    },
    {
      icon: "🛡",
      label: "Risk Level",
      value: data.riskLevel,
      note: "Live market risk model",
      footer: "Risk Score",
      footerValue: `${data.riskScore || 50}/100`,
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

            <p className="mt-5 text-2xl font-black tracking-tight text-white">
              {card.value}
            </p>

            <p className="mt-2 line-clamp-2 text-sm font-bold text-emerald-400">
              {card.note}
            </p>

            {card.type === "sparkline" && (
              <MiniSparkline negative={card.negative} />
            )}

            {card.type === "phase" && <PhaseBar score={data.phaseScore} />}
            {card.type === "risk" && <RiskBar score={data.riskScore} />}

            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{card.footer}</span>
              <span className="text-right font-black text-emerald-400">
                {card.footerValue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}