// src/app/[locale]/community/page.tsx

import { auth } from "@/auth";
import Link from "next/link";
import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityFeed from "@/components/community/CommunityFeed";
import PortfolioTrackerWidget from "@/components/community/PortfolioTrackerWidget";
import VotingArenaWidget from "@/components/community/VotingArenaWidget";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const dict = await getDictionary(locale);
  const t = dict?.CommunityPage;

  // JSON-LD Structured Data for Google Search Engine Optimization
  const communityJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://kryptonal.com/${locale}/community`,
        url: `https://kryptonal.com/${locale}/community`,
        name: t?.title || "Kryptonal Crypto Community & Sentiment Hub",
        description:
          t?.description ||
          "Crowdsourced crypto holdings, sentiment tracking, and community voting for top performing assets across 1-Day, 1-Week, 1-Month, and Long-Term timeframes.",
        isPartOf: {
          "@type": "WebSite",
          name: "Kryptonal",
          url: "https://kryptonal.com",
        },
      },
      {
        "@type": "DiscussionForumPosting",
        headline: t?.title || "Kryptonal Traders Hub & Sentiment Leaderboard",
        text:
          t?.description ||
          "Log high-conviction holdings across custom time horizons and vote on the top 10 community performers.",
        author: {
          "@type": "Organization",
          name: "Kryptonal Community",
        },
      },
    ],
  };

  return (
    <>
      <Header locale={locale} t={dict} />

      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* 1. Injected Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(communityJsonLd) }}
        />

        {/* Community Header Banner */}
        <section className="relative overflow-hidden border-b border-white/10 bg-slate-900/50 py-12">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
                  {t?.badge || "🔥 Community Sentiment Engine"}
                </div>
                <h1 className="text-3xl font-black text-white sm:text-4xl">
                  {t?.heading || "Kryptonal Traders Hub"}
                </h1>
                <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                  {t?.description ||
                    "Log your high-conviction holdings across 1-Day, 1-Week, 1-Month, or Long-Term timeframes. Vote on the top 10 performers and participate in community alpha calls."}
                </p>
              </div>

              {!session?.user && (
                <div className="flex-shrink-0">
                  <Link
                    href="/api/auth/signin"
                    className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/20 hover:bg-emerald-300 transition"
                  >
                    {t?.signInBtn || "Sign In to Join & Vote"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Interactive Grid */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Community Holdings & Voting Arena (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Widget 1: User Bag Selector (Add Holdings) */}
              <PortfolioTrackerWidget
                session={session}
                dict={dict?.PortfolioTracker}
              />

              {/* Widget 2: The Top 10 Voting Arena */}
              <VotingArenaWidget session={session} dict={dict?.VotingArena} />
            </div>

            {/* Right Column: Post Creator Modal & Community Discussion Feed (5 Cols) */}
            <div className="lg:col-span-5">
              <CommunityFeed session={session} locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} t={dict} />
    </>
  );
}
