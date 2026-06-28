import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import CryptocurrencyTaxCalculator from "@/components/tools/CryptocurrencyTaxCalculator";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";
  const url = `${baseUrl}/${locale}/tools/cryptocurrency-tax-calculator`;

  return {
    title: "Cryptocurrency Tax Calculator | Kryptonal",
    description:
      "Estimate crypto capital gains, losses, tax owed, and profit after tax using a simple cryptocurrency tax calculator.",
    keywords: [
      "cryptocurrency tax calculator",
      "crypto tax calculator",
      "bitcoin tax calculator",
      "crypto capital gains calculator",
      "crypto gains calculator",
      "crypto profit after tax",
      "calculate crypto tax",
      "crypto tax estimator",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: "Cryptocurrency Tax Calculator | Kryptonal",
      description:
        "Estimate crypto capital gains, losses, tax owed, and profit after tax.",
      url,
      siteName: "Kryptonal",
      type: "website",
    },
  };
}

export default async function CryptocurrencyTaxCalculatorPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 text-white">
        <CryptocurrencyTaxCalculator t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
