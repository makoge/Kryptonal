import { NextResponse } from "next/server";

export const revalidate = 300;

type DefiLlamaPool = {
  pool: string;
  project: string;
  chain: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  stablecoin?: boolean;
  exposure?: string;
  predictions?: {
    predictedClass?: string;
    predictedProbability?: number;
    binnedConfidence?: number;
  };
};

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function cleanText(value: any) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 80);
}

function getRiskLevel(pool: DefiLlamaPool) {
  const tvl = num(pool.tvlUsd);
  const apy = num(pool.apy);
  const rewardApy = num(pool.apyReward);
  const baseApy = num(pool.apyBase);

  let risk = 0;

  if (tvl < 500_000) risk += 35;
  else if (tvl < 2_000_000) risk += 22;
  else if (tvl < 10_000_000) risk += 12;

  if (apy > 80) risk += 35;
  else if (apy > 40) risk += 25;
  else if (apy > 20) risk += 14;

  if (rewardApy > baseApy && rewardApy > 10) risk += 15;
  if (!pool.stablecoin) risk += 10;

  if (risk >= 60) return "high";
  if (risk >= 30) return "medium";
  return "lower";
}

function getSafetyScore(pool: DefiLlamaPool) {
  const tvl = num(pool.tvlUsd);
  const apy = num(pool.apy);
  const rewardApy = num(pool.apyReward);
  const baseApy = num(pool.apyBase);

  let score = 100;

  if (tvl < 500_000) score -= 35;
  else if (tvl < 2_000_000) score -= 22;
  else if (tvl < 10_000_000) score -= 12;

  if (apy > 100) score -= 35;
  else if (apy > 50) score -= 25;
  else if (apy > 25) score -= 12;

  if (rewardApy > baseApy && rewardApy > 10) score -= 12;
  if (!pool.stablecoin) score -= 8;

  return Math.max(5, Math.min(100, Math.round(score)));
}

function getYieldType(pool: DefiLlamaPool) {
  const base = num(pool.apyBase);
  const reward = num(pool.apyReward);

  if (reward > base && reward > 5) return "incentiveHeavy";
  if (base > 0 && reward > 0) return "mixed";
  if (pool.stablecoin) return "stableYield";
  return "variableYield";
}

function getBestFor(pool: DefiLlamaPool) {
  const risk = getRiskLevel(pool);
  const tvl = num(pool.tvlUsd);
  const apy = num(pool.apy);

  if (pool.stablecoin && risk === "lower") return "stableYield";
  if (tvl >= 25_000_000) return "deepLiquidity";
  if (apy >= 30) return "highRiskYield";
  return "research";
}

function getWarnings(pool: DefiLlamaPool) {
  const warnings: string[] = [];

  if (num(pool.tvlUsd) < 1_000_000) warnings.push("lowTvl");
  if (num(pool.apy) > 50) warnings.push("veryHighApy");
  if (num(pool.apyReward) > num(pool.apyBase) && num(pool.apyReward) > 10) {
    warnings.push("rewardHeavy");
  }
  if (!pool.stablecoin) warnings.push("volatileAsset");

  return warnings;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const stableOnly = searchParams.get("stableOnly") === "true";
    const chain = searchParams.get("chain")?.toLowerCase().trim() || "all";
    const sort = searchParams.get("sort") || "safety";

    const res = await fetch("https://yields.llama.fi/pools", {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Failed to fetch DefiLlama yields");

    const json = await res.json();
    let pools: DefiLlamaPool[] = Array.isArray(json?.data) ? json.data : [];

    pools = pools
      .filter((pool) => cleanText(pool.pool))
      .filter((pool) => cleanText(pool.project))
      .filter((pool) => cleanText(pool.chain))
      .filter((pool) => cleanText(pool.symbol))
      .filter((pool) => num(pool.tvlUsd) >= 250_000)
      .filter((pool) => num(pool.apy) > 0)
      .filter((pool) => num(pool.apy) < 250);

    if (stableOnly) {
      pools = pools.filter((pool) => pool.stablecoin === true);
    }

    if (chain !== "all") {
      pools = pools.filter((pool) => pool.chain?.toLowerCase() === chain);
    }

    if (search) {
      pools = pools.filter((pool) => {
        const text = `${pool.symbol} ${pool.project} ${pool.chain}`.toLowerCase();
        return text.includes(search);
      });
    }

    const cleanPools = pools.map((pool) => {
      const riskLevel = getRiskLevel(pool);
      const safetyScore = getSafetyScore(pool);

      return {
        id: cleanText(pool.pool),
        protocol: cleanText(pool.project),
        chain: cleanText(pool.chain),
        token: cleanText(pool.symbol),
        apy: num(pool.apy),
        apyBase: num(pool.apyBase),
        apyReward: num(pool.apyReward),
        tvlUsd: num(pool.tvlUsd),
        stablecoin: Boolean(pool.stablecoin),
        exposure: cleanText(pool.exposure),
        riskLevel,
        safetyScore,
        yieldType: getYieldType(pool),
        bestFor: getBestFor(pool),
        warnings: getWarnings(pool),
      };
    });

    cleanPools.sort((a, b) => {
      if (sort === "apy") return b.apy - a.apy;
      if (sort === "tvl") return b.tvlUsd - a.tvlUsd;
      if (sort === "risk") return b.safetyScore - a.safetyScore;
      return b.safetyScore - a.safetyScore || b.tvlUsd - a.tvlUsd;
    });

    const chains = Array.from(
      new Set(cleanPools.map((pool) => pool.chain).filter(Boolean))
    )
      .sort()
      .slice(0, 25);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: "DefiLlama yields",
      filters: {
        search,
        stableOnly,
        chain,
        sort,
      },
      chains,
      pools: cleanPools.slice(0, 60),
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: "DefiLlama yields",
      chains: [],
      pools: [],
    });
  }
}