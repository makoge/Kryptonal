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
    title: "Gaming Crypto | Web3 Gaming, NFT Games & Play-to-Earn Research",
    description:
      "Explore gaming crypto, Web3 games, NFT gaming economies, play-to-earn trends, metaverse projects, and blockchain gaming opportunities on Kryptonal.",
    alternates: {
      canonical: `${siteUrl}/${locale}/gaming-crypto`,
      languages: {
        en: `${siteUrl}/en/gaming-crypto`,
        es: `${siteUrl}/es/gaming-crypto`,
        pt: `${siteUrl}/pt/gaming-crypto`,
        fr: `${siteUrl}/fr/gaming-crypto`,
        de: `${siteUrl}/de/gaming-crypto`,
        tr: `${siteUrl}/tr/gaming-crypto`,
      },
    },
    openGraph: {
      title: "Gaming Crypto | Web3 Gaming, NFT Games & Play-to-Earn Research",
      description:
        "A coming-soon research hub for Web3 gaming, gaming crypto, NFT economies, metaverse projects, and blockchain gaming opportunities.",
      url: `${siteUrl}/${locale}/gaming-crypto`,
      siteName: "Kryptonal",
      type: "website",
      locale,
      images: [
        {
          url: `${siteUrl}/og/gaming-crypto.jpg`,
          width: 1200,
          height: 630,
          alt: "Kryptonal Gaming Crypto",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Gaming Crypto | Web3 Gaming, NFT Games & Play-to-Earn Research",
      description:
        "Explore Web3 gaming, gaming crypto, NFT gaming economies, metaverse projects, and blockchain gaming opportunities.",
      images: [`${siteUrl}/og/gaming-crypto.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GamingCryptoPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden px-4 py-24 sm:px-5 md:py-32">
          <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              🎮 Coming Soon
            </div>

            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
              Gaming Crypto Research
            </p>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Discover Web3 gaming, NFT economies and crypto gaming
              opportunities.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Kryptonal is building a dedicated gaming crypto hub for Web3
              games, play-to-earn ecosystems, gaming tokens, NFT economies,
              metaverse projects, and blockchain gaming market research.
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
                <div className="mb-4 text-3xl">🕹️</div>

                <h2 className="text-xl font-bold text-white">
                  Web3 Game Research
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Learn how blockchain games work, which ecosystems are growing,
                  and how gaming tokens fit into the broader crypto market.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
                <div className="mb-4 text-3xl">🧩</div>

                <h2 className="text-xl font-bold text-white">
                  NFT Gaming Economies
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Understand in-game assets, NFT ownership, player incentives,
                  token rewards, game marketplaces, and digital economies.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
                <div className="mb-4 text-3xl">🚀</div>

                <h2 className="text-xl font-bold text-white">
                  Gaming Token Trends
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  Track crypto gaming narratives, metaverse sectors, token
                  performance, adoption signals, and long-term opportunities.
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
                href={`/${locale}/blog`}
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-center font-bold text-white transition hover:bg-white/10"
              >
                Visit Blog
              </Link>
            </div>

            <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-slate-900/40 p-6 text-left backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white">
                What will this section cover?
              </h3>

              <ul className="mt-5 space-y-4 text-slate-300">
                <li>• Best crypto gaming sectors to watch</li>
                <li>• Web3 gaming ecosystem explainers</li>
                <li>• NFT game economy breakdowns</li>
                <li>• Play-to-earn and play-and-own models</li>
                <li>• Metaverse and gaming token narratives</li>
                <li>• Beginner-friendly blockchain gaming guides</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}