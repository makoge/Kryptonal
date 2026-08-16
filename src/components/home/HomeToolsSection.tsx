import { PrismaClient } from "@prisma/client";
import { KRYPTONAL_TOOLS } from "@/lib/tools/tools";
import HomeToolsCarousel from "./HomeToolsCarousel";
import Link from "next/link"; // <-- 1. Import Link

const prisma = new PrismaClient();

// Helper to safely get translation strings for dynamic tools
function getNested(obj: any, path: string) {
  return path?.split(".").reduce((acc: any, key: string) => acc?.[key], obj);
}

export default async function HomeToolsSection({
  locale,
  t,
}: {
  locale: string;
  t: any;
}) {
  const section = t.home.toolsSection;

  // 1. Fetch live usage counts from Prisma
  const usageRecords = await prisma.tool_usage.findMany();
  const dbUsage = usageRecords.reduce(
    (acc, record) => {
      acc[record.slug] = record.views;
      return acc;
    },
    {} as Record<string, number>,
  );

  // 2. Merge counts, sort by highest visits, and grab top 6
  const topTools = KRYPTONAL_TOOLS.map((tool) => ({
    ...tool,
    totalUsage: tool.usageCount + (dbUsage[tool.slug] || 0),
    // Point directly to where the strings live in your JSON file!
    name: getNested(t.tools?.directory?.tools, tool.nameKey),
    description: getNested(t.tools?.directory?.tools, tool.descriptionKey),
  }))
    .sort((a, b) => b.totalUsage - a.totalUsage)
    .slice(0, 6);

  return (
    <section className="relative border-y border-white/10 bg-slate-950 px-4 py-24 sm:px-6">
      {/* Premium subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              {section.badge}
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {section.title}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              {section.description}
            </p>
          </div>

          {/* 2. Added the View All Tools Button */}
          <div className="shrink-0">
            <Link
              href={`/${locale}/tools`}
              className="group inline-flex items-center gap-3 rounded-2xl bg-emerald-400/5 px-6 py-4 text-sm font-black text-emerald-400 ring-1 ring-inset ring-emerald-400/20 transition duration-300 hover:bg-emerald-400 hover:text-slate-950"
            >
              {section.viewAll || "View All Tools"}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1"
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
            </Link>
          </div>
        </div>

        {/* Client-side carousel wrapper */}
        <HomeToolsCarousel
          locale={locale}
          tools={topTools}
          disclaimer={section.disclaimer}
          visitText={t.tools?.directory?.cta?.live || "Visit Tool"}
        />
      </div>
    </section>
  );
}
