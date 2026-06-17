import { NextRequest, NextResponse } from "next/server";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

const allowedYears = ["2017", "2021", "2024", "current"] as const;
const allowedLocales = ["en", "es", "pt", "fr", "de", "tr"] as const;

type Year = (typeof allowedYears)[number];
type Locale = (typeof allowedLocales)[number];

const cyclePeaks: Record<Exclude<Year, "current">, number> = {
  "2017": 830_000_000_000,
  "2021": 3_000_000_000_000,
  "2024": 2_700_000_000_000,
};

function formatUsd(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  return `$${value.toLocaleString()}`;
}

function pct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getLocale(locale: Locale) {
  const map = {
    en: "en-US",
    es: "es-ES",
    pt: "pt-PT",
    fr: "fr-FR",
    de: "de-DE",
    tr: "tr-TR",
  };

  return map[locale];
}




function getRisk({
  marketCapChange24h,
  btcDominance,
  tvlChange1d,
  fearGreed,
}: {
  marketCapChange24h: number;
  btcDominance: number;
  tvlChange1d: number;
  fearGreed: number;
}) {
  if (marketCapChange24h < -3 || tvlChange1d < -2) return "high";
  if (btcDominance >= 58 && marketCapChange24h < 0) return "elevated";
  if (fearGreed >= 75) return "high";
  if (marketCapChange24h > 3) return "medium";
  return "balanced";
}

function getTrend({
  marketCapChange24h,
  tvlChange7d,
  stableChange1d,
}: {
  marketCapChange24h: number;
  tvlChange7d: number;
  stableChange1d: number;
}) {
  const score =
    marketCapChange24h * 0.5 + tvlChange7d * 0.35 + stableChange1d * 0.15;

  if (score > 2.5) return "strong";
  if (score < -1.5) return "weak";
  return "moderate";
}



const words = {
  en: {
    title: "Kryptonal Deep Market Analysis",
    generated: "Generated",
    data: "Live data read",
    phase: "Market phase",
    risk: "Risk level",
    trend: "Trend strength",
    summary: "Simple market read",
    advantages: "What looks positive",
    disadvantages: "What looks risky",
    opportunities: "Opportunities to watch",
    actions: "What users can do",
    comparison: "Cycle comparison",
    disclaimer: "Not financial advice. Crypto markets are volatile.",
    phases: {
  expansion: "Expansion",
  recovery: "Recovery",
  consolidation: "Consolidation",
  distribution: "Distribution",
  riskOff: "Risk-Off",
},
    risks: {
      high: "High",
      elevated: "Elevated",
      medium: "Medium",
      balanced: "Balanced",
    },
    trends: {
      strong: "Strong",
      moderate: "Moderate",
      weak: "Weak",
    },
  },
  es: {
    title: "Análisis Profundo del Mercado de Kryptonal",
    generated: "Generado",
    data: "Lectura de datos en vivo",
    phase: "Fase del mercado",
    risk: "Nivel de riesgo",
    trend: "Fuerza de tendencia",
    summary: "Lectura simple del mercado",
    advantages: "Qué se ve positivo",
    disadvantages: "Qué se ve arriesgado",
    opportunities: "Oportunidades a observar",
    actions: "Qué pueden hacer los usuarios",
    comparison: "Comparación de ciclo",
    disclaimer: "No es asesoramiento financiero. Los mercados cripto son volátiles.",
    phases: {
  expansion: "Expansión",
  recovery: "Recuperación",
  consolidation: "Consolidación",
  distribution: "Distribución",
  riskOff: "Mercado defensivo",
},
    risks: {
      high: "Alto",
      elevated: "Elevado",
      medium: "Medio",
      balanced: "Equilibrado",
    },
    trends: {
      strong: "Fuerte",
      moderate: "Moderada",
      weak: "Débil",
    },
  },
  pt: {
    title: "Análise Profunda de Mercado da Kryptonal",
    generated: "Gerado",
    data: "Leitura de dados ao vivo",
    phase: "Fase do mercado",
    risk: "Nível de risco",
    trend: "Força da tendência",
    summary: "Leitura simples do mercado",
    advantages: "O que parece positivo",
    disadvantages: "O que parece arriscado",
    opportunities: "Oportunidades para observar",
    actions: "O que os usuários podem fazer",
    comparison: "Comparação de ciclo",
    disclaimer: "Não é aconselhamento financeiro. Mercados cripto são voláteis.",
    phases: {
  expansion: "Expansão",
  recovery: "Recuperação",
  consolidation: "Consolidação",
  distribution: "Distribuição",
  riskOff: "Mercado defensivo",
},
    risks: {
      high: "Alto",
      elevated: "Elevado",
      medium: "Médio",
      balanced: "Equilibrado",
    },
    trends: {
      strong: "Forte",
      moderate: "Moderada",
      weak: "Fraca",
    },
  },
  fr: {
    title: "Analyse Approfondie du Marché Kryptonal",
    generated: "Généré",
    data: "Lecture des données en direct",
    phase: "Phase du marché",
    risk: "Niveau de risque",
    trend: "Force de la tendance",
    summary: "Lecture simple du marché",
    advantages: "Ce qui semble positif",
    disadvantages: "Ce qui semble risqué",
    opportunities: "Opportunités à surveiller",
    actions: "Ce que les utilisateurs peuvent faire",
    comparison: "Comparaison du cycle",
    disclaimer: "Ceci n’est pas un conseil financier. Les marchés crypto sont volatils.",
    phases: {
  expansion: "Expansion",
  recovery: "Reprise",
  consolidation: "Consolidation",
  distribution: "Distribution",
  riskOff: "Marché défensif",
},
    risks: {
      high: "Élevé",
      elevated: "Élevé",
      medium: "Moyen",
      balanced: "Équilibré",
    },
    trends: {
      strong: "Forte",
      moderate: "Modérée",
      weak: "Faible",
    },
  },
  de: {
    title: "Kryptonal Tiefenanalyse des Marktes",
    generated: "Generiert",
    data: "Live-Daten gelesen",
    phase: "Marktphase",
    risk: "Risikostufe",
    trend: "Trendstärke",
    summary: "Einfache Marktlesung",
    advantages: "Was positiv aussieht",
    disadvantages: "Was riskant aussieht",
    opportunities: "Chancen im Blick",
    actions: "Was Nutzer tun können",
    comparison: "Zyklusvergleich",
    disclaimer: "Keine Finanzberatung. Kryptomärkte sind volatil.",
    phases: {
  expansion: "Expansion",
  recovery: "Erholung",
  consolidation: "Konsolidierung",
  distribution: "Distribution",
  riskOff: "Defensiver Markt",
},
    risks: {
      high: "Hoch",
      elevated: "Erhöht",
      medium: "Mittel",
      balanced: "Ausgeglichen",
    },
    trends: {
      strong: "Stark",
      moderate: "Moderat",
      weak: "Schwach",
    },
  },
  tr: {
    title: "Kryptonal Derin Piyasa Analizi",
    generated: "Oluşturuldu",
    data: "Canlı veri okuması",
    phase: "Piyasa aşaması",
    risk: "Risk seviyesi",
    trend: "Trend gücü",
    summary: "Basit piyasa yorumu",
    advantages: "Olumlu görünenler",
    disadvantages: "Riskli görünenler",
    opportunities: "İzlenecek fırsatlar",
    actions: "Kullanıcılar ne yapabilir",
    comparison: "Döngü karşılaştırması",
    disclaimer: "Finansal tavsiye değildir. Kripto piyasaları volatildir.",
    phases: {
  expansion: "Genişleme",
  recovery: "Toparlanma",
  consolidation: "Konsolidasyon",
  distribution: "Dağıtım",
  riskOff: "Savunmacı piyasa",
},
    risks: {
      high: "Yüksek",
      elevated: "Yüksek",
      medium: "Orta",
      balanced: "Dengeli",
    },
    trends: {
      strong: "Güçlü",
      moderate: "Orta",
      weak: "Zayıf",
    },
  },
} as const;

function buildAnalysis({
  locale,
  year,
  marketCap,
  marketCapChange24h,
  btcDominance,
  ethDominance,
  totalTvl,
  tvlChange7d,
  stableChange1d,
  fearGreed,
  phase,
  risk,
  trend,
}: {
  locale: Locale;
  year: Year;
  marketCap: number;
  marketCapChange24h: number;
  btcDominance: number;
  ethDominance: number;
  totalTvl: number;
  tvlChange7d: number;
  stableChange1d: number;
  fearGreed: number;
  phase: string;
  risk: string;
  trend: string;
}) {
  const w = words[locale];
  const generatedDate = new Date().toLocaleString(getLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const readablePhase = w.phases[phase as keyof typeof w.phases];
  const readableRisk = w.risks[risk as keyof typeof w.risks];
  const readableTrend = w.trends[trend as keyof typeof w.trends];

  const comparison =
    year === "current"
      ? "current cycle"
      : `${year} peak ${formatUsd(cyclePeaks[year])}`;

  const diff =
    year === "current"
      ? 0
      : ((marketCap - cyclePeaks[year]) / cyclePeaks[year]) * 100;

  const clearRead =
    phase === "defensiveBitcoinRotation"
      ? `The market is red in the short term, but Bitcoin dominance is high. That means capital is becoming defensive and BTC is leading more than altcoins.`
      : phase === "marketContraction"
        ? `The market is weakening across multiple signals. Total market cap and DeFi conditions are not supportive enough yet.`
        : phase === "altcoinExpansion"
          ? `Risk appetite is improving. Bitcoin dominance is lower and broader market strength is improving, which can support altcoin rotation.`
          : `The market is mixed. There is not enough confirmation for a strong bullish or bearish reading yet.`;

  const positives = [
    btcDominance >= 58
      ? "Bitcoin leadership can stabilize the market when traders reduce risk."
      : "Lower Bitcoin dominance can create room for broader altcoin participation.",
    stableChange1d >= 0
      ? "Stablecoin supply is not contracting strongly, which means liquidity conditions are not fully negative."
      : "Stablecoin movement is weak, so liquidity should be watched carefully.",
    totalTvl > 0
      ? `DeFi TVL is around ${formatUsd(totalTvl)}, giving extra context beyond price action.`
      : "DeFi TVL data is currently limited.",
  ];

  const risks = [
    marketCapChange24h < 0
      ? `Total market cap is down ${pct(marketCapChange24h)} in 24h, so short-term momentum is bearish.`
      : `Total market cap is up ${pct(marketCapChange24h)} in 24h, but fast moves can increase volatility.`,
    btcDominance >= 58
      ? "High BTC dominance usually means altcoins are not fully in control yet."
      : "Lower BTC dominance can help altcoins, but it can also increase speculative risk.",
    fearGreed >= 70
      ? "Fear & Greed is high, so traders may be getting crowded."
      : `Fear & Greed is ${fearGreed}/100, so sentiment is not euphoric yet.`,
  ];

  const opportunities = [
    phase === "defensiveBitcoinRotation"
      ? "Watch BTC first. If BTC stabilizes and dominance later cools, altcoins may get a better setup."
      : "Watch assets showing relative strength against BTC and ETH.",
    "Use pullbacks to study structure instead of chasing green candles.",
    "Compare market cap, BTC dominance, DeFi TVL, and stablecoin flows before assuming a new trend.",
  ];

  const actions = [
    risk === "high" || risk === "elevated"
      ? "Reduce leverage, wait for confirmation, and avoid emotional entries."
      : "Build a watchlist and wait for cleaner confirmation.",
    "Check whether BTC dominance is rising or falling before making altcoin decisions.",
    "Use the analysis as a market map, not a direct buy or sell signal.",
  ];

  const analysis = `${w.title}
${w.generated}: ${generatedDate}

${w.data}
- Total market cap: ${formatUsd(marketCap)} (${pct(marketCapChange24h)} 24h)
- BTC dominance: ${btcDominance.toFixed(2)}%
- ETH dominance: ${ethDominance.toFixed(2)}%
- DeFi TVL: ${formatUsd(totalTvl)} (${pct(tvlChange7d)} 7d)
- Stablecoins: ${pct(stableChange1d)} 1d
- Fear & Greed: ${fearGreed}/100

${w.phase}: ${readablePhase}
${w.risk}: ${readableRisk}
${w.trend}: ${readableTrend}

${w.summary}
${clearRead}

${w.comparison}
Compared with ${comparison}, the current market cap is ${
    year === "current"
      ? "being evaluated against live conditions."
      : `${Math.abs(diff).toFixed(2)}% ${diff >= 0 ? "above" : "below"}.`
  }

${w.advantages}
- ${positives.join("\n- ")}

${w.disadvantages}
- ${risks.join("\n- ")}

${w.opportunities}
- ${opportunities.join("\n- ")}

${w.actions}
- ${actions.join("\n- ")}

${w.disclaimer}`;

  return {
    phase: readablePhase,
    risk: readableRisk,
    trend: readableTrend,
    analysis,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const year: Year = allowedYears.includes(body.year) ? body.year : "2021";
    const locale: Locale = allowedLocales.includes(body.locale)
      ? body.locale
      : "en";

    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [globalRes, chainsRes, stableRes, fearRes] = await Promise.all([
      fetch(`${COINGECKO_URL}/global`, {
        headers,
        next: { revalidate: 60 },
      }),
      fetch("https://api.llama.fi/v2/chains", {
        next: { revalidate: 300 },
      }),
      fetch("https://stablecoins.llama.fi/stablecoincharts/all", {
        next: { revalidate: 300 },
      }),
      fetch("https://api.alternative.me/fng/?limit=1", {
        next: { revalidate: 300 },
      }),
    ]);

    if (!globalRes.ok) {
      return NextResponse.json({ error: "Market API failed" }, { status: 502 });
    }

    function getStableTotal(point: any) {
  return Number(
    point?.totalCirculatingUSD?.peggedUSD ||
      point?.totalCirculating?.peggedUSD ||
      point?.totalCirculatingUSD ||
      point?.totalCirculating ||
      0
  );
}

    const globalJson = await globalRes.json();
    const chains = chainsRes.ok ? await chainsRes.json() : [];
    const stableChart = stableRes.ok ? await stableRes.json() : [];
    const fearJson = fearRes.ok ? await fearRes.json() : null;

    const global = globalJson.data;

    const marketCap = Number(global?.total_market_cap?.usd || 0);
    
    

    const validChains = Array.isArray(chains) ? chains : [];

    const totalTvl = validChains.reduce(
      (sum: number, chain: any) => sum + Number(chain.tvl || 0),
      0
    );

    
const fearGreed = Number(fearJson?.data?.[0]?.value || 50);



    const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://192.168.8.103:3000"
    : process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

const marketRes = await fetch(`${baseUrl}/api/crypto/market-cap`, {
  next: { revalidate: 60 },
});
const w = words[locale];

const market = await marketRes.json();

function normalizePhaseKey(value: string) {
  if (value === "Expansion") return "expansion";
  if (value === "Recovery") return "recovery";
  if (value === "Consolidation") return "consolidation";
  if (value === "Distribution") return "distribution";
  if (value === "Risk-Off") return "riskOff";
  return value;
}

function normalizeRiskKey(value: string) {
  if (value === "High") return "high";
  if (value === "Elevated") return "elevated";
  if (value === "Medium") return "medium";
  if (value === "Balanced") return "balanced";
  return value;
}

function normalizeTrendKey(value: string) {
  if (value === "Strong") return "strong";
  if (value === "Moderate") return "moderate";
  if (value === "Weak") return "weak";
  return value;
}

const phase = normalizePhaseKey(market.marketPhase);
const risk = normalizeRiskKey(market.riskLevel);
const trend = normalizeTrendKey(market.trendStrength);

const marketCapChange24h = market.marketCapChange24h;
const btcDominance = market.btcDominance;
const ethDominance = market.ethDominance;
const tvlChange7d = market.tvlChange7d;
const stableChange1d = market.stableChange1d;


   

    const result = buildAnalysis({
      locale,
      year,
      marketCap,
      marketCapChange24h,
      btcDominance,
      ethDominance,
      totalTvl,
      tvlChange7d,
      stableChange1d,
      fearGreed,
      phase,
      risk,
      trend,
    });

    return NextResponse.json({
      marketCap,
      marketCapChange24h,
      btcDominance,
      ethDominance,
      totalTvl,
      tvlChange7d,
      stableChange1d,
      fearGreed,
      ...result,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}