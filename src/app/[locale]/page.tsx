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
      siteName: "Kryptonal",
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
  const t = getDictionary(locale);

  const homeStats = Array.isArray(t.home.stats) ? t.home.stats : [];
  const homeFeatures = Array.isArray(t.home.features) ? t.home.features : [];
  const homeQuestions = Array.isArray(t.home.questions) ? t.home.questions : [];

  return (
    <>
      <Header locale={locale} t={t} />

      <main className="bg-slate-950 text-white">
        <header className="relative overflow-hidden px-4 py-20 sm:px-5 md:py-28">
  <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

  <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
    <div>
      <p className="mb-5 text-sm font-bold uppercase tracking-widest text-emerald-400">
        {t.home.badge}
      </p>

      <h1 className="max-w-5xl text-4xl font-black tracking-tight md:text-6xl">
        {t.home.title}
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        {t.home.description}
      </p>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row">
        <Link
          href={`/${locale}/market-cap`}
          className="rounded-xl bg-emerald-400 px-7 py-4 text-center font-bold text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300"
        >
          {t.home.primaryCta}
        </Link>

        <Link
          href={`/${locale}/analysis`}
          className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-center font-bold transition hover:bg-white/10"
        >
          {t.home.secondaryCta}
        </Link>
      </div>
    </div>

    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-emerald-400/10 blur-2xl" />

      <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                {t.home.intelligenceCard.badge}
              </p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                {t.home.intelligenceCard.title}
              </h2>
            </div>

            <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-300">
              {t.home.intelligenceCard.status}
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
            {t.home.intelligenceCard.description}
          </p>

          <div className="mt-6 grid gap-3">
            {t.home.intelligenceCard.steps.map((step, index) => (
              <div
                key={step.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-black text-emerald-300">
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200">
            {t.home.intelligenceCard.disclaimer}
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

        <section className="border-y border-white/10 bg-slate-900/40 px-4 py-10 sm:px-5">
          <div className="mx-auto grid max-w-7xl gap-6 text-center md:grid-cols-4">
            {homeStats.map((stat) => (
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
            {homeFeatures.map((feature) => (
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
              {homeQuestions.map((question) => (
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