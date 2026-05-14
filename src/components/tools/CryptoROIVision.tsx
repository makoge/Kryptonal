
"use client";

import { useEffect, useMemo, useState } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "ripple", symbol: "XRP" },
  { id: "cardano", symbol: "ADA" },
   { id: "dogecoin", symbol: "DOGE" },
  { id: "litecoin", symbol: "LTC" },
  { id: "chainlink", symbol: "LINK" },
  { id: "polkadot", symbol: "DOT" },
  { id: "avalanche", symbol: "AVAX" },
  { id: "tron", symbol: "TRX" },
  { id: "stellar", symbol: "XLM" },
  { id: "bitcoinCash", symbol: "BCH" },
  { id: "monero", symbol: "XMR" },
   { id: "shiba", symbol: "SHIB" },
  { id: "pepe", symbol: "PEPE" },
  { id: "floki", symbol: "FLOKI" }
];

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

export default function CryptoROIVision({ t }: { t: any }) {
  const copy = t.tools.cryptoRoiVision;

  const [coin, setCoin] = useState("bitcoin");
  const [coinAmount, setCoinAmount] = useState(1);
  const [futurePrice, setFuturePrice] = useState(250000);
  const [date, setDate] = useState("2020-01-01");

  const [loading, setLoading] = useState(false);
  const [historicalPrice, setHistoricalPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  const formattedDate = useMemo(() => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }, [date]);

  useEffect(() => {
   async function load() {
  try {
    setLoading(true);

    const res = await fetch(
      `/api/tools/crypto-roi?coin=${encodeURIComponent(
        coin
      )}&date=${encodeURIComponent(date)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("API route failed");
    }

    const data = await res.json();

    setHistoricalPrice(Number(data.historicalPrice || 0));
    setCurrentPrice(Number(data.currentPrice || 0));
  } catch (error) {
    console.error("Crypto ROI fetch failed:", error);
    setHistoricalPrice(0);
    setCurrentPrice(0);
  } finally {
    setLoading(false);
  }
}

    load();
  }, [coin, date]);

  const amountOwned = historicalPrice > 0
    ? coinAmount / historicalPrice
    : 0;

  const originalValue = coinAmount * historicalPrice;  
  const currentValue = coinAmount * currentPrice;
  const futureValue = coinAmount * futurePrice;

  const currentProfit = currentValue - originalValue;
  const futureProfit = futureValue - originalValue;

  const multiplier = originalValue > 0 ? currentValue / originalValue : 0;

const percentageGain =
  originalValue > 0 ? ((currentValue - originalValue) / originalValue) * 100 : 0;

  const selectedCoin = COINS.find((c) => c.id === coin);

  const shareText = copy.shareTemplate
  .replace("{amount}", String(coinAmount))
  .replaceAll("{coin}", selectedCoin?.symbol || "")
  .replace("{date}", date)
  .replace("{currentValue}", formatUsd(currentValue))
  .replace("{futureValue}", formatUsd(futureValue))
  .replace("{futurePrice}", formatUsd(futurePrice));

  async function share() {
    try {
      await navigator.clipboard.writeText(shareText);
      alert(copy.copied);
    } catch {
      alert(copy.copyFailed);
    }
  }

  return (
    <main className="bg-slate-950 px-4 py-20 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            {copy.badge}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-5 leading-8 text-slate-300">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  {copy.coin}
                </label>

                <select
                  value={coin}
                  onChange={(e) => setCoin(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                >
                  {COINS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  {copy.coinAmount}
                </label>

                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  {copy.date}
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  {copy.futurePrice}
                </label>

                <input
                  type="range"
                  min="1000"
                  max="500000"
                  step="1000"
                  value={futurePrice}
                  onChange={(e) => setFuturePrice(Number(e.target.value))}
                  className="w-full"
                />

                <div className="mt-2 text-lg font-black text-cyan-300">
                  {formatUsd(futurePrice)}
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
              {loading ? (
                <div className="text-slate-300">
                  {copy.loading}
                </div>
              ) : (
                <>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
    <p className="text-sm text-slate-400">
      {copy.historicalPrice}
    </p>
    <p className="mt-2 text-2xl font-black text-white">
      {formatUsd(historicalPrice)}
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
    <p className="text-sm text-slate-400">
      {copy.currentPrice}
    </p>
    <p className="mt-2 text-2xl font-black text-white">
      {formatUsd(currentPrice)}
    </p>
  </div>
</div>
                  <div>
                    <p className="text-sm text-slate-300">
                      {copy.currentValue}
                    </p>

                    <h2 className="mt-2 text-5xl font-black text-white">
                      {formatUsd(currentValue)}
                    </h2>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-slate-400">
                        {copy.currentProfit}
                      </p>

                      <p className="mt-2 text-2xl font-black text-emerald-300">
                        {formatUsd(currentProfit)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-slate-400">
                        {copy.futureValue}
                      </p>

                      <p className="mt-2 text-2xl font-black text-cyan-300">
                        {formatUsd(futureValue)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-slate-400">
                        {copy.multiplier}
                      </p>

                      <p className="mt-2 text-2xl font-black text-white">
                        {multiplier.toFixed(2)}x
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-slate-400">
                        {copy.percentageGain}
                      </p>

                      <p className="mt-2 text-2xl font-black text-emerald-300">
                        {percentageGain.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={share}
                    className="mt-8 rounded-2xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
                  >
                    {copy.share}
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-amber-200">
            {copy.disclaimer}
          </p>
        </div>
      </section>
    </main>
  );
}
