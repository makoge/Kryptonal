import { NextResponse } from "next/server";

const API_URL = "https://api.llama.fi/protocols";

const wantedCategories = [
  "Dexes",
  "Lending",
  "Liquid Staking",
  "Yield",
  "Derivatives",
  "RWA",
  "CDP",
  "Bridge",
];

function getSignal(change7d: number) {
  if (change7d > 10) return "Hot";
  if (change7d > 3) return "Rising";
  if (change7d > -3) return "Neutral";
  return "Cooling";
}

function getScore(tvl: number, change7d: number) {
  const tvlScore = Math.min((tvl / 50_000_000_000) * 60, 60);
  const momentumScore = Math.max(Math.min(change7d * 3, 40), -20);
  return Math.max(Math.round(tvlScore + momentumScore), 0);
}

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch sector data" },
        { status: 502 }
      );
    }

    const protocols = await res.json();
    const grouped: Record<
      string,
      { tvl: number; change7dTotal: number; count: number }
    > = {};

    for (const protocol of protocols || []) {
      const category = protocol.category;
      if (!wantedCategories.includes(category)) continue;

      if (!grouped[category]) {
        grouped[category] = { tvl: 0, change7dTotal: 0, count: 0 };
      }

      grouped[category].tvl += Number(protocol.tvl || 0);
      grouped[category].change7dTotal += Number(protocol.change_7d || 0);
      grouped[category].count += 1;
    }

    const sectors = Object.entries(grouped)
      .map(([name, value]) => {
        const change7d = value.count
          ? value.change7dTotal / value.count
          : 0;

        const score = getScore(value.tvl, change7d);

        return {
          name,
          tvl: value.tvl,
          change7d,
          protocols: value.count,
          score,
          signal: getSignal(change7d),
        };
      })
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      sectors,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}