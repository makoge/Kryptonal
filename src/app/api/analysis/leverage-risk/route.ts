import { NextResponse } from "next/server";

// Force Vercel to execute this route in Frankfurt, Germany (bypasses the US Geo-block)
export const preferredRegion = "fra1";
export const revalidate = 60;

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

const BINANCE_BASE_URLS = [
  "https://fapi.binance.com",
  "https://fapi1.binance.com",
  "https://fapi2.binance.com",
  "https://fapi3.binance.com",
];

type Source = "binance" | "bybit" | "none";

type Market = {
  symbol: string;
  fundingRate: number;
  fundingRatePct: number;
  markPrice: number;
  openInterest: number;
  openInterestUsd: number;
  nextFundingTime: number;
  source: Source;
};

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function safeJson(urlOrUrls: string | string[]) {
  const urls = Array.isArray(urlOrUrls) ? urlOrUrls : [urlOrUrls];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
        headers: { "User-Agent": "Kryptonal/1.0" },
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("FAILED:", url, res.status, text.slice(0, 200));
        continue;
      }
      return await res.json();
    } catch {
      continue;
    }
  }

  return null;
}

function binanceUrls(path: string) {
  return BINANCE_BASE_URLS.map((base) => `${base}${path}`);
}

function getFundingRisk(rate: number) {
  const absPct = Math.abs(rate * 100);
  if (absPct >= 0.08) return 35;
  if (absPct >= 0.04) return 25;
  if (absPct >= 0.02) return 15;
  return 6;
}

function getOiRisk(totalOpenInterestUsd: number) {
  if (totalOpenInterestUsd >= 40_000_000_000) return 35;
  if (totalOpenInterestUsd >= 25_000_000_000) return 28;
  if (totalOpenInterestUsd >= 12_000_000_000) return 18;
  if (totalOpenInterestUsd >= 5_000_000_000) return 10;
  return 4;
}

function getMarketRiskScore(item: Market) {
  const fundingRisk = getFundingRisk(item.fundingRate);

  const oiRisk =
    item.openInterestUsd >= 15_000_000_000
      ? 25
      : item.openInterestUsd >= 5_000_000_000
        ? 15
        : item.openInterestUsd > 0
          ? 8
          : 0;

  return Math.round(clamp(fundingRisk + oiRisk, 0, 100));
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

async function getBinanceMarket(symbol: string): Promise<Market | null> {
  const [premium, oi, ticker] = await Promise.all([
    safeJson(binanceUrls(`/fapi/v1/premiumIndex?symbol=${symbol}`)),
    safeJson(binanceUrls(`/fapi/v1/openInterest?symbol=${symbol}`)),
    safeJson(binanceUrls(`/fapi/v1/ticker/price?symbol=${symbol}`)),
  ]);

  const fundingRate = num(premium?.lastFundingRate);
  const markPrice =
    num(premium?.markPrice) || num(premium?.indexPrice) || num(ticker?.price);

  const openInterest = num(oi?.openInterest);
  const openInterestUsd = openInterest * markPrice;

  if (!markPrice || !openInterestUsd) return null;

  return {
    symbol,
    fundingRate,
    fundingRatePct: fundingRate * 100,
    markPrice,
    openInterest,
    openInterestUsd,
    nextFundingTime: num(premium?.nextFundingTime),
    source: "binance",
  };
}

async function getBybitMarket(symbol: string): Promise<Market | null> {
  const [ticker, oi] = await Promise.all([
    safeJson(
      `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`,
    ),
    safeJson(
      `https://api.bybit.com/v5/market/open-interest?category=linear&symbol=${symbol}&intervalTime=5min`,
    ),
  ]);

  const item = ticker?.result?.list?.[0];
  const oiItem = oi?.result?.list?.[0];

  const fundingRate = num(item?.fundingRate);
  const markPrice = num(item?.markPrice) || num(item?.lastPrice);
  const openInterest = num(oiItem?.openInterest);
  const openInterestUsd = openInterest * markPrice;

  if (!markPrice || !openInterestUsd) return null;

  return {
    symbol,
    fundingRate,
    fundingRatePct: fundingRate * 100,
    markPrice,
    openInterest,
    openInterestUsd,
    nextFundingTime: num(item?.nextFundingTime),
    source: "bybit",
  };
}

async function getMarket(symbol: string) {
  const binance = await getBinanceMarket(symbol);
  const market = binance ||
    (await getBybitMarket(symbol)) || {
      symbol,
      fundingRate: 0,
      fundingRatePct: 0,
      markPrice: 0,
      openInterest: 0,
      openInterestUsd: 0,
      nextFundingTime: 0,
      source: "none" as Source,
    };

  const marketRiskScore = getMarketRiskScore(market);

  return {
    ...market,
    marketRiskScore,
    riskLevel: getRiskLevel(marketRiskScore),
    sourceOk: market.source !== "none",
  };
}

export async function GET() {
  const markets = await Promise.all(SYMBOLS.map((symbol) => getMarket(symbol)));

  const validMarkets = markets.filter((item) => item.sourceOk);

  const avgFundingRate =
    validMarkets.length > 0
      ? validMarkets.reduce((sum, item) => sum + item.fundingRate, 0) /
        validMarkets.length
      : 0;

  const totalOpenInterestUsd = validMarkets.reduce(
    (sum, item) => sum + item.openInterestUsd,
    0,
  );

  const fundingRisk =
    validMarkets.length > 0
      ? validMarkets.reduce(
          (sum, item) => sum + getFundingRisk(item.fundingRate),
          0,
        ) / validMarkets.length
      : 0;

  const oiRisk = getOiRisk(totalOpenInterestUsd);
  const riskScore = Math.round(clamp(fundingRisk + oiRisk, 0, 100));

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    positionBias: getPositionBias(avgFundingRate),
    avgFundingRate,
    avgFundingRatePct: avgFundingRate * 100,
    totalOpenInterestUsd,
    markets,
    sources: {
      binanceFutures: markets.some((item) => item.source === "binance"),
      bybitFutures: markets.some((item) => item.source === "bybit"),
      marketsLoaded: validMarkets.length,
      marketsRequested: SYMBOLS.length,
    },
  });
}
