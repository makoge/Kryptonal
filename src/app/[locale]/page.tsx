import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import CycleComparison from "@/components/home/CycleComparison";
import LiveHeroBoard from "@/components/home/LiveHeroBoard";
import HomeToolsSection from "@/components/home/HomeToolsSection";
import LiveMarketSummary from "@/components/home/LiveMarketSummary";

const siteUrl = "https://kryptonal.com";
const locales = ["en", "es", "pt", "fr", "de", "tr"];

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const url = `${siteUrl}/${locale}`;

  return {
    title: t.seo.home.title,
    description: t.seo.home.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title: t.seo.home.title,
      description: t.seo.home.description,
      url,
      siteName: "Kryptonal",
      type: "website",
      images: [{ url: `${siteUrl}/og/home.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.home.title,
      description: t.seo.home.description,
      images: [`${siteUrl}/og/home.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Homepage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const h = t.home;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kryptonal",
    url: siteUrl,
    description: t.seo.home.description,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: h.faq.items.map((item: any) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="overflow-hidden bg-slate-950 text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* HERO */}
        <header className="relative px-4 py-20 sm:px-6 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_right,rgba(34,211,238,0.12),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
                {h.hero.badge}
              </p>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
                {h.hero.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {h.hero.description}
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/market-cap`}
                  className="rounded-2xl bg-emerald-400 px-7 py-4 text-center font-black text-slate-950 shadow-[0_0_35px_rgba(52,211,153,0.32)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  {h.hero.primaryCta}
                </Link>

                <Link
                  href={`/${locale}/analysis`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-center font-black backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {h.hero.secondaryCta}
                </Link>
              </div>
            </div>

            <LiveHeroBoard
  panelTitle={h.hero.panelTitle}
  panelNote={h.hero.panelNote}
/>
          </div>
        </header>

       <HomeToolsSection locale={locale} t={t}/>

        {/* SUMMARY */}
        <LiveMarketSummary h={h} />
        <CycleComparison locale={locale} data={h.cycles} />

        {/* EDUCATION */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black md:text-5xl">{h.education.title}</h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">{h.education.text}</p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {h.education.items.map((item: any) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30"
                >
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-slate-900/40 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black md:text-5xl">{h.features.title}</h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {h.features.items.map((item: any) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                  <p className="text-3xl">{item.icon}</p>
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-8">
            <h2 className="text-3xl font-black md:text-5xl">{h.trust.title}</h2>
            <p className="mt-5 max-w-4xl leading-8 text-emerald-50">{h.trust.text}</p>
            <p className="mt-6 text-sm leading-7 text-amber-200">{h.trust.disclaimer}</p>
          </div>
        </section>

        {/* BLOG */}
        <section className="bg-slate-900/40 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black md:text-5xl">{h.blog.title}</h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {h.blog.items.map((post: any) => (
                <article key={post.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                    {post.category}
                  </p>
                  <h3 className="mt-4 text-xl font-black">{post.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{post.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-black md:text-5xl">{h.faq.title}</h2>

            <div className="mt-8 space-y-4">
              {h.faq.items.map((item: any) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <summary className="cursor-pointer font-black">{item.q}</summary>
                  <p className="mt-4 leading-7 text-slate-300">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 p-8 text-center">
            <h2 className="text-3xl font-black md:text-5xl">{h.cta.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-200">{h.cta.text}</p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/analysis`} className="rounded-2xl bg-emerald-400 px-7 py-4 font-black text-slate-950">
                {h.cta.primary}
              </Link>
              <Link href={`/${locale}/market-cap`} className="rounded-2xl border border-white/10 bg-white/10 px-7 py-4 font-black">
                {h.cta.secondary}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={t} />
    </>
  );
}