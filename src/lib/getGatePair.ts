// src/lib/getGatePair.ts
import { cache } from "react";

// Only allow clean alphanumeric ticker symbols (e.g., BTC, ETH, 1INCH)
const VALID_SYMBOL_REGEX = /^[A-Z0-9]{1,15}$/;

export const checkGatePair = cache(
  async (symbol: string): Promise<string | null> => {
    if (!symbol) return null;

    const cleanSymbol = symbol.trim().toUpperCase();
    if (!VALID_SYMBOL_REGEX.test(cleanSymbol)) return null;

    const pair = `${cleanSymbol}_USDT`;

    try {
      // Gate.io v4 public endpoint (No API key needed)
      // Abort after 2500ms so a slow Gate.io response never hangs page rendering
      const res = await fetch(
        `https://api.gateio.ws/api/v4/spot/currency_pairs/${pair}`,
        {
          next: { revalidate: 86400 }, // Cache response for 24 hours
          signal: AbortSignal.timeout(2500),
        },
      );

      if (!res.ok) return null;

      const data = await res.json();

      // Verify the pair is actively open for trading
      if (data && data.trade_status === "tradable") {
        return data.id; // e.g. "BTC_USDT"
      }

      return null;
    } catch {
      // Silently return null on timeout or network error so page render still succeeds
      return null;
    }
  },
);
