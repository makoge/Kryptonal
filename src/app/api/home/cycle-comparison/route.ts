import { NextResponse } from "next/server";

export const revalidate = 300;

const BTC_HALVING_2024 = new Date("2024-04-20T00:00:00Z").getTime();

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

function safeNumber(value: any) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function calcChange(now: number, prev: number) {
  return prev > 0 ? ((now - prev) / prev) * 100 : 0;
}

function calcVolatility(values: number[]) {
  if (values.length < 2) return 0;
  const returns = values.slice(1).map((v, i) => calcChange(v, values[i]));
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / returns.length;

  return Math.sqrt(variance);
}

function getPhaseKey(score: number, dominance: number) {
  if (score >= 80) return "euphoria";
  if (score >= 62 && dominance < 55) return "altRotation";
  if (score >= 55) return "expansion";
  if (score <= 35) return "accumulation";
  return "neutral";
}

function getRiskKey(score: number, volatility: number, change7d: number) {
  if (score >= 82 || volatility >= 5) return "high";
  if (change7d <= -8) return "defensive";
  if (score >= 60) return "moderateHigh";
  return "moderate";
}

function getInsightKey(phaseKey: string, stableFlow7d: number, dominance: number) {
  if (phaseKey === "euphoria") return "euphoria";
  if (phaseKey === "altRotation") return "altRotation";
  if (stableFlow7d > 0.5) return "liquidityImproving";
  if (dominance >= 55) return "bitcoinLed";
  return "balanced";
}

export async function GET() {
  try {
    const [globalRes, btcPriceRes, btcChartRes, stableRes] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/global", {
        next: { revalidate: 300 },
      }),
      fetch("https://coins.llama.fi/prices/current/coingecko:bitcoin", {
        next: { revalidate: 300 },
      }),
      fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365",
        { next: { revalidate: 300 } }
      ),
      fetch("https://stablecoins.llama.fi/stablecoincharts/all", {
        next: { revalidate: 300 },
      }),
    ]);

    if (!globalRes.ok || !btcPriceRes.ok || !btcChartRes.ok) {
      throw new Error("Cycle comparison API failed");
    }

    const globalJson = await globalRes.json();
    const btcPriceJson = await btcPriceRes.json();
    const btcChartJson = await btcChartRes.json();
    const stableJson = stableRes.ok ? await stableRes.json() : [];

    const totalMarketCap = safeNumber(globalJson?.data?.total_market_cap?.usd);
    const marketChange24h = safeNumber(
      globalJson?.data?.market_cap_change_percentage_24h_usd
    );
    const btcDominance = safeNumber(globalJson?.data?.market_cap_percentage?.btc);

    const btcPrice = safeNumber(
      btcPriceJson?.coins?.["coingecko:bitcoin"]?.price
    );

    const btcTimeline = Array.isArray(btcChartJson?.prices)
      ? btcChartJson.prices.map((p: any) => ({
          date: new Date(p[0]).toISOString().slice(0, 10),
          price: safeNumber(p[1]),
        }))
      : [];

    const btcChart = btcTimeline.map((p: any) => p.price);

    const marketCapChart = Array.isArray(btcChartJson?.market_caps)
      ? btcChartJson.market_caps.map((p: any) => safeNumber(p[1]))
      : [];

    const btc7dAgo =
      btcChart.length > 7 ? btcChart[btcChart.length - 8] : btcChart[0];

    const btcChange7d = calcChange(btcPrice, btc7dAgo);
    const btcVolatility30d = calcVolatility(btcChart.slice(-30));

    const stableTotals = Array.isArray(stableJson)
      ? stableJson.map((p: any) =>
          safeNumber(
            p?.totalCirculatingUSD?.peggedUSD ||
              p?.totalCirculating?.peggedUSD ||
              p?.totalCirculatingUSD ||
              p?.totalCirculating
          )
        )
      : [];

    const stableNow = stableTotals.at(-1) || 0;
    const stable7dAgo = stableTotals.length > 7 ? stableTotals.at(-8) || 0 : 0;
    const stableFlow7d = calcChange(stableNow, stable7dAgo);

    const daysSinceHalving = Math.floor(
      (Date.now() - BTC_HALVING_2024) / 86_400_000
    );

    const cycleScoreRaw =
      50 +
      btcChange7d * 1.4 +
      marketChange24h * 1.2 +
      stableFlow7d * 2 -
      Math.max(btcVolatility30d - 3, 0) * 2 -
      Math.max(btcDominance - 58, 0) * 0.8;

    const cycleScore = Math.max(0, Math.min(100, Math.round(cycleScoreRaw)));
    const phaseKey = getPhaseKey(cycleScore, btcDominance);
    const riskKey = getRiskKey(cycleScore, btcVolatility30d, btcChange7d);
    const insightKey = getInsightKey(phaseKey, stableFlow7d, btcDominance);

    return NextResponse.json({
      totalMarketCap,
      totalMarketCapFormatted: compactUsd(totalMarketCap),
      btcPrice,
      btcPriceFormatted: compactUsd(btcPrice),
      marketChange24h,
      marketChangeFormatted: pct(marketChange24h),
      btcChange7d,
      btcChange7dFormatted: pct(btcChange7d),
      btcDominance,
      btcDominanceFormatted: `${btcDominance.toFixed(1)}%`,
      btcVolatility30d,
      btcVolatilityFormatted: `${btcVolatility30d.toFixed(1)}%`,
      stableFlow7d,
      stableFlow7dFormatted: pct(stableFlow7d),
      daysSinceHalving,
      cycleScore,
      phaseKey,
      riskKey,
      insightKey,
      btcTimeline,
      btcChart,
      marketCapChart,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: true }, { status: 200 });
  }
}