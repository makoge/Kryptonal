// src/components/crypto-prices/GateTradeButton.tsx
import React from "react";

interface Props {
  symbol: string;
  gatePair: string | null;
  coinName: string;
}

export default function GateTradeButton({ symbol, gatePair, coinName }: Props) {
  const refId = process.env.NEXT_PUBLIC_GATEIO_REF_ID || "";

  // If the coin is verified on Gate.io, direct straight to the order book
  // Otherwise, route to the general registration/market portal with tracking
  const targetUrl = gatePair
    ? `https://www.gate.io/trade/${gatePair}?ref=${refId}`
    : `https://www.gate.io/signup?ref=${refId}`;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-bold text-emerald-300 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-400 hover:text-slate-950 shadow-lg shadow-emerald-950/20"
    >
      <span className="flex h-2 w-2 rounded-full bg-emerald-400 group-hover:bg-slate-950" />
      <span>
        {gatePair
          ? `Trade ${symbol.toUpperCase()} on Gate.io`
          : `Buy ${coinName} on Gate.io`}
      </span>
      <span className="text-xs transition-transform group-hover:translate-x-0.5">
        ↗
      </span>
    </a>
  );
}
