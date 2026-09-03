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

// In-Memory Rate Limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_GUEST_CALLS = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function safeFetch(origin: string, path: string) {
  try {
    const res = await fetch(`${origin}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(`Fetch failed for ${path}:`, e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const mode: Mode = body.mode || "all";
    const origin = req.nextUrl.origin;

    let targetData: any = {};
    let modeInstructions = "";

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
        modeInstructions = `Analyze ONLY Crypto Sector Rotation & Narrative Momentum. Identify which sectors are absorbing liquidity and which are bleeding.`;
        break;
      case "leverage":
        targetData = {
          leverage: await safeFetch(origin, "/api/analysis/leverage-risk"),
        };
        modeInstructions = `Analyze ONLY Derivatives Leverage, Funding Rates, and Open Interest. Evaluate if funding is overheated and if squeeze risks exist.`;
        break;
      case "chains":
        targetData = {
          chains: await safeFetch(origin, "/api/analysis/chains"),
        };
        modeInstructions = `Analyze ONLY Layer-1 & Layer-2 Blockchain Ecosystems and TVL growth.`;
        break;
      case "market":
        targetData = {
          market: await safeFetch(origin, "/api/crypto/market-cap"),
        };
        modeInstructions = `Analyze ONLY Macro Market Cap, Cycle Phase, and Bitcoin/Ethereum Dominance.`;
        break;
      case "all":
      default:
        // Sequential fetch prevents local Next.js deadlock
        const market = await safeFetch(origin, "/api/crypto/market-cap");
        const stable = await safeFetch(origin, "/api/analysis/stablecoins");
        const chains = await safeFetch(origin, "/api/analysis/chains");
        const sectors = await safeFetch(origin, "/api/analysis/sectors");
        const leverage = await safeFetch(origin, "/api/analysis/leverage-risk");

        targetData = { market, stablecoins: stable, chains, sectors, leverage };
        modeInstructions = `
SYNTHESIZE A COMPLETE MACRO TACTICAL PLAYBOOK.
Do not simply repeat individual metrics. Synthesize the intersection of stablecoin liquidity, leverage heat, and sector rotation into an executive game plan.
1. Provide a definitive Market Signal (Bullish, Bearish, or Neutral) and a numerical Confluence Score (0 to 100).
2. Formulate a 2-part playbook:
   - "shortTerm": Tactical stance for the next 1–7 days (volatility risk, funding extremes, squeeze traps).
   - "longTerm": Strategic posture for the next 1–3 months (DCA safety, macro trend strength, capital preservation).
3. "radar.focusOn": Identify 2-3 specific crypto sectors, chains, or setups showing genuine strength/inflows.
4. "radar.avoidOrDeRisk": Identify 2-3 specific sectors, overheated perps, or decaying narratives that traders should avoid or de-risk from.`;
        break;
    }

    const systemPrompt = `
You are a senior quantitative crypto market strategist. Deliver sharp, actionable, institutional-grade market intelligence.

TASK:
${modeInstructions}

STRICT JSON OUTPUT FORMAT:
Return strictly valid JSON matching this schema:
{
  "marketSignal": "Bullish" | "Bearish" | "Neutral",
  "confluenceScore": 75,
  "conclusion": "A direct 2-sentence executive briefing summarizing the impact and bias.",
  "playbook": {
    "shortTerm": "Tactical 1-7 day stance...",
    "longTerm": "Strategic 1-3 month posture..."
  },
  "radar": {
    "focusOn": [
      { "name": "Asset/Sector/Chain", "reason": "Specific data-backed reason for strength", "badge": "Inflows" }
    ],
    "avoidOrDeRisk": [
      { "name": "Asset/Sector/Chain", "reason": "Specific risk/leverage trap reason", "badge": "High Risk" }
    ]
  },
  "sections": [
    {
      "title": "Section Title",
      "signal": "Bullish" | "Bearish" | "Neutral",
      "summary": "1-sentence summary",
      "what": "Exact metrics observed",
      "why": "Why this matters",
      "outcomes": "Market projection",
      "takeaway": "Actionable takeaway"
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
      temperature: 0.35,
      max_tokens: 3500,
    });

    let rawContent = completion.choices[0].message.content || "{}";
    rawContent = rawContent
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();

    const generatedBrief = JSON.parse(rawContent);

    return NextResponse.json({
      mode,
      marketSignal: generatedBrief.marketSignal || "Neutral",
      confluenceScore: generatedBrief.confluenceScore || 50,
      conclusion:
        generatedBrief.conclusion || "Analysis generated successfully.",
      playbook: generatedBrief.playbook || null,
      radar: generatedBrief.radar || null,
      sections: generatedBrief.sections || [],
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI Analysis Engine Error:", error);
    return NextResponse.json(
      { error: "Failed to generate market intelligence" },
      { status: 500 },
    );
  }
}
