// src/lib/gaming/getGamingDailyPulse.ts

import type { GamingMarketPulse } from "./getGamingMarketPulse";

type Sentiment =
  | "bullish"
  | "improving"
  | "neutral"
  | "cooling"
  | "bearish";

type Level =
  | "low"
  | "medium"
  | "high";

export function getGamingDailyPulse(
  pulse: GamingMarketPulse
): {
  summary: string;
  sentiment: Sentiment;
  risk: Level;
  opportunity: Level;
} {
  const change = Number(pulse.change24h || 0);

  const topCoin = pulse.topCoins?.[0];

  const sentiment: Sentiment =
    change >= 5
      ? "bullish"
      : change >= 1
      ? "improving"
      : change <= -5
      ? "bearish"
      : change < 0
      ? "cooling"
      : "neutral";

  const risk: Level =
    Math.abs(change) >= 8
      ? "high"
      : Math.abs(change) >= 3
      ? "medium"
      : "low";

  const opportunity: Level =
    change >= 3
      ? "high"
      : change >= 0
      ? "medium"
      : "low";

  const summary =
    change >= 3
      ? `Gaming crypto momentum is strengthening as the sector is up ${change.toFixed(
          2
        )}% in 24h. ${
          topCoin
            ? `${topCoin.symbol} is leading today’s gaming movers with ${topCoin.change24h.toFixed(
                2
              )}%.`
            : ""
        }`
      : change <= -3
      ? `Gaming crypto momentum is cooling as the sector is down ${Math.abs(
          change
        ).toFixed(
          2
        )}% in 24h. This suggests traders are becoming more cautious around gaming tokens today.`
      : `Gaming crypto is moving sideways with a ${change.toFixed(
          2
        )}% 24h sector change. The market looks selective, so stronger ecosystems may matter more than hype today.`;

  return {
    summary,
    sentiment,
    risk,
    opportunity,
  };
}