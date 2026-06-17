import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AirdropRadar from "@/components/tools/AirdropRadar";
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
    title: "Kryptonal Airdrop Radar | Crypto Airdrop Tracker",
    description:
      "Track potential tokenless protocols, community-submitted crypto airdrops, and research airdrop opportunities safely.",
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/airdrop-radar`,
    },
  };
}

export default async function AirdropRadarPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950">
        <AirdropRadar locale={locale} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
