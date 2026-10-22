import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddressValidator from "@/components/tools/AddressValidator";
import { getDictionary } from "@/lib/getDictionary";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  // Build dynamic OG image query parameters pointing to /api/og
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set("badge", "Security Tool");
  ogUrl.searchParams.set(
    "title",
    "Crypto Address Validator & Checksum Checker",
  );
  ogUrl.searchParams.set("statLabel", "Supported Networks");
  ogUrl.searchParams.set("statValue", "Multi-Chain");
  ogUrl.searchParams.set("status", "Active");

  const ogImageUrl = ogUrl.toString();
  const pageUrl = `${baseUrl}/${locale}/tools/address-validator`;
  const title = "Crypto Address Validator | Wallet Address Checker | Kryptonal";
  const description =
    "Validate cryptocurrency wallet addresses, detect supported networks, review checksum status, and reduce transfer mistakes before sending crypto.";

  return {
    title,
    description,
    keywords: [
      "Crypto address validator",
      "Wallet address checker",
      "Verify bitcoin address",
      "Verify ethereum address",
      "EVM checksum validator",
      "Multi-chain address checker",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Kryptonal",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Crypto Address Validator - Kryptonal",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function AddressValidatorPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950">
        <AddressValidator t={t} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
