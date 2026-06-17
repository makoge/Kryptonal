"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticleCard({
  article,
  locale,
  readGuide,
  t,
}: {
  article: any;
  locale: string;
  readGuide: string;
  t: any;
}) {
  const [views, setViews] = useState(0);
  const [copied, setCopied] = useState(false);

 

  useEffect(() => {
    async function loadViews() {
      const res = await fetch(`/api/article-views?slug=${article.slug}`);
      const data = await res.json();
      setViews(data.views || 0);
    }

    loadViews();
  }, [article.slug]);

 async function shareArticle() {
  const articleUrl = `${window.location.origin}/${locale}/blog/${article.slug}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.excerpt,
        url: articleUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  } catch (error) {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
}

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/40">
      <div className="relative h-52 bg-gradient-to-br from-emerald-400/20 via-slate-800 to-slate-950">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : null}

        <span className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur">
          👁 {views.toLocaleString()} {t.reads}
        </span>
      </div>

      <div className="p-6">
        <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
          {article.category}
        </span>

        <h3 className="mt-4 text-xl font-black text-white">
          {article.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
          <span>{article.readTime}</span>
          <span>Kryptonal</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href={`/${locale}/blog/${article.slug}`}
            className="inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-emerald-300"
          >
            {readGuide} →
          </Link>

          <button
            type="button"
            onClick={shareArticle}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            {copied ? t.copied : t.share}
          </button>
        </div>
      </div>
    </article>
  );
}