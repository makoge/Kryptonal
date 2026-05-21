// src/app/api/crypto-prices/route.ts
import { NextResponse } from "next/server";

export const revalidate = 60;

const CG_BASE = "https://api.coingecko.com/api/v3";

async function cg(path: string) {
  const res = await fetch(`${CG_BASE}${path}`, {
    next: { revalidate: 60 },
    headers: process.env.COINGECKO_API_KEY
      ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
      : {},
  });

  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [coins, exchanges, trending] = await Promise.all([
      cg(
        "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=true&price_change_percentage=1h,24h,7d"
      ),
      cg("/exchanges?per_page=20&page=1"),
      cg("/search/trending"),
    ]);

    const gainers = [...coins]
      .filter((c: any) => typeof c.price_change_percentage_24h === "number")
      .sort(
        (a: any, b: any) =>
          b.price_change_percentage_24h - a.price_change_percentage_24h
      )
      .slice(0, 10);

    const losers = [...coins]
      .filter((c: any) => typeof c.price_change_percentage_24h === "number")
      .sort(
        (a: any, b: any) =>
          a.price_change_percentage_24h - b.price_change_percentage_24h
      )
      .slice(0, 10);

    return NextResponse.json({
      coins,
      gainers,
      losers,
      exchanges,
      newCoins: trending?.coins ?? [],
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load crypto prices" },
      { status: 500 }
    );
  }
}