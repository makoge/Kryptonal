"use client";

import { useState } from "react";
import Link from "next/link";
import type { KryptonalTool } from "@/lib/tools/tools";

type Props = {
  tool: KryptonalTool;
  locale: string;
  name: string;
  description: string;
  benefit: string;
  statusLabel: string;
  ctaLabel: string;
  usesLabel: string;
};

export default function ToolCard({
  tool,
  locale,
  name,
  description,
  benefit,
  statusLabel,
  ctaLabel,
  usesLabel,
}: Props) {
  const [usageCount, setUsageCount] = useState(tool.usageCount);
  const isComingSoon = tool.status === "coming-soon";

  const href = tool.href.startsWith("/")
    ? `/${locale}${tool.href}`
    : tool.href;

  async function registerClick() {
    if (isComingSoon) return;

    try {
      const res = await fetch("/api/tools/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: tool.slug }),
      });

      const data = await res.json();

      if (data?.ok && typeof data.usageCount === "number") {
        setUsageCount(data.usageCount);
      }
    } catch {
      // Silent fail. Navigation should still work.
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.07] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.16),transparent_35%)] opacity-80" />

      <div className="relative z-10">
        <div
          className={`absolute right-0 top-0 rounded-full px-3 py-1 text-xs font-black ${
            isComingSoon
              ? "bg-white/10 text-slate-400"
              : "bg-emerald-400/15 text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.18)]"
          }`}
        >
          {usageCount.toLocaleString()} {usesLabel}
        </div>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-3xl">
          {tool.icon}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
            {tool.category}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
            {statusLabel}
          </span>
        </div>

        <h3 className="text-xl font-black tracking-tight text-white">
          {name}
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-300">
          {description}
        </p>

        <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm font-semibold leading-6 text-emerald-200">
          {benefit}
        </p>

        {isComingSoon ? (
          <button
            disabled
            className="mt-6 w-full rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-slate-400"
          >
            {ctaLabel}
          </button>
        ) : (
          <Link
            href={href}
            onClick={registerClick}
            className="mt-6 block w-full rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </article>
  );
}