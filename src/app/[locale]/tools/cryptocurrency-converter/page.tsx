import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import CryptocurrencyConverter from "@/components/tools/CryptocurrencyConverter";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";
  const url = `${baseUrl}/${locale}/tools/cryptocurrency-converter`;

  return {
    title: "Cryptocurrency Converter | Kryptonal",
    description:
      "Convert Bitcoin, Ethereum, stablecoins, altcoins, and fiat currencies using live crypto market data.",
    keywords: [
      "cryptocurrency converter",
      "crypto converter",
      "bitcoin to usd converter",
      "ethereum to usd converter",
      "btc to eth converter",
      "crypto to fiat converter",
      "crypto price calculator",
      "coin converter crypto",
    ],
    alternates: {
      canonical: url,
    },
  };
}

export default async function CryptocurrencyConverterPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={dict} />

      <main className="min-h-screen bg-slate-950 text-white">
        <CryptocurrencyConverter t={dict} />
      </main>

      <Footer locale={locale} t={dict} />
    </>
  );
}
