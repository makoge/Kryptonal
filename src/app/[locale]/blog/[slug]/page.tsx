import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/getDictionary";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const dict = await getDictionary(locale);

  const article = dict.blog.articles.find(
    (item: any) => item.slug === slug
  );

  if (!article) {
    return {
      title: "Article Not Found | Kryptonal",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

  const url = `${baseUrl}/${locale}/blog/${slug}`;

  return {
    title: `${article.title} | Kryptonal`,
    description: article.excerpt,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      siteName: "Kryptonal",
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },

    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: PageProps) {
  const { locale, slug } = await params;

  const dict = await getDictionary(locale);

  const t = dict.blog;

  const article = t.articles.find(
    (item: any) => item.slug === slug
  );

  if (!article) notFound();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_35%),linear-gradient(to_bottom,#020617,#020617,#0f172a)] px-4 py-12 text-white sm:px-6">
      <article className="mx-auto max-w-3xl">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-white/10"
        >
          ← {t.backToBlog}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
            {article.category}
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            {article.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {article.content.map((section: any) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
                {section.heading}
              </h2>

              <div className="mt-4 space-y-5 text-base leading-8 text-slate-300 md:text-lg">
                {section.body
                  .split("\n\n")
                  .map((paragraph: string) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
          <h2 className="text-2xl font-black text-white">
            {t.educationalTitle}
          </h2>

          <p className="mt-3 leading-7 text-slate-300">
            {t.educationalText}
          </p>
        </div>
      </article>
    </main>
  );
}