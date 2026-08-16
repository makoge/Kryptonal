import { notFound } from "next/navigation";
import AirdropCalculator from "@/components/tools/AirdropCalculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import { SEO_PROTOCOLS } from "@/lib/seo-tools";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "tr", "pt", "es", "fr", "de"];
  const paths: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const protocol of SEO_PROTOCOLS) {
      paths.push({ locale, slug: protocol.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const protocol = SEO_PROTOCOLS.find((p) => p.slug === slug);
  if (!protocol) return {};

  const title = `${protocol.name} Airdrop Points Value Calculator & ROI | Kryptonal`;
  const description = `Calculate your estimated ${protocol.name} points value in USD at TGE, projected payouts across market scenarios, and net gas-adjusted ROI.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function AirdropProtocolSeoPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const protocol = SEO_PROTOCOLS.find((p) => p.slug === slug);

  if (!protocol) {
    notFound();
  }

  const dict = (await getDictionary(locale)) as any;
  const toolDict = dict.tools?.airdropCalc || dict;

  return (
    <>
      <Header locale={locale} t={dict} />
      <main className="min-h-screen bg-[#07090E] py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {protocol.name} Airdrop Points Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Convert your off-chain {protocol.name} points into estimated USD
            token payouts at TGE, taking into account protocol FDV, community
            pool allocation, and transaction gas fees.
          </p>
        </div>

        <AirdropCalculator dict={toolDict} />
      </main>
      <Footer locale={locale} t={dict} />
    </>
  );
}
