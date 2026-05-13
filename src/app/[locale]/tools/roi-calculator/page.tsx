
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CryptoROIVision from "@/components/tools/CryptoROIVision";
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

  return {
    title: t.seo.cryptoRoiVision.title,
    description: t.seo.cryptoRoiVision.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/tools/roi-calculator`,
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          `${siteUrl}/${l}/tools/roi-calculator`,
        ])
      ),
    },
  };
}

export default async function ROICalculatorPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />
      <CryptoROIVision t={t} />
      <Footer locale={locale} t={t} />
    </>
  );
}
