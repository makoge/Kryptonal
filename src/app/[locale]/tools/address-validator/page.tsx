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

  return {
    title: "Crypto Address Validator | Wallet Address Checker",
    description:
      "Validate cryptocurrency wallet addresses, detect supported networks, review checksum status, and reduce transfer mistakes before sending crypto.",
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/address-validator`,
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
        <AddressValidator locale={locale} />
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
