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
  { id: "bonk", name: "Bonk", symbol: "BONK" },
];

type Holding = {
  id: string;
  amount: number;
  entryPrice: number;
  alertAbove: number;
  alertBelow: number;
};

type PriceCoin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
};

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0";

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

function pct(value: number) {
  if (!Number.isFinite(value)) return "0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export default function PrivacyWatchlist({ t }: { t: any }) {
  const copy = t.tools.privacyWatchlist;

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [coins, setCoins] = useState<PriceCoin[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kryptonal_private_portfolio");

    if (saved) {
      setHoldings(JSON.parse(saved));
    } else {
      setHoldings([
        { id: "bitcoin", amount: 0, entryPrice: 0, alertAbove: 0, alertBelow: 0 },
        { id: "ethereum", amount: 0, entryPrice: 0, alertAbove: 0, alertBelow: 0 },
        { id: "solana", amount: 0, entryPrice: 0, alertAbove: 0, alertBelow: 0 },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kryptonal_private_portfolio", JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    if (!holdings.length) {
      setCoins([]);
      return;
    }

    async function loadPrices() {
      try {
        setLoading(true);

        const ids = holdings.map((h) => h.id).join(",");

        const res = await fetch(`/api/tools/watchlist-prices?ids=${ids}`, {
          cache: "no-store",
        });

        const data = await res.json();
        setCoins(data.coins || []);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
    const timer = setInterval(loadPrices, 60000);

    return () => clearInterval(timer);
  }, [holdings]);

  const rows = useMemo(() => {
    return holdings.map((holding) => {
      const coin = coins.find((c) => c.id === holding.id);
      const price = coin?.price || 0;
      const value = holding.amount * price;
      const cost = holding.amount * holding.entryPrice;
      const profit = cost > 0 ? value - cost : 0;
      const profitPct = cost > 0 ? ((value - cost) / cost) * 100 : 0;

      const alertHit =
        (holding.alertAbove > 0 && price >= holding.alertAbove) ||
        (holding.alertBelow > 0 && price <= holding.alertBelow);

      return {
        ...holding,
        name: coin?.name || holding.id,
        symbol: coin?.symbol || "",
        price,
        value,
        cost,
        profit,
        profitPct,
        alertHit,
      };
    });
  }, [holdings, coins]);

  const totalValue = rows.reduce((sum, row) => sum + row.value, 0);
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const totalProfit = totalValue - totalCost;
  const totalProfitPct = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const activeAlerts = rows.filter((row) => row.alertAbove || row.alertBelow).length;
  const triggeredAlerts = rows.filter((row) => row.alertHit).length;

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    return AVAILABLE_COINS.filter((coin) => {
      const alreadyAdded = holdings.some((h) => h.id === coin.id);
      const matches =
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q);

      return !alreadyAdded && q && matches;
    }).slice(0, 6);
  }, [query, holdings]);

  function addCoin(id: string) {
    setHoldings((prev) => [
      ...prev,
      { id, amount: 0, entryPrice: 0, alertAbove: 0, alertBelow: 0 },
    ]);
    setQuery("");
  }

  function removeCoin(id: string) {
    setHoldings((prev) => prev.filter((coin) => coin.id !== id));
  }

  function updateHolding(id: string, field: keyof Holding, value: number) {
    setHoldings((prev) =>
      prev.map((holding) =>
        holding.id === id ? { ...holding, [field]: value } : holding
      )
    );
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

          <p className="mt-5 leading-8 text-slate-300">{copy.description}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">{copy.portfolioValue}</p>
            <p className="mt-2 text-3xl font-black">{formatUsd(totalValue)}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">{copy.totalProfit}</p>
            <p
              className={`mt-2 text-3xl font-black ${
                totalProfit >= 0 ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {formatUsd(totalProfit)}
            </p>
            <p className="mt-1 text-sm text-slate-400">{pct(totalProfitPct)}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">{copy.assetsTracked}</p>
            <p className="mt-2 text-3xl font-black">{holdings.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">{copy.alerts}</p>
            <p className="mt-2 text-3xl font-black text-amber-300">
              {triggeredAlerts}/{activeAlerts}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl">
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

          {loading ? (
            <div className="mt-6 rounded-2xl border border-white/10 p-8 text-center text-slate-400">
              {copy.loading}
            </div>
          ) : rows.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 p-8 text-center text-slate-400">
              {copy.empty}
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {rows.map((row) => (
                <article
                  key={row.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black">{row.name}</h3>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                          {row.symbol}
                        </span>

                        {row.alertHit && (
                          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-black text-amber-300">
                            {copy.alertHit}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-mono text-emerald-300">
                        {formatUsd(row.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeCoin(row.id)}
                      className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/20 lg:self-start"
                    >
                      {copy.remove}
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label>
                      <span className="text-xs font-bold text-slate-400">
                        {copy.amount}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={row.amount || ""}
                        onChange={(e) =>
                          updateHolding(row.id, "amount", Number(e.target.value))
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-300"
                      />
                    </label>

                    <label>
                      <span className="text-xs font-bold text-slate-400">
                        {copy.entryPrice}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={row.entryPrice || ""}
                        onChange={(e) =>
                          updateHolding(row.id, "entryPrice", Number(e.target.value))
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-300"
                      />
                    </label>

                    <label>
                      <span className="text-xs font-bold text-slate-400">
                        {copy.alertAbove}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={row.alertAbove || ""}
                        onChange={(e) =>
                          updateHolding(row.id, "alertAbove", Number(e.target.value))
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-300"
                      />
                    </label>

                    <label>
                      <span className="text-xs font-bold text-slate-400">
                        {copy.alertBelow}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={row.alertBelow || ""}
                        onChange={(e) =>
                          updateHolding(row.id, "alertBelow", Number(e.target.value))
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-300"
                      />
                    </label>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <p className="text-xs text-slate-400">{copy.value}</p>
                      <p className="mt-1 font-black">{formatUsd(row.value)}</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <p className="text-xs text-slate-400">{copy.profitLoss}</p>
                      <p
                        className={`mt-1 font-black ${
                          row.profit >= 0 ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {formatUsd(row.profit)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <p className="text-xs text-slate-400">{copy.return}</p>
                      <p
                        className={`mt-1 font-black ${
                          row.profitPct >= 0 ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {pct(row.profitPct)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="mt-5 text-sm leading-7 text-amber-200">
            {copy.disclaimer}
          </p>
        </div>
      </section>
    </main>
  );
}