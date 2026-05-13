import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HighYieldFinder from "@/components/tools/HighYieldFinder";
import { getDictionary } from "@/lib/getDictionary";

const siteUrl = "https://kryptonal.com";
const locales = ["en", "es", "pt", "fr", "de", "tr"];

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const seo = t.seo.highYieldFinder;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/tools/high-yield-finder`,
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          `${siteUrl}/${l}/tools/high-yield-finder`,
        ])
      ),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/${locale}/tools/high-yield-finder`,
      siteName: "Kryptonal",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HighYieldFinderPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />
      <HighYieldFinder t={t} />
      <Footer locale={locale} t={t} />
    </>
  );
}