"use client";

import { useEffect, useMemo, useState } from "react";

type Airdrop = {
  id: string;
  name: string;
  token?: string;
  platform: string;
  chain: string;
  description: string;
  tvl?: number;
  url?: string;
  officialUrl?: string;
  status: string;
  source?: string;
  riskLevel?: string;
};

const copy: any = {
  en: {
    badge: "Community + DefiLlama",
    title: "Kryptonal Airdrop Radar",
    subtitle:
      "Discover potential tokenless protocols and community-submitted airdrops. Research carefully before connecting any wallet.",
    warning:
      "Airdrops are speculative and may be risky. Kryptonal does not guarantee rewards, safety, or eligibility. Always verify official links and never share your seed phrase.",
    live: "Potential Airdrops",
    community: "Community Listings",
    submit: "Register Airdrop",
    search: "Search airdrops...",
    name: "Airdrop name",
    token: "Token",
    platform: "Platform",
    chain: "Chain",
    description: "Description",
    officialUrl: "Official URL",
    twitterUrl: "X / Twitter URL",
    submitBtn: "Submit for Review",
    empty: "No airdrops found.",
    submitted: "Submitted for review.",
    research: "Research",
  },
};

function money(value?: number) {
  if (!value) return "N/A";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export default function AirdropRadar({ locale = "en" }: { locale?: string }) {
  const t = copy[locale] || copy.en;

  const [tab, setTab] = useState<"live" | "community" | "submit">("live");
  const [live, setLive] = useState<Airdrop[]>([]);
  const [community, setCommunity] = useState<Airdrop[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    token: "",
    platform: "",
    chain: "",
    description: "",
    officialUrl: "",
    twitterUrl: "",
  });

  useEffect(() => {
    async function load() {
      const [liveRes, communityRes] = await Promise.all([
        fetch("/api/tools/airdrops", { cache: "no-store" }),
        fetch("/api/tools/airdrop-submissions", { cache: "no-store" }),
      ]);

      const liveJson = await liveRes.json();
      const communityJson = await communityRes.json();

      setLive(liveJson.airdrops || []);
      setCommunity(communityJson.submissions || []);
    }

    load();
  }, []);

  const activeItems = useMemo(() => {
    const base = tab === "community" ? community : live;

    return base.filter((item) => {
      const text =
        `${item.name} ${item.platform} ${item.chain} ${item.description}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [tab, live, community, query]);

  async function submitAirdrop(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/tools/airdrop-submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage(t.submitted);
      setForm({
        name: "",
        token: "",
        platform: "",
        chain: "",
        description: "",
        officialUrl: "",
        twitterUrl: "",
      });
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%)] p-6 sm:p-10">
          <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
            {t.badge}
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            {t.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
            ⚠️ {t.warning}
          </div>
        </div>

        <div className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-3">
          {[
            ["live", t.live],
            ["community", t.community],
            ["submit", t.submit],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as "live" | "community" | "submit")}
              className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                tab === key
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {(tab === "live" || tab === "community") && (
          <div className="p-4 sm:p-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="mb-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-emerald-300/30 hover:bg-white/[0.06]"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.chain} • {item.platform}
                      </p>
                    </div>

                    <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                      {item.token || item.status}
                    </span>
                  </div>

                  <p className="min-h-[84px] text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-white/[0.06] px-3 py-2 text-slate-300">
                      TVL: {money(item.tvl)}
                    </span>

                    <span className="rounded-full bg-white/[0.06] px-3 py-2 text-slate-300">
                      Risk: {item.riskLevel || "research"}
                    </span>

                    <span className="rounded-full bg-white/[0.06] px-3 py-2 text-slate-300">
                      {item.source || t.community}
                    </span>
                  </div>

                  {(item.url || item.officialUrl) && (
                    <a
                      href={item.url || item.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex w-full justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                    >
                      {t.research}
                    </a>
                  )}
                </article>
              ))}
            </div>

            {activeItems.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-slate-400">
                {t.empty}
              </p>
            )}
          </div>
        )}

        {tab === "submit" && (
          <form
            onSubmit={submitAirdrop}
            className="grid gap-4 p-4 sm:p-6 md:grid-cols-2"
          >
            {message && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-200 md:col-span-2">
                {message}
              </div>
            )}

            {[
              ["name", t.name],
              ["token", t.token],
              ["platform", t.platform],
              ["chain", t.chain],
              ["officialUrl", t.officialUrl],
              ["twitterUrl", t.twitterUrl],
            ].map(([key, label]) => (
              <input
                key={key}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
                placeholder={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
              />
            ))}

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder={t.description}
              className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50 md:col-span-2"
            />

            <button className="rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 hover:bg-emerald-300 md:col-span-2">
              {t.submitBtn}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
