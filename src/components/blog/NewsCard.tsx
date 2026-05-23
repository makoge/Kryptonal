import Image from "next/image";
import type { NormalizedNews } from "@/lib/news/types";

export default function NewsCard({ item, t }: { item: NormalizedNews; t: any }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur">
      <div className="relative h-48 bg-emerald-500/10">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-500/20 to-slate-900 text-sm text-emerald-200">
            Kryptonal
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950">
          {t.filters?.[item.category] || item.category}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-emerald-300">
          {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
        </p>

        <h3 className="mt-3 line-clamp-2 text-xl font-black text-white">{item.title}</h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{item.excerpt}</p>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-300"
        >
          {t.readMore}
        </a>
      </div>
    </article>
  );
}