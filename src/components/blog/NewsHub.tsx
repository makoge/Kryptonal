"use client";

import { useMemo, useState } from "react";
import type { NormalizedNews } from "@/lib/news/types";
import NewsCard from "./NewsCard";
import ArticleCard from "./ArticleCard";
import BlogFilters from "./BlogFilters";

export default function NewsHub({
  initialNews,
  locale,
  t,
}: {
  initialNews: NormalizedNews[];
  locale: string;
  t: any;
}) {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");

  const filteredNews = useMemo(() => {
    return initialNews.filter((item) => {
      const matchesCategory = active === "all" || item.category === active;
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialNews, active, search]);

  const featured = filteredNews[0];
  const sideNews = filteredNews.slice(1, 5);

  return (
    <div>
      <BlogFilters
        active={active}
        setActive={setActive}
        search={search}
        setSearch={setSearch}
        t={t}
      />

      <section id="latest-news">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
          {t.liveNewsLabel}
        </p>
        <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
          {t.latestNewsTitle}
        </h2>

        <div className="mt-8">
          {featured ? (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="lg:row-span-2">
                <NewsCard item={featured} t={t} />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {sideNews.map((item) => (
                  <NewsCard key={item.id} item={item} t={t} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-slate-300">
              {t.noNews}
            </div>
          )}
        </div>
      </section>

      <section id="guides" className="mt-24">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">
          {t.researchLabel}
        </p>
        <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
          {t.guidesTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">{t.editorialNote}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {t.articles.map((article: any) => (
            <ArticleCard
              key={article.slug}
              article={article}
              locale={locale}
              readGuide={t.readGuide}
            />
          ))}
        </div>
      </section>
    </div>
  );
}