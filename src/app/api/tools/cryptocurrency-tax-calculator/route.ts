import { NextResponse } from "next/server";

export const revalidate = 300;

type CountryRule = {
  rate: number;
  note: string;
  longTermTaxFreeDays?: number;
};

const countryRules: Record<string, CountryRule> = {
  Estonia: {
    rate: 22,
    note: "Estonia commonly taxes realized crypto gains as income when gains are realized. This is a simplified estimate and may not reflect your exact situation.",
  },
  "United States": {
    rate: 24,
    note: "The United States can treat crypto gains as capital gains. Short-term and long-term rates may differ, and state taxes may also apply.",
  },
  "United Kingdom": {
    rate: 20,
    note: "The United Kingdom may tax crypto gains under capital gains rules after allowances. This estimate does not apply personal allowances.",
  },
  Germany: {
    rate: 25,
    longTermTaxFreeDays: 365,
    note: "Germany may treat some private crypto sales held longer than one year more favorably. This simplified estimate applies a possible long-term exemption.",
  },
  France: {
    rate: 30,
    note: "France may apply a flat tax approach to some crypto gains. This is a simplified estimate.",
  },
  Spain: {
    rate: 23,
    note: "Spain may tax crypto gains under savings income brackets. This simplified estimate uses a single sample rate.",
  },
  Portugal: {
    rate: 28,
    longTermTaxFreeDays: 365,
    note: "Portugal may treat short-term and long-term crypto gains differently. This simplified estimate applies a possible long-term exemption.",
  },
  Turkey: {
    rate: 0,
    note: "Turkey's crypto tax treatment can be uncertain and may change. This calculator uses 0% by default unless you enter a custom tax rate.",
  },
  Canada: {
    rate: 25,
    note: "Canada may tax only a portion of capital gains, but income classification can differ. This simplified estimate uses an effective sample rate.",
  },
  Australia: {
    rate: 24,
    longTermTaxFreeDays: 365,
    note: "Australia may allow a capital gains discount after a longer holding period. This simplified estimate does not fully model personal tax brackets.",
  },
  Other: {
    rate: 20,
    note: "No country-specific rule selected. This uses a general sample rate. Enter a custom rate for a better estimate.",
  },
};

function safeNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function daysBetween(start?: string, end?: string) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }

  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const country = String(body?.country || "Other");
    const currency = String(body?.currency || "USD");
    const transactionType = String(body?.transactionType || "Sell crypto");

    const buyPrice = safeNumber(body?.buyPrice);
    const sellPrice = safeNumber(body?.sellPrice);
    const quantity = safeNumber(body?.quantity);
    const customTaxRate = safeNumber(body?.taxRate);
    const useCustomRate = Boolean(body?.useCustomRate);

    if (buyPrice < 0 || sellPrice < 0 || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid calculator input" },
        { status: 400 },
      );
    }

    const rule = countryRules[country] || countryRules.Other;

    const holdingDays = daysBetween(body?.buyDate, body?.sellDate);

    const costBasis = buyPrice * quantity;
    const proceeds = sellPrice * quantity;
    const gainLoss = proceeds - costBasis;

    const longTermExempt =
      rule.longTermTaxFreeDays &&
      holdingDays >= rule.longTermTaxFreeDays &&
      gainLoss > 0 &&
      !useCustomRate;

    const taxRate = useCustomRate ? customTaxRate : rule.rate;

    const taxableGain = longTermExempt ? 0 : Math.max(0, gainLoss);
    const estimatedTax = taxableGain * (taxRate / 100);
    const profitAfterTax = gainLoss - estimatedTax;

    const holdingLabel =
      holdingDays >= 365
        ? "Long-term estimate"
        : holdingDays > 0
          ? "Short-term estimate"
          : "Date not provided";

    const extraNote = longTermExempt
      ? " Based on the selected country and holding period, this simplified model treated the gain as potentially exempt."
      : "";

    return NextResponse.json({
      country,
      currency,
      transactionType,
      taxRate,
      costBasis,
      proceeds,
      gainLoss,
      taxableGain,
      estimatedTax,
      profitAfterTax,
      holdingDays,
      holdingLabel,
      ruleNote: `${rule.note}${extraNote}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to calculate crypto tax estimate" },
      { status: 500 },
    );
  }
}
