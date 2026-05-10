import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import Link from "next/link";

const siteUrl = "https://kryptonal.com";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      "Kryptonal Blog | Crypto, Blockchain, Web3 & Gaming Crypto Guides",
    description:
      "Learn about cryptocurrency, blockchain technology, Bitcoin cycles, Web3 opportunities, gaming crypto, NFTs, DeFi, and market analysis on Kryptonal.",
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        en: `${siteUrl}/en/blog`,
        es: `${siteUrl}/es/blog`,
        pt: `${siteUrl}/pt/blog`,
        fr: `${siteUrl}/fr/blog`,
        de: `${siteUrl}/de/blog`,
        tr: `${siteUrl}/tr/blog`,
      },
    },
    openGraph: {
      title:
        "Kryptonal Blog | Crypto, Blockchain, Web3 & Gaming Crypto Guides",
      description:
        "Educational crypto content covering blockchain, Web3, Bitcoin cycles, gaming crypto, and market intelligence.",
      url: `${siteUrl}/${locale}/blog`,
      siteName: "Kryptonal",
      type: "website",
      locale,
      images: [
        {
          url: `${siteUrl}/og/blog.jpg`,
          width: 1200,
          height: 630,
          alt: "Kryptonal Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Kryptonal Blog | Crypto, Blockchain, Web3 & Gaming Crypto Guides",
      description:
        "Educational crypto content covering blockchain, Web3, Bitcoin cycles, gaming crypto, and market intelligence.",
      images: [`${siteUrl}/og/blog.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden px-4 py-24 sm:px-5 md:py-32">
          <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              🚀 Coming Soon
            </div>

            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
              Kryptonal Blog
            </p>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Learn crypto, blockchain, Web3 and gaming crypto the smart way.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              We are building a premium crypto learning hub focused on Bitcoin
              cycles, blockchain technology, Web3 opportunities, DeFi, NFTs,
              gaming crypto, and market intelligence explained in simple
              language.
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
                <div className="mb-4 text-3xl">📈</div>

                <h2 className="text-xl font-bold text-white">
                  Market Cycle Guides
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Understand Bitcoin cycles, crypto market cap trends, bull
                  markets, bear markets, and long-term market behavior.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
                <div className="mb-4 text-3xl">⛓️</div>

                <h2 className="text-xl font-bold text-white">
                  Blockchain & Web3
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Learn blockchain fundamentals, smart contracts, decentralized
                  applications, wallets, and the future of Web3.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
                <div className="mb-4 text-3xl">🎮</div>

                <h2 className="text-xl font-bold text-white">
                  Gaming Crypto
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Discover gaming crypto ecosystems, play-to-earn models, NFT
                  gaming economies, and metaverse opportunities.
                </p>
              </div>
            </div>

            <div className="mt-14 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}/market-cap`}
                className="rounded-xl bg-emerald-400 px-8 py-4 text-center font-bold text-slate-950 transition hover:scale-[1.02]"
              >
                Explore Market Cap
              </Link>

              <Link
                href={`/${locale}`}
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-center font-bold text-white transition hover:bg-white/10"
              >
                Back Home
              </Link>
            </div>

            <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-slate-900/40 p-6 text-left backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white">
                What will be published?
              </h3>

              <ul className="mt-5 space-y-4 text-slate-300">
                <li>
                  • Beginner-friendly crypto and blockchain tutorials
                </li>
                <li>
                  • Bitcoin and crypto cycle analysis
                </li>
                <li>
                  • Web3 opportunities and decentralized ecosystems
                </li>
                <li>
                  • Gaming crypto and NFT ecosystem research
                </li>
                <li>
                  • SEO-rich educational articles for long-term learning
                </li>
                <li>
                  • Market intelligence and downloadable crypto insights
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}