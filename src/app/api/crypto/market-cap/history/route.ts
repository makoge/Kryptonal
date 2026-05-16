import { NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

export const revalidate = 3600;

type YearData = {
  year: number;
  marketCapPeak: number | null;
  btcPeak: number;
};

function groupPeakByYear(points: [number, number][]) {
  const map = new Map<number, number>();

  for (const [time, value] of points) {
    const year = new Date(time).getFullYear();
    const current = map.get(year) || 0;

    if (Number(value) > current) {
      map.set(year, Number(value));
    }
  }

  return map;
}

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [globalRes, btcRes, marketCapRes] = await Promise.all([
      fetch(`${API_URL}/global`, {
        headers,
        next: { revalidate: 3600 },
      }),

      fetch(`${API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=3650`, {
        headers,
        next: { revalidate: 3600 },
      }),

      fetch(`${API_URL}/global/market_cap_chart?vs_currency=usd&days=3650`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!globalRes.ok || !btcRes.ok) {
      return NextResponse.json(
        {
          error: "History API failed",
          globalStatus: globalRes.status,
          btcStatus: btcRes.status,
          marketCapStatus: marketCapRes.status,
        },
        { status: 502 }
      );
    }

    const globalJson = await globalRes.json();
    const btcJson = await btcRes.json();

    const currentMarketCap = Number(
      globalJson?.data?.total_market_cap?.usd || 0
    );

    const btcPeaks = groupPeakByYear(
      Array.isArray(btcJson?.prices) ? btcJson.prices : []
    );

    let marketCapPeaks = new Map<number, number>();

    if (marketCapRes.ok) {
      const marketCapJson = await marketCapRes.json();

      const rawMarketCap =
        marketCapJson?.market_cap_chart?.market_cap ||
        marketCapJson?.market_cap ||
        [];

      if (Array.isArray(rawMarketCap) && rawMarketCap.length > 0) {
        marketCapPeaks = groupPeakByYear(rawMarketCap);
      }
    }

    const years = Array.from(btcPeaks.keys())
      .filter((year) => year >= 2017)
      .sort((a, b) => b - a)
      .map((year): YearData => ({
        year,
        btcPeak: btcPeaks.get(year) || 0,
        marketCapPeak: marketCapPeaks.get(year) || null,
      }));

    return NextResponse.json({
      currentMarketCap,
      years,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        currentMarketCap: 0,
        years: [],
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}