// src/components/crypto-prices/CryptoPricesClient.tsx
"use client";

import { useMemo, useState } from "react";

type Tab = "coins" | "gainers" | "losers" | "new" | "exchanges";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
};

export default function CryptoPricesClient({ data, t }: { data: any; t: any }) {
  const [tab, setTab] = useState<Tab>("coins");
  const [query, setQuery] = useState("");

  const coins: Coin[] = data?.coins ?? [];

  const filteredCoins = useMemo(() => {
    const q = query.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
    );
  }, [coins, query]);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <p>{t.states.failed}</p>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "coins", label: t.tabs.coins },
    { key: "gainers", label: t.tabs.gainers },
    { key: "losers", label: t.tabs.losers },
    { key: "new", label: t.tabs.new },
    { key: "exchanges", label: t.tabs.exchanges },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_40%)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            {t.badge}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {t.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric label={t.metrics.coinsTracked} value={`${coins.length}+`} />
            <Metric
              label={t.metrics.topGainer}
              value={data.gainers?.[0]?.symbol?.toUpperCase() || "—"}
            />
            <Metric
              label={t.metrics.updated}
              value={new Date(data.updatedAt).toLocaleTimeString()}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  tab === item.key
                    ? "bg-emerald-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "coins" && (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400 lg:max-w-xs"
            />
          )}
        </div>

        {tab === "coins" && <CoinsTable coins={filteredCoins} t={t} />}
        {tab === "gainers" && <CoinsTable coins={data.gainers ?? []} t={t} />}
        {tab === "losers" && <CoinsTable coins={data.losers ?? []} t={t} />}
        {tab === "new" && <Trending coins={data.newCoins ?? []} t={t} />}
        {tab === "exchanges" && (
          <Exchanges exchanges={data.exchanges ?? []} t={t} />
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function CoinsTable({ coins, t }: { coins: Coin[]; t: any }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">{t.table.coin}</th>
              <th className="px-5 py-4">{t.table.price}</th>
              <th className="px-5 py-4">1h</th>
              <th className="px-5 py-4">24h</th>
              <th className="px-5 py-4">7d</th>
              <th className="px-5 py-4">{t.table.marketCap}</th>
              <th className="px-5 py-4">{t.table.volume}</th>
              <th className="px-5 py-4">{t.table.supply}</th>
            </tr>
          </thead>

          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="border-t border-white/10 hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4 text-slate-400">
                  {coin.market_cap_rank}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{coin.name}</p>
                      <p className="text-xs uppercase text-slate-500">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-bold">
                  {formatPrice(coin.current_price)}
                </td>
                <td className="px-5 py-4">
                  {formatPercent(coin.price_change_percentage_1h_in_currency)}
                </td>
                <td className="px-5 py-4">
                  {formatPercent(coin.price_change_percentage_24h)}
                </td>
                <td className="px-5 py-4">
                  {formatPercent(coin.price_change_percentage_7d_in_currency)}
                </td>
                <td className="px-5 py-4">${formatCompact(coin.market_cap)}</td>
                <td className="px-5 py-4">${formatCompact(coin.total_volume)}</td>
                <td className="px-5 py-4">
                  {formatCompact(coin.circulating_supply)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Trending({ coins, t }: { coins: any[]; t: any }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coins.map((item) => {
        const coin = item.item;

        return (
          <div
            key={coin.id}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="flex items-center gap-3">
              <img
                src={coin.thumb}
                alt={coin.name}
                className="h-9 w-9 rounded-full"
              />
              <div>
                <p className="font-bold">{coin.name}</p>
                <p className="text-xs uppercase text-slate-500">
                  {coin.symbol}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              {t.table.marketCapRank}
            </p>
            <p className="text-2xl font-black">
              #{coin.market_cap_rank || "—"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Exchanges({ exchanges, t }: { exchanges: any[]; t: any }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {exchanges.map((ex) => (
        <div
          key={ex.id}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="flex items-center gap-3">
            <img
              src={ex.image}
              alt={ex.name}
              className="h-9 w-9 rounded-full"
            />
            <div>
              <p className="font-bold">{ex.name}</p>
              <p className="text-xs text-slate-500">
                {ex.country || t.global}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <p className="flex justify-between text-slate-400">
              {t.table.trustScore}
              <span className="font-bold text-white">
                {ex.trust_score ?? "—"}/10
              </span>
            </p>

            <p className="flex justify-between text-slate-400">
              {t.table.volumeBtc}
              <span className="font-bold text-white">
                {formatCompact(ex.trade_volume_24h_btc)}
              </span>
            </p>

            <p className="flex justify-between text-slate-400">
              {t.table.year}
              <span className="font-bold text-white">
                {ex.year_established || "—"}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatCompact(n?: number | null) {
  if (!n) return "—";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatPrice(n?: number | null) {
  if (!n) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);
}

function formatPercent(n?: number | null) {
  if (typeof n !== "number") return "—";

  const positive = n >= 0;

  return (
    <span className={positive ? "text-emerald-400" : "text-red-400"}>
      {positive ? "+" : ""}
      {n.toFixed(2)}%
    </span>
  );
}