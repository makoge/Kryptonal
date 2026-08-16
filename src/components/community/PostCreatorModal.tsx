// src/components/community/PostCreatorModal.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export type PostModalDict = {
  triggerBtn?: string;
  modalTitle?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  contentLabel?: string;
  contentPlaceholder?: string;
  cancelBtn?: string;
  publishBtn?: string;
  publishing?: string;
  errorMessage?: string;
};

export default function PostCreatorModal({
  session,
  dict,
  onPostCreated,
}: {
  session: any;
  dict?: PostModalDict;
  onPostCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      signIn("google");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError(
        dict?.errorMessage || "Please provide both a title and post content.",
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to create post.");
      }

      setTitle("");
      setContent("");
      setIsOpen(false);
      if (onPostCreated) onPostCreated();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => (session?.user ? setIsOpen(true) : signIn("google"))}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 p-3.5 text-center text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:brightness-110"
      >
        {dict?.triggerBtn || "✍️ Post Alpha / Technical Analysis"}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {dict?.modalTitle || "Create Alpha Post"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative z-30 mt-4 space-y-4"
            >
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {dict?.titleLabel || "Post Title "}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    dict?.titlePlaceholder ||
                    "e.g. Why Solana ($SOL) Is Setting Up for a Breakout This Quarter"
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {dict?.contentLabel || "Content / Analysis"}
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    dict?.contentPlaceholder ||
                    "Share your technical analysis, price target, catalyst events, or on-chain insights..."
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  {dict?.cancelBtn || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
                >
                  {submitting
                    ? dict?.publishing || "Publishing..."
                    : dict?.publishBtn || "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
