import type { Metadata } from "next";
import Link from "next/link";
import NewsHub from "@/components/blog/NewsHub";
import { fetchLatestNews } from "@/lib/news/fetchNews";
import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/layout/Header";
import { Import } from "lucide-react";
import Footer from "@/components/layout/Footer";


type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.blog;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";
  const url = `${baseUrl}/${locale}/blog`;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/blog`,
        es: `${baseUrl}/es/blog`,
        pt: `${baseUrl}/pt/blog`,
        fr: `${baseUrl}/fr/blog`,
        de: `${baseUrl}/de/blog`,
        tr: `${baseUrl}/tr/blog`,
      },
    },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url,
      siteName: "Kryptonal",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.blog;

  const news = await fetchLatestNews();

  return (
    <>
    <Header locale={locale} t={dict} />
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_35%),linear-gradient(to_bottom,#020617,#020617,#0f172a)] px-4 py-10 text-white sm:px-6">
      <section className="mx-auto max-w-7xl pt-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2">
            {t.badges.map((badge: string) => (
              <span
                key={badge}
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300"
              >
                {badge}
              </span>
            ))}
          </div>

          <h1 className="mt-8 text-4xl font-black tracking-tight md:text-7xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#latest-news"
              className="rounded-full bg-emerald-400 px-6 py-3 text-center font-black text-slate-950 hover:bg-emerald-300"
            >
              {t.readLatest}
            </a>

            <Link
              href={`/${locale}/blog#guides`}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center font-black text-white hover:bg-white/10"
            >
              {t.exploreGuides}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl">
        <NewsHub initialNews={news} locale={locale} t={t} />
      </section>

      <section className="mx-auto mt-24 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-10">
        <h2 className="text-3xl font-black md:text-5xl">{t.whyTitle}</h2>

        <div className="mt-6 space-y-5 text-slate-300">
          <p>{t.whyText}</p>

          <h3 className="text-2xl font-black text-white">{t.organizeTitle}</h3>
          <p>{t.organizeText}</p>

          <h3 className="text-2xl font-black text-white">{t.adviceTitle}</h3>
          <p>{t.adviceText}</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-3xl font-black md:text-5xl">{t.faqTitle}</h2>

        <div className="mt-8 space-y-4">
          {t.faq.map((item: any) => (
            <details
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <summary className="cursor-pointer font-bold text-white">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-20 max-w-7xl border-t border-white/10 py-8 text-sm text-slate-400">
        {t.footerNote}
      </footer>
    </main>
    <Footer locale={locale} t={dict} />
    </>
  );
}