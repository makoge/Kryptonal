import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CryptoEtfTracker from "@/components/tools/CryptoEtfTracker";
import { getDictionary } from "@/lib/getDictionary";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  return {
    title: "Crypto ETF Tracker | Bitcoin ETF Inflows Tracker Daily | Kryptonal",
    description:
      "Track crypto ETF flow, Bitcoin ETF inflows, ETF approval crypto list, ETF rankings, and the best cryptocurrency ETF list with Kryptonal.",
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
      canonical: `${baseUrl}/${locale}/tools/crypto-etf-tracker`,
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
