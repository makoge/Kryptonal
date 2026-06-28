import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import HoneypotChecker from "@/components/tools/HoneypotChecker";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";
  const url = `${baseUrl}/${locale}/tools/honeypot-checker`;

  return {
    title: "Honeypot Checker | Kryptonal",
    description:
      "Check if a crypto token may be a honeypot. Analyze sellability, buy tax, sell tax, blacklist risk, mint risk, and token security signals.",
    keywords: [
      "honeypot checker",
      "crypto honeypot checker",
      "token honeypot checker",
      "is this token a honeypot",
      "can I sell this token",
      "ERC20 honeypot checker",
      "BSC honeypot checker",
      "token scam checker",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: "Honeypot Checker | Kryptonal",
      description:
        "Analyze token sellability, taxes, ownership, blacklist risk, mint risk, and honeypot signals.",
      url,
      siteName: "Kryptonal",
      type: "website",
    },
  };
}

export default async function HoneypotCheckerPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 text-white">
        <HoneypotChecker t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
