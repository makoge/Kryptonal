import { NextResponse } from "next/server";

// Map symbols to CoinGecko IDs
const COIN_IDS: Record<string, string> = {
  APT: "aptos",
  ARB: "arbitrum",
  OP: "optimism-ethereum",
  SUI: "sui",
  KAITO: "kaito",
  BEAT: "audiera",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.toUpperCase() || "APT";
  const coinId = COIN_IDS[symbol];

  if (!coinId) {
    return NextResponse.json(
      { success: false, error: "Unknown coin symbol" },
      { status: 400 },
    );
  }

  try {
    // Fetch live market data (price and 24h volume) from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    );

    if (!response.ok) throw new Error("Failed to fetch market data");

    const data = await response.json();
    const coin = data[0];

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        price: coin?.current_price || 0,
        dailyVolume: coin?.total_volume || 0,
        // Approximate liquidity depth as ~25% of 24h volume if DEX depth API isn't connected
        estimatedLiquidity: Math.round((coin?.total_volume || 0) * 0.25),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch live prices" },
      { status: 500 },
    );
  }
}
