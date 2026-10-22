import { NextRequest, NextResponse } from "next/server";

export const revalidate = 1800;
export const maxDuration = 30;

const localeCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 30 * 60 * 1000;

type RawHeadline = {
  title: string;
  pubDate: string;
};

async function getLiveHeadlines(): Promise<RawHeadline[]> {
  try {
    const query = encodeURIComponent(
      "cryptocurrency (Federal Reserve OR BlackRock OR SEC OR MicroStrategy OR Bitcoin ETF)",
    );
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

    const res = await fetch(url, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    return items.slice(0, 8).map((item) => {
      const rawTitle = item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const cleanTitle = rawTitle
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .split(" - ")[0]
        .trim();
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      return { title: cleanTitle, pubDate };
    });
  } catch (error) {
    console.error("Failed to fetch RSS headlines:", error);
    return [];
  }
}

const FALLBACK_MOVERS = [
  {
    id: "fed",
    name: "Federal Reserve",
    role: "US Monetary Policy & Liquidity",
    impactScore: 95,
    latestStatement:
      "Macro rate posture monitoring ongoing financial market liquidity.",
    timeAgo: "Live Macro Track",
    sentiment: "neutral",
    assetAffected: "All Markets / BTC",
  },
  {
    id: "blackrock",
    name: "BlackRock (Larry Fink)",
    role: "Institutional Capital & Spot ETFs",
    impactScore: 92,
    latestStatement:
      "Global sovereign wealth funds expanding digital asset allocations.",
    timeAgo: "Live Flow Track",
    sentiment: "bullish",
    assetAffected: "BTC / ETH",
  },
  {
    id: "sec",
    name: "US SEC",
    role: "Securities & Regulatory Guidance",
    impactScore: 88,
    latestStatement:
      "Clear regulatory frameworks progressing across crypto-asset sectors.",
    timeAgo: "Regulatory Track",
    sentiment: "neutral",
    assetAffected: "Altcoins / DeFi",
  },
];

function buildMoversFromRSS(headlines: RawHeadline[]) {
  if (!headlines.length) return FALLBACK_MOVERS;

  return headlines.slice(0, 4).map((h, idx) => {
    const lower = h.title.toLowerCase();
    const isBlackRock = lower.includes("blackrock") || lower.includes("etf");
    const isSEC = lower.includes("sec") || lower.includes("regul");
    const isFed =
      lower.includes("fed") ||
      lower.includes("rate") ||
      lower.includes("warsh");
    const isMSTR = lower.includes("microstrategy") || lower.includes("saylor");

    const sentiment =
      lower.includes("surge") ||
      lower.includes("buy") ||
      lower.includes("inflow") ||
      lower.includes("approv") ||
      lower.includes("bull")
        ? "bullish"
        : lower.includes("drop") ||
            lower.includes("sue") ||
            lower.includes("outflow") ||
            lower.includes("crash") ||
            lower.includes("bear")
          ? "bearish"
          : "neutral";

    return {
      id: `live-mover-${idx}`,
      name: isBlackRock
        ? "BlackRock & Spot ETFs"
        : isSEC
          ? "US SEC & Regulators"
          : isFed
            ? "Federal Reserve / Macro"
            : isMSTR
              ? "MicroStrategy"
              : "Institutional Desk",
      role: isBlackRock
        ? "Institutional ETF Flows"
        : isSEC
          ? "Regulatory Oversight"
          : isFed
            ? "Macro Liquidity & Rates"
            : "Market Catalyst",
      impactScore: 94 - idx * 3,
      latestStatement:
        h.title.split(" ").slice(0, 15).join(" ") +
        (h.title.split(" ").length > 15 ? "..." : ""),
      timeAgo: "Live RSS Track",
      sentiment,
      assetAffected:
        isBlackRock || isMSTR
          ? "BTC / ETH"
          : isSEC
            ? "Altcoins / DeFi"
            : "All Markets",
    };
  });
}

async function generateWithGroq(systemPrompt: string, locale: string) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  // Keep max_completion_tokens <= 450 so it never exceeds Groq's 1,000 OTPM free-tier limit
  const modelConfigs = [
    {
      model: "qwen/qwen3.8-27b",
      maxTokens: 420,
      extraParams: {
        reasoning_effort: "none",
        reasoning_format: "hidden",
        response_format: { type: "json_object" },
      },
    },
    {
      model: "openai/gpt-oss-20b",
      maxTokens: 550,
      extraParams: {
        reasoning_effort: "low",
        include_reasoning: false,
        response_format: { type: "json_object" },
      },
    },
    {
      model: "openai/gpt-oss-120b",
      maxTokens: 550,
      extraParams: {
        reasoning_effort: "low",
        include_reasoning: false,
        response_format: { type: "json_object" },
      },
    },
  ];

  let lastError = "";

  for (const config of modelConfigs) {
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Return valid JSON with a "movers" array containing 3 items for locale "${locale}". Keep statements concise.`,
              },
            ],
            temperature: 0.2,
            max_completion_tokens: config.maxTokens,
            ...config.extraParams,
          }),
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const errBody = await res.text();
        lastError = `${res.status} on ${config.model}: ${errBody}`;
        console.warn("Groq model attempt failed:", lastError);
        continue;
      }

      const completion = await res.json();
      const content = completion.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err: any) {
      lastError = err?.message || String(err);
      console.warn(`Groq exception on ${config.model}:`, lastError);
    }
  }

  throw new Error(`All Groq models failed. Last error: ${lastError}`);
}

// Safely extract the first JSON object { ... } from the response string
function extractJsonObject(raw: string): any {
  const withoutThink = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const firstBrace = withoutThink.indexOf("{");
  const lastBrace = withoutThink.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSlice = withoutThink.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSlice);
  }
  return JSON.parse(withoutThink);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get("locale") || "en").slice(0, 5);

  const cached = localeCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  }

  const headlinesList = await getLiveHeadlines();
  const formattedHeadlines = headlinesList
    .map((h) => `- ${h.title} (${h.pubDate})`)
    .join("\n");

  try {
    const systemPrompt = `You are an institutional cryptocurrency market intelligence parser.
Output pure, valid JSON with a root object containing a "movers" array. Do not include markdown tags.

Each item in "movers" must have these exact keys:
- "id": string (unique identifier, e.g. "fed", "blackrock", "sec")
- "name": string (entity name, translated to locale: "${locale}")
- "role": string (entity role, translated to locale: "${locale}")
- "impactScore": number (1 to 100)
- "latestStatement": string (brief statement, max 16 words, translated to locale: "${locale}")
- "timeAgo": string (e.g. "Live Track", translated to locale: "${locale}")
- "sentiment": string (must be exactly "bullish", "bearish", or "neutral")
- "assetAffected": string (e.g. "BTC", "ETH", "All Markets")

HEADLINES CONTEXT:
${formattedHeadlines || "No live headlines available. Synthesize ongoing macro strategy."}`;

    const rawContent = await generateWithGroq(systemPrompt, locale);
    const parsed = extractJsonObject(rawContent);

    const movers =
      Array.isArray(parsed?.movers) && parsed.movers.length > 0
        ? parsed.movers
        : buildMoversFromRSS(headlinesList);

    const payload = {
      updatedAt: new Date().toISOString(),
      movers,
    };

    localeCache.set(locale, { timestamp: Date.now(), data: payload });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error: any) {
    console.warn("Groq fallback triggered:", error?.message || error);

    const fallbackPayload = {
      updatedAt: new Date().toISOString(),
      movers: buildMoversFromRSS(headlinesList),
    };

    localeCache.set(locale, { timestamp: Date.now(), data: fallbackPayload });

    return NextResponse.json(fallbackPayload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  }
}
