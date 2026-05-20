import { NextResponse } from "next/server";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getFundingRisk(rate: number) {
  const abs = Math.abs(rate * 100);
  if (abs >= 0.08) return 35;
  if (abs >= 0.04) return 25;
  if (abs >= 0.02) return 15;
  return 6;
}

function getRiskLevel(score: number) {
  if (score >= 75) return "dangerous";
  if (score >= 55) return "heated";
  if (score >= 35) return "normal";
  return "low";
}

function getPositionBias(avgFunding: number) {
  if (avgFunding > 0.00025) return "longCrowded";
  if (avgFunding < -0.00025) return "shortCrowded";
  return "balanced";
}

export async function GET() {
  try {
    const market = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const [premiumRes, oiRes] = await Promise.all([
          fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`, {
            next: { revalidate: 60 },
          }),
          fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`, {
            next: { revalidate: 60 },
          }),
        ]);

        const premium = premiumRes.ok ? await premiumRes.json() : null;
        const oi = oiRes.ok ? await oiRes.json() : null;

        const fundingRate = Number(premium?.lastFundingRate || 0);
        const markPrice = Number(premium?.markPrice || 0);
        const openInterest = Number(oi?.openInterest || 0);
        const openInterestUsd = openInterest * markPrice;

        return {
          symbol,
          fundingRate,
          fundingRatePct: fundingRate * 100,
          markPrice,
          openInterest,
          openInterestUsd,
          nextFundingTime: Number(premium?.nextFundingTime || 0),
        };
      })
    );

    const avgFunding =
      market.reduce((sum, item) => sum + item.fundingRate, 0) / market.length;

    const totalOpenInterestUsd = market.reduce(
      (sum, item) => sum + item.openInterestUsd,
      0
    );

    const fundingRisk = market.reduce(
      (sum, item) => sum + getFundingRisk(item.fundingRate),
      0
    );

    const oiRisk = clamp(totalOpenInterestUsd / 1_000_000_000, 0, 35);

    const riskScore = Math.round(clamp(fundingRisk + oiRisk, 0, 100));
    const riskLevel = getRiskLevel(riskScore);
    const positionBias = getPositionBias(avgFunding);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      riskScore,
      riskLevel,
      positionBias,
      avgFundingRate: avgFunding,
      avgFundingRatePct: avgFunding * 100,
      totalOpenInterestUsd,
      markets: market,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch leverage risk data" },
      { status: 500 }
    );
  }
}