import Image from "next/image";
import Link from "next/link";

export default function ArticleCard({
  article,
  locale,
  readGuide,
}: {
  article: any;
  locale: string;
  readGuide: string;
}) {
  const hasImage =
    typeof article.image === "string" && article.image.trim().length > 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/40">
      <div className="relative h-52 bg-gradient-to-br from-emerald-400/20 via-slate-800 to-slate-950">
        {hasImage && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </div>

      <div className="p-6">
        <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
          {article.category}
        </span>

        <h3 className="mt-4 text-xl font-black text-white">{article.title}</h3>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
          <span>{article.readTime}</span>
          <span>Kryptonal</span>
        </div>

        <Link
          href={`/${locale}/blog/${article.slug}`}
          className="mt-5 inline-flex text-sm font-bold text-emerald-300 hover:text-emerald-200"
        >
          {readGuide} →
        </Link>
      </div>
    </article>
  );
}