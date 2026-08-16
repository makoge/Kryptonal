"use client";

import { useRef } from "react";
import Link from "next/link";

type Props = {
  locale: string;
  tools: any[];
  disclaimer: string;
  visitText: string;
};

export default function HomeToolsCarousel({
  locale,
  tools,
  disclaimer,
  visitText,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Scroll by ~80% of the container width for a smooth reveal
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mt-16">
      {/* Desktop Navigation Arrows */}
      <div className="absolute -top-24 right-0 hidden gap-3 md:flex">
        <button
          onClick={() => scroll("left")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 hover:border-white/20"
          aria-label="Previous tools"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition hover:bg-emerald-500/20 hover:border-emerald-500/50"
          aria-label="Next tools"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-10"
      >
        {tools.map((tool, index) => {
          const href = tool.href.startsWith("/")
            ? `/${locale}${tool.href}`
            : tool.href;

          return (
            <Link
              key={tool.slug}
              href={href}
              className="group relative flex min-w-[85vw] snap-center flex-col justify-between rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-emerald-500/30 hover:bg-white/[0.04] sm:min-w-[400px] md:min-w-[450px]"
            >
              {/* Premium Hover Glow Effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 opacity-0 transition duration-500 group-hover:from-emerald-500/5 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-3xl shadow-inner">
                    {tool.icon}
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                      Top {index + 1}
                    </span>
                    <span className="mt-2 text-xs font-medium text-slate-500">
                      {tool.totalUsage.toLocaleString()} visits
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white">{tool.name}</h3>

                <p className="mt-4 line-clamp-3 min-h-[84px] text-base leading-7 text-slate-400">
                  {tool.description}
                </p>
              </div>

              <div className="relative z-10 mt-10 flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-sm font-black uppercase tracking-wider text-white transition group-hover:text-emerald-400">
                  {visitText}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition duration-300 group-hover:translate-x-2 group-hover:bg-emerald-500 group-hover:text-slate-950">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5 text-sm leading-relaxed text-amber-200/80 backdrop-blur-sm">
        {disclaimer}
      </div>
    </div>
  );
}
