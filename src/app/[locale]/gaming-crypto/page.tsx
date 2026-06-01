
// src/app/[locale]/gaming-crypto/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import FindGamingEcosystem from "@/components/gaming/FindGamingEcosystem";
import { getGamingMarketPulse } from "@/lib/gaming/getGamingMarketPulse";
import { getFeaturedGames } from "@/lib/gaming/getFeaturedGames";
import { getGamingEcosystems } from "@/lib/gaming/getGamingEcosystems";
import { getGamingDailyPulse } from "@/lib/gaming/getGamingDailyPulse";

const locales = ["en", "es", "pt", "fr", "de", "tr"] as const;

const copy: any = {
  en: {
    title: "Discover the Future of Gaming Crypto",
    subtitle:
      "Track Web3 gaming trends, gaming tokens, NFT economies, blockchain games, GameFi ecosystems, and emerging gaming opportunities.",
    exploreTokens: "Explore Gaming Tokens",
    exploreGames: "Discover Web3 Games",
  },
  es: {
    title: "Descubre el futuro del gaming crypto",
    subtitle:
      "Sigue tendencias Web3 gaming, tokens gaming, economías NFT, juegos blockchain y oportunidades emergentes.",
    exploreTokens: "Explorar tokens gaming",
    exploreGames: "Descubrir juegos Web3",
  },
  pt: {
    title: "Descubra o futuro dos jogos cripto",
    subtitle:
      "Acompanhe tendências Web3 gaming, tokens gaming, economias NFT e oportunidades emergentes.",
    exploreTokens: "Explorar tokens gaming",
    exploreGames: "Descobrir jogos Web3",
  },
  fr: {
    title: "Découvrez le futur du gaming crypto",
    subtitle:
      "Suivez les tendances Web3 gaming, les tokens gaming, les économies NFT et les opportunités émergentes.",
    exploreTokens: "Explorer les tokens gaming",
    exploreGames: "Découvrir les jeux Web3",
  },
  de: {
    title: "Entdecke die Zukunft von Gaming Crypto",
    subtitle:
      "Verfolge Web3-Gaming-Trends, Gaming-Token, NFT-Ökonomien und neue Chancen.",
    exploreTokens: "Gaming-Token entdecken",
    exploreGames: "Web3-Spiele entdecken",
  },
  tr: {
    title: "Gaming Crypto’nun Geleceğini Keşfet",
    subtitle:
      "Web3 oyun trendlerini, gaming tokenlerini, NFT ekonomilerini ve yeni fırsatları takip et.",
    exploreTokens: "Gaming Tokenlerini Keşfet",
    exploreGames: "Web3 Oyunlarını Keşfet",
  },
};





const narratives = [
  ["Telegram gaming surge", "Mini-app games are bringing casual users into crypto.", "TON, NOT, gaming launchpads", "Medium"],
  ["AI gaming narrative", "AI agents, NPCs, and generated game economies are becoming a new Web3 trend.", "AI + gaming tokens", "High"],
  ["NFT gaming recovery", "Gaming NFTs are shifting from hype assets to utility-based items.", "IMX, RON, GALA", "Medium"],
  ["Mobile Web3 gaming", "Mobile-first games can onboard millions faster than complex desktop games.", "RON, TON, Base", "Medium"],
];

const guides = [
  "What is GameFi?",
  "What is Play-to-Earn?",
  "How NFT gaming works",
  "Are crypto games profitable?",
  "What are gaming tokens?",
  "Best beginner Web3 games",
];

const chains = ["Immutable", "Ronin", "Solana", "Avalanche", "Base"];



export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  return {
    title: "Gaming Crypto, GameFi & Web3 Gaming Hub | Kryptonal",
    description:
      "Discover gaming crypto tokens, GameFi trends, NFT games, Web3 gaming ecosystems, gaming news, and blockchain game analysis.",
    alternates: {
      canonical: `${site}/${locale}/gaming-crypto`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${site}/${l}/gaming-crypto`])
      ),
    },
    openGraph: {
      title: "Gaming Crypto & Web3 Gaming Hub",
      description:
        "Track GameFi, gaming tokens, NFT games, Web3 gaming trends, and upcoming crypto games.",
      url: `${site}/${locale}/gaming-crypto`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Gaming Crypto & Web3 Gaming Hub",
      description: "Discover Web3 gaming trends, tokens, chains, and GameFi opportunities.",
    },
  };
}

export default async function GamingCryptoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const dict = await getDictionary(locale);
  const t = dict.gaming;
  const pulse = await getGamingMarketPulse();
  const featuredGames = await getFeaturedGames();
  const ecosystems = await getGamingEcosystems();
  const dailyPulse = getGamingDailyPulse(pulse);

  return (
    <>
    <Header locale={locale} t={dict} />
        
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* HERO */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,.18),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
              {t.heroBadge}
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
              {t.heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {t.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#tokens"
                className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-black text-slate-950 shadow-[0_0_40px_rgba(52,211,153,.35)]"
              >
                {t.exploreTokens}
              </Link>

              <Link
                href="#games"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center font-bold backdrop-blur hover:bg-white/10"
              >
                {t.exploreGames}
              </Link>
            </div>
          </div>

    
<div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur">
  <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-400">{t.liveGamingMovers}</p>
      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
        ● Live
      </span>
    </div>

    <h2 className="mt-3 text-3xl font-black">
      {t.gamingCoinsToday}
    </h2>

    <div className="mt-6 grid gap-3">
      {pulse.topCoins.map((coin: any) => (
        <div
          key={coin.symbol}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
        >
          <div>
            <p className="font-black">{coin.symbol}</p>
            <p className="text-xs text-slate-400">{coin.ecosystem}</p>
          </div>

          <span
  className={
    Number(coin.change24h || 0) >= 0
      ? "font-black text-emerald-300"
      : "font-black text-red-300"
  }
>
  {Number(coin.change24h || 0) >= 0 ? "+" : ""}
  {Number(coin.change24h || 0).toFixed(2)}%
</span>
        </div>
      ))}
    </div>
  </div>
</div>
        </div>
      </section>

      {/* MARKET PULSE */}
<Section title={t.marketPulse}>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    {[
      [t.marketCap, formatUsd(pulse.marketCap)],
      [
        t.topGainer,
        pulse.topCoins?.[0]
          ? `${pulse.topCoins[0].symbol} ${
              pulse.topCoins[0].change24h >= 0 ? "+" : ""
            }${pulse.topCoins[0].change24h.toFixed(2)}%`
          : "N/A",
      ],
      [
        t.change24h,
        `${pulse.change24h >= 0 ? "+" : ""}${pulse.change24h.toFixed(2)}%`,
      ],
      [t.hotNarrative, pulse.hottestNarrative],
      [t.dominantChain, pulse.dominantChain],
    ].map(([label, value]) => (
      <Metric key={String(label)} label={label} value={value} />
    ))}
  </div>
</Section>

     {/* TOKENS */}
<Section id="tokens" title={t.trendingTokens}>
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {pulse.topCoins.map((coin) => (
      <Card key={coin.symbol}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
  <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
    <Image
      src={coin.image}
      alt={coin.name}
      fill
      className="object-cover"
      sizes="48px"
    />
  </div>

  <div>
    <div className="text-xl font-black">
      {coin.name}
    </div>

    <div className="text-sm text-slate-400">
      {coin.symbol} • {coin.ecosystem}
    </div>
  </div>
</div>
          <Badge>
            {coin.change24h >= 8
              ? "Hot"
              : coin.change24h >= 3
              ? "Trending"
              : coin.marketCap < 300_000_000
              ? "Low Cap"
              : "Live"}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <Metric
            label={t.price}
            value={formatUsd(coin.price)}
            small
          />

          <Metric
            label="24h"
            value={`${coin.change24h >= 0 ? "+" : ""}${coin.change24h.toFixed(2)}%`}
            small
          />

          <Metric
            label={t.marketCapShort}
            value={formatUsd(coin.marketCap)}
            small
          />
        </div>

        <p className="mt-4 text-sm text-slate-400">
          {coin.ecosystem}
        </p>
      </Card>
    ))}
  </div>
</Section>

     {/* GAMING ECOSYSTEMS */}
<Section title={t.featuredGames}>
  <div className="grid gap-5 lg:grid-cols-2">
    {ecosystems.map((eco) => {
      const ecosystemId = eco.id as keyof typeof t.ecosystems;
      const ecoText = t.ecosystems[ecosystemId];

      if (!ecoText) return null;

      return (
        <Card key={eco.id}>
          <div className="flex items-start gap-4">
            {eco.image ? (
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/5">
                <Image
                  src={eco.image}
                  alt={eco.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : null}

            <div>
              <h3 className="text-2xl font-black">{eco.name}</h3>

              <p className="mt-1 text-sm text-slate-400">
                {eco.token} • {eco.chain} • {ecoText.category}
              </p>
            </div>
          </div>

          <p className="mt-5 text-slate-300">
            {ecoText.description}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Metric
              label={t.price}
              value={formatUsd(eco.price)}
              small
            />

            <Metric
              label="24h"
              value={`${eco.change24h >= 0 ? "+" : ""}${eco.change24h.toFixed(2)}%`}
              small
            />

            <Metric
              label={t.marketCapShort}
              value={formatUsd(eco.marketCap)}
              small
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-emerald-300">
              {t.gamesToExplore}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {ecoText.games.map((game: string) => (
                <Badge key={game}>{game}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-black text-white">
                {t.howToStart}
              </p>

              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {ecoText.howToStart.slice(0, 3).map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-black text-white">
                {t.advantages}
              </p>

              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {ecoText.advantages.slice(0, 3).map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-black text-white">
                {t.risks}
              </p>

              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {ecoText.risks.slice(0, 3).map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      );
    })}
  </div>
</Section>

      {/* DAILY PULSE */}
<Section title={t.dailyPulse}>
  <Card>
    <Badge>{t.sentiments[dailyPulse.sentiment]}</Badge>

    <p className="mt-4 text-xl font-bold leading-8 text-slate-200">
      {dailyPulse.summary}
    </p>

    <div className="mt-5 flex flex-wrap gap-2">
      <Badge>
        {t.risk}: {t.levels[dailyPulse.risk]}
      </Badge>

      <Badge>
        {t.opportunity}: {t.levels[dailyPulse.opportunity]}
      </Badge>

      <Badge>
        {t.sentiment}: {t.sentiments[dailyPulse.sentiment]}
      </Badge>
    </div>
  </Card>
</Section>

      {/* FAQ */}
      <Section title={t.faq}>
  <div className="space-y-3">
    {t.faqItems.map(
      (item: { question: string; answer: string }) => (
        <details
          key={item.question}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
        >
          <summary className="cursor-pointer font-black">
            {item.question}
          </summary>

          <p className="mt-3 text-slate-300">
            {item.answer}
          </p>
        </details>
      )
    )}
  </div>
</Section>

      {/* FINAL CTA */}
      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-black sm:text-6xl">
          {t.finalTitle}
        </h2>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="#tokens"
            className="rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950"
          >
            {t.exploreTokens}
          </Link>

          <Link
            href="#games"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold"
          >
            {t.exploreGames}
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          {t.footerNote}
        </p>
      </section>
    </main>

    <Footer locale={locale} t={dict} />
        </>
  );
}

function Section({
  title,
  children,
  id,
}: any) {
  return (
    <section
      id={id}
      className="px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-3xl font-black tracking-tight sm:text-5xl">
          {title}
        </h2>

        {children}
      </div>
    </section>
  );
}

function Card({ children }: any) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/[0.07]">
      {children}
    </div>
  );
}

function formatUsd(value: number) {
  if (!value) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1 ? "compact" : "standard",
    minimumFractionDigits: value < 0.01 ? 6 : 2,
    maximumFractionDigits: value < 0.01 ? 8 : 2,
  }).format(value);
}

function Badge({ children }: any) {
  return (
    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
      {children}
    </span>
  );
}

function Metric({
  label,
  value,
  small = false,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p
        className={
          small
            ? "mt-1 font-black text-white"
            : "mt-2 text-2xl font-black text-emerald-300"
        }
      >
        {value}
      </p>
    </div>
  );
}



function formatCompact(value: number) {
  if (!value) return "N/A";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const faq = [
  [
    "What is gaming crypto?",
    "Gaming crypto refers to blockchain-powered gaming economies, tokens, NFTs, and Web3 games.",
  ],
  [
    "What is GameFi?",
    "GameFi combines gaming and decentralized finance mechanics.",
  ],
];