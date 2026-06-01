// src/lib/gaming/getGamingMarketPulse.ts

export type GamingCoin = {
  name: string;
  symbol: string;
  ecosystem: string;
  price: number;
  marketCap: number;
  change24h: number;
  image: string;
};

export type GamingMarketPulse = {
  marketCap: number;
  volume24h: number;
  change24h: number;
  topCoins: GamingCoin[];
  dominantChain: string;
  hottestNarrative: string;
};

const FALLBACK: GamingMarketPulse = {
  marketCap: 0,
  volume24h: 0,
  change24h: 0,
  topCoins: [
    {
      name: "Immutable",
      symbol: "IMX",
      ecosystem: "Gaming",
      price: 0,
      marketCap: 0,
      change24h: 0,
      image: "",
    },
  ],
  dominantChain: "Immutable",
  hottestNarrative: "Web3 Gaming",
};

export async function getGamingMarketPulse(): Promise<GamingMarketPulse> {
  try {
    const headers: HeadersInit = process.env.COINGECKO_API_KEY
      ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
      : {};

    const [categoryRes, coinsRes] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/coins/categories", {
        next: { revalidate: 300 },
        headers,
      }),
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=gaming&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h",
        {
          next: { revalidate: 300 },
          headers,
        }
      ),
    ]);

    if (!categoryRes.ok || !coinsRes.ok) return FALLBACK;

    const categories = await categoryRes.json();
    const coins = await coinsRes.json();

    const gaming = Array.isArray(categories)
      ? categories.find((x: any) => x.id === "gaming")
      : null;

    const safeCoins = Array.isArray(coins) ? coins : [];

    return {
      marketCap: Number(gaming?.market_cap || 0),
      volume24h: Number(gaming?.volume_24h || 0),
      change24h: Number(gaming?.market_cap_change_24h || 0),

      topCoins: safeCoins.slice(0, 5).map((coin: any) => ({
        name: String(coin.name || "Unknown"),
        symbol: String(coin.symbol || "N/A").toUpperCase(),
        ecosystem: "Gaming",
        price: Number(coin.current_price || 0),
        marketCap: Number(coin.market_cap || 0),
        change24h: Number(coin.price_change_percentage_24h || 0),
        image: String(coin.image || ""),
      })),

      dominantChain: "Immutable",
      hottestNarrative:
        Number(gaming?.market_cap_change_24h || 0) >= 0
          ? "Gaming Recovery"
          : "Gaming Risk-Off",
    };
  } catch {
    return FALLBACK;
  }
}