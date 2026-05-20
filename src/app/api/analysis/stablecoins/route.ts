import { NextResponse } from "next/server";

const STABLES_URL =
  "https://stablecoins.llama.fi/stablecoins?includePrices=true";

const CHART_URL = "https://stablecoins.llama.fi/stablecoincharts/all";

function pct(now: number, prev: number) {
  return prev > 0 ? ((now - prev) / prev) * 100 : 0;
}

function getTotalFromChartPoint(point: any) {
  return Number(
    point?.totalCirculatingUSD?.peggedUSD ||
      point?.totalCirculating?.peggedUSD ||
      point?.totalCirculatingUSD ||
      point?.totalCirculating ||
      0
  );
}

function getFlowSignal(change7dPct: number) {
  if (change7dPct >= 1) return "Liquidity entering";
  if (change7dPct <= -1) return "Liquidity leaving";
  return "Liquidity neutral";
}

export async function GET() {
  try {
    const [stableRes, chartRes] = await Promise.all([
      fetch(STABLES_URL, { next: { revalidate: 300 } }),
      fetch(CHART_URL, { next: { revalidate: 300 } }),
    ]);

    if (!stableRes.ok || !chartRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch stablecoin data" },
        { status: 502 }
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

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}