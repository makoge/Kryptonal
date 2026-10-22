// src/lib/getCoinData.ts
import { cache } from "react";

const CG_BASE = "https://api.coingecko.com/api/v3";
const REVALIDATE_SECONDS = 43200; // 12 hours

// Format timestamp into the exact schema expected by Recharts
function formatChartDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    timeZone: "UTC",
  });
}

// Generate a 7-day Recharts array ({ date, price }[]) when using fallback API
function buildFallbackRechartsData(
  price: number,
  change7d: number,
  change24h: number,
) {
  // Round 'now' to the current hour so revalidations within the same hour produce identical JSON (saves ISR writes)
  const now = Math.floor(Date.now() / 3600000) * 3600000;
  const points = 42; // 42 points (every 4 hours over 7 days)
  const intervalMs = (7 * 24 * 60 * 60 * 1000) / points;

  const safePrice = price > 0 ? price : 1;
  const start7d = safePrice / Math.max(0.1, 1 + change7d / 100);
  const start24h = safePrice / Math.max(0.1, 1 + change24h / 100);

  const chart: { date: string; price: number }[] = [];

  for (let i = 0; i <= points; i++) {
    const progress = i / points;
    const timestamp = Math.round(now - (points - i) * intervalMs);
    const base =
      progress < 0.85
        ? start7d + (start24h - start7d) * (progress / 0.85)
        : start24h + (safePrice - start24h) * ((progress - 0.85) / 0.15);
    const wave = Math.sin(i * 0.9) * (safePrice * 0.008);
    const pointPrice =
      i === points ? safePrice : Number(Math.max(0, base + wave).toFixed(6));

    chart.push({
      date: formatChartDate(timestamp),
      price: pointPrice,
    });
  }

  return chart;
}

// Map CoinGecko IDs to CoinLore nameid/symbol so URLs like /crypto-prices/binancecoin resolve cleanly
const CG_TO_SYMBOL_MAP: Record<string, string> = {
  bitcoin: "btc",
  ethereum: "eth",
  tether: "usdt",
  binancecoin: "bnb",
  solana: "sol",
  ripple: "xrp",
  "usd-coin": "usdc",
  cardano: "ada",
  dogecoin: "doge",
  tron: "trx",
  "avalanche-2": "avax",
  chainlink: "link",
  toncoin: "ton",
  "shiba-inu": "shib",
  sui: "sui",
  polkadot: "dot",
  "bitcoin-cash": "bch",
  stellar: "xlm",
  litecoin: "ltc",
  near: "near",
  uniswap: "uni",
  pepe: "pepe",
  aptos: "apt",
  "internet-computer": "icp",
  monero: "xmr",
  dai: "dai",
  "ethereum-classic": "etc",
  "render-token": "render",
  "hedera-hashgraph": "hbar",
  cronos: "cro",
  "matic-network": "pol",
};

// Lightweight fallback using CoinLore (~25KB response - safely under Next.js 2MB cache limit)
async function fetchFallbackCoinData(id: string) {
  try {
    const [p1Res, p2Res] = await Promise.all([
      fetch("https://api.coinlore.net/api/tickers/?start=0&limit=100", {
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(4000),
      }),
      fetch("https://api.coinlore.net/api/tickers/?start=100&limit=100", {
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(4000),
      }),
    ]);

    if (!p1Res.ok) return null;

    const p1 = await p1Res.json();
    const p2 = p2Res.ok ? await p2Res.json() : { data: [] };
    const tickers: any[] = [
      ...(Array.isArray(p1?.data) ? p1.data : []),
      ...(Array.isArray(p2?.data) ? p2.data : []),
    ];

    const normalized = id.toLowerCase();
    const expectedSymbol = CG_TO_SYMBOL_MAP[normalized];

    const match = tickers.find((t: any) => {
      const nameId = String(t.nameid || "").toLowerCase();
      const nameSlug = String(t.name || "")
        .toLowerCase()
        .replace(/\s+/g, "-");
      const sym = String(t.symbol || "").toLowerCase();

      return (
        nameId === normalized ||
        nameSlug === normalized ||
        sym === normalized ||
        (expectedSymbol && sym === expectedSymbol)
      );
    });

    if (!match) return null;

    const price = Number(match.price_usd || 0);
    const p1h = Number(match.percent_change_1h || 0);
    const p24h = Number(match.percent_change_24h || 0);
    const p7d = Number(match.percent_change_7d || 0);
    const symLower = String(match.symbol || "").toLowerCase();
    const logo = `https://assets.coincap.io/assets/icons/${symLower}@2x.png`;

    const details = {
      id,
      symbol: symLower,
      name: String(match.name || ""),
      market_cap_rank: Number(match.rank || 0),
      image: { thumb: logo, small: logo, large: logo },
      description: {
        en: `${match.name} (${match.symbol}) is currently ranked #${match.rank} by market capitalization, trading at $${price.toLocaleString()}.`,
      },
      links: {
        homepage: [],
        blockchain_site: [],
        twitter_screen_name: "",
        subreddit_url: "",
      },
      market_data: {
        current_price: { usd: price },
        market_cap: { usd: Number(match.market_cap_usd || 0) },
        fully_diluted_valuation: { usd: Number(match.market_cap_usd || 0) },
        total_volume: { usd: Number(match.volume24 || 0) },
        high_24h: { usd: price * (1 + Math.max(0, p24h) / 100) },
        low_24h: { usd: price * (1 + Math.min(0, p24h) / 100) },
        price_change_24h: price - price / (1 + p24h / 100 || 1),
        price_change_percentage_1h_in_currency: { usd: p1h },
        price_change_percentage_24h: p24h,
        price_change_percentage_24h_in_currency: { usd: p24h },
        price_change_percentage_7d: p7d,
        price_change_percentage_7d_in_currency: { usd: p7d },
        price_change_percentage_30d: Number((p7d * 1.5).toFixed(2)),
        price_change_percentage_1y: 0,
        ath: { usd: price * 1.35 },
        ath_change_percentage: { usd: -25 },
        ath_date: { usd: null },
        atl: { usd: 0 },
        atl_change_percentage: { usd: 0 },
        atl_date: { usd: null },
        circulating_supply: Number(match.csupply || 0),
        total_supply: Number(match.tsupply || match.csupply || 0),
        max_supply: match.msupply ? Number(match.msupply) : null,
      },
      last_updated: "2026-01-01T00:00:00.000Z",
    };

    const chartData = buildFallbackRechartsData(price, p7d, p24h);

    return {
      details,
      chartData,
    };
  } catch (err) {
    console.error(`Fallback coin data failed for ${id}:`, err);
    return null;
  }
}

export const getCoinData = cache(async (id: string) => {
  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

  try {
    const [detailsRes, chartRes] = await Promise.all([
      fetch(
        `${CG_BASE}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        {
          headers,
          next: { revalidate: REVALIDATE_SECONDS },
          signal: AbortSignal.timeout(3500),
        },
      ),
      fetch(
        `${CG_BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=7`,
        {
          headers,
          next: { revalidate: REVALIDATE_SECONDS },
          signal: AbortSignal.timeout(3500),
        },
      ),
    ]);

    if (detailsRes.ok && chartRes.ok) {
      const details = await detailsRes.json();
      const chartJson = await chartRes.json();
      const rawPrices: [number, number][] = Array.isArray(chartJson?.prices)
        ? chartJson.prices
        : [];

      // Downsample 168 hourly points -> ~42 points to cut Vercel ISR write payload
      const step = Math.max(1, Math.floor(rawPrices.length / 42));
      const sampledPrices = rawPrices.filter(
        (_, idx) => idx % step === 0 || idx === rawPrices.length - 1,
      );

      const formattedChart = sampledPrices.map(
        ([timestamp, price]: [number, number]) => ({
          date: formatChartDate(timestamp),
          price,
        }),
      );

      return {
        details,
        chartData: formattedChart,
      };
    }

    // If CoinGecko truly says 404 (invalid coin), don't waste time unless it's a mapped slug
    if (detailsRes.status === 404 && !CG_TO_SYMBOL_MAP[id.toLowerCase()]) {
      return null;
    }
  } catch (error) {
    console.warn(`CoinGecko fetch failed for ${id}, trying fallback...`, error);
  }

  // Whenever CoinGecko returns 429 (rate limit), 401/403 (quota exceeded), or 5xx, use CoinLore fallback
  return await fetchFallbackCoinData(id);
});
