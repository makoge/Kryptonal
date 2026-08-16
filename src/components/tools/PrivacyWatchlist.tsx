"use client";

import { useEffect, useMemo, useState } from "react";

const AVAILABLE_COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "polygon", name: "Polygon", symbol: "POL" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "bitcoinCash", name: "Bitcoin Cash", symbol: "BCH" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "monero", name: "Monero", symbol: "XMR" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  { id: "optimism", name: "Optimism", symbol: "OP" },
  { id: "render", name: "Render", symbol: "RENDER" },
  { id: "near", name: "NEAR Protocol", symbol: "NEAR" },
  { id: "aptos", name: "Aptos", symbol: "APT" },
  { id: "sui", name: "Sui", symbol: "SUI" },
  { id: "injective", name: "Injective", symbol: "INJ" },
  { id: "cosmos", name: "Cosmos", symbol: "ATOM" },
  { id: "internetComputer", name: "Internet Computer", symbol: "ICP" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI" },
  { id: "aave", name: "Aave", symbol: "AAVE" },
  { id: "maker", name: "Maker", symbol: "MKR" },
  { id: "lido", name: "Lido DAO", symbol: "LDO" },
  { id: "curve", name: "Curve DAO", symbol: "CRV" },
  { id: "pendle", name: "Pendle", symbol: "PENDLE" },
  { id: "etherfi", name: "Ether.fi", symbol: "ETHFI" },
  { id: "eigenlayer", name: "EigenLayer", symbol: "EIGEN" },
  { id: "immutable", name: "Immutable", symbol: "IMX" },
  { id: "gala", name: "Gala", symbol: "GALA" },
  { id: "ronin", name: "Ronin", symbol: "RON" },
  { id: "beam", name: "Beam", symbol: "BEAM" },
  { id: "sandbox", name: "The Sandbox", symbol: "SAND" },
  { id: "decentraland", name: "Decentraland", symbol: "MANA" },
  {
    id: "fetchai",
    name: "Artificial Superintelligence Alliance",
    symbol: "FET",
  },
  { id: "bittensor", name: "Bittensor", symbol: "TAO" },
  { id: "akash", name: "Akash Network", symbol: "AKT" },
  { id: "grass", name: "Grass", symbol: "GRASS" },
  { id: "virtuals", name: "Virtuals Protocol", symbol: "VIRTUAL" },
  { id: "kaito", name: "Kaito", symbol: "KAITO" },
  { id: "worldcoin", name: "Worldcoin", symbol: "WLD" },
  { id: "dogwifhat", name: "dogwifhat", symbol: "WIF" },
  { id: "bonk", name: "Bonk", symbol: "BONK" },
  { id: "pepe", name: "Pepe", symbol: "PEPE" },
  { id: "shiba", name: "Shiba Inu", symbol: "SHIB" },
  { id: "floki", name: "FLOKI", symbol: "FLOKI" },
  { id: "mubarak", name: "Mubarak", symbol: "MUBARAK" },
  { id: "tether", name: "Tether", symbol: "USDT" },
  { id: "usdCoin", name: "USDC", symbol: "USDC" },
  { id: "dai", name: "Dai", symbol: "DAI" },
];

type Holding = {
  id: string;
  amount: string;
  entryPrice: string;
  alertAbove: string;
  alertBelow: string;
};

type PriceCoin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
};

interface PrivacyWatchlistProps {
  t?: any;
  defaultCoin?: string;
}

const DEFAULT_COPY = {
  badge: "Private Portfolio Tool",
  title: "Crypto Portfolio Tracker",
  description:
    "Track your crypto holdings, profit and loss, portfolio allocation, alerts, and risk signals directly in your browser.",
  privacy:
    "Your portfolio stays private on your device. Kryptonal does not require login or store your holdings on a server.",
  addHolding: "Add Holding",
  coin: "Coin",
  amount: "Amount",
  entryPrice: "Entry Price",
  alertAbove: "Alert Above",
  alertBelow: "Alert Below",
  totalValue: "Total Value",
  invested: "Invested",
  profitLoss: "Profit / Loss",
  roi: "ROI",
  portfolioHealth: "Portfolio Health",
  allocation: "Allocation",
  largestHolding: "Largest Holding",
  stablecoinExposure: "Stablecoin Exposure",
  diversificationScore: "Diversification Score",
  riskLevel: "Risk Level",
  bestPerformer: "Best Performer",
  worstPerformer: "Worst Performer",
  insights: "Portfolio Insights",
  lowRisk: "Low Risk",
  mediumRisk: "Medium Risk",
  highRisk: "High Risk",
  holdings: "Holdings",
  remove: "Remove",
  price: "Price",
  value: "Value",
  cost: "Cost",
  pnl: "P/L",
  noHoldings: "Add your first holding to start tracking your crypto portfolio.",
  updatingPrices: "Updating live prices...",
  seoTitle: "Crypto Portfolio Tracker Guide",
  faqBestTrackerQ: "What is the best portfolio tracker for crypto?",
  faqBestTrackerA:
    "The best crypto portfolio tracker depends on your needs. A strong tracker should offer live prices, profit and loss tracking, portfolio allocation, risk insights, alerts, and privacy-friendly storage.",
  faqFreeTrackerQ: "Is there a free portfolio tracker?",
  faqFreeTrackerA:
    "Yes. Kryptonal offers a free crypto portfolio tracker that helps users monitor holdings, calculate profit and loss, track alerts, and review portfolio exposure without requiring an account.",
  faqWhatTrackerQ: "What is a crypto portfolio tracker?",
  faqWhatTrackerA:
    "A crypto portfolio tracker is a tool that helps investors monitor their cryptocurrency holdings, current value, profit or loss, allocation, and performance in one place.",
  faqHowTrackQ: "How do I track my crypto portfolio?",
  faqHowTrackA:
    "You can track your crypto portfolio by adding each coin, entering the amount you hold, adding your entry price, and reviewing live value, profit, loss, allocation, and risk signals.",
  faq1000Q: "Can you make $1000 a day with crypto?",
  faq1000A:
    "It is possible, but it usually requires large capital, advanced trading skill, high risk, or unusually strong market conditions. Most users should focus on portfolio growth, risk control, and long-term consistency instead of fixed daily profit targets.",
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value || 0);
}

function pct(value: number) {
  if (!Number.isFinite(value)) return "0.00%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function PrivacyWatchlist({
  t,
  defaultCoin = "bitcoin",
}: PrivacyWatchlistProps) {
  const copy = { ...DEFAULT_COPY, ...(t?.tools?.privacyWatchlist || {}) };

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<PriceCoin[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Add an isLoaded flag
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 2. Load the initial data safely
    const saved = localStorage.getItem("kryptonal-portfolio");
    if (saved) {
      try {
        setHoldings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse portfolio");
      }
    }

    // Unlock saving
    setIsLoaded(true);

    // 3. Listen for changes made from the HeroBoard in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kryptonal-portfolio" && e.newValue) {
        try {
          setHoldings(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // 4. ONLY save to localStorage AFTER the initial load is complete
    if (isLoaded) {
      localStorage.setItem("kryptonal-portfolio", JSON.stringify(holdings));
    }
  }, [holdings, isLoaded]);

  const ids = useMemo(
    () =>
      holdings
        .map((h) => h.id)
        .filter(Boolean)
        .join(","),
    [holdings],
  );

  useEffect(() => {
    if (!ids) {
      setPrices([]);
      return;
    }

    async function loadPrices() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tools/watchlist-prices?ids=${ids}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setPrices(json.coins || []);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
    const timer = setInterval(loadPrices, 60000);
    return () => clearInterval(timer);
  }, [ids]);

  function addHolding() {
    // Pre-select the defaultCoin passed from pSEO page if valid, else fallback to 'bitcoin'
    const initialCoin = AVAILABLE_COINS.some((c) => c.id === defaultCoin)
      ? defaultCoin
      : "bitcoin";

    setHoldings((prev) => [
      ...prev,
      {
        id: initialCoin,
        amount: "",
        entryPrice: "",
        alertAbove: "",
        alertBelow: "",
      },
    ]);
  }

  function updateHolding(index: number, key: keyof Holding, value: string) {
    setHoldings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function removeHolding(index: number) {
    setHoldings((prev) => prev.filter((_, i) => i !== index));
  }

  const priceMap = useMemo(() => {
    return Object.fromEntries(prices.map((coin) => [coin.id, coin]));
  }, [prices]);

  const rows = holdings.map((holding) => {
    const coin = priceMap[holding.id];
    const amount = parseFloat(holding.amount) || 0;
    const entryPrice = parseFloat(holding.entryPrice) || 0;
    const price = coin?.price || 0;
    const value = amount * price;
    const cost = amount * entryPrice;
    const profit = value - cost;
    const profitPct = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      ...holding,
      name:
        coin?.name ||
        AVAILABLE_COINS.find((c) => c.id === holding.id)?.name ||
        holding.id,
      symbol:
        coin?.symbol ||
        AVAILABLE_COINS.find((c) => c.id === holding.id)?.symbol ||
        "",
      amount,
      entryPrice,
      price,
      value,
      cost,
      profit,
      profitPct,
    };
  });

  const activeRows = rows.filter((row) => row.value > 0);
  const totalValue = activeRows.reduce((sum, row) => sum + row.value, 0);
  const totalCost = activeRows.reduce((sum, row) => sum + row.cost, 0);
  const totalProfit = totalValue - totalCost;
  const totalRoi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const largestHolding = [...activeRows].sort((a, b) => b.value - a.value)[0];
  const bestPerformer = [...activeRows]
    .filter((r) => r.cost > 0)
    .sort((a, b) => b.profitPct - a.profitPct)[0];
  const worstPerformer = [...activeRows]
    .filter((r) => r.cost > 0)
    .sort((a, b) => a.profitPct - b.profitPct)[0];

  const largestAllocationPct =
    totalValue > 0 && largestHolding
      ? (largestHolding.value / totalValue) * 100
      : 0;

  const stablecoinIds = ["tether", "usdCoin", "dai"];
  const stablecoinValue = activeRows
    .filter((row) => stablecoinIds.includes(row.id))
    .reduce((sum, row) => sum + row.value, 0);

  const stablecoinExposure =
    totalValue > 0 ? (stablecoinValue / totalValue) * 100 : 0;

  const diversificationScore =
    activeRows.length >= 8 && largestAllocationPct < 35
      ? 90
      : activeRows.length >= 5 && largestAllocationPct < 50
        ? 75
        : activeRows.length >= 3
          ? 55
          : activeRows.length > 0
            ? 35
            : 0;

  const portfolioRisk =
    largestAllocationPct >= 65 || activeRows.length <= 2
      ? copy.highRisk
      : largestAllocationPct >= 45
        ? copy.mediumRisk
        : copy.lowRisk;

  const insights = [
    activeRows.length <= 2
      ? "Your portfolio is concentrated in very few assets."
      : "Your portfolio has multiple holdings, which may reduce single-asset risk.",
    largestAllocationPct >= 50
      ? `Your largest holding is ${largestHolding?.symbol}, representing ${largestAllocationPct.toFixed(1)}% of the portfolio.`
      : "No single holding dominates the entire portfolio.",
    stablecoinExposure < 5
      ? "Stablecoin exposure is low, so your portfolio may be more exposed to market volatility."
      : `Stablecoin exposure is ${stablecoinExposure.toFixed(1)}%, which may help reduce volatility.`,
    totalRoi >= 0
      ? "Your current portfolio return is positive based on your entered prices."
      : "Your current portfolio return is negative based on your entered prices.",
  ];

  const allocation = activeRows
    .map((row) => ({
      symbol: row.symbol,
      value: row.value,
      pct: totalValue > 0 ? (row.value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)] sm:p-8">
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
            {copy.badge}
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">{copy.description}</p>

          <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
            {copy.privacy}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label={copy.totalValue} value={money(totalValue)} />
          <SummaryCard label={copy.invested} value={money(totalCost)} />
          <SummaryCard
            label={copy.profitLoss}
            value={money(totalProfit)}
            positive={totalProfit >= 0}
          />
          <SummaryCard
            label={copy.roi}
            value={pct(totalRoi)}
            positive={totalRoi >= 0}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label={copy.diversificationScore}
            value={`${diversificationScore}/100`}
          />
          <SummaryCard
            label={copy.riskLevel}
            value={portfolioRisk}
            amber={portfolioRisk !== copy.lowRisk}
          />
          <SummaryCard
            label={copy.largestHolding}
            value={
              largestHolding
                ? `${largestHolding.symbol} ${largestAllocationPct.toFixed(1)}%`
                : "N/A"
            }
          />
          <SummaryCard
            label={copy.stablecoinExposure}
            value={`${stablecoinExposure.toFixed(1)}%`}
          />
          <SummaryCard
            label={copy.bestPerformer}
            value={
              bestPerformer
                ? `${bestPerformer.symbol} ${pct(bestPerformer.profitPct)}`
                : "N/A"
            }
            positive
          />
          <SummaryCard
            label={copy.worstPerformer}
            value={
              worstPerformer
                ? `${worstPerformer.symbol} ${pct(worstPerformer.profitPct)}`
                : "N/A"
            }
            amber
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <h2 className="text-2xl font-black">{copy.allocation}</h2>

          <div className="mt-5 space-y-4">
            {allocation.length ? (
              allocation.map((item) => (
                <div key={item.symbol}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-bold">{item.symbol}</span>
                    <span className="text-slate-400">
                      {item.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">{copy.noHoldings}</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <h2 className="text-2xl font-black">{copy.insights}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            {insights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-black">{copy.holdings}</h2>

            <button
              onClick={addHolding}
              className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 hover:bg-emerald-300"
            >
              {copy.addHolding}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {holdings.map((holding, index) => {
              const row = rows[index];

              return (
                <div
                  key={index}
                  className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 lg:grid-cols-12"
                >
                  <select
                    value={holding.id}
                    onChange={(e) => updateHolding(index, "id", e.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none lg:col-span-3"
                  >
                    {AVAILABLE_COINS.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </option>
                    ))}
                  </select>

                  <input
                    value={holding.amount}
                    onChange={(e) =>
                      updateHolding(index, "amount", e.target.value)
                    }
                    placeholder={copy.amount}
                    inputMode="decimal"
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none lg:col-span-2"
                  />

                  <input
                    value={holding.entryPrice}
                    onChange={(e) =>
                      updateHolding(index, "entryPrice", e.target.value)
                    }
                    placeholder={copy.entryPrice}
                    inputMode="decimal"
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none lg:col-span-2"
                  />

                  <input
                    value={holding.alertAbove}
                    onChange={(e) =>
                      updateHolding(index, "alertAbove", e.target.value)
                    }
                    placeholder={copy.alertAbove}
                    inputMode="decimal"
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none lg:col-span-2"
                  />

                  <input
                    value={holding.alertBelow}
                    onChange={(e) =>
                      updateHolding(index, "alertBelow", e.target.value)
                    }
                    placeholder={copy.alertBelow}
                    inputMode="decimal"
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none lg:col-span-2"
                  />

                  <button
                    onClick={() => removeHolding(index)}
                    className="rounded-2xl bg-red-400/10 px-4 py-3 font-bold text-red-300 hover:bg-red-400/20 lg:col-span-1"
                  >
                    {copy.remove}
                  </button>

                  <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-4 lg:col-span-12">
                    <MiniStat label={copy.price} value={money(row.price)} />
                    <MiniStat label={copy.value} value={money(row.value)} />
                    <MiniStat label={copy.cost} value={money(row.cost)} />
                    <MiniStat
                      label={copy.pnl}
                      value={`${money(row.profit)} (${pct(row.profitPct)})`}
                    />
                  </div>
                </div>
              );
            })}

            {!holdings.length && (
              <p className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center text-slate-400">
                {copy.noHoldings}
              </p>
            )}
          </div>

          {loading && (
            <p className="mt-4 text-sm text-slate-500">{copy.updatingPrices}</p>
          )}
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <h2 className="text-3xl font-black">{copy.seoTitle}</h2>

          <div className="mt-6 grid gap-4">
            {[
              [copy.faqWhatTrackerQ, copy.faqWhatTrackerA],
              [copy.faqHowTrackQ, copy.faqHowTrackA],
              [copy.faqFreeTrackerQ, copy.faqFreeTrackerA],
              [copy.faqBestTrackerQ, copy.faqBestTrackerA],
              [copy.faq1000Q, copy.faq1000A],
            ].map(([question, answer]) => (
              <article
                key={question}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <h3 className="text-lg font-black text-white">{question}</h3>
                <p className="mt-3 leading-7 text-slate-300">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  positive,
  amber,
}: {
  label: string;
  value: string;
  positive?: boolean;
  amber?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-3 text-2xl font-black ${
          amber
            ? "text-amber-300"
            : positive
              ? "text-emerald-300"
              : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
