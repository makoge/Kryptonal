import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddressValidator from "@/components/tools/AddressValidator";
import { getDictionary } from "@/lib/getDictionary";
import { SEO_NETWORKS } from "@/lib/seo-tools";

type PageProps = {
  params: Promise<{ locale: string; network: string }>;
};

export async function generateStaticParams() {
  const locales = ["en", "tr", "pt", "es", "fr", "de"];
  const paths: { locale: string; network: string }[] = [];

  for (const locale of locales) {
    for (const net of SEO_NETWORKS) {
      paths.push({ locale, network: net.slug });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, network } = await params;
  const netData = SEO_NETWORKS.find((n) => n.slug === network);
  if (!netData) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  return {
    title: `${netData.name} (${netData.symbol}) Address Validator | Kryptonal`,
    description: `Validate ${netData.name} (${netData.symbol}) wallet addresses, verify checksum integrity, and reduce transfer mistakes before sending crypto.`,
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/address-validator/${network}`,
    },
  };
}

export default async function AddressValidatorSeoPage({ params }: PageProps) {
  const { locale, network } = await params;
  const netData = SEO_NETWORKS.find((n) => n.slug === network);

  if (!netData) {
    notFound();
  }

  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {netData.name} ({netData.symbol}) Address Validator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Verify {netData.name} wallet address formatting, checksum status,
            and network compatibility before sending crypto.
          </p>
        </div>

        <AddressValidator t={t} defaultNetwork={netData.slug} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
