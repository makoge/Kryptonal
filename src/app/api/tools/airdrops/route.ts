import { NextResponse } from "next/server";

const DEFILLAMA_PROTOCOLS = "https://api.llama.fi/protocols";

function getRiskLevel(tvl: number) {
  if (tvl >= 50_000_000) return "lower";
  if (tvl >= 5_000_000) return "medium";
  return "high";
}

export async function GET() {
  try {
    const res = await fetch(DEFILLAMA_PROTOCOLS, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch DefiLlama protocols");
    }

    const protocols = await res.json();

    const BLOCKED_CATEGORIES = [
      "CEX",
      "Bridge",
      "Chain",
      "Reserve Currency",
      "Treasury Manager",
    ];

    const GOOD_CATEGORIES = [
      "Dexes",
      "Lending",
      "Yield",
      "Derivatives",
      "Liquid Staking",
      "Options",
      "CDP",
      "RWA",
    ];

    const BLOCKED_NAMES = [
      "Binance",
      "OKX",
      "Bitfinex",
      "Bybit",
      "Robinhood",
      "WBTC",
      "Coinbase",
      "Kraken",
    ];

    const tokenless = protocols
      .filter((p: any) => !p.symbol || p.symbol === "-")
      .filter((p: any) => Number(p.tvl || 0) > 1_000_000)
      .filter((p: any) => GOOD_CATEGORIES.includes(p.category))
      .filter((p: any) => !BLOCKED_CATEGORIES.includes(p.category))
      .filter(
        (p: any) =>
          !BLOCKED_NAMES.some((name) =>
            String(p.name || "")
              .toLowerCase()
              .includes(name.toLowerCase()),
          ),
      )
      .sort((a: any, b: any) => Number(b.tvl || 0) - Number(a.tvl || 0))
      .slice(0, 60)
      .filter((p: any) => Number(p.tvl || 0) > 0)
      .sort((a: any, b: any) => Number(b.tvl || 0) - Number(a.tvl || 0))
      .slice(0, 60)
      .map((p: any) => ({
        id: p.slug,
        name: p.name,
        platform: p.category || "DeFi",
        chain: p.chains?.[0] || p.chain || "Multi-chain",
        description: `${p.name} is a tokenless ${p.category || "DeFi"} protocol tracked by DefiLlama.`,
        tvl: Number(p.tvl || 0),
        url: p.url || `https://defillama.com/protocol/${p.slug}`,
        status: "potential",
        source: "DefiLlama",
        riskLevel: getRiskLevel(Number(p.tvl || 0)),
      }));

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      count: tokenless.length,
      airdrops: tokenless,
    });
  } catch {
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        count: 0,
        airdrops: [],
        error: "Unable to load airdrop opportunities.",
      },
      { status: 500 },
    );
  }
}
