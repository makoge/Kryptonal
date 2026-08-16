import AirdropCalculator from "@/components/tools/AirdropCalculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;
  const t = dict.tools?.airdropCalc || {};
  return {
    title: `${t.title || "Airdrop Calculator"} | Kryptonal`,
    description:
      t.description || "Calculate TGE points value and restaking ROI.",
  };
}

export default async function AirdropCalculatorPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;

  // Pass dict.tools.airdropCalc directly
  return (
    <>
      <Header locale={locale} t={dict} />
      <main className="min-h-screen bg-[#07090E] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <AirdropCalculator dict={dict.tools?.airdropCalc || dict} />
      </main>
      <Footer locale={locale} t={dict} />
    </>
  );
}
