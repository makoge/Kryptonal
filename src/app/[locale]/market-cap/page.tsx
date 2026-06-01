import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import MarketCapChart from "@/components/market/MarketCapChart";
import MarketAnalysis from "@/components/market/MarketAnalysis";
import MarketOverview from "@/components/market/MarketOverview";
import AltseasonIndex from "@/components/market/AltseasonIndex";
import MarketComparison from "@/components/market/MarketComparison";
import MarketStickyTools from "@/components/market/MarketStickyTools";

const siteUrl = "https://cryptonal.com";

const languages = {
  en: `${siteUrl}/en/market-cap`,
  es: `${siteUrl}/es/market-cap`,
  pt: `${siteUrl}/pt/market-cap`,
  fr: `${siteUrl}/fr/market-cap`,
  de: `${siteUrl}/de/market-cap`,
  tr: `${siteUrl}/tr/market-cap`,
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

type TranslationItem = {
  label?: string;
  value?: string;
  text?: string;
  title?: string;
  change?: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const url = `${siteUrl}/${locale}/market-cap`;

  return {
    title: t.seo.marketCap.title,
    description: t.seo.marketCap.description,
    keywords: t.seo.marketCap.keywords,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: t.seo.marketCap.title,
      description: t.seo.marketCap.description,
      url,
      siteName: "Kryptonal",
      type: "website",
      locale,
      images: [
        {
          url: `${siteUrl}/og/market-cap.jpg`,
          width: 1200,
          height: 630,
          alt: t.seo.marketCap.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.marketCap.title,
      description: t.seo.marketCap.description,
      images: [`${siteUrl}/og/market-cap.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

type GlobalMarketData = {
  totalMarketCap: number;
  change24h: number;
  btcDominance: number;
  ethDominance: number;
  updatedAt: string;
};

async function getGlobalMarketData(): Promise<GlobalMarketData | null> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/global", {
      next: { revalidate: 60 },
      headers: process.env.COINGECKO_API_KEY
        ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
        : {},
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json.data;

    return {
      totalMarketCap: data.total_market_cap.usd,
      change24h: data.market_cap_change_percentage_24h_usd,
      btcDominance: data.market_cap_percentage.btc,
      ethDominance: data.market_cap_percentage.eth,
      updatedAt: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return null;
  }
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  return `$${value.toLocaleString()}`;
}

function getMarketPhase(change24h: number) {
  if (change24h >= 3) return "Expansion";
  if (change24h <= -3) return "Contraction";
  if (change24h < 0) return "Cooling";
  return "Recovery";
}

function getDominanceSignal(btcDominance: number) {
  if (btcDominance >= 58) {
    return {
      label: "Bitcoin Season",
      color: "text-orange-300",
    };
  }

  if (btcDominance >= 52) {
    return {
      label: "BTC Leading",
      color: "text-emerald-300",
    };
  }

  return {
    label: "Altcoin Rotation",
    color: "text-cyan-300",
  };
}

export default async function MarketCapPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const marketCapFaqs = arr<FaqItem>(t.marketCap.faqs);
  const marketCapAnalysisTags = arr<string>(t.marketCap.analysisTags);
  const metrics = arr<TranslationItem>(t.marketCap.metrics);
  const pulseCards = arr<TranslationItem>(t.marketCap.pulseCards);
  const framework = arr<TranslationItem>(t.marketCap.framework);
  const trustPills = arr<string>(t.marketCap.trustPills);


  const globalData = await getGlobalMarketData();

  const dominanceSignal = globalData
  ? getDominanceSignal(globalData.btcDominance)
  : null;

  const liveMetrics = globalData
  ? [
      {
        label: t.marketCap.totalMarketCap,
        value: formatMarketCap(globalData.totalMarketCap),
        change: `${globalData.change24h >= 0 ? "+" : ""}${globalData.change24h.toFixed(2)}% ${t.marketCap.change24h}`,
        positive: globalData.change24h >= 0,
      },
      {
        label: t.marketCap.change24h,
        value: `${globalData.change24h >= 0 ? "+" : ""}${globalData.change24h.toFixed(2)}%`,
        change: globalData.change24h >= 0 ? "Bullish momentum" : "Bearish pressure",
        positive: globalData.change24h >= 0,
      },
      {
        label: t.marketCap.btcDominance,
        value: `${globalData.btcDominance.toFixed(2)}%`,
        change: dominanceSignal?.label || t.marketCap.btcDominance,
        positive: true,
      },
      {
        label: t.marketCap.marketPhase,
        value: getMarketPhase(globalData.change24h),
        change: `${t.marketCap.updated}: ${globalData.updatedAt}`,
        positive: globalData.change24h >= 0,
      },
    ]
  : metrics.slice(0, 4).map((metric) => ({
      label: metric.label,
      value: metric.value,
      change: metric.text || metric.change,
      positive: true,
    }));

  
  const pageUrl = `${siteUrl}/${locale}/market-cap`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: t.seo.marketCap.title,
        description: t.seo.marketCap.description,
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          name: "Kryptonal",
          url: siteUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: marketCapFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Header locale={locale} t={t} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="overflow-hidden bg-[#020617] text-white">
        <section className="relative px-4 pb-14 pt-10 sm:px-5 sm:pb-20 sm:pt-16 lg:pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.20),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.14),transparent_32%),linear-gradient(to_bottom,#020617,#020617_58%,#07111f)]" />
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl sm:h-[520px] sm:w-[520px]" />

          <div className="relative mx-auto max-w-7xl">
            <Link
              href={`/${locale}`}
              className="mb-7 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 backdrop-blur transition hover:border-emerald-300/40 hover:text-emerald-300"
            >
              {t.marketCap.back}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {trustPills.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 sm:text-sm">
                  {t.marketCap.badge}
                </p>

                <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                  {t.marketCap.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  {t.marketCap.description}
                </p>

                <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
                  <Link
                    href="#analysis-engine"
                    className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-black text-slate-950 shadow-[0_0_35px_rgba(52,211,153,0.28)] transition hover:bg-emerald-300"
                  >
                    {t.marketCap.primaryCta}
                  </Link>

                  <Link
                    href="#altcoin-index"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center font-bold text-white backdrop-blur transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
                  >
                    {t.marketCap.secondaryCta}
                  </Link>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
  {liveMetrics.map((metric) => (
    <div
      key={metric.label}
      className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {metric.label}
      </p>

      <p className="mt-2 font-mono text-base font-black text-white sm:text-lg">
        {metric.value}
      </p>

      <p
        className={`mt-1 text-xs ${
          metric.positive ? "text-emerald-300" : "text-red-300"
        }`}
      >
        {metric.change}
      </p>
    </div>
  ))}
</div>
              </div>

              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-emerald-400/20 to-cyan-400/10 blur-2xl" />
                <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-2 shadow-2xl backdrop-blur-xl sm:p-5">
                  <MarketCapChart t={t} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <MarketStickyTools t={t} />

        <section id="overview" className="px-4 py-12 sm:px-5 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                {t.marketCap.overviewLabel}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {t.marketCap.overviewTitle}
              </h2>
              <p className="mt-4 leading-8 text-slate-300">
                {t.marketCap.overviewText}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl sm:p-5">
              <MarketOverview t={t} />
            </div>
          </div>
        </section>

        {pulseCards.length > 0 ? (
          <section className="px-4 py-8 sm:px-5">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {pulseCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-emerald-300/30 hover:bg-white/[0.06]"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-4 font-mono text-xl font-black text-emerald-300">
                      {card.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section
          id="analysis-engine"
          className="relative mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20"
        >
          <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mb-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              {t.marketCap.engineLabel}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {t.marketCap.engineTitle}
            </h2>
            <p className="mt-4 leading-8 text-slate-300">
              {t.marketCap.engineText}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.045] p-2 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:p-4">
              <MarketAnalysis locale={locale} t={t} />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-8">
              <div className="mb-5 flex flex-wrap gap-2">
                {marketCapAnalysisTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1 text-xs font-bold text-emerald-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl font-black sm:text-3xl">
                {t.marketCap.analysisTitle}
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {t.marketCap.analysisText}
              </p>

              <div className="mt-7 grid gap-3">
                {arr<string>(t.marketCap.engineChecks).map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
                  >
                    <span className="text-sm font-bold text-slate-200">
                      {item}
                    </span>
                    <span className="shrink-0 font-mono text-xs font-black text-emerald-300">
                      {t.marketCap.checkLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {framework.length > 0 ? (
          <section className="px-4 py-14 sm:px-5 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  {t.marketCap.frameworkLabel}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {t.marketCap.frameworkTitle}
                </h2>
                <p className="mt-4 leading-8 text-slate-300">
                  {t.marketCap.frameworkText}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {framework.map((item, index) => (
                  <div
                    key={item.title || item.text}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6"
                  >
                    <span className="font-mono text-sm font-black text-cyan-300">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 font-black text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section
          id="altcoin-index"
          className="relative px-4 py-14 sm:px-5 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                {t.marketCap.historicalLabel}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {t.marketCap.chartTitle}
              </h2>
              <p className="mt-4 leading-8 text-slate-300">
                {t.marketCap.chartDescription}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl sm:p-5">
              <AltseasonIndex t={t} />
            </div>
          </div>
        </section>

        

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20">
          <article className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: t.marketCap.content.whatTitle,
                text: t.marketCap.content.whatText,
              },
              {
                title: t.marketCap.content.whyTitle,
                text: t.marketCap.content.whyText,
              },
              {
                title: t.marketCap.content.cyclesTitle,
                text: t.marketCap.content.cyclesText,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-8"
              >
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {item.title}
                </h2>
                <p className="mt-5 leading-8 text-slate-300">{item.text}</p>
              </div>
            ))}
          </article>
        </section>

        <section className="relative px-4 py-16 sm:px-5 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />

          <div className="relative mx-auto max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              {t.marketCap.faqLabel}
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t.marketCap.faqTitle}
            </h2>

            <div className="mt-8 grid gap-4">
              {marketCapFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-emerald-300/30 sm:p-6"
                >
                  <h3 className="text-lg font-black text-white sm:text-xl">
                    {faq.question}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}