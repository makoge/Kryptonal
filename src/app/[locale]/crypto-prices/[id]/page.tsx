// src/app/[locale]/crypto-prices/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import { getCoinData } from "@/lib/getCoinData";
import CoinDetailsClient from "@/components/crypto-prices/CoinDetailsClient";
import { checkGatePair } from "@/lib/getGatePair";

// 1. Force ISR Caching: Cache all pages and metadata on this route for 1 hour.
// This is the most critical fix to stop bots from draining your Active CPU.
export const revalidate = 3600;

// Allow Next.js to dynamically generate (and then cache) coins outside the top 200
export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// 2. Dynamic SEO Metadata with Live Coin Info
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
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

// 3. Server Page Rendering
export default async function CoinDetailsPage({ params }: Props) {
  const { locale, id } = await params;
  const t = getDictionary(locale);

  // Note: Ensure getCoinData uses native fetch() or is wrapped in React cache()
  // so this call and the one in generateMetadata are deduplicated into a single request.
  const data = await getCoinData(id);

  if (!data || !data.details) {
    notFound();
  }
  const { details } = data;

  // Check if Gate.io supports trading for this token symbol
  const symbol = data.details.symbol || "";
  const gatePair = await checkGatePair(symbol);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${details.name} (${details.symbol?.toUpperCase()})`,
    description: `Real-time price metrics and AI cycle risk analysis for ${details.name}.`,
    brand: {
      "@type": "Brand",
      name: "Kryptonal",
    },
    offers: {
      "@type": "Offer",
      price: details.market_data?.current_price?.usd,
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
            details={data.details}
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

// 4. Generate only the parameters for THIS segment
export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1",
      { next: { revalidate: 86400 } }, // Cache this list for 24 hours
    );

    if (!res.ok) return [];

    const coins = await res.json();

    // Next.js will automatically matrix these IDs with the locales from your parent layout
    return coins.map((coin: any) => ({
      id: coin.id,
    }));
  } catch (error) {
    console.error("Failed to fetch coins for static params:", error);
    return [];
  }
}
