import Link from "next/link";

const accentStyles: Record<string, string> = {
  emerald: "from-emerald-400/20 border-emerald-400/25 text-emerald-300",
  cyan: "from-cyan-400/20 border-cyan-400/25 text-cyan-300",
  amber: "from-amber-400/20 border-amber-400/25 text-amber-300",
};

export default function HomeToolsSection({
  locale,
  t,
}: {
  locale: string;
  t: any;
}) {
  const section = t.home.toolsSection;

  return (
    <section className="relative border-y border-white/10 bg-slate-950 px-4 py-16 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            {section.badge}
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
            {section.title}
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            {section.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {section.tools.map((tool: any) => (
            <Link
              key={tool.title}
              href={`/${locale}${tool.href}`}
              className={`group rounded-[2rem] border bg-gradient-to-br ${
                accentStyles[tool.accent]
              } to-white/[0.03] p-5 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]`}
            >
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-current/25 bg-current/10 px-3 py-1 text-xs font-black uppercase tracking-widest">
                    {tool.badge}
                  </span>

                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-current" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-white">
                  {tool.title}
                </h3>

                <p className="mt-4 min-h-[108px] leading-7 text-slate-300">
                  {tool.text}
                </p>

                <div className="mt-6 grid gap-2">
                  {tool.stats.map((stat: string) => (
                    <div
                      key={stat}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {stat}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="font-black text-white">{tool.cta}</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-sm text-white transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">
          {section.disclaimer}
        </div>
      </div>
    </section>
  );
}