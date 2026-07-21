import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing coin ID" }, { status: 400 });
  }

  // Grab the key from the restarted server environment
  const apiKey = process.env.COINGECKO_DEMO_KEY || "";

  try {
    // We attach the key directly to the end of the URL using ?x_cg_demo_api_key=
    const [chartRes, detailRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&x_cg_demo_api_key=${apiKey}`,
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&x_cg_demo_api_key=${apiKey}`,
      ),
    ]);

    if (!chartRes.ok || !detailRes.ok) {
      throw new Error(`CoinGecko Error: ${chartRes.status}`);
    }

    const chartJson = await chartRes.json();
    const detailJson = await detailRes.json();

    return NextResponse.json({
      chart: chartJson,
      details: detailJson,
    });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
