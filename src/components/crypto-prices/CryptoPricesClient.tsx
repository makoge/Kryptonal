// src/components/crypto-prices/CryptoPricesClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Tab = "coins" | "gainers" | "losers" | "new" | "exchanges";
type ModalView = "chart" | "analysis" | "about";

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

// --- Helper to Strip HTML from CoinGecko Descriptions ---
function cleanDescription(html?: string, fallbackString?: string) {
  if (!html) return fallbackString || "No description available.";
  const clean = html.replace(/<[^>]*>?/gm, "").trim();
  return clean || fallbackString || "No description available.";
}

// --- Custom Hook for Analytics ---
function useCoinAnalytics(id: string | null) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setError(false);
    setLoading(true);

    async function fetchData() {
      try {
        const res = await fetch(`/api/analytics?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch from proxy");
        const data = await res.json();
        if (!isMounted) return;

        const formattedChart = (data.chart.prices || []).map(
          ([timestamp, price]: [number, number]) => ({
            date: new Date(timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              timeZone: "UTC",
            }),
            price: price,
          }),
        );

        setChartData(formattedChart);
        setDetails(data.details);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { chartData, details, loading, error };
}

// --- Algorithmic Analysis Engine (Localized) ---
function generateMarketAnalysis(details: any, t: any) {
  if (!details || !details.market_data) return null;
  const md = details.market_data;

  const current = md.current_price.usd || 0;
  const high24 = md.high_24h?.usd || current;
  const low24 = md.low_24h?.usd || current;
  const change24 = md.price_change_percentage_24h || 0;
  const ath = md.ath?.usd || 0;
  const athChange = md.ath_change_percentage?.usd || 0;
  const rank = details.market_cap_rank || 999;

  // Calculate supply dilution
  const supplyRatio = md.max_supply
    ? md.circulating_supply / md.max_supply
    : md.total_supply
      ? md.circulating_supply / md.total_supply
      : 1;

  // Determine Momentum (Using translation object)
  let momentum = t?.analysis?.neutral || "Neutral ⚖️";
  let momentumText =
    t?.analysis?.neutralText || "The asset is currently consolidating.";

  if (change24 > 5) {
    momentum = t?.analysis?.strongBullish || "Strong Bullish 🐂";
    momentumText = (t?.analysis?.strongBullishText || "Up {change}%")
      .replace("{change}", change24.toFixed(2))
      .replace("{high}", high24.toLocaleString());
  } else if (change24 < -5) {
    momentum = t?.analysis?.strongBearish || "Strong Bearish 🐻";
    momentumText = (t?.analysis?.strongBearishText || "Down {change}%")
      .replace("{change}", Math.abs(change24).toFixed(2))
      .replace("{low}", low24.toLocaleString());
  } else if (change24 > 0) {
    momentum = t?.analysis?.slightlyBullish || "Slightly Bullish 📈";
    momentumText =
      t?.analysis?.slightlyBullishText || "Displaying mild positive momentum.";
  } else if (change24 < 0) {
    momentum = t?.analysis?.slightlyBearish || "Slightly Bearish 📉";
    momentumText =
      t?.analysis?.slightlyBearishText ||
      "Experiencing mild downward pressure.";
  }

  // Investment Horizon Assessment
  let investmentProfile =
    t?.analysis?.speculativeFocus || "Speculative / Short-Term Focus";
  let horizonText =
    t?.analysis?.speculativeText || "Higher volatility, suited for short-term.";

  if (rank <= 20) {
    investmentProfile =
      t?.analysis?.coreAsset || "Core Asset / Long-Term Potential";
    horizonText =
      t?.analysis?.coreText ||
      "Ranked among top 20, candidate for long-term allocation.";
  } else if (rank <= 100) {
    investmentProfile =
      t?.analysis?.midCap || "Mid-Cap Growth / Balanced Horizon";
    horizonText =
      t?.analysis?.midCapText ||
      "Balance of growth and risk. Medium-term positioning.";
  }

  // Tokenomics Assessment
  let supplyText = t?.analysis?.supplyStandard || "Tokenomics appear standard.";
  if (supplyRatio < 0.5) {
    supplyText = (
      t?.analysis?.supplyCaution || "Only {ratio}% circulating."
    ).replace("{ratio}", (supplyRatio * 100).toFixed(0));
  } else if (supplyRatio > 0.85) {
    supplyText = (
      t?.analysis?.supplyFavorable || "Over {ratio}% circulating."
    ).replace("{ratio}", (supplyRatio * 100).toFixed(0));
  }

  const athText = (t?.analysis?.athText || "Down {change}% from ATH ${ath}.")
    .replace("{change}", Math.abs(athChange).toFixed(2))
    .replace("{ath}", ath.toLocaleString());

  const volatility = high24 - low24;
  const resistanceTarget = (
    current + (volatility > 0 ? volatility * 0.618 : current * 0.05)
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
  const supportRaw =
    current - (volatility > 0 ? volatility * 0.618 : current * 0.05);
  const supportTarget =
    supportRaw > 0
      ? supportRaw.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "0.00";

  return {
    momentum,
    momentumText,
    investmentProfile,
    horizonText,
    supplyText,
    athText,
    resistanceTarget,
    supportTarget,
    high24,
    low24,
  };
}

// --- Main Client Component ---
export default function CryptoPricesClient({ data, t }: { data: any; t: any }) {
  const [tab, setTab] = useState<Tab>("coins");
  const [query, setQuery] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const coins: Coin[] = data?.coins ?? [];

  const filteredCoins = useMemo(() => {
    const q = query?.toLowerCase() || "";
    return (coins || []).filter(
      (coin) =>
        coin?.name?.toLowerCase().includes(q) ||
        coin?.symbol?.toLowerCase().includes(q),
    );
  }, [coins, query]);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <p>{t?.states?.failed || "Failed to load data"}</p>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "coins", label: t?.tabs?.coins || "Top 200" },
    { key: "gainers", label: t?.tabs?.gainers || "Top Gainers" },
    { key: "losers", label: t?.tabs?.losers || "Top Losers" },
    { key: "new", label: t?.tabs?.new || "Trending" },
    { key: "exchanges", label: t?.tabs?.exchanges || "Exchanges" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_40%)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            {t?.badge || "Live Markets"}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {t?.title || "Crypto Dashboard"}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t?.description ||
              "Track prices, volume, and market capitalizations."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric
              label={t?.metrics?.coinsTracked || "Coins Tracked"}
              value={`${coins.length}+`}
            />
            <Metric
              label={t?.metrics?.topGainer || "Top Gainer"}
              value={data.gainers?.[0]?.symbol?.toUpperCase() || "—"}
            />
            <Metric
              label={t?.metrics?.updated || "Last Updated"}
              value={new Date(
                data.updatedAt || Date.now(),
              ).toLocaleTimeString()}
            />
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
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
              placeholder={t?.search || "Search coins..."}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400 lg:max-w-xs"
            />
          )}
        </div>

        {tab === "coins" && (
          <CoinsTable
            coins={filteredCoins}
            t={t}
            onSelectCoin={setSelectedCoinId}
          />
        )}
        {tab === "gainers" && (
          <CoinsTable
            coins={data.gainers ?? []}
            t={t}
            onSelectCoin={setSelectedCoinId}
          />
        )}
        {tab === "losers" && (
          <CoinsTable
            coins={data.losers ?? []}
            t={t}
            onSelectCoin={setSelectedCoinId}
          />
        )}
        {tab === "new" && (
          <Trending
            coins={data.newCoins ?? []}
            t={t}
            onSelectCoin={setSelectedCoinId}
          />
        )}
        {tab === "exchanges" && (
          <Exchanges exchanges={data.exchanges ?? []} t={t} />
        )}
      </section>

      {selectedCoinId && (
        <CoinAnalyticsModal
          id={selectedCoinId}
          onClose={() => setSelectedCoinId(null)}
          t={t}
        />
      )}
    </main>
  );
}

// --- Analytics Modal Component (Localized) ---
function CoinAnalyticsModal({
  id,
  onClose,
  t,
}: {
  id: string;
  onClose: () => void;
  t: any;
}) {
  const { chartData, details, loading, error } = useCoinAnalytics(id);
  const [view, setView] = useState<ModalView>("chart");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const analysis = details ? generateMarketAnalysis(details, t) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="custom-scrollbar relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>

        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
            <p className="text-sm text-slate-400">
              {t?.modal?.loadingIntelligence || "Loading intelligence..."}
            </p>
          </div>
        ) : error || !details ? (
          <div className="flex h-72 flex-col items-center justify-center gap-2">
            <p className="text-xl font-bold text-red-400">
              {t?.modal?.unableToLoad || "Unable to load data"}
            </p>
            <p className="text-sm text-slate-400 text-center max-w-md">
              {t?.modal?.apiLimitReached ||
                "The API limit was reached, or this coin is missing historical data."}
            </p>
          </div>
        ) : (
          <div className="pt-2">
            {/* Header Area */}
            <div className="mb-6 flex flex-col gap-4 pr-12 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {details?.image?.large && (
                  <img
                    src={details.image.large}
                    alt={details.name}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-3xl font-black">
                    {details?.name || "Unknown"}{" "}
                    <span className="text-xl uppercase text-slate-500">
                      {details?.symbol || ""}
                    </span>
                  </h2>
                  <div className="mt-1 flex gap-4 text-sm text-slate-400">
                    <p>
                      {t?.modal?.rank || "Rank"}: #
                      {details?.market_cap_rank || "—"}
                    </p>
                    <p>
                      {t?.modal?.ath || "ATH"}: $
                      {details?.market_data?.ath?.usd?.toLocaleString() || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Bar */}
              <ShareBar
                coinName={details.name}
                coinSymbol={details.symbol}
                t={t}
              />
            </div>

            {/* Toggle View Buttons */}
            <div className="mb-6 flex w-fit flex-wrap gap-2 rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setView("chart")}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  view === "chart"
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t?.modal?.priceChart || "Price Chart"}
              </button>
              <button
                onClick={() => setView("analysis")}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  view === "analysis"
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t?.modal?.aiAnalysis || "AI Analysis"}
              </button>
              <button
                onClick={() => setView("about")}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  view === "about"
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t?.modal?.aboutProject || "About Project"}
              </button>
            </div>

            {/* VIEW 1: PRICE CHART */}
            {view === "chart" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                  <p className="mb-4 text-sm font-semibold text-slate-400">
                    {t?.modal?.priceHistory7d || "7-Day Price History"}
                  </p>
                  <div className="relative h-64 w-full">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorPrice"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#34d399"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#34d399"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                              `$${value.toLocaleString()}`
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                            itemStyle={{ color: "#34d399", fontWeight: "bold" }}
                            formatter={(value: any) => {
                              if (value === undefined || value === null)
                                return ["—", "Price"];
                              return [
                                `$${Number(value).toLocaleString()}`,
                                "Price",
                              ];
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#34d399"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        {t?.modal?.noChartData || "No chart data available."}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      {t?.modal?.currentPrice || "Current Price"}
                    </p>
                    <p className="text-2xl font-black">
                      $
                      {details?.market_data?.current_price?.usd?.toLocaleString() ||
                        "—"}
                    </p>
                    <p className="mt-1 text-sm">
                      {formatPercent(
                        details?.market_data?.price_change_percentage_24h,
                      )}{" "}
                      (24h)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      {t?.modal?.marketCap || "Market Cap"}
                    </p>
                    <p className="text-xl font-bold">
                      $
                      {details?.market_data?.market_cap?.usd?.toLocaleString() ||
                        "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      {t?.modal?.maxSupply || "Max Supply"}
                    </p>
                    <p className="text-xl font-bold">
                      {details?.market_data?.max_supply
                        ? details.market_data.max_supply.toLocaleString()
                        : t?.modal?.infinite || "Infinite"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: AI ANALYSIS */}
            {view === "analysis" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 md:col-span-2">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                      {t?.modal?.aiAnalysis || "Automated Market Intelligence"}
                    </p>
                  </div>
                  <h3 className="mb-3 text-xl font-black">
                    {t?.modal?.trend || "Trend"}: {analysis?.momentum}
                  </h3>
                  <p className="mb-4 leading-relaxed text-slate-300">
                    {analysis?.momentumText}
                  </p>

                  <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {t?.modal?.investmentProfile || "Investment Profile"}
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {analysis?.investmentProfile}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                      {analysis?.horizonText}
                    </p>
                  </div>

                  <p className="mb-4 leading-relaxed text-slate-300">
                    {analysis?.supplyText}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {analysis?.athText}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="text-sm text-slate-500">
                        {t?.modal?.resistanceLevel ||
                          "Resistance Level (Fib 0.618)"}
                      </p>
                      <p className="text-xl font-bold text-emerald-400">
                        ${analysis?.resistanceTarget}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        {t?.modal?.supportFloor || "Support Floor (Fib 0.618)"}
                      </p>
                      <p className="text-xl font-bold text-red-400">
                        ${analysis?.supportTarget}
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 text-[10px] uppercase tracking-wide text-slate-600">
                    {t?.analysis?.disclaimer ||
                      "Disclaimer: Algorithmic estimates are based on 24h volatility and do not constitute financial advice."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      {t?.modal?.high24h || "24h High"}
                    </p>
                    <p className="text-xl font-bold text-emerald-400">
                      ${analysis?.high24.toLocaleString() || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      {t?.modal?.low24h || "24h Low"}
                    </p>
                    <p className="text-xl font-bold text-red-400">
                      ${analysis?.low24.toLocaleString() || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      {t?.modal?.volumeMarketCap || "Volume / Market Cap"}
                    </p>
                    <p className="text-xl font-bold">
                      {(
                        (details?.market_data?.total_volume?.usd /
                          details?.market_data?.market_cap?.usd) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: ABOUT PROJECT */}
            {view === "about" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-2">
                  <h3 className="mb-4 text-xl font-black">
                    {t?.modal?.whatIs || "What is"} {details?.name}?
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                    {cleanDescription(
                      details?.description?.en,
                      t?.modal?.noDescription,
                    )}
                  </p>

                  {/* Categories */}
                  {details?.categories?.length > 0 && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {t?.modal?.categories || "Categories & Ecosystem"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {details.categories
                          .filter(Boolean)
                          .map((cat: string) => (
                            <span
                              key={cat}
                              className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Useful Links Sidebar */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                      {t?.modal?.officialResources || "Official Resources"}
                    </p>
                    <div className="space-y-2">
                      {details?.links?.homepage?.[0] && (
                        <a
                          href={details.links.homepage[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10 hover:text-emerald-400"
                        >
                          {t?.modal?.officialWebsite || "Official Website"} ↗
                        </a>
                      )}
                      {details?.links?.twitter_screen_name && (
                        <a
                          href={`https://x.com/${details.links.twitter_screen_name}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10 hover:text-emerald-400"
                        >
                          Twitter / X ↗
                        </a>
                      )}
                      {details?.links?.blockchain_site?.[0] && (
                        <a
                          href={details.links.blockchain_site[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10 hover:text-emerald-400"
                        >
                          {t?.modal?.blockExplorer || "Block Explorer"} ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Shareable Socials Component (Localized) ---
function ShareBar({
  coinName,
  coinSymbol,
  t,
}: {
  coinName: string;
  coinSymbol: string;
  t: any;
}) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const shareText = (
    t?.analysis?.shareText ||
    "Check out live market metrics and analysis for {name} ({symbol})!"
  )
    .replace("{name}", coinName)
    .replace("{symbol}", coinSymbol?.toUpperCase());

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const url = encodeURIComponent(getShareUrl());
  const text = encodeURIComponent(shareText);

  return (
    <div className="flex items-center gap-2">
      <p className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {t?.modal?.share || "Share"}:
      </p>

      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        title="Copy Link"
        className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        {copied
          ? t?.modal?.copied || "Copied! ✓"
          : t?.modal?.copyLink || "Copy Link 🔗"}
      </button>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs transition hover:bg-white/10 hover:text-emerald-400"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${url}&text=${text}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs transition hover:bg-white/10 hover:text-emerald-400"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${text}%20${url}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs transition hover:bg-white/10 hover:text-emerald-400"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      </a>
    </div>
  );
}

// --- Small Components ---
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function CoinsTable({
  coins,
  t,
  onSelectCoin,
}: {
  coins: Coin[];
  t: any;
  onSelectCoin: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">{t?.table?.coin || "Coin"}</th>
              <th className="px-5 py-4">{t?.table?.price || "Price"}</th>
              <th className="px-5 py-4">1h</th>
              <th className="px-5 py-4">24h</th>
              <th className="px-5 py-4">7d</th>
              <th className="px-5 py-4">
                {t?.table?.marketCap || "Market Cap"}
              </th>
              <th className="px-5 py-4">
                {t?.table?.volume || "Volume (24h)"}
              </th>
              <th className="px-5 py-4">
                {t?.table?.supply || "Circulating Supply"}
              </th>
            </tr>
          </thead>

          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                onClick={() => onSelectCoin(coin.id)}
                className="cursor-pointer border-t border-white/10 transition hover:bg-white/[0.08]"
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
                <td className="px-5 py-4">
                  ${formatCompact(coin.total_volume)}
                </td>
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

function Trending({
  coins,
  t,
  onSelectCoin,
}: {
  coins: any[];
  t: any;
  onSelectCoin: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coins.map((item) => {
        const coin = item.item;

        return (
          <div
            key={coin.id}
            onClick={() => onSelectCoin(coin.id)}
            className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
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
              {t?.table?.marketCapRank || "Market Cap Rank"}
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
                {ex.country || t?.global || "Global"}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <p className="flex justify-between text-slate-400">
              {t?.table?.trustScore || "Trust Score"}
              <span className="font-bold text-white">
                {ex.trust_score ?? "—"}/10
              </span>
            </p>

            <p className="flex justify-between text-slate-400">
              {t?.table?.volumeBtc || "Volume (BTC)"}
              <span className="font-bold text-white">
                {formatCompact(ex.trade_volume_24h_btc)}
              </span>
            </p>

            <p className="flex justify-between text-slate-400">
              {t?.table?.year || "Year"}
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

// --- Formatters ---
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
