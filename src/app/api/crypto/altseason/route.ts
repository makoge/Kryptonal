import { NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

export const revalidate = 1800; // 30 minutes

// Lightweight RAM cache so we don't trigger Next.js's 2MB fetch-cache error on CoinPaprika
let cachedAltseasonResponse: any = null;
let cachedAltseasonTime = 0;
const ALTSEASON_TTL = 30 * 60 * 1000; // 30 minutes

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

type NormalizedCoin = {
  name: string;
  symbol: string;
  image: string;
  change30d: number;
};

// Tier 1: CoinGecko
async function fetchFromCoinGecko(): Promise<{
  markets: NormalizedCoin[];
  btcDominance: number;
  ethDominance: number;
}> {
  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

  const [globalRes, marketsRes] = await Promise.all([
    fetch(`${API_URL}/global`, {
      headers,
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    }),
    fetch(
      `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=65&page=1&price_change_percentage=30d`,
      {
        headers,
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(4000),
      },
    ),
  ]);

  if (!marketsRes.ok) {
    throw new Error(`CoinGecko failed: ${marketsRes.status}`);
  }

  const globalJson = globalRes.ok ? await globalRes.json() : null;
  const rawMarkets = await marketsRes.json();

  const markets: NormalizedCoin[] = (
    Array.isArray(rawMarkets) ? rawMarkets : []
  ).map((coin: any) => ({
    name: String(coin.name || ""),
    symbol: String(coin.symbol || "").toLowerCase(),
    image: String(coin.image || ""),
    change30d: Number(
      coin.price_change_percentage_30d_in_currency ??
        coin.price_change_percentage_24h ??
        0,
    ),
  }));

  return {
    markets,
    btcDominance: Number(globalJson?.data?.market_cap_percentage?.btc || 0),
    ethDominance: Number(globalJson?.data?.market_cap_percentage?.eth || 0),
  };
}

// Tier 2: CoinPaprika (uses cache: "no-store" so Next.js doesn't crash on the >2MB response)
async function fetchFromCoinPaprika(): Promise<{
  markets: NormalizedCoin[];
  btcDominance: number;
  ethDominance: number;
}> {
  const [tickersRes, globalRes] = await Promise.all([
    fetch("https://api.coinpaprika.com/v1/tickers?limit=75", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    }),
    fetch("https://api.coinlore.net/api/global/", {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    }),
  ]);

  if (!tickersRes.ok) {
    throw new Error(`CoinPaprika failed: ${tickersRes.status}`);
  }

  const allTickers = await tickersRes.json();
  const top65 = Array.isArray(allTickers) ? allTickers.slice(0, 65) : [];

  if (top65.length === 0) {
    throw new Error("CoinPaprika returned empty list");
  }

  const markets: NormalizedCoin[] = top65.map((t: any) => {
    const sym = String(t.symbol || "").toLowerCase();
    return {
      name: String(t.name || ""),
      symbol: sym,
      image: `https://assets.coincap.io/assets/icons/${sym}@2x.png`,
      change30d: Number(t.quotes?.USD?.percent_change_30d ?? 0),
    };
  });

  let btcDominance = 0;
  let ethDominance = 0;
  if (globalRes.ok) {
    const loreJson = await globalRes.json();
    const loreData = Array.isArray(loreJson) ? loreJson[0] : loreJson;
    btcDominance = Number(loreData?.btc_d || 0);
    ethDominance = Number(loreData?.eth_d || 0);
  }

  return { markets, btcDominance, ethDominance };
}

// Tier 3: CoinLore (~25KB response, ultra-reliable)
async function fetchFromCoinLore(): Promise<{
  markets: NormalizedCoin[];
  btcDominance: number;
  ethDominance: number;
}> {
  const [tickersRes, globalRes] = await Promise.all([
    fetch("https://api.coinlore.net/api/tickers/?start=0&limit=70", {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    }),
    fetch("https://api.coinlore.net/api/global/", {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    }),
  ]);

  if (!tickersRes.ok) {
    throw new Error("CoinLore tickers failed");
  }

  const tickersJson = await tickersRes.json();
  const rows = Array.isArray(tickersJson?.data) ? tickersJson.data : [];

  const markets: NormalizedCoin[] = rows.map((c: any) => {
    const sym = String(c.symbol || "").toLowerCase();
    // Estimate 30d momentum from 7d + 24h when using Tier 3 fallback
    const p7d = Number(c.percent_change_7d || 0);
    const p24h = Number(c.percent_change_24h || 0);
    return {
      name: String(c.name || ""),
      symbol: sym,
      image: `https://assets.coincap.io/assets/icons/${sym}@2x.png`,
      change30d: Number((p7d * 1.6 + p24h * 0.4).toFixed(2)),
    };
  });

  let btcDominance = 0;
  let ethDominance = 0;
  if (globalRes.ok) {
    const loreJson = await globalRes.json();
    const loreData = Array.isArray(loreJson) ? loreJson[0] : loreJson;
    btcDominance = Number(loreData?.btc_d || 0);
    ethDominance = Number(loreData?.eth_d || 0);
  }

  return { markets, btcDominance, ethDominance };
}

export async function GET() {
  try {
    if (
      cachedAltseasonResponse &&
      Date.now() - cachedAltseasonTime < ALTSEASON_TTL
    ) {
      return NextResponse.json(cachedAltseasonResponse, {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      });
    }

    let data: {
      markets: NormalizedCoin[];
      btcDominance: number;
      ethDominance: number;
    };

    try {
      data = await fetchFromCoinGecko();
    } catch {
      try {
        data = await fetchFromCoinPaprika();
      } catch {
        data = await fetchFromCoinLore();
      }
    }

    const { markets, btcDominance, ethDominance } = data;

    const btc = markets.find((coin) => coin.symbol === "btc");
    const btcChange30d = Number.isFinite(btc?.change30d)
      ? Number(btc!.change30d)
      : 0;

    const altcoins = markets
      .filter((coin) => coin.symbol !== "btc")
      .filter((coin) => !stablecoins.has(coin.symbol))
      .filter((coin) => Number.isFinite(coin.change30d))
      .slice(0, 50);

    const outperformers = altcoins.filter(
      (coin) => coin.change30d > btcChange30d,
    );

    const index =
      altcoins.length > 0
        ? Math.round((outperformers.length / altcoins.length) * 100)
        : 0;

    const phase = getPhase(index);

    const leaders = [...outperformers]
      .sort((a, b) => b.change30d - a.change30d)
      .slice(0, 5)
      .map((coin) => ({
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.image,
        change30d: Number(coin.change30d.toFixed(2)),
      }));

    const laggards = [...altcoins]
      .sort((a, b) => a.change30d - b.change30d)
      .slice(0, 5)
      .map((coin) => ({
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.image,
        change30d: Number(coin.change30d.toFixed(2)),
      }));

    const payload = {
      index,
      phase,
      summary: getSummary(index, btcChange30d),
      btcChange30d: Number(btcChange30d.toFixed(2)),
      totalAltcoinsChecked: altcoins.length,
      outperformCount: outperformers.length,
      btcDominance,
      ethDominance,
      leaders,
      laggards,
      updatedAt: new Date().toISOString(),
    };

    cachedAltseasonResponse = payload;
    cachedAltseasonTime = Date.now();

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("Altseason route error:", err);
    return NextResponse.json(
      {
        index: 50,
        phase: "rotation",
        summary: "Altseason data is temporarily unavailable.",
        btcChange30d: 0,
        totalAltcoinsChecked: 50,
        outperformCount: 25,
        btcDominance: 56,
        ethDominance: 13,
        leaders: [],
        laggards: [],
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
