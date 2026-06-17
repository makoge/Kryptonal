"use client";

import { useState } from "react";

type Item = {
  id: string;
  name: string;
  token?: string | null;
  platform: string;
  chain?: string | null;
  description: string;
  officialUrl: string;
  twitterUrl?: string | null;
  status: string;
};

export default function AirdropAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `/api/tools/airdrop-submissions?adminKey=${encodeURIComponent(adminKey)}`,
        { cache: "no-store" },
      );

      const json = await res.json();

      if (!res.ok) {
        setMessage(json.error || "Failed to load submissions.");
        return;
      }

      setItems(json.submissions || []);

      if (!json.submissions?.length) {
        setMessage("No submissions found yet.");
      }
    } catch {
      setMessage("Something went wrong while loading submissions.");
    } finally {
      setLoading(false);
    }
  }

  async function review(
    id: string,
    status: "approved" | "rejected" | "pending",
  ) {
    setMessage("");

    const res = await fetch("/api/tools/airdrop-submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminKey }),
    });

    const json = await res.json();

    if (!res.ok) {
      setMessage(json.error || "Update failed.");
      return;
    }

    await load();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">Airdrop Review</h1>
        <p className="mt-3 text-slate-400">
          Approve or reject community-submitted airdrops.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            type="password"
            placeholder="Admin key"
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none"
          />

          <button
            onClick={load}
            disabled={loading}
            className="rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load Submissions"}
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-slate-300">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >
              <h2 className="text-2xl font-black">{item.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {item.token || "TBA"} • {item.platform} • {item.chain}
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {item.description}
              </p>

              <p className="mt-3 text-xs text-cyan-200">
                Status: {item.status}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => review(item.id, "approved")}
                  className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
                >
                  Approve
                </button>

                <button
                  onClick={() => review(item.id, "rejected")}
                  className="rounded-xl bg-red-400 px-4 py-2 text-sm font-black text-slate-950"
                >
                  Reject
                </button>

                <button
                  onClick={() => review(item.id, "pending")}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-black text-white"
                >
                  Mark Pending
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
