import { NextResponse } from "next/server";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

export const revalidate = 60;

function buildFallbackChart(totalMarketCap: number, change24h: number) {
  const start = totalMarketCap / (1 + change24h / 100);

  return Array.from({ length: 12 }, (_, i) => {
    const progress = i / 11;
    const value = start + (totalMarketCap - start) * progress;

    return {
      time: Date.now() - (11 - i) * 2 * 60 * 60 * 1000,
      value,
    };
  });
}

function getMarketPhase({
  marketCapChange24h,
  btcDominance,
  ethDominance,
  tvlChange7d,
  stableChange1d,
}: {
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  tvlChange7d: number;
  stableChange1d: number;
}) {
  if (marketCapChange24h > 3 && btcDominance < 54 && tvlChange7d > 1) {
    return "Altcoin Expansion";
  }

  if (marketCapChange24h > 1 && btcDominance >= 58) {
    return "Bitcoin-Led Recovery";
  }

  if (marketCapChange24h < 0 && btcDominance >= 58) {
    return "Defensive Bitcoin Rotation";
  }

  if (marketCapChange24h < -3 || tvlChange7d < -3) {
    return "Market Contraction";
  }

  if (stableChange1d > 0.5 && marketCapChange24h >= 0) {
    return "Early Recovery";
  }

  if (ethDominance > 11 && btcDominance < 56) {
    return "Risk-On Rotation";
  }

  return "Neutral Consolidation";
}

function getRiskLevel({
  marketCapChange24h,
  btcDominance,
  tvlChange1d,
}: {
  marketCapChange24h: number;
  btcDominance: number;
  tvlChange1d: number;
}) {
  if (marketCapChange24h < -3 || tvlChange1d < -2) return "High";
  if (btcDominance >= 58 && marketCapChange24h < 0) return "Elevated";
  if (marketCapChange24h > 3) return "Medium";
  return "Balanced";
}

function getTrendStrength({
  marketCapChange24h,
  tvlChange7d,
  stableChange1d,
}: {
  marketCapChange24h: number;
  tvlChange7d: number;
  stableChange1d: number;
}) {
  const score =
    marketCapChange24h * 0.5 + tvlChange7d * 0.35 + stableChange1d * 0.15;

  if (score > 2.5) return "Strong";
  if (score < -1.5) return "Weak";
  return "Moderate";
}

function getPlainSummary({
  marketCapChange24h,
  btcDominance,
  ethDominance,
  marketPhase,
  riskLevel,
  trendStrength,
}: {
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  marketPhase: string;
  riskLevel: string;
  trendStrength: string;
}) {
  if (marketPhase === "Defensive Bitcoin Rotation") {
    return `The market is down ${Math.abs(
      marketCapChange24h
    ).toFixed(
      2
    )}% while Bitcoin dominance is high at ${btcDominance.toFixed(
      2
    )}%. This means capital is defensive and traders are favoring Bitcoin over altcoins. Risk is ${riskLevel.toLowerCase()} and trend strength is ${trendStrength.toLowerCase()}.`;
  }

  if (marketPhase === "Altcoin Expansion") {
    return `The market is rising while Bitcoin dominance is easing. This suggests risk appetite is improving and altcoins may be gaining strength. Risk is ${riskLevel.toLowerCase()} and trend strength is ${trendStrength.toLowerCase()}.`;
  }

  if (marketPhase === "Market Contraction") {
    return `The broader market is contracting. Market cap and DeFi activity are weakening, so users should treat this as a higher-risk environment.`;
  }

  return `The market is mixed. Total market cap, Bitcoin dominance, Ethereum dominance, DeFi TVL, and stablecoin flows are not giving a strong one-sided signal yet.`;
}

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [globalRes, chainsRes, stableRes, tvlChartRes] = await Promise.all([
      fetch(`${COINGECKO_URL}/global`, {
        headers,
        next: { revalidate: 60 },
      }),
      fetch("https://api.llama.fi/v2/chains", {
        next: { revalidate: 300 },
      }),
      fetch("https://stablecoins.llama.fi/stablecoins", {
        next: { revalidate: 300 },
      }),
      fetch("https://api.llama.fi/charts", {
  next: { revalidate: 300 },
}),
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
    const marketCapChange24h = Number(
      global?.market_cap_change_percentage_24h_usd || 0
    );
    const btcDominance = Number(global?.market_cap_percentage?.btc || 0);
    const ethDominance = Number(global?.market_cap_percentage?.eth || 0);

    const validChains = Array.isArray(chains) ? chains : [];

    const topChains = validChains
  .filter((chain: any) => Number(chain.tvl) > 100_000_000)
  .filter((chain: any) => Number.isFinite(Number(chain.change_1d)))
  .filter((chain: any) => Number.isFinite(Number(chain.change_7d)));

const totalTvl = topChains.reduce(
  (sum: number, chain: any) => sum + Number(chain.tvl || 0),
  0
);

const tvlHistory = Array.isArray(tvlChart) ? tvlChart : [];

const latestTvlPoint = tvlHistory[tvlHistory.length - 1];
const oneDayAgoPoint = tvlHistory[tvlHistory.length - 2];
const sevenDaysAgoPoint = tvlHistory[tvlHistory.length - 8];

const latestTvl = Number(latestTvlPoint?.totalLiquidityUSD || totalTvl);
const oneDayAgoTvl = Number(oneDayAgoPoint?.totalLiquidityUSD || latestTvl);
const sevenDaysAgoTvl = Number(sevenDaysAgoPoint?.totalLiquidityUSD || latestTvl);

const tvlChange1d =
  oneDayAgoTvl > 0 ? ((latestTvl - oneDayAgoTvl) / oneDayAgoTvl) * 100 : 0;

const tvlChange7d =
  sevenDaysAgoTvl > 0 ? ((latestTvl - sevenDaysAgoTvl) / sevenDaysAgoTvl) * 100 : 0;

const peggedAssets = Array.isArray(stablecoins?.peggedAssets)
  ? stablecoins.peggedAssets
  : [];

const stableUsdAssets = peggedAssets.filter(
  (asset: any) => Number(asset?.circulating?.peggedUSD) > 0
);

const stableNow = stableUsdAssets.reduce(
  (sum: number, asset: any) =>
    sum + Number(asset?.circulating?.peggedUSD || 0),
  0
);

const stablePrev1d = stableUsdAssets.reduce((sum: number, asset: any) => {
  const prev =
    Number(asset?.circulatingPrevDay?.peggedUSD) ||
    Number(asset?.circulatingPrevDay) ||
    Number(asset?.circulating?.peggedUSD || 0) -
      Number(asset?.change_1d?.peggedUSD || asset?.change_1d || 0);

  return sum + Math.max(prev, 0);
}, 0);

const stableChange1d =
  stablePrev1d > 0
    ? ((stableNow - stablePrev1d) / stablePrev1d) * 100
    : 0;

   
    
    const marketPhase = getMarketPhase({
      marketCapChange24h,
      btcDominance,
      ethDominance,
      tvlChange7d,
      stableChange1d,
    });

    const riskLevel = getRiskLevel({
      marketCapChange24h,
      btcDominance,
      tvlChange1d,
    });

    const trendStrength = getTrendStrength({
      marketCapChange24h,
      tvlChange7d,
      stableChange1d,
    });

    const summary = getPlainSummary({
      marketCapChange24h,
      btcDominance,
      ethDominance,
      marketPhase,
      riskLevel,
      trendStrength,
    });

    let chart = buildFallbackChart(totalMarketCap, marketCapChange24h);

    return NextResponse.json({
      totalMarketCap,
      marketCapChange24h,
      btcDominance,
      ethDominance,
      totalTvl,
      tvlChange1d,
      tvlChange7d,
      stableChange1d,
      marketPhase,
      riskLevel,
      trendStrength,
      summary,
      chart,
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
        marketPhase: "Neutral Consolidation",
        riskLevel: "Balanced",
        trendStrength: "Moderate",
        summary: "Market data is temporarily unavailable.",
        chart: [],
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}