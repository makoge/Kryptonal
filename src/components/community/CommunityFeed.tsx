// src/components/community/CommunityFeed.tsx

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCreatorModal from "./PostCreatorModal";

interface CommunityFeedProps {
  session: any;
  locale: string;
  dict?: any;
}

export default async function CommunityFeed({
  session,
  locale,
  dict,
}: CommunityFeedProps) {
  const tFeed = dict?.CommunityFeed;
  const tSingle = dict?.SinglePost;

  // Fetch top posts sorted by creation date
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      author: {
        select: { name: true, image: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* 1. Modal Trigger to create new posts */}
      <div className="relative z-20 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
        <h3 className="text-base font-bold text-white mb-2">
          {tFeed?.shareTitle || "Share Market Insights"}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {tFeed?.shareSubtitle ||
            "Got an alpha call or technical analysis? Post it here to rank on Kryptonal & search engines."}
        </p>
        <PostCreatorModal session={session} dict={dict?.PostModal} />
      </div>

      {/* 2. Posts Discussion Feed */}
      <div className="relative z-10 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💬</span> {tFeed?.feedTitle || "Recent Alpha & Analysis"}
        </h2>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              {tFeed?.noPosts ||
                "No posts created yet. Be the first trader to publish an alpha call above!"}
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="group rounded-xl border border-white/5 bg-slate-950/80 p-4 transition hover:border-emerald-400/30 hover:bg-slate-950"
              >
                <Link href={`/${locale}/community/${post.slug}`}>
                  <h3 className="text-base font-bold text-white transition group-hover:text-emerald-400">
                    {post.title}
                  </h3>
                </Link>

                <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                  {post.content}
                </p>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">
                      {post.author.name ||
                        post.author.email?.split("@")[0] ||
                        tSingle?.anonymous ||
                        "Kryptonal Trader"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString(locale)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-medium">
                    <span className="flex items-center gap-1 text-slate-400">
                      👁️ {post.views} {tSingle?.views || "views"}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      ▲ {post.upvotes} {tSingle?.upvotes || "upvotes"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
