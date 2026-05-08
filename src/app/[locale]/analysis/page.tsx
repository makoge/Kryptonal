import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import LiveMarketPhaseCard from "@/components/analysis/LiveMarketPhaseCard";
import LiveSignals from "@/components/analysis/LiveSignals";
import DeepAnalysisEngine from "@/components/analysis/DeepAnalysisEngine";
import StablecoinFlows from "@/components/analysis/StablecoinFlows";
import ChainStrengthTracker from "@/components/analysis/ChainStrengthTracker";
import SectorRotationHeatmap from "@/components/analysis/SectorRotationHeatmap";

const siteUrl = "https://kryptonal.com";

const languages = {
  en: `${siteUrl}/en/analysis`,
  es: `${siteUrl}/es/analysis`,
  pt: `${siteUrl}/pt/analysis`,
  fr: `${siteUrl}/fr/analysis`,
  de: `${siteUrl}/de/analysis`,
  tr: `${siteUrl}/tr/analysis`,
};

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const url = `${siteUrl}/${locale}/analysis`;

  return {
    title: t.seo.analysis.title,
    description: t.seo.analysis.description,
    keywords: t.seo.analysis.keywords,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: t.seo.analysis.title,
      description: t.seo.analysis.description,
      url,
      siteName: "Cryptonal",
      type: "website",
      locale,
      images: [
        {
          url: `${siteUrl}/og/analysis.jpg`,
          width: 1200,
          height: 630,
          alt: t.seo.analysis.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.analysis.title,
      description: t.seo.analysis.description,
      images: [`${siteUrl}/og/analysis.jpg`],
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

export default async function AnalysisPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const pageUrl = `${siteUrl}/${locale}/analysis`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: t.seo.analysis.title,
        description: t.seo.analysis.description,
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          name: "Cryptonal",
          url: siteUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: t.analysis.faqs.map((faq) => ({
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
        <header className="relative overflow-hidden px-4 py-16 sm:px-5 md:py-28">
  <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

  <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
    <div>
      <p className="mb-5 text-sm font-bold uppercase tracking-widest text-emerald-400">
        {t.analysis.badge}
      </p>

      <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
        {t.analysis.title}
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        {t.analysis.description}
      </p>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row">
        <Link
          href="#analysis-engine"
          className="rounded-xl bg-emerald-400 px-7 py-4 text-center font-bold text-slate-950 shadow-[0_0_35px_rgba(52,211,153,0.22)] transition hover:bg-emerald-300"
        >
          {t.analysis.primaryCta}
        </Link>

        <Link
          href="#methodology"
          className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-center font-bold transition hover:bg-white/10"
        >
          {t.analysis.secondaryCta}
        </Link>
      </div>
    </div>

    <LiveMarketPhaseCard t={t} />
  </div>
</header>

        <LiveSignals t={t} />

        <DeepAnalysisEngine t={t} />
        <StablecoinFlows t={t} />
        <ChainStrengthTracker t={t} />
        <SectorRotationHeatmap t={t} />

        

        <section id="methodology" className="mx-auto max-w-4xl px-4 py-20 sm:px-5">
          <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-black prose-p:text-slate-300">
            <h2>{t.analysis.content.howTitle}</h2>
            <p>{t.analysis.content.howText}</p>

            <h2>{t.analysis.content.marketCapTitle}</h2>
            <p>{t.analysis.content.marketCapText}</p>

            <h2>{t.analysis.content.bitcoinTitle}</h2>
            <p>{t.analysis.content.bitcoinText}</p>

            <h2>{t.analysis.content.riskTitle}</h2>
            <p>{t.analysis.content.riskText}</p>

            <h2>{t.analysis.content.historyTitle}</h2>
            <p>{t.analysis.content.historyText}</p>
          </article>
        </section>

        <section className="border-y border-white/10 bg-slate-900/40 px-4 py-16 sm:px-5">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black md:text-4xl">{t.analysis.internalLinksTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {t.analysis.internalLinks.map((item) => (
                <Link key={item.href} href={`/${locale}${item.href}`} className="rounded-2xl border border-white/10 bg-slate-950 p-6 transition hover:border-emerald-400/40">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-5">
          <h2 className="text-3xl font-black md:text-4xl">{t.analysis.faqTitle}</h2>
          <div className="mt-8 grid gap-5">
            {t.analysis.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-bold">{faq.question}</h3>
                <p className="mt-4 leading-7 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}
