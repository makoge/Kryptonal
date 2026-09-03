"use client";

import { useState, useEffect } from "react";

const modes = [
  "all",
  "market",
  "stablecoins",
  "chains",
  "sectors",
  "leverage",
] as const;

type Mode = (typeof modes)[number];

type Section = {
  title: string;
  signal?: "Bullish" | "Bearish" | "Neutral";
  summary: string;
  what: string;
  why: string;
  outcomes: string;
  takeaway: string;
};

type RadarItem = {
  name: string;
  reason: string;
  badge?: string;
};

type Playbook = {
  shortTerm: string;
  longTerm: string;
};

type AnalysisData = {
  mode: Mode;
  marketSignal: "Bullish" | "Bearish" | "Neutral";
  confluenceScore?: number;
  conclusion: string;
  playbook?: Playbook;
  radar?: {
    focusOn: RadarItem[];
    avoidOrDeRisk: RadarItem[];
  };
  sections: Section[];
  updatedAt: string;
};

type Props = {
  t: any;
};

const fallback = {
  badge: "Intelligence Engine",
  title: "Deep Crypto Analysis Engine",
  description:
    "Generate institutional-grade market intelligence covering market cycles, liquidity health, chain dominance, and plain-English takeaways in seconds.",
  focusLabel: "Analysis Focus",
  generate: "Generate Deep Analysis",
  placeholderTitle: "Ready for Deep Analysis",
  placeholder:
    "Choose a focus area and generate a real-time, institutional-grade market brief.",
  copied: "Copied!",
  copyMarkdown: "Copy for Telegram / Discord",
  shareTwitter: "Share on X",
  download: "Download TXT",
  copyFailed: "Copy failed. Please copy manually.",
  disclaimer:
    "Educational content only. Not financial advice. Always verify important financial information independently.",
  modes: {
    all: "Full Market",
    market: "Market",
    stablecoins: "Stablecoins",
    chains: "Chains",
    sectors: "Sectors",
    leverage: "Leverage",
  },
  checklist: [
    "Macro cycle & trend verification",
    "On-chain stablecoin liquidity health",
    "Derivatives heat & leverage risk check",
    "Tactical Short & Long horizon playbooks",
  ],
  tags: ["AI Synthesis", "Tactical Playbook", "Institutional Grade"],
};

const TELEMETRY_STEPS = [
  "Auditing macro trend & Bitcoin dominance...",
  "Evaluating derivatives funding & leverage heat...",
  "Scanning on-chain stablecoin liquidity flows...",
  "Building tactical execution playbook...",
];

function tx(t: any, key: keyof typeof fallback) {
  return t?.analysis?.deepEngine?.[key] || fallback[key];
}

function modeLabel(t: any, mode: Mode) {
  return t?.analysis?.deepEngine?.modes?.[mode] || fallback.modes[mode];
}

function getSignalBadge(signal?: string) {
  if (signal === "Bullish")
    return "bg-emerald-400/15 text-emerald-300 border-emerald-400/30";
  if (signal === "Bearish")
    return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return "bg-amber-400/15 text-amber-300 border-amber-400/30";
}

export default function DeepAnalysisEngine({ t }: Props) {
  const [mode, setMode] = useState<Mode>("all");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [copyState, setCopyState] = useState<"none" | "plain" | "md">("none");
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % TELEMETRY_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const checklist =
    Array.isArray(t?.analysis?.deepEngine?.checklist) &&
    t.analysis.deepEngine.checklist.length
      ? t.analysis.deepEngine.checklist
      : fallback.checklist;

  const tags =
    Array.isArray(t?.analysis?.deepEngine?.tags) &&
    t.analysis.deepEngine.tags.length
      ? t.analysis.deepEngine.tags
      : fallback.tags;

  async function generate() {
    setLoading(true);
    setCopyState("none");
    setLimitReached(false);

    try {
      const res = await fetch("/api/analysis/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      if (res.status === 429) {
        setLimitReached(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Server returned ${res.status}: ${errorText.slice(0, 150)}`,
        );
      }

      const json: AnalysisData = await res.json();
      setData(json);
    } catch (error: any) {
      alert(`DIAGNOSTIC ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function getMarkdownText() {
    if (!data) return "";
    let lines = [
      `⚡ **Kryptonal Market Playbook** \`${modeLabel(t, data.mode).toUpperCase()}\``,
      `*Generated: ${new Date(data.updatedAt).toLocaleDateString()}*`,
      `**Market Signal:** ${data.marketSignal} ${data.confluenceScore ? `(Confluence: ${data.confluenceScore}/100)` : ""}`,
      "",
      `> 💡 **Executive Verdict:** ${data.conclusion}`,
      "",
    ];

    if (data.mode === "all" && data.playbook) {
      lines.push(
        `### 🧭 Tactical Playbook`,
        `• **Short-Term (1-7D):** ${data.playbook.shortTerm}`,
        `• **Long-Term (1-3M):** ${data.playbook.longTerm}`,
        "",
      );
    }

    if (data.mode === "all" && data.radar) {
      if (data.radar.focusOn?.length) {
        lines.push(`### 🟢 Focus & Accumulation Radar`);
        data.radar.focusOn.forEach((item) => {
          lines.push(`• **${item.name}**: ${item.reason}`);
        });
        lines.push("");
      }
      if (data.radar.avoidOrDeRisk?.length) {
        lines.push(`### 🔴 Traps & De-Risking Zones`);
        data.radar.avoidOrDeRisk.forEach((item) => {
          lines.push(`• **${item.name}**: ${item.reason}`);
        });
        lines.push("");
      }
    }

    if (data.sections?.length) {
      lines.push(
        ...data.sections.flatMap((s, idx) => [
          `### ${idx + 1}. ${s.title} ${s.signal ? `(${s.signal})` : ""}`,
          `*${s.summary}*`,
          `• **What:** ${s.what}`,
          `• **Why:** ${s.why}`,
          `🎯 **Takeaway:** \`${s.takeaway}\``,
          "",
        ]),
      );
    }

    lines.push(
      `🔗 *Live Intelligence: [Kryptonal](https://kryptonal.com/analysis)*`,
    );
    return lines.join("\n");
  }

  function getPlainText() {
    return getMarkdownText().replace(/[*`>#•]/g, "");
  }

  async function copyToClipboard(text: string, type: "plain" | "md") {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(type);
      setTimeout(() => setCopyState("none"), 2500);
    } catch {
      alert(tx(t, "copyFailed"));
    }
  }

  function shareOnTwitter() {
    if (!data) return;
    const tweetText = encodeURIComponent(
      `⚡ Kryptonal Macro Playbook (${modeLabel(t, data.mode)})\n\n` +
        `📈 Signal: ${data.marketSignal} ${data.confluenceScore ? `(${data.confluenceScore}/100)` : ""}\n\n` +
        `💡 Verdict:\n"${data.conclusion.slice(0, 140)}..."\n\n` +
        `Read the full strategic playbook 👇\n` +
        `https://kryptonal.com/analysis#analysis-engine`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  }

  function downloadTxt() {
    const text = getPlainText();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kryptonal-${mode}-playbook-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      id="analysis-engine"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-5 md:py-20"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Controls Column */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
              {tx(t, "badge")}
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {tx(t, "title")}
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300">
              {tx(t, "description")}
            </p>

            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {tx(t, "focusLabel")}
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {modes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setMode(item)}
                    className={`rounded-2xl border px-4 py-3.5 text-sm font-bold transition duration-200 ${
                      mode === item
                        ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
                        : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-emerald-400/40 hover:bg-slate-900"
                    }`}
                  >
                    {modeLabel(t, item)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-2.5">
              {checklist.map((item: string) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-400">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.2)] transition duration-300 hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-slate-950"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>{TELEMETRY_STEPS[statusIndex]}</span>
              </>
            ) : (
              <>
                <span>{tx(t, "generate")}</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>

        {/* Dashboard Display Column */}
        <div className="relative flex flex-col justify-between rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-400/[0.04] to-slate-950 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                      index === 1
                        ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                        : index === 2
                          ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                          : "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {data && (
                <span className="text-xs font-semibold text-slate-400">
                  {new Date(data.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            {limitReached ? (
              <div className="mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/5 p-8 text-center shadow-2xl backdrop-blur-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-3xl text-amber-400">
                  ⚡
                </div>
                <h3 className="mt-5 text-2xl font-black text-white">
                  Daily Limit Reached
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                  You have reached the guest limit of 10 analyses per day. Sign
                  in to unlock unrestricted access.
                </p>
                <a
                  href={`/${t?.locale || "en"}/sign-in`}
                  className="mt-6 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                >
                  Sign In to Continue
                </a>
              </div>
            ) : data ? (
              <div className="mt-6 space-y-6">
                {/* Executive Summary & Confluence */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Executive Verdict
                    </div>
                    <div className="flex items-center gap-2">
                      {data.confluenceScore && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                          Confluence: {data.confluenceScore}/100
                        </span>
                      )}
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${getSignalBadge(data.marketSignal)}`}
                      >
                        {data.marketSignal}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-base font-medium leading-7 text-white">
                    {data.conclusion}
                  </p>
                </div>

                <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 no-scrollbar">
                  {/* FULL MARKET VIEW: DUAL-HORIZON & RADAR */}
                  {data.mode === "all" && data.playbook && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300">
                          <span>⚡</span> 1–7D Tactical Stance
                        </div>
                        <p className="mt-2.5 text-sm leading-6 text-slate-200">
                          {data.playbook.shortTerm}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-300">
                          <span>🎯</span> 1–3M Strategic Posture
                        </div>
                        <p className="mt-2.5 text-sm leading-6 text-slate-200">
                          {data.playbook.longTerm}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.mode === "all" && data.radar && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Focus Radar */}
                      <div className="space-y-2.5 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                          🟢 Focus & Inflow Momentum
                        </h4>
                        {data.radar.focusOn?.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-emerald-400/10 bg-slate-950/60 p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-xs leading-5 text-slate-300">
                              {item.reason}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Avoid Radar */}
                      <div className="space-y-2.5 rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-rose-400">
                          🔴 Traps & De-Risking Zones
                        </h4>
                        {data.radar.avoidOrDeRisk?.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-rose-500/10 bg-slate-950/60 p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-xs leading-5 text-slate-300">
                              {item.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PILLAR SPECIFIC DIAGNOSTIC CARDS */}
                  {data.sections?.map((section, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur transition hover:border-white/20"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h4 className="text-lg font-black text-white">
                          {idx + 1}. {section.title}
                        </h4>
                        {section.signal && (
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getSignalBadge(section.signal)}`}
                          >
                            {section.signal}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-3 text-sm leading-6">
                        <p className="text-slate-300">
                          <strong className="text-cyan-300">What: </strong>
                          {section.what}
                        </p>
                        <p className="text-slate-400">
                          <strong className="text-slate-200">Why: </strong>
                          {section.why}
                        </p>
                        <p className="text-slate-300">
                          <strong className="text-amber-300">Outlook: </strong>
                          {section.outcomes}
                        </p>
                      </div>

                      <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 text-xs font-bold text-emerald-300">
                        🎯 <span className="underline">Key Takeaway:</span>{" "}
                        {section.takeaway}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-12 flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-3xl shadow-inner">
                  ⚡
                </div>
                <h3 className="mt-5 text-xl font-black text-white">
                  {tx(t, "placeholderTitle")}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  {tx(t, "placeholder")}
                </p>
              </div>
            )}
          </div>

          {/* Social Share / Copy Tools */}
          <div className="mt-8 pt-5 border-t border-white/10">
            {data ? (
              <div className="grid gap-2.5 sm:grid-cols-3">
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] px-4 py-3 text-xs font-black text-white transition hover:bg-white/[0.15]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {tx(t, "shareTwitter")}
                </button>

                <button
                  onClick={() => copyToClipboard(getMarkdownText(), "md")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/20"
                >
                  {copyState === "md" ? tx(t, "copied") : tx(t, "copyMarkdown")}
                </button>

                <button
                  onClick={downloadTxt}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 transition hover:bg-white/5"
                >
                  {tx(t, "download")}
                </button>
              </div>
            ) : (
              <p className="text-center text-xs leading-relaxed text-slate-500">
                {tx(t, "disclaimer")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
