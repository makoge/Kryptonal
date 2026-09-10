// src/lib/getCoinData.ts

export async function getCoinData(id: string) {
  // 1. Pull your API key from the environment variables
  const apiKey = process.env.COINGECKO_API_KEY;

  // 2. Set up the headers object to reuse in your fetches
  const fetchOptions = {
    headers: {
      "x-cg-demo-api-key": apiKey || "",
    },
  };

  try {
    // 3. Add the fetchOptions to your CoinGecko requests
    const [detailsRes, chartRes] = await Promise.all([
      fetch(`https://api.coingecko.com/api/v3/coins/${id}`, fetchOptions),
      // (Assuming you fetch chart data here too. Add fetchOptions to it!)
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
        fetchOptions,
      ),
    ]);

    // 4. Handle Rate Limits specifically
    if (detailsRes.status === 429 || chartRes.status === 429) {
      return { error: "rate_limit" };
    }

    if (!detailsRes.ok || !chartRes.ok) {
      return null;
    }

    // ... existing fetch logic ...
    const details = await detailsRes.json();
    const chartData = await chartRes.json();

    // Format the raw arrays [timestamp, price] into the objects Recharts expects
    const formattedChart = (chartData.prices || []).map(
      ([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          timeZone: "UTC",
        }),
        price: price,
      }),
    );

    // Return the perfectly formatted data
    return {
      details,
      chartData: formattedChart,
    };
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return null;
  }
}
