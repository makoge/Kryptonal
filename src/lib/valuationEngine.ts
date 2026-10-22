// src/lib/valuationEngine.ts

export type ValuationResult = {
  fairPrice: number;
  currentPrice: number;
  fdv: number;
  turnoverRatio: number; // in %
  circulationRatio: number; // in %
  deviationPercent: number; // in %
  signal: "accumulate" | "balanced" | "caution" | "hazard";
  badgeLabel: string;
  badgeColor: "emerald" | "blue" | "amber" | "rose";
  liquidityStatus: "healthy" | "moderate" | "illiquid";
  analysisText: string;
  unlockRunwayDays: number | null;
};

export function calculateEconomicValuation(
  currentPrice: number,
  circulatingSupply: number,
  totalSupply: number | null,
  maxSupply: number | null,
  volume24h: number = 0,
  nextUnlockDate?: string | null,
): ValuationResult {
  const effectiveMax = maxSupply || totalSupply || circulatingSupply || 1;
  const effectiveCirc = circulatingSupply || 1;

  // Supply Absorption Ratio (clamped between 0.01 and 1.0)
  const ratio = Math.min(1, Math.max(0.01, effectiveCirc / effectiveMax));

  // Implied Fair Value via Square-Root Supply Amortization
  const fairPrice = currentPrice * Math.sqrt(ratio);
  const deviationPercent =
    fairPrice > 0 ? ((currentPrice - fairPrice) / fairPrice) * 100 : 0;
  const circulationPercent = ratio * 100;

  // FDV & Liquidity Turnover Calculations
  const fdv = currentPrice * effectiveMax;
  const turnoverRatio = fdv > 0 ? (volume24h / fdv) * 100 : 0;

  const liquidityStatus: "healthy" | "moderate" | "illiquid" =
    turnoverRatio >= 2.0
      ? "healthy"
      : turnoverRatio >= 0.5
        ? "moderate"
        : "illiquid";

  // --- Calculate Unlock Runway ---
  let unlockRunwayDays: number | null = null;
  if (nextUnlockDate) {
    const unlockTime = new Date(nextUnlockDate).getTime();
    const now = Date.now();
    if (unlockTime > now) {
      unlockRunwayDays = Math.ceil((unlockTime - now) / (1000 * 60 * 60 * 24));
    }
  }

  // Classification Logic (evaluating both Float Dilution & Liquidity Depth)
  if (ratio >= 0.8 && turnoverRatio >= 1.5 && deviationPercent <= 12) {
    return {
      fairPrice,
      currentPrice,
      fdv,
      turnoverRatio,
      circulationRatio: circulationPercent,
      deviationPercent,
      signal: "accumulate",
      badgeLabel: "Approved: Organic Float",
      badgeColor: "emerald",
      unlockRunwayDays,
      liquidityStatus,
      analysisText:
        "High float absorption (>80%) backed by active daily liquidity. Low unlock overhang and minimal risk of paper-valuation slippage.",
    };
  }

  if (ratio >= 0.5 && turnoverRatio >= 0.5) {
    return {
      fairPrice,
      currentPrice,
      fdv,
      turnoverRatio,
      circulationRatio: circulationPercent,
      deviationPercent,
      signal: "balanced",
      badgeLabel: "Balanced Float",
      badgeColor: "blue",
      unlockRunwayDays,
      liquidityStatus,
      analysisText:
        "Moderate float with steady market depth. Current valuation tracks within standard macro equilibrium ranges.",
    };
  }

  if (turnoverRatio < 0.3 || ratio < 0.25) {
    return {
      fairPrice,
      currentPrice,
      fdv,
      turnoverRatio,
      circulationRatio: circulationPercent,
      deviationPercent,
      signal: "hazard",
      badgeLabel:
        turnoverRatio < 0.3
          ? "Alert: Illiquid Paper FDV"
          : "Warning: Low-Float Bubble",
      badgeColor: "rose",
      unlockRunwayDays,
      liquidityStatus,
      analysisText:
        turnoverRatio < 0.3
          ? `Extreme liquidity risk: 24h volume represents only ${turnoverRatio.toFixed(2)}% of FDV. Large sells may cause severe slippage.`
          : "Severe unlock overhang: Under 25% of supply is unlocked, artificially inflating spot price against prospective supply.",
    };
  }

  return {
    fairPrice,
    currentPrice,
    fdv,
    turnoverRatio,
    circulationRatio: circulationPercent,
    deviationPercent,
    signal: "caution",
    badgeLabel: "Caution: Dilution Overhang",
    unlockRunwayDays,
    badgeColor: "amber",
    liquidityStatus,
    analysisText:
      "Future token release schedule or modest turnover could dampen upside momentum. Best approached with phased positioning.",
  };
}
