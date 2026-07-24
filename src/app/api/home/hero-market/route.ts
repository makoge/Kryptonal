import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.COINGECKO_DEMO_KEY || "";

  try {
    // Fetch top 250 coins in 1 API request to cover the full Top 200 market cap
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h&x_cg_demo_api_key=${apiKey}`,
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    );

    if (!res.ok) {
      throw new Error(`CoinGecko HTTP error! status: ${res.status}`);
    }

    const coins = await res.json();

    // Map all 200+ coins cleanly
    const mappedCoins = coins
      .filter((c: any) => typeof c.price_change_percentage_24h === "number")
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        image: coin.image,
        rank: coin.market_cap_rank,
      }));

    // Calculate true Top 10 Gainers across all 200 coins
    const sortedGainers = [...mappedCoins]
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 10);

    return NextResponse.json({
      gainers: sortedGainers,
      allCoins: mappedCoins, // Returns full top 200 list for search/favorites
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Hero market fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero market data", gainers: [], allCoins: [] },
      { status: 500 },
    );
  }
}
