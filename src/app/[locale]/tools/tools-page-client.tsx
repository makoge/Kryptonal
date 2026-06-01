"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/tools/ToolCard";
import ToolFilters from "@/components/tools/ToolFilters";
import {
  KRYPTONAL_TOOLS,
  TOOL_CATEGORIES,
  type ToolCategory,
} from "@/lib/tools/tools";

type Props = {
  locale: string;
  t: any;
};

function getNested(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export default function ToolsPageClient({ locale, t }: Props) {
  const [active, setActive] = useState<ToolCategory>("all");

  const tools = useMemo(() => {
    if (active === "all") return KRYPTONAL_TOOLS;
    return KRYPTONAL_TOOLS.filter((tool) => tool.category === active);
  }, [active]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(52,211,153,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {t.badges.map((badge: string) => (
                <span
                  key={badge}
                  className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-300"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {t.heroText}
            </p>

            <a
              href="#tools-grid"
              className="mt-8 inline-flex rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-black text-slate-950 shadow-[0_0_35px_rgba(52,211,153,0.28)] transition hover:bg-emerald-300"
            >
              {t.explore}
            </a>
          </div>

          <div className="mt-12">
            <ToolFilters
              categories={TOOL_CATEGORIES}
              active={active}
              labels={t.categories}
              onChange={setActive}
            />
          </div>

          <div
            id="tools-grid"
            className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                locale={locale}
                name={getNested(t.tools, tool.nameKey)}
                description={getNested(t.tools, tool.descriptionKey)}
                benefit={getNested(t.tools, tool.benefitKey)}
                statusLabel={t.status[tool.status]}
                ctaLabel={t.cta[tool.status]}
                usesLabel={t.uses}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-10">
          <h2 className="text-3xl font-black tracking-tight">
            {t.whyTitle}
          </h2>
          <p className="mt-4 max-w-4xl text-slate-300 leading-8">
            {t.whyText}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {t.seo.map((item: any) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
            >
              <h2 className="text-2xl font-black">{item.title}</h2>
              <p className="mt-3 leading-8 text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black">{t.faqTitle}</h2>

          <div className="mt-6 space-y-4">
            {t.faqs.map((item: any) => (
              <details
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <summary className="cursor-pointer font-black text-white">
                  {item.q}
                </summary>
                <p className="mt-3 leading-7 text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-emerald-300/20 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.16),rgba(15,23,42,0.7))] p-8 text-center shadow-[0_0_60px_rgba(52,211,153,0.12)] sm:p-12">
          <h2 className="text-3xl font-black sm:text-5xl">
            {t.finalTitle}
          </h2>

          <a
            href={`/${locale}/market-cap`}
            className="mt-8 inline-flex rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
          >
            {t.finalCta}
          </a>
        </div>
      </section>
    </main>
  );
}