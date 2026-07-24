import { getDictionary } from "@/lib/getDictionary";
import { getLiveNews } from "@/lib/fetchLiveNews"; // 1. Import the fetcher!
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/trending/HeroSection";
import TrendingTabs from "@/components/trending/TrendingTabs";
import SidebarWidget from "@/components/trending/SidebarWidget";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const dict = await getDictionary(locale);

  const metaTitle =
    dict.TrendingMeta?.title ||
    "Trending Crypto & Financial Stories | Kryptonal";
  const metaDescription =
    dict.TrendingMeta?.description ||
    "Follow live trending cryptocurrency, blockchain, stock market and global finance stories.";

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `https://kryptonal.com/${locale}/trending`,
      languages: {
        en: "https://kryptonal.com/en/trending",
        es: "https://kryptonal.com/es/trending",
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `https://kryptonal.com/${locale}/trending`,
      siteName: "Kryptonal",
      images: [{ url: "/images/trending-og.webp", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ["/images/trending-og.webp"],
    },
  };
}

export default async function TrendingPage({ params: { locale } }: Props) {
  const dict = await getDictionary(locale);

  // 2. Fetch the live stories right here on the server!
  const liveStories = await getLiveNews();

  const pageTitle =
    dict.TrendingMeta?.title ||
    "Trending Crypto & Financial Stories | Kryptonal";
  const pageDescription =
    dict.TrendingMeta?.description ||
    "Follow live trending cryptocurrency, blockchain, stock market and global finance stories.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kryptonal.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Trending",
          item: `https://kryptonal.com/${locale}/trending`,
        },
      ],
    },
  };

  return (
    <>
      <Header locale={locale} t={dict} />

      <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-emerald-500/30">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <HeroSection dict={dict.Trending?.Hero} />

        <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 xl:col-span-9">
            {/* 3. Pass the fetched stories down to your Tabs */}
            <TrendingTabs
              dict={dict.Trending?.Tabs}
              initialStories={liveStories}
              locale={locale}
            />
          </div>

          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <SidebarWidget dict={dict.Trending?.Sidebar} />
          </aside>
        </main>
      </div>

      <Footer locale={locale} t={dict} />
    </>
  );
}
