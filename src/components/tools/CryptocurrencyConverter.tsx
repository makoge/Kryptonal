"use client";

import { useEffect, useMemo, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
};

type ConverterData = {
  updatedAt: string;
  coins: Coin[];
};

const fallback = {
  badge: "Live Crypto Tool",
  title: "Cryptocurrency Converter",
  descriptionLong:
    "Convert crypto prices between Bitcoin, Ethereum, stablecoins, altcoins, and fiat currencies using live market data.",
  amount: "Amount",
  from: "From",
  to: "To",
  result: "Result",
  loading: "Loading prices...",
  error: "Unable to load live prices. Showing fallback data.",
  updated: "Updated",
  faqTitle: "Cryptocurrency Converter FAQ",
  faq1Q: "What is a cryptocurrency converter?",
  faq1A:
    "A cryptocurrency converter calculates the value of one crypto asset in another crypto asset or fiat currency using market prices.",
  faq2Q: "How does a crypto converter work?",
  faq2A:
    "A crypto converter compares live market prices. For example, BTC to ETH is calculated by dividing the Bitcoin price by the Ethereum price.",
  faq3Q: "Can I convert Bitcoin to USD?",
  faq3A:
    "Yes. You can convert Bitcoin, Ethereum, stablecoins, and selected altcoins to USD or other supported assets.",
  faq4Q: "Is this financial advice?",
  faq4A:
    "No. This tool is for educational purposes only and should not be treated as financial advice.",
};

const fiatCoins: Coin[] = [
  { id: "usd", symbol: "USD", name: "US Dollar", priceUsd: 1 },
  { id: "eur", symbol: "EUR", name: "Euro", priceUsd: 1.08 },
  { id: "gbp", symbol: "GBP", name: "British Pound", priceUsd: 1.27 },
  { id: "try", symbol: "TRY", name: "Turkish Lira", priceUsd: 0.031 },
  { id: "brl", symbol: "BRL", name: "Brazilian Real", priceUsd: 0.2 },
];

export default function CryptocurrencyConverter({ t }: { t: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.cryptocurrencyConverter || {}),
  };

  const [data, setData] = useState<ConverterData | null>(null);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("bitcoin");
  const [to, setTo] = useState("usd");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrices() {
      try {
        setLoading(true);

        const res = await fetch("/api/tools/cryptocurrency-converter", {
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error("Failed");
        }

        setData(json);
      } catch {
        setError(copy.error);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, [copy.error]);

  const assets = useMemo(() => {
    return [...(data?.coins || []), ...fiatCoins];
  }, [data]);

  const fromAsset = assets.find((asset) => asset.id === from);
  const toAsset = assets.find((asset) => asset.id === to);

  const convertedValue = useMemo(() => {
    const numericAmount = Number(amount);

    if (!numericAmount || !fromAsset?.priceUsd || !toAsset?.priceUsd) {
      return 0;
    }

    return (numericAmount * fromAsset.priceUsd) / toAsset.priceUsd;
  }, [amount, fromAsset, toAsset]);

  const faqs = [
    [copy.faq1Q, copy.faq1A],
    [copy.faq2Q, copy.faq2A],
    [copy.faq3Q, copy.faq3A],
    [copy.faq4Q, copy.faq4A],
  ];

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur md:p-10">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            {copy.badge}
          </p>

          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {copy.descriptionLong}
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            {loading && (
              <p className="mb-4 text-sm text-slate-400">{copy.loading}</p>
            )}

            {error && (
              <p className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {error}
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.amount}
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.from}
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                >
                  {assets.map((asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                      className="bg-slate-950"
                    >
                      {asset.symbol} — {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.to}
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                >
                  {assets.map((asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                      className="bg-slate-950"
                    >
                      {asset.symbol} — {asset.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm text-slate-400">{copy.result}</p>
              <p className="mt-2 text-3xl font-black text-white">
                {convertedValue.toLocaleString(undefined, {
                  maximumFractionDigits: convertedValue > 1 ? 4 : 10,
                })}{" "}
                {toAsset?.symbol}
              </p>

              <p className="mt-3 text-sm text-slate-400">
                {amount || 0} {fromAsset?.symbol} ≈{" "}
                {convertedValue.toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })}{" "}
                {toAsset?.symbol}
              </p>
            </div>

            {data?.updatedAt && (
              <p className="mt-4 text-xs text-slate-500">
                {copy.updated}: {new Date(data.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">{copy.faqTitle}</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map(([question, answer], index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"
              >
                <h3 className="font-bold text-white">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {answer}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            Educational purposes only. Crypto prices change quickly and may
            differ slightly across exchanges.
          </p>
        </div>
      </div>
    </section>
  );
}
