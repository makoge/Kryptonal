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

function getMarketPhase({
  marketCapChange24h,
  btcDominance,
  tvlChange7d,
  stableChange1d,
}: {
  marketCapChange24h: number;
  btcDominance: number;
  tvlChange7d: number;
  stableChange1d: number;
}) {
  if (marketCapChange24h > 3 && btcDominance < 54 && tvlChange7d > 1) {
    return "altcoinExpansion";
  }

  if (marketCapChange24h > 1 && btcDominance >= 58) {
    return "bitcoinLedRecovery";
  }

  if (marketCapChange24h < 0 && btcDominance >= 58) {
    return "defensiveBitcoinRotation";
  }

  if (marketCapChange24h < -3 || tvlChange7d < -3) {
    return "marketContraction";
  }

  if (stableChange1d > 0.5 && marketCapChange24h >= 0) {
    return "earlyRecovery";
  }

  return "neutralConsolidation";
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
  if (marketCapChange24h < -3 || tvlChange1d < -2) return "high";
  if (btcDominance >= 58 && marketCapChange24h < 0) return "elevated";
  if (marketCapChange24h > 3) return "medium";
  return "balanced";
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

  if (score > 2.5) return "strong";
  if (score < -1.5) return "weak";
  return "moderate";
}

export async function GET() {
  try {
    const [globalRes, chainsRes, stableRes, btcRes, blockRes] =
      await Promise.all([
        fetch("https://api.coingecko.com/api/v3/global", {
          next: { revalidate: 300 },
          headers: process.env.COINGECKO_API_KEY
            ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
            : {},
        }),
        fetch("https://api.llama.fi/v2/chains", {
          next: { revalidate: 300 },
        }),
        fetch("https://stablecoins.llama.fi/stablecoins", {
          next: { revalidate: 300 },
        }),
        fetch("https://coins.llama.fi/prices/current/coingecko:bitcoin", {
          next: { revalidate: 300 },
        }),
        fetch("https://mempool.space/api/blocks/tip/height", {
          next: { revalidate: 300 },
        }),
      ]);

    if (
      !globalRes.ok ||
      !chainsRes.ok ||
      !stableRes.ok ||
      !btcRes.ok ||
      !blockRes.ok
    ) {
      throw new Error("Market pulse fetch failed");
    }

    const globalJson = await globalRes.json();
    const chains = await chainsRes.json();
    const stablecoins = await stableRes.json();
    const btcJson = await btcRes.json();
    const blockHeight = Number(await blockRes.text());

    const global = globalJson.data;

    const totalMarketCap = Number(global?.total_market_cap?.usd || 0);
    const marketCapChange24h = Number(
      global?.market_cap_change_percentage_24h_usd || 0
    );
    const btcDominance = Number(global?.market_cap_percentage?.btc || 0);
    const ethDominance = Number(global?.market_cap_percentage?.eth || 0);

    const totalTvl = chains.reduce(
      (sum: number, chain: any) => sum + Number(chain.tvl || 0),
      0
    );

    const validTvl1d = chains.filter(
      (chain: any) => typeof chain.change_1d === "number"
    );

    const validTvl7d = chains.filter(
      (chain: any) => typeof chain.change_7d === "number"
    );

    const avgTvlChange1d =
      validTvl1d.reduce(
        (sum: number, chain: any) => sum + Number(chain.change_1d || 0),
        0
      ) / Math.max(validTvl1d.length, 1);

    const avgTvlChange7d =
      validTvl7d.reduce(
        (sum: number, chain: any) => sum + Number(chain.change_7d || 0),
        0
      ) / Math.max(validTvl7d.length, 1);

    const stableChange1d = Number(stablecoins?.change_1d?.peggedUSD || 0);
    const btcPrice = Number(btcJson?.coins?.["coingecko:bitcoin"]?.price || 0);

    const marketPhase = getMarketPhase({
      marketCapChange24h,
      btcDominance,
      tvlChange7d: avgTvlChange7d,
      stableChange1d,
    });

    const riskLevel = getRiskLevel({
      marketCapChange24h,
      btcDominance,
      tvlChange1d: avgTvlChange1d,
    });

    const trendStrength = getTrendStrength({
      marketCapChange24h,
      tvlChange7d: avgTvlChange7d,
      stableChange1d,
    });

    const blocksRemaining = Math.max(NEXT_HALVING_BLOCK - blockHeight, 0);
    const daysRemaining = Math.ceil(blocksRemaining / BLOCKS_PER_DAY);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),

      btcPrice: compactUsd(btcPrice),
      totalMarketCap: compactUsd(totalMarketCap),
      totalTvl: compactUsd(totalTvl),

      marketCapChange24h: pct(marketCapChange24h),
      btcDominance: `${btcDominance.toFixed(2)}%`,
      ethDominance: `${ethDominance.toFixed(2)}%`,
      tvlChange1d: pct(avgTvlChange1d),
      tvlChange7d: pct(avgTvlChange7d),
      stableChange1d: pct(stableChange1d),

      marketPhase,
      riskLevel,
      trendStrength,

      halving: {
        currentBlock: blockHeight,
        nextHalvingBlock: NEXT_HALVING_BLOCK,
        blocksRemaining,
        daysRemaining,
      },
    });
  } catch {
    return NextResponse.json(
      {
        marketPhase: "neutralConsolidation",
        riskLevel: "balanced",
        trendStrength: "moderate",
        halving: {
          currentBlock: 0,
          nextHalvingBlock: NEXT_HALVING_BLOCK,
          blocksRemaining: 0,
          daysRemaining: 0,
        },
      },
      { status: 200 }
    );
  }
}