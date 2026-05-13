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
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const stableOnly = searchParams.get("stableOnly") === "true";

    const res = await fetch("https://yields.llama.fi/pools", {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch DefiLlama yields");
    }

    const json = await res.json();
    let pools: DefiLlamaPool[] = Array.isArray(json?.data) ? json.data : [];

    pools = pools
      .filter((pool) => Number(pool.tvlUsd || 0) >= 100000)
      .filter((pool) => Number(pool.apy || 0) > 0)
      .filter((pool) => Number(pool.apy || 0) < 300);

    if (stableOnly) {
      pools = pools.filter((pool) => pool.stablecoin === true);
    }

    if (search) {
      pools = pools.filter((pool) =>
        String(pool.symbol || "").toLowerCase().includes(search)
      );
    }

    const cleanPools = pools
      .sort((a, b) => Number(b.apy || 0) - Number(a.apy || 0))
      .slice(0, 50)
      .map((pool) => ({
        id: pool.pool,
        protocol: pool.project,
        chain: pool.chain,
        token: pool.symbol,
        apy: Number(pool.apy || 0),
        tvlUsd: Number(pool.tvlUsd || 0),
        stablecoin: Boolean(pool.stablecoin),
      }));

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      pools: cleanPools,
    });
  } catch {
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), pools: [] },
      { status: 200 }
    );
  }
}