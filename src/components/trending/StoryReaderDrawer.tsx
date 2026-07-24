"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LiveStory } from "@/lib/fetchLiveNews";

interface StoryReaderDrawerProps {
  story: LiveStory | null;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function StoryReaderDrawer({
  story,
  isOpen,
  onClose,
  locale,
}: StoryReaderDrawerProps) {
  // Prevent scrolling on the main page when the drawer is open
  if (typeof window !== "undefined") {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }

  return (
    <AnimatePresence>
      {isOpen && story && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-Over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0a0a0c]/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 md:p-10 flex flex-col min-h-full">
              {/* Header / Controls */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    Intel Brief
                  </span>
                  <span className="text-slate-400 text-sm">
                    {story.publishedAt}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Story Content */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {story.title}
              </h2>

              {/* Metrics Bar */}
              <div className="flex flex-wrap items-center gap-6 mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {story.trendingScore}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase">
                      Trending
                    </span>
                    <span className="text-sm font-semibold text-white">
                      Score
                    </span>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                <div className="text-slate-400 text-sm flex gap-6">
                  <span>👁️ {story.views.toLocaleString()}</span>
                  <span>❤️ {story.likes.toLocaleString()}</span>
                  <span>💬 {story.comments.toLocaleString()}</span>
                </div>
              </div>

              {/* The Summary / Content */}
              <div className="prose prose-invert prose-emerald max-w-none mb-12">
                <p className="text-lg text-slate-300 leading-relaxed">
                  {story.summary}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 transition-colors"
                >
                  Read Source Article ↗
                </a>
                <button className="flex-1 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-colors">
                  Discuss in Community
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
