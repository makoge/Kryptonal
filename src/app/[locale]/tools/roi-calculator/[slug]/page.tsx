import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfitSimulator from "@/components/tools/CryptoProfitSimulator";
import { getDictionary } from "@/lib/getDictionary";
import { SEO_ROI_TOKENS } from "@/lib/seo-tools";
import CryptoProfitSimulator from "@/components/tools/CryptoProfitSimulator";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const locales = ["en", "tr", "pt", "es", "fr", "de"];
  const paths: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const token of SEO_ROI_TOKENS) {
      paths.push({ locale, slug: token.slug });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const token = SEO_ROI_TOKENS.find((t) => t.slug === slug);
  if (!token) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  return {
    title: `${token.name} (${token.symbol}) Crypto Profit Simulator & ROI | Kryptonal`,
    description: `Calculate ${token.name} historical DCA returns, simulate future target price profit scenarios, and check required market cap on Kryptonal.`,
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/roi-calculator/${slug}`,
    },
  };
}

export default async function RoiCalculatorSeoPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const token = SEO_ROI_TOKENS.find((t) => t.slug === slug);

  if (!token) {
    notFound();
  }

  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {token.name} ({token.symbol}) Profit Simulator & ROI Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Simulate historical DCA returns, test future {token.name} price
            targets, and check market cap reality levels.
          </p>
        </div>

        <CryptoProfitSimulator t={t} defaultCoin={token.slug} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
