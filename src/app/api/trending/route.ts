import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function getLiveHeadlines() {
  try {
    const query = encodeURIComponent(
      "cryptocurrency (Warsh OR BlackRock OR SEC OR MicroStrategy OR Elon Musk)",
    );
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";

    const xml = await res.text();
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    return items
      .slice(0, 10)
      .map((item) => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1] || "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
        return `- ${title.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")} (${pubDate})`;
      })
      .join("\n");
  } catch (error) {
    console.error("Failed to fetch RSS headlines:", error);
    return "";
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";
    const liveHeadlines = await getLiveHeadlines();

    const systemPrompt = `You are an institutional cryptocurrency market intelligence parser.
Return ONLY a valid JSON object matching the schema below.
CRITICAL FORMAT RULES:
- Never output markdown fences (no \`\`\`json or \`\`\`).
- Never use unescaped double quotes inside values. Use single quotes if quoting someone.
- You MUST translate the fields "name", "role", "latestStatement", "timeAgo", and "assetAffected" into the language "${locale}".
- DO NOT translate the "id" field.
- DO NOT translate the "sentiment" field. It must remain exactly "bullish", "bearish", or "neutral" in English.

Schema:
{
  "movers": [
    {
      "id": "fed",
      "name": "Federal Reserve (Kevin Warsh)",
      "role": "US Monetary Policy & Liquidity",
      "impactScore": 98,
      "latestStatement": "Short statement under 14 words without nested double quotes",
      "timeAgo": "Live Macro Track",
      "sentiment": "neutral",
      "assetAffected": "All Markets / BTC"
    }
  ]
}

HEADLINES CONTEXT:
${liveHeadlines || "No live headlines available. Synthesize ongoing macro strategy."}`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate the market movers radar JSON in locale "${locale}".`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "market_movers_radar",
          strict: true,
          schema: {
            type: "object",
            properties: {
              movers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    role: { type: "string" },
                    impactScore: { type: "number" },
                    latestStatement: { type: "string" },
                    timeAgo: { type: "string" },
                    sentiment: {
                      type: "string",
                      enum: ["bullish", "bearish", "neutral"],
                    },
                    assetAffected: { type: "string" },
                  },
                  required: [
                    "id",
                    "name",
                    "role",
                    "impactScore",
                    "latestStatement",
                    "timeAgo",
                    "sentiment",
                    "assetAffected",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["movers"],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.1,
      max_tokens: 1500,
    });

    const rawContent =
      completion.choices[0]?.message?.content?.trim() || '{"movers":[]}';
    const cleanContent = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const data = JSON.parse(cleanContent);

    if (
      !data.movers ||
      !Array.isArray(data.movers) ||
      data.movers.length === 0
    ) {
      throw new Error("Invalid movers payload structure returned from LLM");
    }

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      movers: data.movers,
    });
  } catch (error: any) {
    // Extract Groq's hidden 'failed_generation' field if it exists
    const failedGen =
      error?.error?.failed_generation || error?.failed_generation;

    if (failedGen) {
      console.error("🚨 Groq Failed Generation Dump:\n", failedGen);
    } else {
      console.error("Trending API Error:", error?.message || error);
    }

    return NextResponse.json(
      {
        error: "Failed to generate trending market movers",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
