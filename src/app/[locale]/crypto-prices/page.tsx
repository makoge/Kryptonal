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
  const headers: Record<string, string> = {};

if (process.env.COINGECKO_API_KEY) {
  headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
}

  try {
    const [coinsRes, exchangesRes, trendingRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
        { next: { revalidate: 60 }, headers }
      ),
      fetch("https://api.coingecko.com/api/v3/exchanges?per_page=20&page=1", {
        next: { revalidate: 300 },
        headers,
      }),
      fetch("https://api.coingecko.com/api/v3/search/trending", {
        next: { revalidate: 300 },
        headers,
      }),
    ]);

    if (!coinsRes.ok) return null;

    const coins = await coinsRes.json();
    const exchanges = exchangesRes.ok ? await exchangesRes.json() : [];
    const trending = trendingRes.ok ? await trendingRes.json() : { coins: [] };

    return {
      coins,
      gainers: [...coins]
        .filter((c: any) => typeof c.price_change_percentage_24h === "number")
        .sort((a: any, b: any) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 10),
      losers: [...coins]
        .filter((c: any) => typeof c.price_change_percentage_24h === "number")
        .sort((a: any, b: any) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 10),
      exchanges,
      newCoins: trending?.coins ?? [],
      updatedAt: new Date().toISOString(),
    };
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