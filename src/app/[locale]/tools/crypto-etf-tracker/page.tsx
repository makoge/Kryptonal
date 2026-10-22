import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CryptoEtfTracker from "@/components/tools/CryptoEtfTracker";
import { getDictionary } from "@/lib/getDictionary";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 1800; // Cache and refresh every 30 minutes

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  let latestFlow = "+$280M";
  let signal = "Accumulation";

  // 1. Fetch live metrics from your internal tracker endpoint for dynamic preview tags
  try {
    const res = await fetch(`${baseUrl}/api/tools/crypto-etf-tracker`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const data = await res.json();
      const num = data?.metrics?.dailyNetFlowUsdM || 0;
      latestFlow = `${num >= 0 ? "+" : ""}$${num}M`;
      signal = data?.signal || "Accumulation";
    }
  } catch {
    // Falls back gracefully if backend endpoint is unavailable during initial build
  }

  // 2. Build dynamic OG image URL pointing to /api/og
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set("badge", "ETF Intelligence");
  ogUrl.searchParams.set("title", "Bitcoin & Ethereum ETF Flow Tracker");
  ogUrl.searchParams.set("statLabel", "Daily Net Inflow");
  ogUrl.searchParams.set("statValue", latestFlow);
  ogUrl.searchParams.set("status", signal);

  const ogImageUrl = ogUrl.toString();
  const pageUrl = `${baseUrl}/${locale}/tools/crypto-etf-tracker`;
  const dynamicTitle = `Bitcoin ETF Flows (${latestFlow}) | Crypto ETF Tracker | Kryptonal`;
  const dynamicDescription = `Live daily spot ETF flow intelligence. Today's net inflow/outflow is ${latestFlow} with institutional ${signal} signal.`;

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    keywords: [
      "Best crypto ETF tracker",
      "ETF approval crypto list",
      "Crypto ETF tracker app",
      "Crypto ETF approval",
      "Bitcoin ETF inflows tracker daily",
      "Crypto ETF flow",
      "Bitcoin ETF inflows chart",
      "Best cryptocurrency ETF list",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: pageUrl,
      siteName: "Kryptonal",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Crypto ETF Net Flow: ${latestFlow}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function CryptoEtfTrackerPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950">
        <CryptoEtfTracker t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
