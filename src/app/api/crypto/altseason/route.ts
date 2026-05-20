import { NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

export const revalidate = 300;

const stablecoins = new Set([
  "usdt",
  "usdc",
  "dai",
  "fdusd",
  "usde",
  "usds",
  "tusd",
  "usdd",
  "usdp",
  "pyusd",
  "gusd",
  "lusd",
]);

function getPhase(index: number) {
  if (index >= 75) return "altseason";
  if (index <= 25) return "bitcoinSeason";
  return "rotation";
}

function getSummary(index: number, btcChange30d: number) {
  if (index >= 75) {
    return "Altcoins are broadly outperforming Bitcoin over the last 30 days. This suggests risk appetite is strong, but volatility may also be higher.";
  }

  if (index <= 25) {
    return "Bitcoin is outperforming most large altcoins. This usually means the market is defensive and capital is staying closer to BTC.";
  }

  return "The market is in a mixed rotation zone. Some altcoins are showing strength, but Bitcoin still has meaningful control.";
}

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [globalRes, marketsRes] = await Promise.all([
      fetch(`${API_URL}/global`, {
        headers,
        next: { revalidate: 300 },
      }),
      fetch(
        `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=60&page=1&price_change_percentage=30d`,
        {
          headers,
          next: { revalidate: 300 },
        }
      ),
    ]);

    if (!marketsRes.ok) {
      return NextResponse.json(
        { error: "Altseason API failed", status: marketsRes.status },
        { status: 502 }
      );
    }

    const globalJson = globalRes.ok ? await globalRes.json() : null;
    const markets = await marketsRes.json();

    const btc = markets.find((coin: any) => coin.symbol === "btc");
    const btcChange30d = Number(
      btc?.price_change_percentage_30d_in_currency || 0
    );

    const altcoins = markets
      .filter((coin: any) => coin.symbol !== "btc")
      .filter((coin: any) => !stablecoins.has(String(coin.symbol).toLowerCase()))
      .filter((coin: any) =>
        Number.isFinite(Number(coin.price_change_percentage_30d_in_currency))
      )
      .slice(0, 50);

    const outperformers = altcoins.filter(
      (coin: any) =>
        Number(coin.price_change_percentage_30d_in_currency) > btcChange30d
    );

    const index =
      altcoins.length > 0
        ? Math.round((outperformers.length / altcoins.length) * 100)
        : 0;

    const phase = getPhase(index);

    const leaders = outperformers
      .sort(
        (a: any, b: any) =>
          Number(b.price_change_percentage_30d_in_currency || 0) -
          Number(a.price_change_percentage_30d_in_currency || 0)
      )
      .slice(0, 5)
      .map((coin: any) => ({
        name: coin.name,
        symbol: String(coin.symbol).toUpperCase(),
        image: coin.image,
        change30d: Number(coin.price_change_percentage_30d_in_currency || 0),
      }));

    const laggards = altcoins
      .sort(
        (a: any, b: any) =>
          Number(a.price_change_percentage_30d_in_currency || 0) -
          Number(b.price_change_percentage_30d_in_currency || 0)
      )
      .slice(0, 5)
      .map((coin: any) => ({
        name: coin.name,
        symbol: String(coin.symbol).toUpperCase(),
        image: coin.image,
        change30d: Number(coin.price_change_percentage_30d_in_currency || 0),
      }));

    return NextResponse.json({
      index,
      phase,
      summary: getSummary(index, btcChange30d),
      btcChange30d,
      totalAltcoinsChecked: altcoins.length,
      outperformCount: outperformers.length,
      btcDominance: Number(globalJson?.data?.market_cap_percentage?.btc || 0),
      ethDominance: Number(globalJson?.data?.market_cap_percentage?.eth || 0),
      leaders,
      laggards,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        index: 0,
        phase: "rotation",
        summary: "Altseason data is temporarily unavailable.",
        btcChange30d: 0,
        totalAltcoinsChecked: 0,
        outperformCount: 0,
        btcDominance: 0,
        ethDominance: 0,
        leaders: [],
        laggards: [],
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}