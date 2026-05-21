// src/app/[locale]/crypto-prices/page.tsx
import type { Metadata } from "next";
import CryptoPricesClient from "@/components/crypto-prices/CryptoPricesClient";
import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

async function getData() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${base}/api/crypto-prices`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const seo = dict.cryptoPrices?.seo;

  return {
    title:
      seo?.title ||
      "Live Crypto Prices Today | Top Coins, Gainers & Exchanges",
    description:
      seo?.description ||
      "Track live cryptocurrency prices, top 200 coins, top gainers, top losers, trending coins, and top exchanges.",
    alternates: {
      canonical: `/${locale}/crypto-prices`,
    },
    openGraph: {
      title:
        seo?.title ||
        "Live Crypto Prices Today | Top Coins, Gainers & Exchanges",
      description:
        seo?.description ||
        "Track live cryptocurrency prices, top 200 coins, top gainers, top losers, trending coins, and top exchanges.",
      url: `/${locale}/crypto-prices`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        seo?.title ||
        "Live Crypto Prices Today | Top Coins, Gainers & Exchanges",
      description:
        seo?.description ||
        "Track live cryptocurrency prices, top 200 coins, top gainers, top losers, trending coins, and top exchanges.",
    },
  };
}

export default async function CryptoPricesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const data = await getData();

  return (
    <>
      <Header locale={locale} t={dict} />

      <CryptoPricesClient
        data={data}
        t={dict.cryptoPrices}
      />

      <Footer locale={locale} t={dict} />
    </>
  );
}