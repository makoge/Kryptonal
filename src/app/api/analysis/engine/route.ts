import { NextRequest, NextResponse } from "next/server";

type Mode = "all" | "market" | "stablecoins" | "chains" | "sectors" | "leverage";

function formatUsd(value: number) {
  if (!value) return "$0";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}

function formatPct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

async function safeFetch(origin: string, path: string) {
  try {
    const res = await fetch(`${origin}${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function makeMarketAnalysis(market: any) {
  if (!market) return null;

  return {
    title: "Market Overview",
    summary: `The crypto market is currently in a ${market.marketPhase} phase with ${market.riskLevel} risk.`,
    what: `Total market cap is ${formatUsd(market.totalMarketCap)}, with a 24h move of ${formatPct(market.marketCapChange24h)}. Bitcoin dominance is ${market.btcDominance?.toFixed(2)}% and Ethereum dominance is ${market.ethDominance?.toFixed(2)}%.`,
    why: market.summary,
    outcomes:
      market.marketCapChange24h > 0
        ? "If liquidity keeps improving, the market may continue rotating into stronger assets. If momentum fades, traders may return to Bitcoin or stablecoins."
        : "If weakness continues, capital may become defensive. Bitcoin dominance and stablecoin flows should be watched closely.",
    takeaway: market.marketHint,
  };
}

function makeStableAnalysis(stable: any) {
  if (!stable) return null;

  const topChain = stable.chains?.[0];

  return {
    title: "Stablecoin Liquidity",
    summary:
      stable.flowSignal === "entering"
        ? "Stablecoin liquidity is entering the market."
        : stable.flowSignal === "leaving"
          ? "Stablecoin liquidity is leaving the market."
          : "Stablecoin liquidity is mostly neutral.",
    what: `Total stablecoin liquidity is ${formatUsd(stable.totalStablecoins)}. The 7-day change is ${formatPct(stable.change7dPct)}. The largest stablecoin chain is ${topChain?.chain || "N/A"} with about ${topChain?.dominance?.toFixed(2) || "0"}% dominance.`,
    why:
      "Stablecoins matter because they are often the cash waiting to enter crypto trades. Rising stablecoin supply can support stronger market conditions, while falling supply can show capital leaving.",
    outcomes:
      stable.change7dPct > 0
        ? "If stablecoin liquidity keeps rising, the market has more fuel for future buying pressure."
        : "If stablecoin liquidity keeps falling, rallies may become weaker because less fresh capital is available.",
    takeaway:
      "This signal helps users understand whether crypto has fresh liquidity behind the move or if price is moving without strong capital support.",
  };
}

function makeChainAnalysis(chains: any) {
  if (!chains?.chains?.length) return null;

  const strongest = chains.chains[0];
  const weakest = chains.chains[chains.chains.length - 1];

  return {
    title: "Chain Strength",
    summary: `${strongest.name} is currently the strongest tracked ecosystem by Kryptonal’s chain score.`,
    what: `${strongest.name} has ${formatUsd(strongest.tvl)} TVL, ${strongest.protocols} protocols, ${formatPct(strongest.change7d)} 7D growth, and ${formatPct(strongest.change1m)} 1M growth.`,
    why:
      "Chain strength measures where liquidity, app activity, and ecosystem momentum are strongest. A chain with rising TVL and many protocols usually has healthier activity.",
    outcomes:
      strongest.change7d > 0
        ? `${strongest.name} may continue attracting attention if TVL and protocol activity keep growing.`
        : `Even the strongest chain needs caution if TVL momentum is slowing.`,
    takeaway: `${weakest.name} is currently weaker compared with the top chains, so users should avoid assuming every ecosystem is moving equally.`,
  };
}

function makeSectorAnalysis(sectors: any) {
  if (!sectors?.sectors?.length) return null;

  const top = sectors.sectors[0];
  const hot = sectors.sectors.find((s: any) => s.signal === "Hot" || s.signal === "hot");

  return {
    title: "Sector Rotation",
    summary: `${top.name} is currently leading the tracked crypto sectors.`,
    what: `${top.name} has ${formatUsd(top.tvl)} TVL, ${top.protocols} protocols, and ${formatPct(top.change7d)} 7D momentum.`,
    why:
      "Sector rotation shows where capital is moving inside crypto. When one sector gains TVL faster than others, it can show a growing narrative.",
    outcomes: hot
      ? `${hot.name} looks hot right now, but users should be careful because hot sectors can cool fast after crowded moves.`
      : "No sector looks extremely hot right now, so the market may be more selective than broad-based.",
    takeaway:
      "This helps users avoid chasing random coins and instead understand which crypto narratives are gaining or losing strength.",
  };
}

function makeLeverageAnalysis(leverage: any) {
  if (!leverage) return null;

  return {
    title: "Leverage Risk",
    summary: `Leverage risk is currently ${leverage.riskLevel}.`,
    what: `The leverage risk score is ${leverage.riskScore}/100. Average funding is ${formatPct(leverage.avgFundingRatePct)}, and total open interest is ${formatUsd(leverage.totalOpenInterestUsd)}.`,
    why:
      "Leverage matters because too many crowded futures positions can cause fast liquidations. High funding often means traders are leaning too heavily in one direction.",
    outcomes:
      leverage.riskLevel === "dangerous" || leverage.riskLevel === "heated"
        ? "If price moves against crowded traders, the market could see a sharp liquidation move."
        : "If leverage stays controlled, price moves may be healthier and less liquidation-driven.",
    takeaway:
      leverage.positionBias === "longCrowded"
        ? "Long traders are crowded, so upside can continue but downside liquidation risk is higher."
        : leverage.positionBias === "shortCrowded"
          ? "Short traders are crowded, so a short squeeze is possible if price rises."
          : "Positioning looks balanced, which is healthier for the market.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode: Mode = body.mode || "all";
    const origin = req.nextUrl.origin;

    const [market, stable, chains, sectors, leverage] = await Promise.all([
      safeFetch(origin, "/api/crypto/market-cap"),
      safeFetch(origin, "/api/analysis/stablecoins"),
      safeFetch(origin, "/api/analysis/chains"),
      safeFetch(origin, "/api/analysis/sectors"),
      safeFetch(origin, "/api/analysis/leverage-risk"),
    ]);

    const allSections = {
      market: makeMarketAnalysis(market),
      stablecoins: makeStableAnalysis(stable),
      chains: makeChainAnalysis(chains),
      sectors: makeSectorAnalysis(sectors),
      leverage: makeLeverageAnalysis(leverage),
    };

    const sections =
      mode === "all"
        ? Object.values(allSections).filter(Boolean)
        : [allSections[mode]].filter(Boolean);

    const conclusion =
      mode === "all"
        ? "Overall, the best market read comes from combining price, liquidity, chain strength, sector rotation, and leverage. A healthy market usually needs improving liquidity, strong chain activity, rising sectors, and controlled leverage."
        : "This signal should not be used alone. Strong analysis comes from comparing it with liquidity, market trend, chain strength, and leverage risk.";

    return NextResponse.json({
      mode,
      sections,
      conclusion,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}