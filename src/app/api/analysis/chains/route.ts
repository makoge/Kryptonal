import { NextResponse } from "next/server";

const API_URL = "https://api.llama.fi/v2/chains";

const preferredChains = [
  "Ethereum",
  "Solana",
  "Base",
  "Arbitrum",
  "BSC",
  "Avalanche",
  "Polygon",
  "Optimism",
];

function getStrengthScore(tvl: number, change7d: number) {
  const tvlScore = Math.min((tvl / 50_000_000_000) * 60, 60);
  const momentumScore = Math.max(Math.min(change7d * 4, 40), -20);
  return Math.max(Math.round(tvlScore + momentumScore), 0);
}

function getSignal(score: number) {
  if (score >= 75) return "Very Strong";
  if (score >= 55) return "Strong";
  if (score >= 35) return "Moderate";
  return "Weak";
}

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch chain data" },
        { status: 502 }
      );
    }

    const json = await res.json();

    const chains = json
      .filter((chain: any) => preferredChains.includes(chain.name))
      .map((chain: any) => {
        const tvl = Number(chain.tvl || 0);
        const change7d = Number(chain.change_7d || 0);
        const score = getStrengthScore(tvl, change7d);

        return {
          name: chain.name,
          tvl,
          change1d: Number(chain.change_1d || 0),
          change7d,
          change1m: Number(chain.change_1m || 0),
          protocols: Number(chain.protocols || 0),
          score,
          signal: getSignal(score),
        };
      })
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      chains,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}