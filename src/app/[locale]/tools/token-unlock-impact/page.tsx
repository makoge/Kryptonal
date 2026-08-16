import TokenUnlockSimulator from "@/components/tools/TokenUnlockSimulator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;
  const t = dict.tools?.tokenUnlock || {};
  return {
    title: `${t.title || "Token Unlock Simulator"} | Kryptonal`,
    description:
      t.description ||
      "Calculate token unlock market impact and slippage risk.",
  };
}

export default async function TokenUnlockPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;

  // Pass dict.tools.tokenUnlock directly
  return (
    <>
      <Header locale={locale} t={dict} />
      <main className="min-h-screen bg-[#07090E] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <TokenUnlockSimulator dict={dict.tools?.tokenUnlock || dict} />
      </main>
      <Footer locale={locale} t={dict} />
    </>
  );
}
