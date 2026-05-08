import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";
const DAY = 24 * 60 * 60;

export async function GET(req: NextRequest) {
  try {
    const range = req.nextUrl.searchParams.get("range") || "1Y";

    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const now = Math.floor(Date.now() / 1000);

    let from = now - 365 * DAY;

    if (range === "3Y") from = now - 3 * 365 * DAY;
    if (range === "5Y") from = now - 5 * 365 * DAY;
    if (range === "ALL") from = now - 10 * 365 * DAY;

    const res = await fetch(
      `${API_URL}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${now}`,
      {
        headers,
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch history data" },
        { status: 502 }
      );
    }

    const json = await res.json();

    const chart = Array.isArray(json.prices)
      ? json.prices.map(([time, value]: [number, number]) => ({
          time,
          value,
        }))
      : [];

    return NextResponse.json({ chart });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}