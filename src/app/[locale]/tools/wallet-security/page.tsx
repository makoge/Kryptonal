import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WalletSecurityChecker from "@/components/tools/WalletSecurityChecker";
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
    title: "Wallet Security Checker | Kryptonal",
    description:
      "Analyze EVM wallet format, basic risk signals, compatible networks, and wallet safety recommendations before interacting with a crypto address.",
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/wallet-security`,
    },
  };
}

export default async function WalletSecurityPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950">
        <WalletSecurityChecker t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
