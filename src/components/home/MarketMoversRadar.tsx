"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  locale: string;
  t: any;
};

type MoverEntity = {
  id: string;
  name: string;
  role: string;
  impactScore: number;
  latestStatement: string;
  timeAgo: string;
  sentiment: "bullish" | "bearish" | "neutral";
  assetAffected: string;
};

const DEFAULT_MOVERS: MoverEntity[] = [
  {
    id: "fed",
    name: "Federal Reserve (Kevin Warsh)",
    role: "US Monetary Policy & Liquidity",
    impactScore: 98,
    latestStatement:
      "Monetary policy stance remains data-dependent amidst labor and inflation telemetry.",
    timeAgo: "Live Macro Track",
    sentiment: "neutral",
    assetAffected: "All Markets / BTC",
  },
  {
    id: "saylor",
    name: "Michael Saylor (MicroStrategy)",
    role: "Corporate Treasury Bitcoin Accumulation",
    impactScore: 95,
    latestStatement:
      "Continuing long-term debt-financed corporate Bitcoin treasury expansion strategies.",
    timeAgo: "Treasury Monitor",
    sentiment: "bullish",
    assetAffected: "BTC",
  },
  {
    id: "elon",
    name: "Elon Musk (X / Tesla)",
    role: "Retail Social Momentum & Meme Ecosystems",
    impactScore: 92,
    latestStatement:
      "Platform payment integration features and open-source decentralized discussions.",
    timeAgo: "Social Radar",
    sentiment: "bullish",
    assetAffected: "DOGE / Memes",
  },
  {
    id: "blackrock",
    name: "BlackRock (Larry Fink)",
    role: "Spot ETF Inflows & Institutional Allocations",
    impactScore: 89,
    latestStatement:
      "Sustained global institutional appetite and digital asset adoption in traditional wealth portfolios.",
    timeAgo: "ETF Radar",
    sentiment: "bullish",
    assetAffected: "BTC / ETH",
  },
  {
    id: "sec",
    name: "SEC & Global Regulators",
    role: "Regulatory Enforcement & Framework Approvals",
    impactScore: 85,
    latestStatement:
      "Reviewing multi-asset index funds and staking frameworks for registered investment products.",
    timeAgo: "Regulatory Wire",
    sentiment: "neutral",
    assetAffected: "Altcoins / DeFi",
  },
];

function label(t: any, key: string, fallback: string) {
  return t?.marketCap?.movers?.[key] || fallback;
}

export default function MarketMoversRadar({ locale, t }: Props) {
  const [movers, setMovers] = useState<MoverEntity[]>(DEFAULT_MOVERS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/trending?locale=${locale}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();

        if (
          isMounted &&
          json.movers &&
          Array.isArray(json.movers) &&
          json.movers.length > 0
        ) {
          setMovers(json.movers);
          setIsLive(true);
        }
      } catch (err) {
        console.error("Failed to load live trending movers:", err);
        if (isMounted) setIsLive(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    const timer = setInterval(loadData, 180000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [locale]);

  const getSentimentText = (sentiment: string) => {
    if (sentiment === "bullish")
      return label(t, "sentimentBullish", "Bullish Catalyst");
    if (sentiment === "bearish")
      return label(t, "sentimentBearish", "Bearish Headwind");
    return label(t, "sentimentNeutral", "Macro Neutral");
  };

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10">
      {/* Top Banner */}
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              {label(t, "badge", "Market Drivers & Catalyst Radar")}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span
                className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-amber-400" : isLive ? "bg-emerald-400" : "bg-slate-500"}`}
              />
              <span>
                {loading
                  ? label(t, "statusSyncing", "Syncing...")
                  : isLive
                    ? label(t, "statusLive", "Live Stream")
                    : label(t, "statusFallback", "Offline Mode")}
              </span>
            </div>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
            {label(
              t,
              "title",
              "Key Figures & Entities Shaping Market Momentum",
            )}
          </h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            {label(
              t,
              "description",
              "Track high-sensitivity news, public statements, and policy shifts influencing global liquidity.",
            )}
          </p>
        </div>

        <Link
          href={`/${locale}/trending`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.3)] transition hover:bg-emerald-300"
        >
          <span>{label(t, "exploreBtn", "Explore Trending News")}</span>
          <span>→</span>
        </Link>
      </div>

      {/* Grid of 5 Movers (Slidable on Mobile) */}
      <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {movers.map((mover, idx) => {
          const isBullish = mover.sentiment === "bullish";
          const isBearish = mover.sentiment === "bearish";

          const badgeStyles = isBullish
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            : isBearish
              ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
              : "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";

          return (
            <div
              key={mover.id || idx}
              className="flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.05] sm:w-auto"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-slate-500">
                    #0{idx + 1}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                    {label(t, "impact", "Impact")}: {mover.impactScore}/100
                  </span>
                </div>

                <h3 className="mt-3 text-base font-black text-white">
                  {mover.name}
                </h3>
                <p className="text-xs text-slate-400">{mover.role}</p>

                <div className="mt-4 rounded-2xl border border-white/5 bg-slate-950/60 p-3">
                  <p className="text-xs leading-5 text-slate-300">
                    "{mover.latestStatement}"
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {label(t, "affects", "Affects")}:
                  </span>
                  <span className="font-bold text-white">
                    {mover.assetAffected}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] text-slate-500">
                    {mover.timeAgo}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${badgeStyles}`}
                  >
                    {getSentimentText(mover.sentiment)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center sm:flex-row sm:text-left">
        <p className="text-xs text-slate-400">
          {label(
            t,
            "footerText",
            "News alerts and statements are continuously indexed to gauge real-time sentiment impact across major asset pairs.",
          )}
        </p>
        <Link
          href={`/${locale}/trending`}
          className="text-xs font-black text-emerald-400 underline underline-offset-4 transition hover:text-emerald-300"
        >
          {label(t, "footerLink", "View Full Feed on Trending Topics →")}
        </Link>
      </div>
    </div>
  );
}
