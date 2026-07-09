import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhaleTracker from "@/components/tools/WhaleTracker";
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
    title: "Crypto Whale Tracker | Track Large On-Chain Movements",
    description:
      "Monitor massive crypto transactions. Understand whether big players are moving funds to sell or accumulating for the long term with simple, educational insights.",
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/whale-tracker`,
    },
  };
}

export default async function WhaleTrackerPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950">
        <WhaleTracker t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
