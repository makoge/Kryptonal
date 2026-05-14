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

export async function GET() {
  try {
    const [chainsRes, stableRes, btcRes, blockRes] = await Promise.all([
      fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 300 } }),
      fetch("https://stablecoins.llama.fi/stablecoins", { next: { revalidate: 300 } }),
      fetch("https://coins.llama.fi/prices/current/coingecko:bitcoin", {
        next: { revalidate: 300 },
      }),
      fetch("https://mempool.space/api/blocks/tip/height", {
        next: { revalidate: 300 },
      }),
    ]);

    if (!chainsRes.ok || !stableRes.ok || !btcRes.ok || !blockRes.ok) {
      throw new Error("Market pulse fetch failed");
    }

    const chains = await chainsRes.json();
    const stablecoins = await stableRes.json();
    const btcJson = await btcRes.json();
    const blockHeight = Number(await blockRes.text());

    const totalTvl = chains.reduce(
      (sum: number, chain: any) => sum + Number(chain.tvl || 0),
      0
    );

    const avgTvlChange1d =
      chains.reduce((sum: number, chain: any) => sum + Number(chain.change_1d || 0), 0) /
      Math.max(chains.length, 1);

    const avgTvlChange7d =
      chains.reduce((sum: number, chain: any) => sum + Number(chain.change_7d || 0), 0) /
      Math.max(chains.length, 1);

    const stableChange1d = Number(stablecoins?.change_1d?.peggedUSD || 0);
    const btcPrice = Number(btcJson?.coins?.["coingecko:bitcoin"]?.price || 0);

    const marketPhase =
      avgTvlChange7d > 2 && stableChange1d > 0
        ? "expansion"
        : avgTvlChange7d < -2
        ? "cooling"
        : "neutral";

    const riskLevel =
      avgTvlChange1d < -1.5
        ? "high"
        : avgTvlChange1d > 1.5
        ? "medium"
        : "balanced";

    const trendStrength =
      avgTvlChange7d > 3
        ? "strong"
        : avgTvlChange7d < -1
        ? "weak"
        : "moderate";

    const blocksRemaining = Math.max(NEXT_HALVING_BLOCK - blockHeight, 0);
    const daysRemaining = Math.ceil(blocksRemaining / BLOCKS_PER_DAY);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      btcPrice: compactUsd(btcPrice),
      totalTvl: compactUsd(totalTvl),
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
        marketPhase: "neutral",
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