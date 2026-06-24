import { NextResponse } from "next/server";

export const revalidate = 300;

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,tron,chainlink,polkadot,avalanche-2,polygon-ecosystem-token,litecoin,bitcoin-cash,near,uniswap,aptos,arbitrum,optimism,render-token&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h";

const fallbackCoins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", priceUsd: 65000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", priceUsd: 3500 },
  { id: "solana", symbol: "SOL", name: "Solana", priceUsd: 150 },
  { id: "binancecoin", symbol: "BNB", name: "BNB", priceUsd: 600 },
  { id: "ripple", symbol: "XRP", name: "XRP", priceUsd: 0.6 },
  { id: "cardano", symbol: "ADA", name: "Cardano", priceUsd: 0.45 },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", priceUsd: 0.12 },
  { id: "tron", symbol: "TRX", name: "TRON", priceUsd: 0.11 },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", priceUsd: 14 },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", priceUsd: 80 },
];

export async function GET() {
  try {
    const res = await fetch(COINGECKO_URL, {
      next: { revalidate: 300 },
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("CoinGecko request failed");
    }

    const json = await res.json();

    const coins = Array.isArray(json)
      ? json.map((coin: any) => ({
          id: String(coin?.id || ""),
          symbol: String(coin?.symbol || "").toUpperCase(),
          name: String(coin?.name || ""),
          priceUsd: Number(coin?.current_price || 0),
        }))
      : [];

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      sourceNote: "Live crypto prices from CoinGecko.",
      coins: coins.length ? coins : fallbackCoins,
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      sourceNote: "Fallback crypto prices. Live data unavailable.",
      coins: fallbackCoins,
    });
  }
}
