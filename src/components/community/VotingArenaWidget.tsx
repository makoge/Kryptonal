/// src/components/community/VotingArenaWidget.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { signIn } from "next-auth/react";

type DurationOption = "DAY" | "WEEK" | "MONTH" | "LONG_TERM";

type TopCoin = {
  symbol: string;
  holdCount: number;
  voteCount: number;
};

export interface VotingArenaDict {
  title?: string;
  subtitle?: string;
  oneDay?: string;
  oneWeek?: string;
  oneMonth?: string;
  longTerm?: string;
  rank?: string;
  asset?: string;
  votes?: string;
  action?: string;
  voted?: string;
  loginToVote?: string;
  holders?: string;
  noHoldings?: string;
}

interface VotingArenaWidgetProps {
  session?: any;
  dict?: VotingArenaDict;
}

export default function VotingArenaWidget({
  session,
  dict,
}: VotingArenaWidgetProps) {
  const [activeDuration, setActiveDuration] =
    useState<DurationOption>("LONG_TERM");
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingSymbol, setVotingSymbol] = useState<string | null>(null);

  const DURATIONS: { id: DurationOption; label: string }[] = [
    { id: "DAY", label: dict?.oneDay || "24 Hours" },
    { id: "WEEK", label: dict?.oneWeek || "1 Week" },
    { id: "MONTH", label: dict?.oneMonth || "1 Month" },
    { id: "LONG_TERM", label: dict?.longTerm || "Long Term" },
  ];

  const fetchTopCoins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/community/holdings?duration=${activeDuration}`,
      );
      const data = await res.json();
      if (data.success) {
        setTopCoins(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeDuration]);

  useEffect(() => {
    fetchTopCoins();
  }, [fetchTopCoins]);

  const handleVote = async (symbol: string) => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    setVotingSymbol(symbol);
    try {
      const res = await fetch("/api/community/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, duration: activeDuration }),
      });

      if (res.ok) {
        await fetchTopCoins();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVotingSymbol(null);
    }
  };

  const totalVotes = topCoins.reduce((sum, coin) => sum + coin.voteCount, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆</span> {dict?.title || "Top 10 Community Performer Arena"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {dict?.subtitle ||
              "Vote for the coin you believe will perform best in this timeframe."}
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-1 rounded-xl bg-slate-950 p-1 border border-white/5">
          {DURATIONS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveDuration(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeDuration === tab.id
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Grid */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        ) : topCoins.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            {dict?.noHoldings ||
              "No holdings logged for this timeframe yet. Be the first to add one above!"}
          </div>
        ) : (
          topCoins.map((coin, index) => {
            const percentage =
              totalVotes > 0
                ? Math.round((coin.voteCount / totalVotes) * 100)
                : 0;

            return (
              <div
                key={coin.symbol}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-950/60 p-3 transition hover:border-emerald-400/30"
              >
                {/* Background Progress Bar for Visual Sentiment */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-500 pointer-events-none"
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="font-black text-white">
                        ${coin.symbol}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>
                          {coin.holdCount} {dict?.holders || "Holders"}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">
                          {percentage}% {dict?.votes || "votes"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVote(coin.symbol)}
                    disabled={votingSymbol === coin.symbol}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-400 hover:text-slate-950 disabled:opacity-50"
                  >
                    {votingSymbol === coin.symbol
                      ? "..."
                      : dict?.action || "Vote"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
