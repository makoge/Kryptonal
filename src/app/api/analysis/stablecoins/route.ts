import { NextResponse } from "next/server";

const API_URL = "https://stablecoins.llama.fi/stablecoins?includePrices=true";

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch stablecoin data" },
        { status: 502 }
      );
    }

    const json = await res.json();

    const grouped: Record<string, number> = {};

    for (const asset of json.peggedAssets || []) {
      const chains = asset.chainCirculating || {};

      for (const [chain, values] of Object.entries(chains)) {
        const current = (values as any)?.current?.peggedUSD ?? 0;

        if (!grouped[chain]) grouped[chain] = 0;
        grouped[chain] += current;
      }
    }

    const chains = Object.entries(grouped)
      .map(([chain, value]) => ({ chain, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      chains,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}