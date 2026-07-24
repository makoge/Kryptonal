"use client";

interface HeroProps {
  dict?: {
    headline: string;
    subtitle: string;
    exploreCta: string;
    joinCta: string;
  };
}

const TRENDS = [
  "🔥 Bitcoin ETF",
  "🔥 Ethereum",
  "🔥 Nvidia",
  "🔥 Federal Reserve",
  "🔥 Solana",
  "🔥 XRP",
  "🔥 AI Tokens",
  "🔥 S&P 500",
];

export default function HeroSection({ dict }: HeroProps) {
  const headline = dict?.headline || "Discover What the World is Talking About";
  const subtitle =
    dict?.subtitle ||
    "Follow live trending cryptocurrency, blockchain, and global finance stories.";
  const exploreCta = dict?.exploreCta || "Explore Trends";
  const joinCta = dict?.joinCta || "Join Discussion";

  return (
    <section className="relative w-full overflow-hidden border-b border-white/5 py-20">
      {/* GLASS GREEN BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-teal-900/10 z-0" />

      {/* Green Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-400 mb-6">
          {headline}
        </h1>
        <p className="text-lg md:text-xl text-emerald-100/60 max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>

        <div className="flex items-center justify-center gap-4">
          {/* Glass Green Button */}
          <button className="px-8 py-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 text-white font-semibold backdrop-blur-md border border-emerald-400/50 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            {exploreCta}
          </button>
          <button className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold backdrop-blur-sm transition-all">
            {joinCta}
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 w-full border-t border-white/5 bg-black/40 backdrop-blur-md py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...TRENDS, ...TRENDS, ...TRENDS].map((trend, i) => (
            <span
              key={i}
              className="mx-6 text-sm font-medium text-emerald-200/80"
            >
              {trend}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
