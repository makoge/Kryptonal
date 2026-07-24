"use client";

import type { LiveStory } from "@/lib/fetchLiveNews";

// 1. Define the dictionary interface for the card
export interface StoryCardDict {
  hot?: string;
  breaking?: string;
  trending?: string;
}

interface StoryCardProps {
  story: LiveStory; // Now it knows what LiveStory is!
  dict?: StoryCardDict;
  locale: string;
  onClick: (story: LiveStory) => void;
}

export default function StoryCard({
  story,
  dict,
  locale,
  onClick,
}: StoryCardProps) {
  // Fallbacks in case translation is missing
  const textHot = dict?.hot || "HOT";
  const textBreaking = dict?.breaking || "BREAKING";
  const textTrending = dict?.trending || "Trending";

  return (
    <article
      onClick={() => onClick(story)}
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all flex flex-col md:flex-row gap-6 overflow-hidden cursor-pointer"
    >
      {/* Glass Green Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-transparent transition-all duration-500" />

      {/* Image Container */}
      <div className="w-full md:w-64 h-48 bg-slate-800/50 rounded-xl overflow-hidden shrink-0 relative">
        {/* Render Image if it exists */}
        {story.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* Fallback if an article genuinely has no image */
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-white/5">
            <span className="text-4xl font-bold">K</span>
          </div>
        )}
        {story.isHot && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg uppercase">
            {textHot}
          </div>
        )}
        {story.isBreaking && (
          <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg uppercase">
            {textBreaking}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center gap-3 mb-2 text-sm text-slate-400">
            <span className="text-emerald-400 font-semibold">
              {story.category}
            </span>
            <span>•</span>
            <span>{story.publishedAt}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
            {story.title}
          </h3>

          <p className="text-slate-400 line-clamp-2">{story.summary}</p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {/* Glass Green Trending Badge */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm">
              {story.trendingScore}
            </div>
            <span className="text-sm font-medium text-slate-300">
              {textTrending}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <button className="hover:text-white transition-colors flex items-center gap-1">
              <span>💬</span> {story.comments}
            </button>
            <button className="hover:text-red-400 transition-colors flex items-center gap-1">
              <span>❤️</span> {story.likes}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
