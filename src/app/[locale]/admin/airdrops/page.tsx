import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AirdropAdmin from "@/components/tools/AirdropAdmin";
import { getDictionary } from "@/lib/getDictionary";

export const metadata = {
  title: "Airdrop Admin | Kryptonal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AirdropAdminPage() {
  const locale = "en"; // or get from params if needed

  const t = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <AirdropAdmin />

      <Footer locale={locale} t={t} />
    </>
  );
}
