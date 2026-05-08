import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.coingecko.com/api/v3";

const allowedYears = ["2017", "2021", "2024", "current"] as const;
const allowedLocales = ["en", "es", "pt", "fr", "de", "tr"] as const;

type Year = (typeof allowedYears)[number];
type Locale = (typeof allowedLocales)[number];

const cyclePeaks: Record<Exclude<Year, "current">, number> = {
  "2017": 830_000_000_000,
  "2021": 3_000_000_000_000,
  "2024": 2_700_000_000_000
};

function formatTrillion(value: number) {
  return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
}

function getPhase(marketCap: number) {
  if (marketCap < 1_000_000_000_000) return "Accumulation";
  if (marketCap < 2_300_000_000_000) return "Early Expansion";
  if (marketCap < 3_000_000_000_000) return "Expansion";
  return "Late Cycle";
}

function getRisk(marketCap: number) {
  if (marketCap < 1_500_000_000_000) return "Low";
  if (marketCap < 2_800_000_000_000) return "Moderate";
  return "High";
}

function buildAnalysis({
  locale,
  year,
  marketCap,
  change,
  btcDominance
}: {
  locale: Locale;
  year: Year;
  marketCap: number;
  change: number;
  btcDominance: number;
}) {

  const generatedDate = new Date().toLocaleString(
  locale === "en" ? "en-US" :
  locale === "es" ? "es-ES" :
  locale === "pt" ? "pt-PT" :
  locale === "fr" ? "fr-FR" :
  locale === "de" ? "de-DE" :
  "tr-TR",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
);
  const phase = getPhase(marketCap);
  const risk = getRisk(marketCap);
  const trend = change >= 0 ? "bullish" : "bearish";

  const comparison =
    year === "current"
      ? "the current market cycle"
      : `the ${year} cycle peak of ${formatTrillion(cyclePeaks[year])}`;

  const diff =
    year === "current"
      ? 0
      : ((marketCap - cyclePeaks[year]) / cyclePeaks[year]) * 100;

  const direction =
    year === "current"
      ? "near its current cycle range"
      : diff >= 0
        ? `${Math.abs(diff).toFixed(2)}% above`
        : `${Math.abs(diff).toFixed(2)}% below`;

  const templates: Record<Locale, string> = {
    en: `Cryptonal AI Market Brief
Generated: ${generatedDate}

Total crypto market cap is currently ${formatTrillion(marketCap)}, which is ${direction} ${comparison}.

The market appears to be in a ${phase} phase with ${risk.toLowerCase()} risk. The 24h market cap change is ${change.toFixed(2)}%, suggesting ${trend} short-term momentum.

Bitcoin dominance is ${btcDominance.toFixed(2)}%, which shows that capital is still strongly influenced by BTC. During similar cycle periods, Bitcoin often leads first before broader altcoin strength appears.

Overall, the market looks ${phase.toLowerCase()}, but historical data does not guarantee future results.

Not financial advice. Crypto markets are highly volatile.`,

    es: `Análisis del mercado cripto:

La capitalización total del mercado cripto es actualmente ${formatTrillion(marketCap)}, lo que está ${direction} frente a ${comparison}.

El mercado parece estar en una fase de ${phase} con riesgo ${risk.toLowerCase()}. El cambio de 24h es ${change.toFixed(2)}%, lo que sugiere un impulso de corto plazo ${trend}.

La dominancia de Bitcoin es ${btcDominance.toFixed(2)}%, mostrando que el capital sigue muy influenciado por BTC.

No es asesoramiento financiero. El mercado cripto es altamente volátil.`,

    pt: `Análise do mercado cripto:

A capitalização total do mercado cripto está atualmente em ${formatTrillion(marketCap)}, ficando ${direction} em relação a ${comparison}.

O mercado parece estar em fase de ${phase}, com risco ${risk.toLowerCase()}. A variação em 24h é de ${change.toFixed(2)}%, sugerindo momentum de curto prazo ${trend}.

A dominância do Bitcoin está em ${btcDominance.toFixed(2)}%, mostrando que o capital ainda é fortemente influenciado pelo BTC.

Não é aconselhamento financeiro. Cripto é altamente volátil.`,

    fr: `Analyse du marché crypto :

La capitalisation totale du marché crypto est actuellement de ${formatTrillion(marketCap)}, soit ${direction} par rapport à ${comparison}.

Le marché semble être en phase de ${phase}, avec un risque ${risk.toLowerCase()}. La variation sur 24h est de ${change.toFixed(2)}%, indiquant une dynamique court terme ${trend}.

La dominance du Bitcoin est de ${btcDominance.toFixed(2)}%, ce qui montre que le capital reste fortement influencé par BTC.

Ceci n’est pas un conseil financier. Les cryptomonnaies sont très volatiles.`,

    de: `Krypto-Marktanalyse:

Die gesamte Krypto-Marktkapitalisierung liegt derzeit bei ${formatTrillion(marketCap)} und damit ${direction} im Vergleich zu ${comparison}.

Der Markt scheint sich in einer ${phase}-Phase mit ${risk.toLowerCase()}em Risiko zu befinden. Die 24h-Veränderung beträgt ${change.toFixed(2)}%, was auf ${trend}e kurzfristige Dynamik hindeutet.

Die Bitcoin-Dominanz liegt bei ${btcDominance.toFixed(2)}%, was zeigt, dass Kapital weiterhin stark von BTC beeinflusst wird.

Keine Finanzberatung. Kryptomärkte sind sehr volatil.`,

    tr: `Kripto Piyasa Analizi:

Toplam kripto piyasa değeri şu anda ${formatTrillion(marketCap)} seviyesinde ve ${comparison} ile karşılaştırıldığında ${direction} durumda.

Piyasa ${phase} aşamasında görünüyor ve risk seviyesi ${risk.toLowerCase()}. Son 24 saatlik değişim ${change.toFixed(2)}%, bu da kısa vadede ${trend} momentum gösteriyor.

Bitcoin dominansı ${btcDominance.toFixed(2)}%, yani sermaye hâlâ güçlü şekilde BTC etkisinde.

Finansal tavsiye değildir. Kripto piyasaları yüksek volatilite taşır.`
  };

  return {
    phase,
    risk,
    trend,
    comparisonYear: year,
    differencePercent: year === "current" ? null : diff,
    analysis: templates[locale]
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const year = allowedYears.includes(body.year) ? body.year : "2021";
    const locale = allowedLocales.includes(body.locale) ? body.locale : "en";

    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const res = await fetch(`${API_URL}/global`, {
      headers,
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Market API failed" }, { status: 502 });
    }

    const json = await res.json();
    const data = json.data;

    const marketCap = data.total_market_cap.usd;
    const change = data.market_cap_change_percentage_24h_usd;
    const btcDominance = data.market_cap_percentage.btc;

    const result = buildAnalysis({
      locale,
      year,
      marketCap,
      change,
      btcDominance
    });

    return NextResponse.json({
      marketCap,
      change,
      btcDominance,
      ...result,
      updatedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}