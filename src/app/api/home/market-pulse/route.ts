import { NextResponse } from "next/server";

export const revalidate = 300;

const NEXT_HALVING_BLOCK = 1_050_000;
const BLOCKS_PER_DAY = 144;

function compactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function pct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function changePct(now: number, previous: number) {
  return previous > 0 ? ((now - previous) / previous) * 100 : 0;
}

function getStableTotal(point: any) {
  return Number(
    point?.totalCirculatingUSD?.peggedUSD ||
      point?.totalCirculating?.peggedUSD ||
      0
  );
}

function getMarketPhase(score: number) {
  if (score >= 2.5) return "expansion";
  if (score >= 1) return "recovery";
  if (score > -0.75) return "consolidation";
  if (score > -2) return "distribution";
  return "riskOff";
}

function getRiskLevel(score: number) {
  if (score <= -2) return "high";
  if (score <= -0.75) return "elevated";
  if (score >= 2.5) return "medium";
  return "balanced";
}

function getTrendStrength(score: number) {
  if (score >= 2.5) return "strong";
  if (score >= 1) return "improving";
  if (score > -0.75) return "moderate";
  return "weak";
}

function getTone(value: number) {
  if (value > 0.3) return "green";
  if (value < -0.3) return "red";
  return "amber";
}

export async function GET() {
  try {
    const [globalRes, tvlChartRes, stableChartRes, blockRes] =
      await Promise.all([
        fetch("https://api.coingecko.com/api/v3/global", {
          next: { revalidate: 300 },
          headers: process.env.COINGECKO_API_KEY
            ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
            : {},
        }),
        fetch("https://api.llama.fi/charts", {
          next: { revalidate: 300 },
        }),
        fetch("https://stablecoins.llama.fi/stablecoincharts/all", {
          next: { revalidate: 300 },
        }),
        fetch("https://mempool.space/api/blocks/tip/height", {
          next: { revalidate: 300 },
        }),
      ]);

    if (!globalRes.ok || !tvlChartRes.ok || !stableChartRes.ok || !blockRes.ok) {
      throw new Error("Market pulse fetch failed");
    }

    const globalJson = await globalRes.json();
    const tvlChart = await tvlChartRes.json();
    const stableChart = await stableChartRes.json();
    const blockHeight = Number(await blockRes.text());

    const global = globalJson.data;

    const totalMarketCap = Number(global?.total_market_cap?.usd || 0);
    const marketCapChange24h = Number(
      global?.market_cap_change_percentage_24h_usd || 0
    );

    const btcDominance = Number(global?.market_cap_percentage?.btc || 0);
    const ethDominance = Number(global?.market_cap_percentage?.eth || 0);

    const latestTvl = tvlChart.at(-1);
    const prevTvl1d = tvlChart.at(-2);
    const prevTvl7d = tvlChart.at(-8);

    const totalTvl = Number(latestTvl?.totalLiquidityUSD || 0);
    const tvlChange1d = changePct(
      totalTvl,
      Number(prevTvl1d?.totalLiquidityUSD || 0)
    );
    const tvlChange7d = changePct(
      totalTvl,
      Number(prevTvl7d?.totalLiquidityUSD || 0)
    );

    const latestStable = stableChart.at(-1);
    const prevStable1d = stableChart.at(-2);

    const totalStablecoins = getStableTotal(latestStable);
    const stableChange1d = changePct(
      totalStablecoins,
      getStableTotal(prevStable1d)
    );

    const score =
      marketCapChange24h * 0.45 +
      tvlChange7d * 0.35 +
      stableChange1d * 0.2;

    const marketPhase = getMarketPhase(score);
    const riskLevel = getRiskLevel(score);
    const trendStrength = getTrendStrength(score);

    const blocksRemaining = Math.max(NEXT_HALVING_BLOCK - blockHeight, 0);
    const daysRemaining = Math.ceil(blocksRemaining / BLOCKS_PER_DAY);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),

      totalMarketCap: compactUsd(totalMarketCap),
      totalTvl: compactUsd(totalTvl),
      totalStablecoins: compactUsd(totalStablecoins),

      marketCapChange24h: pct(marketCapChange24h),
      tvlChange1d: pct(tvlChange1d),
      tvlChange7d: pct(tvlChange7d),
      stableChange1d: pct(stableChange1d),

      btcDominance: `${btcDominance.toFixed(2)}%`,
      ethDominance: `${ethDominance.toFixed(2)}%`,

      marketPhase,
      riskLevel,
      trendStrength,

      tones: {
        marketPhase: getTone(score),
        riskLevel:
          riskLevel === "high" || riskLevel === "elevated" ? "red" : "green",
        trendStrength:
          trendStrength === "strong" || trendStrength === "improving"
            ? "green"
            : trendStrength === "weak"
            ? "red"
            : "amber",
      },

      halving: {
        currentBlock: blockHeight,
        nextHalvingBlock: NEXT_HALVING_BLOCK,
        blocksRemaining,
        daysRemaining,
      },
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      marketPhase: "dataLoading",
      riskLevel: "balanced",
      trendStrength: "moderate",
      totalTvl: "Unavailable",
      tvlChange1d: "—",
      tvlChange7d: "—",
      stableChange1d: "—",
      tones: {
        marketPhase: "amber",
        riskLevel: "amber",
        trendStrength: "amber",
      },
      halving: {
        currentBlock: 0,
        nextHalvingBlock: NEXT_HALVING_BLOCK,
        blocksRemaining: 0,
        daysRemaining: 0,
      },
    });
  }
}