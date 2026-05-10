import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import MarketCapChart from "@/components/market/MarketCapChart";
import MarketAnalysis from "@/components/market/MarketAnalysis";
import MarketOverview from "@/components/market/MarketOverview";
import HistoricalChart from "@/components/market/HistoricalChart";
import MarketComparison from "@/components/market/MarketComparison";

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
  params: Promise<{
    locale: string;
  }>;
};

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

export default async function MarketCapPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const marketCapFaqs = Array.isArray(t.marketCap.faqs)
  ? t.marketCap.faqs
  : [];
  const marketCapAnalysisTags = Array.isArray(t.marketCap.analysisTags)
  ? t.marketCap.analysisTags
  : [];
  
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

      <main className="bg-slate-950 text-white">
       <header className="relative overflow-hidden px-4 py-20 sm:px-5 md:py-28">
  <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

  <div className="relative mx-auto max-w-7xl">
    <Link
      href={`/${locale}`}
      className="mb-8 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-emerald-300"
    >
      {t.marketCap.back}
    </Link>

    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="mb-5 text-sm font-bold uppercase tracking-widest text-emerald-400">
          {t.marketCap.badge}
        </p>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
          {t.marketCap.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          {t.marketCap.description}
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link
            href="#overview"
            className="rounded-xl bg-emerald-400 px-7 py-4 text-center font-bold text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300"
          >
            {t.marketCap.primaryCta}
          </Link>

          <Link
            href="#historical-data"
            className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-center font-bold transition hover:bg-white/10"
          >
            {t.marketCap.secondaryCta}
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur sm:p-5">
        <MarketCapChart t={t} />
      </div>
    </div>
  </div>
</header>

        <MarketOverview t={t} />

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20">
  <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
    <MarketAnalysis locale={locale} t={t} />

    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-2xl sm:p-6 md:p-8">
      <div className="mb-5 flex flex-wrap gap-2">
        {marketCapAnalysisTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-black sm:text-3xl">
        {t.marketCap.analysisTitle}
      </h2>

      <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
        {t.marketCap.analysisText}
      </p>
    </div>
  </div>
</section>

        <HistoricalChart t={t} />

        <MarketComparison t={t} />
       

        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-5">
          <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-black prose-p:text-slate-300">
            <h2>{t.marketCap.content.whatTitle}</h2>
            <p>{t.marketCap.content.whatText}</p>

            <h2>{t.marketCap.content.whyTitle}</h2>
            <p>{t.marketCap.content.whyText}</p>

            <h2>{t.marketCap.content.cyclesTitle}</h2>
            <p>{t.marketCap.content.cyclesText}</p>
          </article>
        </section>

        <section className="bg-slate-900/40 px-4 py-20 sm:px-5">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-black md:text-4xl">{t.marketCap.faqTitle}</h2>

            <div className="mt-8 grid gap-5">
              {marketCapFaqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                  <h3 className="text-xl font-bold">{faq.question}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{faq.answer}</p>
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
