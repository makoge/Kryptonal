// src/lib/getGatePair.ts

export async function checkGatePair(symbol: string): Promise<string | null> {
  if (!symbol) return null;

  const pair = `${symbol.toUpperCase()}_USDT`;

  try {
    // Gate.io v4 public endpoint (No API key needed)
    const res = await fetch(
      `https://api.gateio.ws/api/v4/spot/currency_pairs/${pair}`,
      {
        next: { revalidate: 86400 }, // Cache on CDN for 24 hours
      },
    );

    if (!res.ok) return null;

    const data = await res.json();

    // Verify the pair is actively open for trading
    if (data && data.trade_status === "tradable") {
      return data.id; // e.g. "BTC_USDT"
    }

    return null;
  } catch (error) {
    console.error(`Failed to verify Gate.io pair for ${symbol}:`, error);
    return null;
  }
}
