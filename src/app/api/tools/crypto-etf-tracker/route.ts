import { NextResponse } from "next/server";

export const revalidate = 3600;

const ETF_FUNDS = [
  {
    ticker: "IBIT",
    name: "BlackRock iShares Bitcoin Trust",
    status: "approved",
    asset: "Bitcoin",
    issuer: "BlackRock",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "FBTC",
    name: "Fidelity Wise Origin Bitcoin Fund",
    status: "approved",
    asset: "Bitcoin",
    issuer: "Fidelity",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "ARKB",
    name: "ARK 21Shares Bitcoin ETF",
    status: "approved",
    asset: "Bitcoin",
    issuer: "ARK / 21Shares",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "BITB",
    name: "Bitwise Bitcoin ETF",
    status: "approved",
    asset: "Bitcoin",
    issuer: "Bitwise",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "HODL",
    name: "VanEck Bitcoin Trust",
    status: "approved",
    asset: "Bitcoin",
    issuer: "VanEck",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "BTCO",
    name: "Invesco Galaxy Bitcoin ETF",
    status: "approved",
    asset: "Bitcoin",
    issuer: "Invesco Galaxy",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "EZBC",
    name: "Franklin Bitcoin ETF",
    status: "approved",
    asset: "Bitcoin",
    issuer: "Franklin Templeton",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "BRRR",
    name: "Valkyrie Bitcoin Fund",
    status: "approved",
    asset: "Bitcoin",
    issuer: "Valkyrie",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "GBTC",
    name: "Grayscale Bitcoin Trust ETF",
    status: "approved",
    asset: "Bitcoin",
    issuer: "Grayscale",
    category: "Spot Bitcoin ETF",
  },
  {
    ticker: "ETHA",
    name: "BlackRock iShares Ethereum Trust ETF",
    status: "approved",
    asset: "Ethereum",
    issuer: "BlackRock",
    category: "Spot Ethereum ETF",
  },
  {
    ticker: "FETH",
    name: "Fidelity Ethereum Fund",
    status: "approved",
    asset: "Ethereum",
    issuer: "Fidelity",
    category: "Spot Ethereum ETF",
  },
];

function getSignal(netFlow: number) {
  if (netFlow >= 500) return "strongAccumulation";
  if (netFlow >= 100) return "accumulation";
  if (netFlow <= -500) return "heavyOutflows";
  if (netFlow <= -100) return "distribution";
  return "neutral";
}

export async function GET() {
  const sampleFlows = [
    { date: "Latest", netFlow: 280 },
    { date: "7D", netFlow: 920 },
    { date: "30D", netFlow: 3100 },
  ];

  const latestNetFlow = sampleFlows[0].netFlow;

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    sourceNote:
      "ETF flow values are sample placeholders. Connect a licensed ETF flow source before presenting as live financial data.",
    signal: getSignal(latestNetFlow),
    metrics: {
      dailyNetFlowUsdM: latestNetFlow,
      sevenDayNetFlowUsdM: sampleFlows[1].netFlow,
      thirtyDayNetFlowUsdM: sampleFlows[2].netFlow,
      approvedFunds: ETF_FUNDS.filter((f) => f.status === "approved").length,
    },
    flows: sampleFlows,
    funds: ETF_FUNDS,
  });
}
