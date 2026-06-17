import { NextResponse } from "next/server";

export const revalidate = 60;

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

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

function getMarketPhase(
  market: number,
  btc: number,
  eth: number,
  tvl7d: number,
  stable1d: number
) {
  const score =
    market * 0.45 +
    tvl7d * 0.3 +
    stable1d * 0.25 +
    (btc >= 58 && market < 0 ? -0.8 : 0) +
    (eth >= 11 && market > 0 ? 0.4 : 0);

  if (score >= 2.5) return "Expansion";
  if (score >= 1) return "Recovery";
  if (score > -0.75) return "Consolidation";
  if (score > -2) return "Distribution";
  return "Risk-Off";
}

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

    const [globalRes, tvlChartRes, stableChartRes, pricesRes] =
      await Promise.all([
        fetch(`${COINGECKO_URL}/global`, {
          headers,
          next: { revalidate: 60 },
        }),
        fetch("https://api.llama.fi/charts", {
          next: { revalidate: 300 },
        }),
        fetch("https://stablecoins.llama.fi/stablecoincharts/all", {
          next: { revalidate: 300 },
        }),
        fetch(
          `${COINGECKO_URL}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`,
          {
            headers,
            next: { revalidate: 60 },
          }
        ),
      ]);

    if (!globalRes.ok || !tvlChartRes.ok || !stableChartRes.ok || !pricesRes.ok) {
      throw new Error("Hero market API error");
    }

    const globalJson = await globalRes.json();
    const tvlChart = await tvlChartRes.json();
    const stableChart = await stableChartRes.json();
    const prices = await pricesRes.json();

    const global = globalJson.data;

    const totalMarketCap = Number(global?.total_market_cap?.usd || 0);
    const marketCapChange24h = Number(
      global?.market_cap_change_percentage_24h_usd || 0
    );
    const btcDominance = Number(global?.market_cap_percentage?.btc || 0);
    const ethDominance = Number(global?.market_cap_percentage?.eth || 0);

    const btcPrice = Number(prices?.bitcoin?.usd || 0);
    const ethPrice = Number(prices?.ethereum?.usd || 0);
    const btcChange = Number(prices?.bitcoin?.usd_24h_change || 0);
    const ethChange = Number(prices?.ethereum?.usd_24h_change || 0);

    const latestTvl = tvlChart.at(-1);
    const prevTvl7d = tvlChart.at(-8);

    const totalTvl = Number(latestTvl?.totalLiquidityUSD || 0);
    const previousTotalTvl7d = Number(prevTvl7d?.totalLiquidityUSD || totalTvl);
    const tvlChange7d = changePct(totalTvl, previousTotalTvl7d);

    const latestStable = stableChart.at(-1);
    const previousStable = stableChart.at(-2);

    const totalStablecoins = getStableTotal(latestStable);
    const previousStablecoins = getStableTotal(previousStable);
    const stableChange1d = changePct(totalStablecoins, previousStablecoins);

    const marketPhase = getMarketPhase(
      marketCapChange24h,
      btcDominance,
      ethDominance,
      tvlChange7d,
      stableChange1d
    );

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      items: [
        {
          label: "BTC",
          value: compactUsd(btcPrice),
          change: pct(btcChange),
          changeValue: btcChange,
          subtitle: "24h change",
          type: "price",
        },
        {
          label: "ETH",
          value: compactUsd(ethPrice),
          change: pct(ethChange),
          changeValue: ethChange,
          subtitle: "24h change",
          type: "price",
        },
        {
          label: "Total Market Cap",
          value: compactUsd(totalMarketCap),
          change: pct(marketCapChange24h),
          changeValue: marketCapChange24h,
          subtitle: "24h global market change",
          type: "market",
        },
        {
          label: "DeFi TVL",
          value: compactUsd(totalTvl),
          change: pct(tvlChange7d),
          changeValue: tvlChange7d,
          subtitle: "7d global DeFi TVL change",
          type: "market",
        },
        {
          label: "Market Phase",
          value: marketPhase,
          subtitle: "Weighted signal from market cap, BTC dominance, ETH dominance, TVL and stablecoins",
          type: "phase",
        },
      ],
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      items: [
        { label: "BTC", value: "Unavailable", change: "0.00%", changeValue: 0, subtitle: "Retry soon", type: "price" },
        { label: "ETH", value: "Unavailable", change: "0.00%", changeValue: 0, subtitle: "Retry soon", type: "price" },
        { label: "Total Market Cap", value: "Unavailable", change: "0.00%", changeValue: 0, subtitle: "Retry soon", type: "market" },
        { label: "DeFi TVL", value: "Unavailable", change: "0.00%", changeValue: 0, subtitle: "Retry soon", type: "market" },
        { label: "Market Phase", value: "Data Loading", subtitle: "Fallback signal", type: "phase" },
      ],
    });
  }
}