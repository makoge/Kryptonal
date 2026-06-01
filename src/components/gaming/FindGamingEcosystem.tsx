// src/components/gaming/FindGamingEcosystem.tsx
"use client";

import { useState } from "react";

const data: any = {
  Casual: ["Ronin", "Pixels", "PIXEL", "Good for simple social gaming."],
  Competitive: ["Immutable", "Parallel", "PRIME", "Best for esports-style games."],
  Strategy: ["Base", "Parallel", "PRIME", "Good for card and tactical games."],
  RPG: ["Immutable", "Illuvium", "ILV", "Best for cinematic RPG ecosystems."],
  Mobile: ["TON", "Telegram Games", "NOT", "Best for mobile-first discovery."],
};

export default function FindGamingEcosystem() {
  const [choice, setChoice] = useState("Casual");
  const result = data[choice];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap gap-3">
        {Object.keys(data).map((x) => (
          <button
            key={x}
            onClick={() => setChoice(x)}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              choice === x
                ? "bg-emerald-400 text-slate-950"
                : "bg-white/5 text-white"
            }`}
          >
            {x} Gamer
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950/70 p-5">
        <p className="text-sm text-slate-400">Recommended ecosystem</p>
        <h3 className="mt-2 text-3xl font-black text-emerald-300">{result[0]}</h3>
        <p className="mt-3 text-slate-300">
          Game: {result[1]} • Token: {result[2]}
        </p>
        <p className="mt-3 text-slate-400">{result[3]}</p>
      </div>
    </div>
  );
}