import { NextResponse } from "next/server";

const STABLES_URL =
  "https://stablecoins.llama.fi/stablecoins?includePrices=true";

const CHART_URL = "https://stablecoins.llama.fi/stablecoincharts/all";

// --- IN-MEMORY CACHE ---
// Stores the computed result in RAM so we don't re-download huge JSON payloads
let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
// -----------------------

function pct(now: number, prev: number) {
  return prev > 0 ? ((now - prev) / prev) * 100 : 0;
}

function getTotalFromChartPoint(point: any) {
  return Number(
    point?.totalCirculatingUSD?.peggedUSD ||
      point?.totalCirculating?.peggedUSD ||
      point?.totalCirculatingUSD ||
      point?.totalCirculating ||
      0,
  );
}

function getFlowSignal(change7dPct: number) {
  if (change7dPct >= 1) return "entering";
  if (change7dPct <= -1) return "leaving";
  return "neutral";
}

export async function GET() {
  try {
    // 1. Instantly return from RAM if data is fresh (bypasses heavy downloads!)
    if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
      return NextResponse.json(cachedData);
    }

    // 2. Fetch WITHOUT Next.js cache to avoid the 2MB limit error
    const [stableRes, chartRes] = await Promise.all([
      fetch(STABLES_URL, { cache: "no-store" }),
      fetch(CHART_URL, { cache: "no-store" }),
    ]);

    if (!stableRes.ok || !chartRes.ok) {
      // Fallback to old cache if DefiLlama is down
      if (cachedData) return NextResponse.json(cachedData);
      return NextResponse.json(
        { error: "Failed to fetch stablecoin data" },
        { status: 502 },
      );
    }

    const stableJson = await stableRes.json();
    const chartJson = await chartRes.json();

    const chart = Array.isArray(chartJson)
      ? chartJson
          .map((point: any) => ({
            date: point.date,
            value: getTotalFromChartPoint(point),
          }))
          .filter((point) => point.value > 0)
          .slice(-30)
      : [];

    const latest = chart.at(-1)?.value || 0;
    const prev1d = chart.at(-2)?.value || latest;
    const prev7d = chart.at(-8)?.value || latest;

    const change1d = latest - prev1d;
    const change7d = latest - prev7d;
    const change1dPct = pct(latest, prev1d);
    const change7dPct = pct(latest, prev7d);

    const grouped: Record<string, number> = {};

    for (const asset of stableJson.peggedAssets || []) {
      const chains = asset.chainCirculating || {};

      for (const [chain, values] of Object.entries(chains)) {
        const current = (values as any)?.current?.peggedUSD ?? 0;
        grouped[chain] = (grouped[chain] || 0) + current;
      }
    }

    const chains = Object.entries(grouped)
      .map(([chain, value]) => ({
        chain,
        value,
        dominance: latest ? (value / latest) * 100 : 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // 3. Save the processed result to RAM and update the timestamp
    cachedData = {
      updatedAt: new Date().toISOString(),
      totalStablecoins: latest,
      change1d,
      change7d,
      change1dPct,
      change7dPct,
      flowSignal: getFlowSignal(change7dPct),
      isGrowing: change7d >= 0,
      chart,
      chains,
    };
    cacheTimestamp = Date.now();

    return NextResponse.json(cachedData);
  } catch (error) {
    // Fallback to old cache if the server fails
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
