"use client";

import { useState } from "react";

interface UpvoteButtonProps {
  postId: string;
  initialUpvotes: number;
  label: string;
}

export default function UpvoteButton({
  postId,
  initialUpvotes,
  label,
}: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (hasVoted || loading) return;

    // Optimistic UI update
    setUpvotes((prev) => prev + 1);
    setHasVoted(true);
    setLoading(true);

    try {
      const res = await fetch("/api/posts/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        // Rollback on failure
        setUpvotes((prev) => prev - 1);
        setHasVoted(false);
      }
    } catch {
      setUpvotes((prev) => prev - 1);
      setHasVoted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={hasVoted || loading}
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition ${
        hasVoted
          ? "bg-emerald-500/20 text-emerald-300 cursor-not-allowed"
          : "text-emerald-400 hover:bg-emerald-500/10 hover:scale-105 active:scale-95"
      }`}
    >
      ▲ {upvotes} {label}
    </button>
  );
}
