import { notFound } from "next/navigation";
import TokenUnlockSimulator from "@/components/tools/TokenUnlockSimulator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import { SEO_TOKENS } from "@/lib/seo-tools";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate static routes for all tokens at build time for fast indexing
export async function generateStaticParams() {
  const locales = ["en", "tr", "pt", "es", "fr", "de"];
  const paths: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const token of SEO_TOKENS) {
      paths.push({ locale, slug: token.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const token = SEO_TOKENS.find((t) => t.slug === slug);
  if (!token) return {};

  const dict = (await getDictionary(locale)) as any;
  const toolDict = dict.tools?.tokenUnlock || {};

  const title = `${token.name} (${token.symbol}) Token Unlock Price Impact & Dilution Risk | Kryptonal`;
  const description = `Analyze upcoming ${token.name} (${token.symbol}) token cliff unlock schedule, liquidity overhang, sell pressure, and projected price slippage on Kryptonal.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TokenUnlockSeoPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const token = SEO_TOKENS.find((t) => t.slug === slug);

  if (!token) {
    notFound();
  }

  const dict = (await getDictionary(locale)) as any;
  const toolDict = dict.tools?.tokenUnlock || dict;

  // JSON-LD Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${token.name} Token Unlock Impact Simulator`,
    description: `Simulate selling pressure and market slippage for upcoming ${token.name} token unlocks.`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
  };

  return (
    <>
      <Header locale={locale} t={dict} />
      <main className="min-h-screen bg-[#07090E] py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Dynamic SEO Content Heading Block */}
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {token.name} ({token.symbol}) Token Unlock Price Impact
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Calculate market dilution, liquidity depth absorption, and price
            slippage risk before the next major {token.name} cliff unlock event.
          </p>
        </div>

        <TokenUnlockSimulator dict={toolDict} />
      </main>
      <Footer locale={locale} t={dict} />
    </>
  );
}
