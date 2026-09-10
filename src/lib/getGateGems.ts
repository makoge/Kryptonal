// src/lib/getGateGems.ts

export type GateGem = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  price_change_percentage_24h: number;
  gatePair: string;
  isNew: boolean;
};

export async function getGateNewGems(): Promise<GateGem[]> {
  try {
    // 1. Fetch all trading pairs and all tickers in parallel
    const [pairsRes, tickersRes] = await Promise.all([
      fetch("https://api.gateio.ws/api/v4/spot/currency_pairs", {
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }),
      fetch("https://api.gateio.ws/api/v4/spot/tickers", {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }),
    ]);

    if (!pairsRes.ok || !tickersRes.ok) return [];

    const pairs = await pairsRes.json();
    const tickers = await tickersRes.json();

    // Index tickers by currency pair (e.g. "PEPE_USDT")
    const tickerMap = new Map<string, any>();
    tickers.forEach((t: any) => tickerMap.set(t.currency_pair, t));

    // Filter for active USDT pairs only
    const usdtPairs = pairs.filter(
      (p: any) =>
        p.trade_status === "tradable" &&
        p.quote === "USDT" &&
        tickerMap.has(p.id),
    );

    // Sort by newest listing (using buy_start timestamp if available, or pair order)
    const sorted = usdtPairs.sort((a: any, b: any) => {
      const timeA = Number(a.buy_start) || 0;
      const timeB = Number(b.buy_start) || 0;
      return timeB - timeA;
    });

    // Return the top 30 early listings
    return sorted.slice(0, 30).map((p: any, index: number) => {
      const ticker = tickerMap.get(p.id) || {};
      const lastPrice = parseFloat(ticker.last || "0");
      const change24h = parseFloat(ticker.change_percentage || "0");
      const volumeUsd = parseFloat(ticker.quote_volume || "0");

      return {
        id: p.base.toLowerCase(),
        name: p.base,
        symbol: p.base.toUpperCase(),
        image: `https://gimg2.gateimg.com/coininfo/${p.base.toLowerCase()}.png`,
        current_price: lastPrice,
        market_cap: 0, // Microcaps/Pre-markets often omit aggregated cap
        market_cap_rank: index + 1,
        total_volume: volumeUsd,
        circulating_supply: 0,
        price_change_percentage_24h: change24h,
        gatePair: p.id,
        isNew: true,
      };
    });
  } catch (error) {
    console.error("Failed to load Gate.io gems:", error);
    return [];
  }
}
