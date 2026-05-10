import { NextResponse } from "next/server";

const CHAINS_URL = "https://api.llama.fi/v2/chains";
const STABLECOINS_URL =
  "https://stablecoins.llama.fi/stablecoins?includePrices=true";

function formatBillions(value: number) {
  return `$${(value / 1_000_000_000).toFixed(2)}B`;
}

function getAlertLevel(score: number) {
  if (score >= 75) return "Strong";
  if (score >= 55) return "Watch";
  if (score >= 35) return "Neutral";
  return "Weak";
}

export async function GET() {
  try {
    const [chainsRes, stableRes] = await Promise.all([
      fetch(CHAINS_URL, { next: { revalidate: 300 } }),
      fetch(STABLECOINS_URL, { next: { revalidate: 300 } }),
    ]);

    if (!chainsRes.ok || !stableRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch smart money data" },
        { status: 502 }
      );
    }

    const chainsJson = await chainsRes.json();
    const stableJson = await stableRes.json();

    const stableByChain: Record<string, number> = {};

    for (const asset of stableJson.peggedAssets || []) {
      const chains = asset.chainCirculating || {};

      for (const [chain, values] of Object.entries(chains)) {
        const current = (values as any)?.current?.peggedUSD ?? 0;
        stableByChain[chain] = (stableByChain[chain] || 0) + current;
      }
    }

    const preferred = [
      "Ethereum",
      "Solana",
      "Base",
      "Arbitrum",
      "BSC",
      "Avalanche",
      "Polygon",
      "Optimism",
      "Tron",
    ];

    const alerts = chainsJson
      .filter((chain: any) => preferred.includes(chain.name))
      .map((chain: any) => {
        const tvl = Number(chain.tvl || 0);
        const change7d = Number(chain.change_7d || 0);
        const stablecoins = Number(stableByChain[chain.name] || 0);

        const liquidityScore = Math.min((stablecoins / 30_000_000_000) * 40, 40);
        const tvlScore = Math.min((tvl / 30_000_000_000) * 35, 35);
        const momentumScore = Math.max(Math.min(change7d * 3, 25), -15);
        const score = Math.max(
          Math.round(liquidityScore + tvlScore + momentumScore),
          0
        );

        return {
          chain: chain.name,
          tvl,
          stablecoins,
          change7d,
          protocols: Number(chain.protocols || 0),
          score,
          level: getAlertLevel(score),
          title:
            score >= 75
              ? `${chain.name} showing strong smart-money conditions`
              : score >= 55
              ? `${chain.name} worth watching for liquidity rotation`
              : score >= 35
              ? `${chain.name} is neutral for now`
              : `${chain.name} looks weaker relative to stronger ecosystems`,
          summary:
            score >= 75
              ? `High stablecoin liquidity (${formatBillions(
                  stablecoins
                )}), solid TVL, and positive ecosystem activity suggest stronger capital conditions.`
              : score >= 55
              ? `Liquidity and TVL are meaningful, but users should wait for stronger confirmation before assuming a major rotation.`
              : score >= 35
              ? `The chain has some activity, but signals are mixed. Watch stablecoins, TVL, and weekly growth together.`
              : `Liquidity or momentum is weaker compared with leading chains. Caution is needed until activity improves.`,
        };
      })
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 6);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      alerts,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}