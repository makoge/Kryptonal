import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";
import Link from "next/link";

const siteUrl = "https://cryptonal.com";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale)
  const url = `${siteUrl}/${locale}`;

  return {
    title: t.seo.home.title,
    description: t.seo.home.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        pt: `${siteUrl}/pt`,
        fr: `${siteUrl}/fr`,
        de: `${siteUrl}/de`,
        tr: `${siteUrl}/tr`,
      },
    },
    openGraph: {
      title: t.seo.home.title,
      description: t.seo.home.description,
      url,
      siteName: "Cryptonal",
      type: "website",
      locale,
      images: [
        {
          url: `${siteUrl}/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: t.seo.home.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.home.title,
      description: t.seo.home.description,
      images: [`${siteUrl}/og/home.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Homepage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale)

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="bg-slate-950 text-white">
        <section className="relative overflow-hidden px-4 py-20 sm:px-5 md:py-28">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-widest text-emerald-400">
                {t.home.badge}
              </p>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                {t.home.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {t.home.description}
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/market-cap`}
                  className="rounded-xl bg-emerald-400 px-7 py-4 text-center font-bold text-slate-950"
                >
                  {t.home.primaryCta}
                </Link>

                <Link
                  href={`/${locale}/blog`}
                  className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-center font-bold"
                >
                  {t.home.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="rounded-2xl bg-slate-900 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {t.home.chartLabel}
                    </p>
                    <h2 className="text-3xl font-black">$3.3T</h2>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-400">
                    {t.home.marketSignal}
                  </span>
                </div>

                <div className="flex h-64 items-end gap-3">
                  {[30, 45, 38, 70, 55, 82, 68, 90].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-lg bg-emerald-400/30"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  {t.home.chartNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/40 px-4 py-10 sm:px-5">
          <div className="mx-auto grid max-w-7xl gap-6 text-center md:grid-cols-4">
            {t.home.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-5">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black md:text-4xl">
              {t.home.contentTitle}
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              {t.home.contentDescription}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.home.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 px-4 py-20 sm:px-5">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black md:text-4xl">
              {t.home.questionsTitle}
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {t.home.questions.map((question) => (
                <div
                  key={question}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-6 text-slate-300"
                >
                  {question}
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