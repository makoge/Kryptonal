// src/app/[locale]/community/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/getDictionary";

export default async function SinglePostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  // 1. Fetch the single post matching the URL slug
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: { name: true, image: true, email: true },
      },
    },
  });

  // If the post doesn't exist in DB, show 404
  if (!post) {
    notFound();
  }

  // Increment view count asynchronously
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const dict = await getDictionary(params.locale);
  const t = dict?.SinglePost;

  // 2. Schema.org JSON-LD for Google SEO Indexing
  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: post.title,
    articleBody: post.content,
    author: {
      "@type": "Person",
      name: post.author.name || post.author.email?.split("@")[0] || "Anonymous",
    },
    datePublished: post.createdAt.toISOString(),
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ViewAction",
      userInteractionCount: post.views + 1,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      {/* Google SEO JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4">
        {/* Back Link */}
        <Link href={`/${params.locale}/community`} className="...">
          {t?.backLink || "← Back to Community Hub"}
        </Link>

        {/* Post Title */}
        <h1 className="text-3xl font-black text-white sm:text-4xl leading-tight">
          {post.title}
        </h1>

        {/* Author & Meta Row */}
        <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">
              {t?.by || "By"}{" "}
              {post.author.name ||
                post.author.email?.split("@")[0] ||
                t?.anonymous ||
                "Kryptonal Trader"}
            </span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              👁️ {post.views + 1} {t?.views || "views"}
            </span>
            <span className="text-emerald-400 font-bold">
              ▲ {post.upvotes} {t?.upvotes || "upvotes"}
            </span>
          </div>
        </div>

        {/* Post Body */}
        <div className="mt-8 text-slate-300 leading-relaxed whitespace-pre-line text-base">
          {post.content}
        </div>
      </article>
    </div>
  );
}
