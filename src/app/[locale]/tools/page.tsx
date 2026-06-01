import type { Metadata } from "next";
import ToolsPageClient from "./tools-page-client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

const locales = ["en", "es", "pt", "fr", "de", "tr"];

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getDictionary(locale);
  const pageT = t.tools.directory;

  return {
    title: pageT.metaTitle,
    description: pageT.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/tools`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/tools`])
      ),
    },
    openGraph: {
      title: pageT.metaTitle,
      description: pageT.metaDescription,
      url: `${SITE_URL}/${locale}/tools`,
      siteName: "Kryptonal",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og/tools.png`,
          width: 1200,
          height: 630,
          alt: "Kryptonal Crypto Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageT.metaTitle,
      description: pageT.metaDescription,
      images: [`${SITE_URL}/og/tools.png`],
    },
  };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />
      <ToolsPageClient locale={locale} t={t.tools.directory} />
      <Footer locale={locale} t={t} />
    </>
  );
}