import { NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

export const revalidate = 3600;

async function cgFetch(url: string) {
  const apiKey = process.env.COINGECKO_API_KEY;

  const withKey = await fetch(url, {
    headers: apiKey ? { "x-cg-demo-api-key": apiKey } : {},
    next: { revalidate: 3600 },
  });

  if (withKey.status !== 401) return withKey;

  return fetch(url, {
    next: { revalidate: 3600 },
  });
}

export async function GET() {
  try {
    const btcRes = await cgFetch(
      `${API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=365`
    );

    if (!btcRes.ok) {
      return NextResponse.json(
        { error: "BTC API failed", status: btcRes.status },
        { status: 502 }
      );
    }

    const btcJson = await btcRes.json();
    const prices = Array.isArray(btcJson?.prices) ? btcJson.prices : [];

    const btcPeak = Math.max(
      ...prices.map((item: [number, number]) => Number(item[1] || 0))
    );

    const year = new Date().getFullYear();

    return NextResponse.json({
      currentMarketCap: 0,
      years: [
        {
          year,
          btcPeak,
          marketCapPeak: null,
        },
      ],
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}