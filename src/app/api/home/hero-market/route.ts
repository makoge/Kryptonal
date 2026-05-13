import { NextResponse } from "next/server";

export const revalidate = 60;

function compactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function pct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export async function GET() {
  try {
    const [chainsRes, stableRes, btcRes, ethRes] = await Promise.all([
      fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 60 } }),
      fetch("https://stablecoins.llama.fi/stablecoins", { next: { revalidate: 60 } }),
      fetch("https://coins.llama.fi/prices/current/coingecko:bitcoin", {
        next: { revalidate: 60 },
      }),
      fetch("https://coins.llama.fi/prices/current/coingecko:ethereum", {
        next: { revalidate: 60 },
      }),
    ]);

    if (!chainsRes.ok || !stableRes.ok || !btcRes.ok || !ethRes.ok) {
      throw new Error("DefiLlama API error");
    }

    const chains = await chainsRes.json();
    const stablecoins = await stableRes.json();
    const btc = await btcRes.json();
    const eth = await ethRes.json();

    const totalTvl = chains.reduce((sum: number, chain: any) => {
      return sum + Number(chain.tvl || 0);
    }, 0);

    const tvlChange1d =
      chains.reduce((sum: number, chain: any) => {
        return sum + Number(chain.change_1d || 0);
      }, 0) / Math.max(chains.length, 1);

    const totalStablecoins = Number(
      stablecoins?.totalCirculatingUSD?.peggedUSD || 0
    );

    const stableChange1d = Number(
      stablecoins?.change_1d?.peggedUSD || 0
    );

    const btcPrice = Number(
      btc?.coins?.["coingecko:bitcoin"]?.price || 0
    );

    const ethPrice = Number(
      eth?.coins?.["coingecko:ethereum"]?.price || 0
    );

    const mood =
      tvlChange1d > 1 && stableChange1d > 0
        ? "Risk-On"
        : tvlChange1d < -1
        ? "Cautious"
        : "Neutral";

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      items: [
        {
          label: "BTC",
          value: compactUsd(btcPrice),
          change: "Live price",
          tone: "emerald",
        },
        {
          label: "ETH",
          value: compactUsd(ethPrice),
          change: "Live price",
          tone: "cyan",
        },
        {
          label: "DeFi TVL",
          value: compactUsd(totalTvl),
          change: pct(tvlChange1d),
          tone: tvlChange1d >= 0 ? "emerald" : "red",
        },
        {
          label: "Stablecoins",
          value: compactUsd(totalStablecoins),
          change: pct(stableChange1d),
          tone: stableChange1d >= 0 ? "emerald" : "amber",
        },
        {
          label: "Market Mood",
          value: mood,
          change: "Derived from DeFi flow",
          tone:
            mood === "Risk-On"
              ? "emerald"
              : mood === "Cautious"
              ? "red"
              : "amber",
        },
      ],
    });
  } catch {
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        items: [
          { label: "BTC", value: "Unavailable", change: "Retry soon", tone: "amber" },
          { label: "ETH", value: "Unavailable", change: "Retry soon", tone: "amber" },
          { label: "DeFi TVL", value: "Unavailable", change: "Retry soon", tone: "amber" },
          { label: "Stablecoins", value: "Unavailable", change: "Retry soon", tone: "amber" },
          { label: "Market Mood", value: "Neutral", change: "Fallback", tone: "amber" }
        ],
      },
      { status: 200 }
    );
  }
}