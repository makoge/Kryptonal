import { NextResponse } from "next/server";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

export const revalidate = 60;

function pct(now: number, prev: number) {
  return prev > 0 ? ((now - prev) / prev) * 100 : 0;
}

function getRiskLevel(market: number, btc: number, tvl1d: number, stable1d: number) {
  let score = 0;

  if (market < -3) score += 35;
  else if (market < -1) score += 20;
  else if (market > 4) score += 18;

  if (tvl1d < -2) score += 25;
  else if (tvl1d < 0) score += 10;

  if (stable1d < -0.25) score += 20;
  if (btc > 58 && market < 0) score += 20;

  if (score >= 60) return "High";
  if (score >= 38) return "Elevated";
  if (score >= 20) return "Medium";
  return "Balanced";
}

function getTrendStrength(market: number, tvl7d: number, stable1d: number) {
  const score = market * 0.45 + tvl7d * 0.4 + stable1d * 0.15;

  if (score >= 2.5) return "Strong";
  if (score <= -1.5) return "Weak";
  return "Moderate";
}

function getMarketPhase(market: number, btc: number, eth: number, tvl7d: number, stable1d: number) {
  if (market <= -3 || tvl7d <= -4) return "Market Contraction";
  if (btc >= 58 && market < 1) return "Defensive Bitcoin Rotation";
  if (market > 2 && btc < 56 && eth > 10.5 && tvl7d > 0) return "Altcoin Expansion";
  if (market > 1 && btc >= 56) return "Bitcoin-Led Recovery";
  if (market >= 0 && stable1d > 0.15 && tvl7d > 0) return "Early Recovery";
  if (market > 0 && tvl7d > 1) return "Risk-On Rotation";

  return "Neutral Consolidation";
}

function getMarketHint(phase: string, risk: string) {
  if (phase === "Market Contraction") return "Protect capital and wait for stronger confirmation.";
  if (phase === "Defensive Bitcoin Rotation") return "Bitcoin is safer than most altcoins right now.";
  if (phase === "Altcoin Expansion") return "Altcoins may have momentum, but avoid chasing late pumps.";
  if (phase === "Bitcoin-Led Recovery") return "Bitcoin is leading; altcoins may follow later.";
  if (phase === "Early Recovery") return "Good time to research setups, not over-risk.";
  if (phase === "Risk-On Rotation") return "Momentum is improving, but position sizing still matters.";
  if (risk === "High") return "Risk is high; avoid emotional entries.";
  return "Market is mixed; wait for clearer confirmation.";
}

function getSummary(args: {
  phase: string;
  risk: string;
  trend: string;
  market: number;
  btc: number;
  tvl7d: number;
  stable1d: number;
}) {
  return `${args.phase}: total crypto market cap is ${args.market.toFixed(
    2
  )}% over 24h, Bitcoin dominance is ${args.btc.toFixed(
    2
  )}%, DeFi TVL is ${args.tvl7d.toFixed(
    2
  )}% over 7d, and stablecoin supply is ${args.stable1d.toFixed(
    2
  )}% over 24h. Risk is ${args.risk.toLowerCase()} and trend strength is ${args.trend.toLowerCase()}.`;
}

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

    const [globalRes, chainsRes, stableRes, tvlChartRes] = await Promise.all([
      fetch(`${COINGECKO_URL}/global`, { headers, next: { revalidate: 60 } }),
      fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 300 } }),
      fetch("https://stablecoins.llama.fi/stablecoins", { next: { revalidate: 300 } }),
      fetch("https://api.llama.fi/charts", { next: { revalidate: 300 } }),
    ]);

    if (!globalRes.ok) {
      return NextResponse.json({ error: "Global API failed" }, { status: 502 });
    }

    const globalJson = await globalRes.json();
    const chains = chainsRes.ok ? await chainsRes.json() : [];
    const stablecoins = stableRes.ok ? await stableRes.json() : null;
    const tvlChart = tvlChartRes.ok ? await tvlChartRes.json() : [];

    const global = globalJson.data;

    const totalMarketCap = Number(global?.total_market_cap?.usd || 0);
    const marketCapChange24h = Number(global?.market_cap_change_percentage_24h_usd || 0);
    const btcDominance = Number(global?.market_cap_percentage?.btc || 0);
    const ethDominance = Number(global?.market_cap_percentage?.eth || 0);

    const validChains = Array.isArray(chains) ? chains : [];
    const totalTvl = validChains.reduce(
      (sum: number, chain: any) => sum + Number(chain.tvl || 0),
      0
    );

    const history = Array.isArray(tvlChart) ? tvlChart : [];
    const latest = Number(history.at(-1)?.totalLiquidityUSD || totalTvl);
    const prev1d = Number(history.at(-2)?.totalLiquidityUSD || latest);
    const prev7d = Number(history.at(-8)?.totalLiquidityUSD || latest);

    const tvlChange1d = pct(latest, prev1d);
    const tvlChange7d = pct(latest, prev7d);

    const assets = Array.isArray(stablecoins?.peggedAssets)
      ? stablecoins.peggedAssets
      : [];

    const stableUsdAssets = assets.filter(
      (asset: any) => Number(asset?.circulating?.peggedUSD) > 0
    );

    const stableNow = stableUsdAssets.reduce(
      (sum: number, asset: any) => sum + Number(asset?.circulating?.peggedUSD || 0),
      0
    );

    const stablePrev1d = stableUsdAssets.reduce((sum: number, asset: any) => {
      const now = Number(asset?.circulating?.peggedUSD || 0);
      const change = Number(asset?.change_1d?.peggedUSD || asset?.change_1d || 0);
      const prev = Number(asset?.circulatingPrevDay?.peggedUSD) || now - change;
      return sum + Math.max(prev, 0);
    }, 0);

    const stableChange1d = pct(stableNow, stablePrev1d);

    const marketPhase = getMarketPhase(
      marketCapChange24h,
      btcDominance,
      ethDominance,
      tvlChange7d,
      stableChange1d
    );

    const riskLevel = getRiskLevel(
      marketCapChange24h,
      btcDominance,
      tvlChange1d,
      stableChange1d
    );

    const trendStrength = getTrendStrength(
      marketCapChange24h,
      tvlChange7d,
      stableChange1d
    );

    const riskScore =
  riskLevel === "High" ? 82 :
  riskLevel === "Elevated" ? 64 :
  riskLevel === "Medium" ? 45 :
  24;

const phaseScore =
  marketPhase === "Market Contraction" ? 18 :
  marketPhase === "Defensive Bitcoin Rotation" ? 32 :
  marketPhase === "Neutral Consolidation" ? 48 :
  marketPhase === "Early Recovery" ? 58 :
  marketPhase === "Bitcoin-Led Recovery" ? 68 :
  marketPhase === "Risk-On Rotation" ? 76 :
  marketPhase === "Altcoin Expansion" ? 86 :
  50;

    const marketHint = getMarketHint(marketPhase, riskLevel);

    const summary = getSummary({
      phase: marketPhase,
      risk: riskLevel,
      trend: trendStrength,
      market: marketCapChange24h,
      btc: btcDominance,
      tvl7d: tvlChange7d,
      stable1d: stableChange1d,
    });

    const btcDominanceChange24h =
  Number(global?.market_cap_percentage_24h_change?.btc || 0);

const ethDominanceChange24h =
  Number(global?.market_cap_percentage_24h_change?.eth || 0);

    return NextResponse.json({
      totalMarketCap,
      marketCapChange24h,
      btcDominance,
      ethDominance,
      totalTvl: latest,
      tvlChange1d,
      tvlChange7d,
      stableChange1d,
      marketPhase,
      riskLevel,
      trendStrength,
      riskScore,
      phaseScore,
      btcDominanceChange24h,
      ethDominanceChange24h,
      marketHint,
      summary,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        totalMarketCap: 0,
        marketCapChange24h: 0,
        btcDominance: 0,
        ethDominance: 0,
        totalTvl: 0,
        tvlChange1d: 0,
        tvlChange7d: 0,
        stableChange1d: 0,
        marketPhase: "Data Unavailable",
        riskLevel: "Balanced",
        trendStrength: "Moderate",
        marketHint: "Live market data is temporarily unavailable.",
        summary: "Market data is temporarily unavailable.",
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}