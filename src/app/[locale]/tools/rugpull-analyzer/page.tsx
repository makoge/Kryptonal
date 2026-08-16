import RugPullAnalyzer from "@/components/tools/RugPullAnalyzer";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;
  const t = dict.tools?.rugPullAnalyzer || {};
  return {
    title: `${t.title || "Rug Pull & Bundled Sniper Analyzer"} | Kryptonal`,
    description:
      t.description ||
      "Audit token contracts for bundled sniper wallets, honeypot code, and liquidity locks.",
  };
}

export default async function RugPullAnalyzerPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;

  // Pass dict.tools.rugPullAnalyzer directly
  return (
    <>
      <Header locale={locale} t={dict} />

      <main className="min-h-screen bg-[#07090E] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <RugPullAnalyzer dict={dict.tools?.rugPullAnalyzer || dict} />
      </main>
      <Footer locale={locale} t={dict} />
    </>
  );
}
