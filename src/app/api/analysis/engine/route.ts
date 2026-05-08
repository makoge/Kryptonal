import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

const HALVING_DATE = new Date("2024-04-20T00:00:00Z").getTime();

function formatCap(value: number) {
  return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
}

function getCyclePhase(marketCap: number) {
  if (marketCap < 1_200_000_000_000) return "Accumulation";
  if (marketCap < 2_300_000_000_000) return "Early Expansion";
  if (marketCap < 3_000_000_000_000) return "Expansion";
  return "Late Cycle";
}

function getRisk(marketCap: number, change: number) {
  if (change < -3) return "High";
  if (marketCap > 3_000_000_000_000) return "High";
  if (marketCap > 2_300_000_000_000) return "Moderate";
  return "Lower";
}

function getSignal(change: number) {
  if (change > 3) return "Strong bullish momentum";
  if (change > 0) return "Mild bullish momentum";
  if (change > -3) return "Weak or neutral momentum";
  return "Bearish pressure";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = body.mode || "full";

    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const res = await fetch(`${API_URL}/global`, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Market data failed" }, { status: 502 });
    }

    const json = await res.json();
    const data = json.data;

    const marketCap = data.total_market_cap.usd;
    const change = data.market_cap_change_percentage_24h_usd;
    const btcDominance = data.market_cap_percentage.btc;
    const ethDominance = data.market_cap_percentage.eth;

    const phase = getCyclePhase(marketCap);
    const risk = getRisk(marketCap, change);
    const signal = getSignal(change);

    const daysPostHalving = Math.floor(
      (Date.now() - HALVING_DATE) / (1000 * 60 * 60 * 24)
    );

    const generatedAt = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const analysis = `Cryptonal Deep Market Intelligence
Generated: ${generatedAt}

1. Market Cycle Read
The total crypto market cap is currently ${formatCap(marketCap)}. Based on current valuation levels, the market appears to be in the ${phase} phase.

Bitcoin is approximately ${daysPostHalving} days after the 2024 halving. Historically, crypto markets often become more active after halving events, but timing can vary by cycle.

2. Trend Strength
The total crypto market cap changed ${change.toFixed(2)}% in the last 24 hours. This suggests: ${signal}.

So what?
Short-term momentum is useful, but users should avoid making decisions from one daily move alone. The bigger context is whether market cap, Bitcoin dominance, and liquidity are improving together.

3. Bitcoin Dominance
Bitcoin dominance is currently ${btcDominance.toFixed(2)}%.

So what?
When Bitcoin dominance is high, capital is usually concentrated in BTC. Altcoins may underperform until dominance starts falling and liquidity rotates into smaller assets.

4. Ethereum & Altcoin Signal
Ethereum dominance is currently ${ethDominance.toFixed(2)}%.

So what?
If ETH dominance starts rising while BTC dominance cools, it can suggest early altcoin rotation. If ETH remains weak, the market may still be Bitcoin-led.

5. Risk Management
Current risk level: ${risk}.

Practical interpretation:
- Avoid excessive leverage.
- Do not chase green candles emotionally.
- Scale into positions gradually.
- Always define invalidation levels before buying.
- Historical data gives context, not certainty.

6. What People Are Likely Doing
In the ${phase} phase, users often:
- Hold stronger assets.
- Watch Bitcoin dominance.
- Compare current valuation with previous cycle highs.
- Wait for confirmation before rotating heavily into altcoins.

7. Final Takeaway
The market is not only about price. The important question is: why is capital moving, where is it concentrated, and what happens next?

Cryptonal View:
This looks like a ${phase.toLowerCase()} environment with ${risk.toLowerCase()} risk. The smartest approach is patience, position sizing, and watching whether liquidity expands beyond Bitcoin.

Source: Cryptonal
Disclaimer: Educational content only. Not financial advice. Crypto markets are highly volatile.`;

    return NextResponse.json({
      mode,
      marketCap,
      change,
      btcDominance,
      ethDominance,
      phase,
      risk,
      daysPostHalving,
      analysis,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}