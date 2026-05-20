import { NextResponse } from "next/server";

const CHAINS_URL = "https://api.llama.fi/v2/chains";
const PROTOCOLS_URL = "https://api.llama.fi/protocols";

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function pct(now: number, prev: number) {
  return prev > 0 ? ((now - prev) / prev) * 100 : 0;
}

function getStrengthScore(args: {
  tvl: number;
  change7d: number;
  change1m: number;
  protocols: number;
}) {
  const tvlScore = clamp(Math.log10(args.tvl || 1) * 7 - 45, 0, 35);
  const momentum7dScore = clamp(args.change7d * 2.5, -20, 25);
  const momentum1mScore = clamp(args.change1m * 1.2, -20, 25);
  const protocolScore = clamp(Math.log10(args.protocols || 1) * 10, 0, 15);

  return Math.round(
    clamp(tvlScore + momentum7dScore + momentum1mScore + protocolScore, 0, 100)
  );
}

function getSignal(score: number) {
  if (score >= 80) return "veryStrong";
  if (score >= 62) return "strong";
  if (score >= 42) return "moderate";
  return "weak";
}

async function getChainHistory(chain: string) {
  try {
    const res = await fetch(
      `https://api.llama.fi/v2/historicalChainTvl/${encodeURIComponent(chain)}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [chainsRes, protocolsRes] = await Promise.all([
      fetch(CHAINS_URL, { next: { revalidate: 300 } }),
      fetch(PROTOCOLS_URL, { next: { revalidate: 300 } }),
    ]);

    if (!chainsRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch chain data" },
        { status: 502 }
      );
    }

    const chainsJson = await chainsRes.json();
    const protocolsJson = protocolsRes.ok ? await protocolsRes.json() : [];

    const protocolCounts: Record<string, number> = {};

    for (const protocol of protocolsJson || []) {
      for (const chain of protocol.chains || []) {
        protocolCounts[chain] = (protocolCounts[chain] || 0) + 1;
      }
    }

    const chains = await Promise.all(
      chainsJson
        .filter((chain: any) => preferredChains.includes(chain.name))
        .map(async (chain: any) => {
          const tvl = Number(chain.tvl || 0);
          const history = await getChainHistory(chain.name);

          const latest = Number(history.at(-1)?.tvl || tvl);
          const prev1d = Number(history.at(-2)?.tvl || latest);
          const prev7d = Number(history.at(-8)?.tvl || latest);
          const prev1m = Number(history.at(-31)?.tvl || latest);

          const change1d = pct(latest, prev1d);
          const change7d = pct(latest, prev7d);
          const change1m = pct(latest, prev1m);

          const protocols = protocolCounts[chain.name] || 0;

          const score = getStrengthScore({
            tvl,
            change7d,
            change1m,
            protocols,
          });

          return {
            name: chain.name,
            tvl,
            change1d,
            change7d,
            change1m,
            protocols,
            score,
            signal: getSignal(score),
          };
        })
    );

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      chains: chains.sort((a, b) => b.score - a.score),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}