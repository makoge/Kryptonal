import { NextResponse } from "next/server";

export const revalidate = 300;

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
  return `${sign}${value.toFixed(1)}%`;
}

function getMood(change24h: number, btcDominance: number) {
  if (change24h >= 4) return "Expansion";
  if (change24h <= -4) return "Caution";
  if (btcDominance >= 55) return "Bitcoin-Led";
  return "Neutral";
}

function getRisk(change24h: number, btcDominance: number) {
  if (change24h >= 6) return "Higher Risk";
  if (change24h <= -4) return "Defensive";
  if (btcDominance >= 55) return "Watch Dominance";
  return "Moderate";
}

function getInsight(change24h: number, btcDominance: number) {
  if (change24h >= 4) {
    return "The current market is showing strong expansion. Capital is moving into crypto, but fast upside can also increase short-term risk.";
  }

  if (change24h <= -4) {
    return "The current market is cooling. Momentum is weaker, so risk control matters more than chasing short-term moves.";
  }

  if (btcDominance >= 55) {
    return "Bitcoin dominance remains elevated, which suggests capital is still concentrated in BTC before wider altcoin expansion.";
  }

  return "The current market is balanced. Conditions are not extremely bullish or bearish, so confirmation from trend and liquidity matters.";
}

export async function GET() {
  try {
    const [globalRes, btcPriceRes, btcChartRes] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/global", {
        next: { revalidate: 300 },
      }),
      fetch("https://coins.llama.fi/prices/current/coingecko:bitcoin", {
        next: { revalidate: 300 },
      }),
      fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7",
        { next: { revalidate: 300 } }
      ),
    ]);

    if (!globalRes.ok || !btcPriceRes.ok || !btcChartRes.ok) {
      throw new Error("Cycle comparison API failed");
    }

    const globalJson = await globalRes.json();
    const btcPriceJson = await btcPriceRes.json();
    const btcChartJson = await btcChartRes.json();

    const totalMarketCap = Number(globalJson?.data?.total_market_cap?.usd || 0);
    const marketChange24h = Number(
      globalJson?.data?.market_cap_change_percentage_24h_usd || 0
    );
    const btcDominance = Number(globalJson?.data?.market_cap_percentage?.btc || 0);

    const btcPrice = Number(
      btcPriceJson?.coins?.["coingecko:bitcoin"]?.price || 0
    );

    const btcChart = Array.isArray(btcChartJson?.prices)
      ? btcChartJson.prices.map((p: any) => Number(p[1]))
      : [];

    const btcMarketCapChart = Array.isArray(btcChartJson?.market_caps)
      ? btcChartJson.market_caps.map((p: any) => Number(p[1]))
      : [];

    return NextResponse.json({
      totalMarketCap,
      totalMarketCapFormatted: compactUsd(totalMarketCap),
      btcPrice,
      btcPriceFormatted: compactUsd(btcPrice),
      marketChange24h,
      marketChangeFormatted: pct(marketChange24h),
      btcDominance,
      btcDominanceFormatted: `${btcDominance.toFixed(1)}%`,
      cycleMood: getMood(marketChange24h, btcDominance),
      riskView: getRisk(marketChange24h, btcDominance),
      insight: getInsight(marketChange24h, btcDominance),
      btcChart,
      marketCapChart: btcMarketCapChart,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: true }, { status: 200 });
  }
}