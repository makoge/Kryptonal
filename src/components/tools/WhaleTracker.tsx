"use client";

import { useState, useEffect } from "react";

// 1. Define the exact shape of our Moralis data
export interface WhaleMovement {
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  asset?: string;
  timestamp: string;
}

// 2. Fallback text if translations aren't passed
const fallback = {
  badge: "Live Feed",
  title: "Crypto Whale Tracker",
  descriptionLong:
    "Monitoring massive on-chain movements in real-time. Tracking high-value transfers across the Ethereum network.",
};

export default function WhaleTracker({ t }: { t?: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.whaleTracker || {}),
  };

  const [results, setResults] = useState<WhaleMovement[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchLiveAlerts() {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/whale-tracker");
      const json = await res.json();
      setResults(json.result || []);

      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch whale movements", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLiveAlerts();
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)]">
        {/* Header Section */}
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_35%)] p-6 sm:p-10">
          <div className="mb-5 inline-flex rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-fuchsia-200">
            {copy.badge}
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {copy.descriptionLong}
          </p>
        </div>

        {/* Interface Section */}
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-emerald-400">
                Live Moralis Feed Active
              </span>
            </div>

            <button
              onClick={fetchLiveAlerts}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {loading
                ? "Syncing..."
                : `Refresh Feed (Last: ${lastUpdated || "Never"})`}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 min-h-[400px]">
            {/* Display Logic */}
            {!results ? (
              <div className="flex h-full min-h-[300px] items-center justify-center text-slate-400">
                Initializing tracker...
              </div>
            ) : results.length === 0 ? (
              <div className="flex h-full min-h-[300px] items-center justify-center text-slate-400">
                No recent whale movements detected.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((movement) => (
                  <div
                    key={movement.hash}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-cyan-400">
                          {movement.value}
                        </span>
                        <span className="text-sm font-bold text-slate-300">
                          {movement.asset || movement.tokenSymbol}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Tx:{" "}
                        <a
                          href={`https://etherscan.io/tx/${movement.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-cyan-400 underline"
                        >
                          {movement.hash.slice(0, 8)}...
                          {movement.hash.slice(-6)}
                        </a>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 text-sm font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500">From:</span>{" "}
                        {movement.from.slice(0, 6)}...{movement.from.slice(-4)}
                      </div>
                      <div>
                        <span className="text-slate-500">To:</span>{" "}
                        {movement.to.slice(0, 6)}...{movement.to.slice(-4)}
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      {new Date(movement.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
