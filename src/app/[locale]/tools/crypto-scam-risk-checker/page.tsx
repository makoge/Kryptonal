import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import CryptoScamRiskChecker from "@/components/tools/CryptoScamRiskChecker";

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

  const url = `${baseUrl}/${locale}/tools/crypto-scam-risk-checker`;

  return {
    title: "Crypto Scam Risk Checker | Kryptonal",
    description:
      "Check crypto projects, websites, wallet addresses, and tokens for common scam warning signs before making research decisions.",
    keywords: [
      "crypto scam risk checker",
      "crypto scam checker",
      "how to check crypto scam",
      "what is the current crypto scam",
      "can you get your money back if you get scammed on crypto",
      "how can I verify a scammer",
      "token scam checker",
      "fake crypto website checker",
      "wallet scam checker",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Crypto Scam Risk Checker | Kryptonal",
      description:
        "Analyze crypto projects, websites, wallet addresses, and tokens for common scam warning signs.",
      url,
      siteName: "Kryptonal",
      type: "website",
    },
  };
}

export default async function CryptoScamRiskCheckerPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 text-white">
        <CryptoScamRiskChecker t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
