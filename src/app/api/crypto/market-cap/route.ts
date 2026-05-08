import { NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const res = await fetch(`${API_URL}/global`, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "API failed" }, { status: 502 });
    }

    const json = await res.json();
    const data = json.data;

    return NextResponse.json({
      totalMarketCap: data.total_market_cap.usd,
      marketCapChange24h: data.market_cap_change_percentage_24h_usd,
      btcDominance: data.market_cap_percentage.btc,
      ethDominance: data.market_cap_percentage.eth,

      // TEMP FAKE DATA (so chart shows)
  chart: [
    { time: 1, value: 2.5 },
    { time: 2, value: 2.6 },
    { time: 3, value: 2.55 },
    { time: 4, value: 2.7 },
    { time: 5, value: 2.65 },
    { time: 6, value: 2.74 }
  ],
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}