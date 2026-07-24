"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StoryCard, { StoryCardDict } from "@/components/trending/StoryCard";
import type { LiveStory } from "@/lib/fetchLiveNews";
import StoryReaderDrawer from "@/components/trending/StoryReaderDrawer";

// 1. Strict TypeScript interfaces
export interface FilterDict {
  trending?: string;
  newest?: string;
  marketImpact?: string;
}

export interface CommunityFeedDict {
  title?: string;
  description?: string;
  signInBtn?: string;
}

export interface TabsDict {
  storiesTab?: string;
  communityTab?: string;
  filters?: FilterDict;
  communityFeed?: CommunityFeedDict;
  card?: StoryCardDict;
}

interface TrendingTabsProps {
  dict?: TabsDict;
  initialStories?: LiveStory[];
  locale?: string;
}

export default function TrendingTabs({
  dict,
  initialStories = [],
  locale = "en",
}: TrendingTabsProps) {
  const [activeTab, setActiveTab] = useState<"stories" | "community">(
    "stories",
  );
  const [selectedStory, setSelectedStory] = useState<LiveStory | null>(null);

  const tabTextStories = dict?.storiesTab || "Trending Stories";
  const tabTextCommunity = dict?.communityTab || "Community";

  return (
    <div className="w-full space-y-6">
      {/* Glass Green Tab Navigation */}
      <div className="flex space-x-2 bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab("stories")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === "stories"
              ? "bg-emerald-500/80 backdrop-blur-md border border-emerald-400/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {tabTextStories}
        </button>
        <button
          onClick={() => setActiveTab("community")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === "community"
              ? "bg-emerald-500/80 backdrop-blur-md border border-emerald-400/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {tabTextCommunity}
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === "stories" ? (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StoryFeed
                stories={initialStories}
                dict={dict?.filters}
                cardDict={dict?.card}
                locale={locale}
                onStoryClick={(story: LiveStory) => setSelectedStory(story)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CommunityFeed dict={dict?.communityFeed} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <StoryReaderDrawer
        story={selectedStory}
        isOpen={selectedStory !== null}
        onClose={() => setSelectedStory(null)}
        locale={locale}
      />
    </div>
  );
}

// 2. Real Story Feed mapping real stories
function StoryFeed({
  stories,
  dict,
  cardDict,
  locale,
  onStoryClick,
}: {
  stories: LiveStory[];
  dict?: FilterDict;
  cardDict?: StoryCardDict;
  locale: string;
  onStoryClick: (story: LiveStory) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Filtering Toolbar */}
      <div className="flex gap-4 mb-6 text-sm">
        <select className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 outline-none focus:border-emerald-500 transition-colors">
          <option value="trending">{dict?.trending || "Trending"}</option>
          <option value="newest">{dict?.newest || "Newest"}</option>
          <option value="marketImpact">
            {dict?.marketImpact || "Market Impact"}
          </option>
        </select>
      </div>

      {/* Render Real Stories or Empty State */}
      {stories.length > 0 ? (
        <div className="space-y-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              dict={cardDict}
              locale={locale}
              onClick={onStoryClick}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
          <p className="text-slate-400">No live stories available right now.</p>
        </div>
      )}
    </div>
  );
}

// 3. Community Feed
function CommunityFeed({ dict }: { dict?: CommunityFeedDict }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
      <h3 className="text-2xl font-bold mb-2 text-white">
        {dict?.title || "Join the Discussion"}
      </h3>
      <p className="text-slate-400 mb-6 max-w-md">
        {dict?.description ||
          "Connect your account to share charts, post analysis, and vote on community predictions."}
      </p>
      <button className="px-6 py-2 bg-emerald-500/80 hover:bg-emerald-400 text-white font-semibold rounded-lg border border-emerald-400/50 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        {dict?.signInBtn || "Sign In with NextAuth"}
      </button>
    </div>
  );
}
