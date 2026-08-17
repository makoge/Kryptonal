import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

type Mode =
  | "all"
  | "market"
  | "stablecoins"
  | "chains"
  | "sectors"
  | "leverage";

// --- RATE LIMITING SETUP ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_GUEST_CALLS = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
// ---------------------------

async function safeFetch(origin: string, path: string) {
  try {
    const res = await fetch(`${origin}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(`Fetch failed for ${path}:`, e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // --- RATE LIMIT CHECK ---
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();

    let userLimit = rateLimitMap.get(ip);
    if (!userLimit || now > userLimit.resetAt) {
      userLimit = { count: 0, resetAt: now + ONE_DAY_MS };
    }

    if (userLimit.count >= MAX_GUEST_CALLS) {
      return NextResponse.json(
        { error: "Daily limit reached." },
        { status: 429 },
      );
    }

    userLimit.count += 1;
    rateLimitMap.set(ip, userLimit);
    // ------------------------

    const body = await req.json();
    const mode: Mode = body.mode || "all";
    const origin = req.nextUrl.origin;

    let targetData: any = {};
    let modeInstructions = "";

    // 🚀 SMART FETCHING: Only fetch the exact data requested to prevent server timeouts!
    switch (mode) {
      case "stablecoins":
        targetData = {
          stablecoins: await safeFetch(origin, "/api/analysis/stablecoins"),
        };
        modeInstructions = `Analyze ONLY Stablecoin Liquidity & Supply Flows. Evaluate whether fresh capital is entering (dry powder) or exiting crypto, and determine the direct liquidity impact on market depth.`;
        break;
      case "sectors":
        targetData = {
          sectors: await safeFetch(origin, "/api/analysis/sectors"),
        };
        modeInstructions = `Analyze ONLY Crypto Sector Rotation & Narrative Momentum. Identify which sectors are absorbing liquidity, which are bleeding, and whether narrative strength is broad or isolated.`;
        break;
      case "leverage":
        targetData = {
          leverage: await safeFetch(origin, "/api/analysis/leverage-risk"),
        };
        modeInstructions = `Analyze ONLY Derivatives Leverage, Funding Rates, and Open Interest. Evaluate if funding is overheated, if long/short squeeze risk is imminent, and whether leverage is healthy or dangerous.`;
        break;
      case "chains":
        targetData = {
          chains: await safeFetch(origin, "/api/analysis/chains"),
        };
        modeInstructions = `Analyze ONLY Layer-1 & Layer-2 Blockchain Ecosystems and TVL growth. Identify capital concentration between major chains.`;
        break;
      case "market":
        targetData = {
          market: await safeFetch(origin, "/api/crypto/market-cap"),
        };
        modeInstructions = `Analyze ONLY Macro Market Cap, Cycle Phase, and Bitcoin/Ethereum Dominance.`;
        break;
      case "all":
      default:
        // Only fetch everything if they specifically ask for "Full Market"
        const [market, stable, chains, sectors, leverage] = await Promise.all([
          safeFetch(origin, "/api/crypto/market-cap"),
          safeFetch(origin, "/api/analysis/stablecoins"),
          safeFetch(origin, "/api/analysis/chains"),
          safeFetch(origin, "/api/analysis/sectors"),
          safeFetch(origin, "/api/analysis/leverage-risk"),
        ]);
        targetData = { market, stablecoins: stable, chains, sectors, leverage };
        modeInstructions = `Provide a comprehensive multi-pillar briefing covering Macro Market, Stablecoins, Chains, Sectors, and Leverage.`;
        break;
    }

    const systemPrompt = `
You are a senior quantitative crypto strategist.
Deliver a sharp, realistic, and institutional intelligence briefing based ONLY on the data below.
If the data array is empty or null, state clearly that data is currently unavailable for this metric.

TASK:
${modeInstructions}

STRICT GUIDELINES:
1. ONLY discuss the requested focus area (${mode.toUpperCase()}).
2. Classify the overall market signal and each section's signal as strictly one of: "Bullish", "Bearish", or "Neutral".
3. Use specific numbers from the data. 

RESPONSE FORMAT:
Return strictly valid JSON matching this exact structure:
{
  "marketSignal": "Bullish" | "Bearish" | "Neutral",
  "conclusion": "A direct 2-sentence executive briefing summarizing the impact and bias.",
  "sections": [
    {
      "title": "Clear Section Title",
      "signal": "Bullish" | "Bearish" | "Neutral",
      "summary": "1-sentence concise bottom line.",
      "what": "Exact metrics, numbers, and data points observed.",
      "why": "Why this matters to traders and capital flows.",
      "outcomes": "Projected market impact and potential scenario.",
      "takeaway": "Actionable risk or opportunity takeaway."
    }
  ]
}

LIVE TELEMETRY DATA:
${JSON.stringify(targetData)}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.4, // Lowered slightly to prevent hallucination
    });

    // 🛡️ JSON SANITIZER: Clean up Markdown formatting if AI includes it
    let rawContent = completion.choices[0].message.content || "{}";
    rawContent = rawContent
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();

    let generatedBrief;
    try {
      generatedBrief = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("AI JSON Parse Error. Raw Output:", rawContent);
      throw new Error("Failed to parse AI response into JSON");
    }

    return NextResponse.json({
      mode,
      marketSignal: generatedBrief.marketSignal || "Neutral",
      conclusion:
        generatedBrief.conclusion || "Analysis generated successfully.",
      sections: generatedBrief.sections || [],
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Analysis Engine Error:", error);
    return NextResponse.json(
      { error: "Failed to generate market intelligence" },
      { status: 500 },
    );
  }
}
