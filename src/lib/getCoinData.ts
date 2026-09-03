// src/lib/getCoinData.ts

export async function getCoinData(id: string) {
  const headers: Record<string, string> = {};

  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  }

  try {
    const [detailsRes, chartRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        {
          headers,
          next: { revalidate: 120 }, // Cache on server for 2 minutes
        },
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
        {
          headers,
          next: { revalidate: 120 },
        },
      ),
    ]);

    if (!detailsRes.ok) return null;

    const details = await detailsRes.json();
    const chart = chartRes.ok ? await chartRes.json() : { prices: [] };

    // Format chart prices for Recharts
    const formattedChart = (chart.prices || []).map(
      ([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          timeZone: "UTC",
        }),
        price,
      }),
    );

    return {
      details,
      chartData: formattedChart,
    };
  } catch (error) {
    console.error(`Failed to fetch server data for ${id}:`, error);
    return null;
  }
}
