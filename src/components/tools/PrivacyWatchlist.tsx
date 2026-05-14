"use client";

import { useEffect, useMemo, useState } from "react";

const AVAILABLE_COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "bitcoinCash", name: "Bitcoin Cash", symbol: "BCH" },
  { id: "monero", name: "Monero", symbol: "XMR" },
  { id: "shiba", name: "Shiba Inu", symbol: "SHIB" },
  { id: "pepe", name: "Pepe", symbol: "PEPE" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "floki", name: "FLOKI", symbol: "FLOKI" },
  { id: "kaito", name: "Kaito", symbol: "KAITO" },
{ id: "worldcoin", name: "Worldcoin", symbol: "WLD" },
{ id: "mubarak", name: "Mubarak", symbol: "MUBARAK" },
{ id: "bonk", name: "Bonk", symbol: "BONK" }
];

type PriceCoin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
};

function formatUsd(value: number) {
  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(value);
}

export default function PrivacyWatchlist({ t }: { t: any }) {
  const copy = t.tools.privacyWatchlist;

  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [coins, setCoins] = useState<PriceCoin[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kryptonal_watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    } else {
      setWatchlist(["bitcoin", "ethereum", "solana"]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kryptonal_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (watchlist.length === 0) {
      setCoins([]);
      return;
    }

    async function loadPrices() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/tools/watchlist-prices?ids=${watchlist.join(",")}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        setCoins(data.coins || []);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, [watchlist]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    return AVAILABLE_COINS.filter((coin) => {
      const alreadyAdded = watchlist.includes(coin.id);
      const matches =
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q);

      return !alreadyAdded && q && matches;
    }).slice(0, 6);
  }, [query, watchlist]);

  function addCoin(id: string) {
    setWatchlist((prev) => [...prev, id]);
    setQuery("");
  }

  function removeCoin(id: string) {
    setWatchlist((prev) => prev.filter((coin) => coin !== id));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-amber-300">
            {copy.badge}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-5 leading-8 text-slate-300">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-amber-400/20 bg-slate-950 px-4 py-4 font-mono text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-300"
            />

            {results.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
                {results.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => addCoin(coin.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/5"
                  >
                    <span>
                      <span className="font-bold">{coin.name}</span>
                      <span className="ml-2 font-mono text-sm text-slate-400">
                        {coin.symbol}
                      </span>
                    </span>
                    <span className="text-amber-300">{copy.add}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs uppercase tracking-widest text-slate-400">
              <span>{copy.table.asset}</span>
              <span>{copy.table.price}</span>
              <span>{copy.table.action}</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">
                {copy.loading}
              </div>
            ) : coins.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {copy.empty}
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    className="grid animate-[fadeIn_0.25s_ease-in] grid-cols-[1fr_auto_auto] items-center gap-4 bg-slate-950/70 px-4 py-4 font-mono"
                  >
                    <div>
                      <p className="font-bold text-white">{coin.name}</p>
                      <p className="text-xs text-slate-500">{coin.symbol}</p>
                    </div>

                    <p className="text-right text-emerald-300">
                      {formatUsd(coin.price)}
                    </p>

                    <button
                      onClick={() => removeCoin(coin.id)}
                      className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/20"
                    >
                      {copy.remove}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-5 text-sm leading-7 text-amber-200">
            {copy.disclaimer}
          </p>
        </div>
      </section>
    </main>
  );
}