import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PrivacyWatchlist from "@/components/tools/PrivacyWatchlist";
import { getDictionary } from "@/lib/getDictionary";

const siteUrl = "https://kryptonal.com";
const locales = ["en", "es", "pt", "fr", "de", "tr"];

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);

  return {
    title: t.seo.privacyWatchlist.title,
    description: t.seo.privacyWatchlist.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/tools/watchlist`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}/tools/watchlist`])
      ),
    },
  };
}

export default async function WatchlistPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />
      <PrivacyWatchlist t={t} />
      <Footer locale={locale} t={t} />
    </>
  );
}