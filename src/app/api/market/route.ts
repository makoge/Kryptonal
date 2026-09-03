import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const HISTORICAL_CYCLE_KNOWLEDGE: Record<string, any> = {
  "2017": {
    theme: "Retail ICO Mania & Proof-of-Work Peak",
    btcPeak: "$19,783 (Dec 2017)",
    ethPeak: "$1,420 (Jan 2018)",
    btcDominanceRange: "37% - 85%",
    catalysts:
      "First mainstream retail adoption wave, Ethereum ERC-20 explosion, CME Bitcoin Futures launch.",
    sentimentProfile:
      "Extreme speculative euphoria driven by unvetted ICO whitepapers.",
    marketLessons:
      "Liquidity dried up instantly once retail capital exhausted; over 90% of altcoins never reclaimed previous highs.",
  },
  "2021": {
    theme: "Institutional Inception, DeFi Summer & Dual Top",
    btcPeak: "$64,800 (Apr 2021) & $68,789 (Nov 2021)",
    ethPeak: "$4,891 (Nov 2021)",
    btcDominanceRange: "39% - 71%",
    catalysts:
      "COVID-19 zero-interest stimulus, MicroStrategy & Tesla treasury allocations, NFT boom, Layer-1 alternative surge (SOL, AVAX, LUNA).",
    sentimentProfile:
      "High institutional interest followed by massive leverage unwind and China mining ban volatility.",
    marketLessons:
      "High derivatives leverage and uncollateralized lending create systemic contagion risks during distribution phases.",
  },
  "2024": {
    theme: "Spot ETF Institutional Era & 4th Halving",
    btcPeak: "$73,750 (Mar 2024 pre-halving ATH)",
    ethPeak: "$4,090 (Mar 2024)",
    btcDominanceRange: "50% - 58%",
    catalysts:
      "SEC approval of US Spot Bitcoin & Ethereum ETFs, BlackRock IBIT inflows, 4th Bitcoin Halving, Memecoin liquidity loops on Solana.",
    sentimentProfile:
      "Bifurcated market: High Bitcoin institutional absorption alongside concentrated speculative rotations in select L1s.",
    marketLessons:
      "ETF liquidity creates sticky structural accumulation for majors while retail liquidity remains highly fragmented across micro-caps.",
  },
};

async function safeFetch(origin: string, path: string) {
  try {
    const res = await fetch(`${origin}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const year: string = body.year || "current";
    const locale: string = body.locale || "en";
    const origin = req.nextUrl.origin;

    let cycleContext: any = {};
    let isCurrent = year === "current";

    if (isCurrent) {
      // Gather live telemetry: Market Cap, Sentiment/Fees, Altseason Index, and Trending News
      const [marketData, stickyData, altseasonData, newsData] =
        await Promise.all([
          safeFetch(origin, "/api/crypto/market-cap"),
          safeFetch(origin, "/api/crypto/sticky-tools"),
          safeFetch(origin, "/api/crypto/altseason"),
          safeFetch(origin, "/api/trending"), // Gathers trending crypto headlines/news
        ]);

      cycleContext = {
        mode: "LIVE_MARKET",
        market: marketData,
        sentiment: {
          fearGreed: stickyData?.fearGreed,
          gasCostsUsd: stickyData?.gas,
          networkAlert: stickyData?.bestOpportunity,
        },
        altseasonIndex: {
          score: altseasonData?.index,
          phase: altseasonData?.phase,
          leaders: altseasonData?.leaders?.slice(0, 3),
          btc30d: altseasonData?.btcChange30d,
        },
        newsHeadlines:
          newsData?.trending ||
          newsData?.news ||
          "Macro liquidity conditions steady.",
      };
    } else {
      cycleContext = {
        mode: "HISTORICAL_CYCLE",
        year,
        profile:
          HISTORICAL_CYCLE_KNOWLEDGE[year] ||
          HISTORICAL_CYCLE_KNOWLEDGE["2021"],
      };
    }

    const systemPrompt = `
You are an institutional cryptocurrency historian and macro strategist. Analyze the given crypto cycle period with depth, precision, and actionable risk frameworks.

PERIOD ANALYZED: ${isCurrent ? "Current Live Market Regime" : `Historical Cycle Benchmark: ${year}`}

CONTEXT DATA:
${JSON.stringify(cycleContext)}

INSTRUCTIONS:
${
  isCurrent
    ? `- Synthesize the current Fear & Greed score with the Altseason Index and recent news sentiment.
     - State whether news momentum is acting as a catalyst or a headwind.
     - Provide actionable portfolio positioning hints (accumulation, hedging, or taking profits).`
    : `- Break down the ${year} cycle dynamics, liquidity drivers, top performing asset classes, and key macro catalysts.
     - Highlight the core cycle lessons and how this historical cycle compares to modern market structure.`
}

STRICT JSON OUTPUT SCHEMA:
Return ONLY valid JSON matching this schema:
{
  "title": "Brief Descriptive Title",
  "regime": "Expansion" | "Distribution" | "Euphoria" | "Capitulation" | "Consolidation",
  "sentimentSummary": "1-2 sentences on market sentiment and macro news direction",
  "macroDrivers": [
    { "title": "Driver Name", "description": "Details regarding liquidity, regulatory catalysts, or adoption" }
  ],
  "assetPerformance": {
    "leaders": "Key assets or sectors leading the period",
    "dynamics": "How Bitcoin Dominance and altcoin liquidity behaved"
  },
  "tacticalHints": [
    "Specific actionable takeaway or historical lesson 1",
    "Specific actionable takeaway or historical lesson 2",
    "Specific risk management guideline"
  ],
  "verdict": "A concise executive takeaway summarizing the cycle's primary takeaway."
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.35,
      max_tokens: 3500,
    });

    let rawContent = completion.choices[0].message.content || "{}";
    rawContent = rawContent
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();
    const result = JSON.parse(rawContent);

    return NextResponse.json({
      year,
      ...result,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Market Analysis Engine Error:", error);
    return NextResponse.json(
      { error: "Failed to generate market cycle intelligence" },
      { status: 500 },
    );
  }
}
