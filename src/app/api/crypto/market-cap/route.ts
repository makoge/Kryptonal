import { NextResponse } from "next/server";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";
const COINLORE_GLOBAL_URL = "https://api.coinlore.net/api/global/";

// Cache across Vercel's global edge for 15 minutes (900 seconds)
// 900s = max ~2,880 calls/month (safely under CoinGecko's 10,000 limit)
export const revalidate = 900;

function pct(now: number, prev: number) {
  return prev > 0 ? ((now - prev) / prev) * 100 : 0;
}

function getRiskLevel(
  market: number,
  btc: number,
  tvl1d: number,
  stable1d: number,
) {
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

function getMarketPhase(
  market: number,
  btc: number,
  eth: number,
  tvl7d: number,
  stable1d: number,
) {
  const score =
    market * 0.45 +
    tvl7d * 0.3 +
    stable1d * 0.25 +
    (btc >= 58 && market < 0 ? -0.8 : 0) +
    (eth >= 11 && market > 0 ? 0.4 : 0);

  if (score >= 2.5) return "Expansion";
  if (score >= 1) return "Recovery";
  if (score > -0.75) return "Consolidation";
  if (score > -2) return "Distribution";
  return "Risk-Off";
}

function getMarketHint(phase: string, risk: string) {
  if (risk === "High") {
    return "Risk is elevated. Focus on capital preservation and avoid emotional decisions.";
  }
  if (phase === "Expansion") {
    return "Capital is flowing into the market and momentum is strengthening.";
  }
  if (phase === "Recovery") {
    return "Market conditions are improving, but confirmation is still important.";
  }
  if (phase === "Consolidation") {
    return "The market is moving sideways while investors wait for clearer direction.";
  }
  if (phase === "Distribution") {
    return "Profit-taking activity is increasing and momentum is weakening.";
  }
  if (phase === "Risk-Off") {
    return "Investors are becoming defensive and reducing exposure to risk assets.";
  }
  return "Market conditions are mixed. Wait for stronger confirmation before increasing risk.";
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
  return `${args.phase} conditions are currently in place. Total crypto market cap is ${args.market.toFixed(
    2,
  )}% over 24h, Bitcoin dominance is ${args.btc.toFixed(
    2,
  )}%, DeFi TVL is ${args.tvl7d.toFixed(
    2,
  )}% over 7d, and stablecoin supply is ${args.stable1d.toFixed(
    2,
  )}% over 24h. Risk is ${args.risk.toLowerCase()} and trend strength is ${args.trend.toLowerCase()}.`;
}

// Helper: Fetch CoinGecko first; if quota exceeded (429/401/error), fall back to CoinLore
async function fetchGlobalMarketData() {
  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

  try {
    const cgRes = await fetch(`${COINGECKO_URL}/global`, {
      headers,
      next: { revalidate: 900 },
    });

    if (cgRes.ok) {
      const cgJson = await cgRes.json();
      const global = cgJson?.data;
      if (global) {
        return {
          totalMarketCap: Number(global.total_market_cap?.usd || 0),
          marketCapChange24h: Number(
            global.market_cap_change_percentage_24h_usd || 0,
          ),
          btcDominance: Number(global.market_cap_percentage?.btc || 0),
          ethDominance: Number(global.market_cap_percentage?.eth || 0),
          btcDominanceChange24h: Number(
            global.market_cap_percentage_24h_change?.btc || 0,
          ),
          ethDominanceChange24h: Number(
            global.market_cap_percentage_24h_change?.eth || 0,
          ),
        };
      }
    }
  } catch {
    // Ignore CoinGecko error and proceed to fallback
  }

  // Fallback: CoinLore API (Free, no API key required)
  const loreRes = await fetch(COINLORE_GLOBAL_URL, {
    next: { revalidate: 300 },
  });

  if (!loreRes.ok) {
    throw new Error("Both primary and fallback global APIs failed");
  }

  const loreJson = await loreRes.json();
  const loreData = Array.isArray(loreJson) ? loreJson[0] : loreJson;

  return {
    totalMarketCap: Number(loreData?.total_mcap || 0),
    marketCapChange24h: Number(loreData?.mcap_change || 0),
    btcDominance: Number(loreData?.btc_d || 0),
    ethDominance: Number(loreData?.eth_d || 0),
    btcDominanceChange24h: 0,
    ethDominanceChange24h: 0,
  };
}

export async function GET() {
  try {
    const [globalData, chainsRes, stableRes, tvlChartRes] = await Promise.all([
      fetchGlobalMarketData(),
      fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 900 } }),
      fetch("https://stablecoins.llama.fi/stablecoins", {
        next: { revalidate: 900 },
      }),
      fetch("https://api.llama.fi/charts", { next: { revalidate: 900 } }),
    ]);

    const chains = chainsRes.ok ? await chainsRes.json() : [];
    const stablecoins = stableRes.ok ? await stableRes.json() : null;
    const tvlChart = tvlChartRes.ok ? await tvlChartRes.json() : [];

    const {
      totalMarketCap,
      marketCapChange24h,
      btcDominance,
      ethDominance,
      btcDominanceChange24h,
      ethDominanceChange24h,
    } = globalData;

    const validChains = Array.isArray(chains) ? chains : [];
    const totalTvl = validChains.reduce(
      (sum: number, chain: any) => sum + Number(chain.tvl || 0),
      0,
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
      (asset: any) => Number(asset?.circulating?.peggedUSD) > 0,
    );

    const stableNow = stableUsdAssets.reduce(
      (sum: number, asset: any) =>
        sum + Number(asset?.circulating?.peggedUSD || 0),
      0,
    );

    const stablePrev1d = stableUsdAssets.reduce((sum: number, asset: any) => {
      const now = Number(asset?.circulating?.peggedUSD || 0);
      const change = Number(
        asset?.change_1d?.peggedUSD || asset?.change_1d || 0,
      );
      const prev = Number(asset?.circulatingPrevDay?.peggedUSD) || now - change;

      return sum + Math.max(prev, 0);
    }, 0);

    const stableChange1d = pct(stableNow, stablePrev1d);

    const marketPhase = getMarketPhase(
      marketCapChange24h,
      btcDominance,
      ethDominance,
      tvlChange7d,
      stableChange1d,
    );

    const riskLevel = getRiskLevel(
      marketCapChange24h,
      btcDominance,
      tvlChange1d,
      stableChange1d,
    );

    const trendStrength = getTrendStrength(
      marketCapChange24h,
      tvlChange7d,
      stableChange1d,
    );

    const riskScore =
      riskLevel === "High"
        ? 82
        : riskLevel === "Elevated"
          ? 64
          : riskLevel === "Medium"
            ? 45
            : 24;

    const phaseScore =
      marketPhase === "Expansion"
        ? 86
        : marketPhase === "Recovery"
          ? 68
          : marketPhase === "Consolidation"
            ? 48
            : marketPhase === "Distribution"
              ? 32
              : marketPhase === "Risk-Off"
                ? 18
                : 50;

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

    const responseData = {
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
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
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
        riskScore: 24,
        phaseScore: 50,
        btcDominanceChange24h: 0,
        ethDominanceChange24h: 0,
        marketHint: "Live market data is temporarily unavailable.",
        summary: "Market data is temporarily unavailable.",
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
