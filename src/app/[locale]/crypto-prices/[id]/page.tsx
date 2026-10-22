// src/app/[locale]/crypto-prices/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import { getCoinData } from "@/lib/getCoinData";
import CoinDetailsClient from "@/components/crypto-prices/CoinDetailsClient";
import { checkGatePair } from "@/lib/getGatePair";

// Cache for 12 hours (43,200s) to cut Fast Origin Transfer & ISR Writes in half
export const revalidate = 43200;
export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// Reject bot/scanner garbage slugs immediately before touching any API
const VALID_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidCoinSlug(id: string): boolean {
  if (!id || id.length > 50) return false;
  if (
    id.includes(".") ||
    id.includes("wp-") ||
    id.includes("admin") ||
    id.includes("config") ||
    id.includes("env")
  ) {
    return false;
  }
  return VALID_SLUG_REGEX.test(id);
}

// Strip massive unused CoinGecko fields (cuts RSC payload from ~300KB to <12KB)
function slimCoinDetails(details: any) {
  if (!details) return null;
  const md = details.market_data || {};

  return {
    id: details.id,
    symbol: details.symbol,
    name: details.name,
    market_cap_rank: details.market_cap_rank ?? md.market_cap_rank ?? null,
    image: {
      thumb:
        details.image?.thumb ||
        details.image?.small ||
        details.image?.large ||
        "",
      small: details.image?.small || details.image?.large || "",
      large: details.image?.large || details.image?.small || "",
    },
    description: {
      en:
        typeof details.description?.en === "string"
          ? details.description.en.slice(0, 1200)
          : "",
    },
    links: {
      homepage: details.links?.homepage?.filter(Boolean).slice(0, 1) || [],
      blockchain_site:
        details.links?.blockchain_site?.filter(Boolean).slice(0, 2) || [],
      twitter_screen_name: details.links?.twitter_screen_name || "",
      subreddit_url: details.links?.subreddit_url || "",
    },
    market_data: {
      current_price: { usd: Number(md.current_price?.usd || 0) },
      market_cap: { usd: Number(md.market_cap?.usd || 0) },
      fully_diluted_valuation: {
        usd: Number(md.fully_diluted_valuation?.usd || 0),
      },
      total_volume: { usd: Number(md.total_volume?.usd || 0) },
      high_24h: { usd: Number(md.high_24h?.usd || 0) },
      low_24h: { usd: Number(md.low_24h?.usd || 0) },
      price_change_24h: Number(md.price_change_24h || 0),
      price_change_percentage_1h_in_currency: {
        usd: Number(md.price_change_percentage_1h_in_currency?.usd || 0),
      },
      price_change_percentage_24h: Number(md.price_change_percentage_24h || 0),
      price_change_percentage_24h_in_currency: {
        usd: Number(
          md.price_change_percentage_24h_in_currency?.usd ??
            md.price_change_percentage_24h ??
            0,
        ),
      },
      price_change_percentage_7d: Number(md.price_change_percentage_7d || 0),
      price_change_percentage_7d_in_currency: {
        usd: Number(
          md.price_change_percentage_7d_in_currency?.usd ??
            md.price_change_percentage_7d ??
            0,
        ),
      },
      price_change_percentage_30d: Number(md.price_change_percentage_30d || 0),
      price_change_percentage_1y: Number(md.price_change_percentage_1y || 0),
      ath: { usd: Number(md.ath?.usd || 0) },
      ath_change_percentage: {
        usd: Number(md.ath_change_percentage?.usd || 0),
      },
      ath_date: { usd: md.ath_date?.usd || null },
      atl: { usd: Number(md.atl?.usd || 0) },
      atl_change_percentage: {
        usd: Number(md.atl_change_percentage?.usd || 0),
      },
      atl_date: { usd: md.atl_date?.usd || null },
      circulating_supply: Number(md.circulating_supply || 0),
      total_supply: Number(md.total_supply || 0),
      max_supply: md.max_supply ? Number(md.max_supply) : null,
    },
    // IMPORTANT: Avoid new Date().toISOString() fallback so identical pages don't trigger extra ISR writes
    last_updated: details.last_updated || "2026-01-01T00:00:00.000Z",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidCoinSlug(id)) {
    return { title: "Coin Not Found | Kryptonal" };
  }

  const data = await getCoinData(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  if (!data || !data.details) {
    return {
      title: "Coin Not Found | Kryptonal",
    };
  }

  const { details } = data;
  const name = details.name;
  const symbol = details.symbol?.toUpperCase();
  const price = details.market_data?.current_price?.usd
    ? `$${details.market_data.current_price.usd.toLocaleString()}`
    : "";

  return {
    metadataBase: new URL(baseUrl),
    title: `${name} (${symbol}) Price ${price} & AI Risk Analysis | Kryptonal`,
    description: `Real-time price, 7-day chart, and automated AI market risk assessment for ${name} (${symbol}).`,
    alternates: {
      canonical: `${baseUrl}/${locale}/crypto-prices/${id}`,
    },
    openGraph: {
      title: `${name} (${symbol}) Live Price & AI Analysis`,
      description: `Track ${name} on Kryptonal with live market metrics and automated intelligence.`,
      url: `${baseUrl}/${locale}/crypto-prices/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} (${symbol}) Live Price & AI Analysis`,
    },
  };
}

export default async function CoinDetailsPage({ params }: Props) {
  const { locale, id } = await params;

  if (!isValidCoinSlug(id)) {
    notFound();
  }

  const t = await getDictionary(locale);
  const data = await getCoinData(id);

  if (!data || !data.details) {
    notFound();
  }

  const slimDetails = slimCoinDetails(data.details);
  const symbol = slimDetails?.symbol || "";
  const gatePair = await checkGatePair(symbol);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${slimDetails?.name} (${slimDetails?.symbol?.toUpperCase()})`,
    description: `Real-time price metrics and AI cycle risk analysis for ${slimDetails?.name}.`,
    brand: {
      "@type": "Brand",
      name: "Kryptonal",
    },
    offers: {
      "@type": "Offer",
      price: slimDetails?.market_data?.current_price?.usd,
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locale={locale} t={t} />
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <CoinDetailsClient
            details={slimDetails}
            chartData={data.chartData}
            t={t}
            locale={locale}
            gatePair={gatePair}
          />
        </div>
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}

// Static list of top 30 coins so build never fails or wastes API calls
const TOP_30_IDS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
  "usd-coin",
  "cardano",
  "dogecoin",
  "tron",
  "avalanche-2",
  "chainlink",
  "toncoin",
  "shiba-inu",
  "sui",
  "polkadot",
  "bitcoin-cash",
  "stellar",
  "litecoin",
  "near",
  "uniswap",
  "pepe",
  "aptos",
  "internet-computer",
  "monero",
  "dai",
  "ethereum-classic",
  "render-token",
  "hedera-hashgraph",
  "cronos",
];

export async function generateStaticParams() {
  return TOP_30_IDS.map((id) => ({ id }));
}
