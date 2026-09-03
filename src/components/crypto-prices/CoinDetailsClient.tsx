"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ModalView = "chart" | "analysis" | "about";

// --- Helpers ---
function cleanDescription(html?: string, fallbackString?: string) {
  if (!html) return fallbackString || "No description available.";
  const clean = html.replace(/<[^>]*>?/gm, "").trim();
  return clean || fallbackString || "No description available.";
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

// --- Algorithmic Analysis Engine ---
function generateMarketAnalysis(details: any, t: any) {
  if (!details || !details.market_data) return null;
  const md = details.market_data;
  const aT = t?.coinDetails?.analysis || t?.analysis || {};

  const current = md.current_price.usd || 0;
  const high24 = md.high_24h?.usd || current;
  const low24 = md.low_24h?.usd || current;
  const change24 = md.price_change_percentage_24h || 0;
  const ath = md.ath?.usd || 0;
  const athChange = md.ath_change_percentage?.usd || 0;
  const rank = details.market_cap_rank || 999;

  const supplyRatio = md.max_supply
    ? md.circulating_supply / md.max_supply
    : md.total_supply
      ? md.circulating_supply / md.total_supply
      : 1;

  let momentum = aT.neutral || "Neutral ⚖️";
  let momentumText = aT.neutralText || "The asset is currently consolidating.";

  if (change24 > 5) {
    momentum = aT.strongBullish || "Strong Bullish 🐂";
    momentumText = (aT.strongBullishText || "Up {change}%")
      .replace("{change}", change24.toFixed(2))
      .replace("{high}", high24.toLocaleString());
  } else if (change24 < -5) {
    momentum = aT.strongBearish || "Strong Bearish 🐻";
    momentumText = (aT.strongBearishText || "Down {change}%")
      .replace("{change}", Math.abs(change24).toFixed(2))
      .replace("{low}", low24.toLocaleString());
  } else if (change24 > 0) {
    momentum = aT.slightlyBullish || "Slightly Bullish 📈";
    momentumText =
      aT.slightlyBullishText || "Displaying mild positive momentum.";
  } else if (change24 < 0) {
    momentum = aT.slightlyBearish || "Slightly Bearish 📉";
    momentumText =
      aT.slightlyBearishText || "Experiencing mild downward pressure.";
  }

  let investmentProfile =
    aT.speculativeFocus || "Speculative / Short-Term Focus";
  let horizonText =
    aT.speculativeText || "Higher volatility, suited for short-term.";

  if (rank <= 20) {
    investmentProfile = aT.coreAsset || "Core Asset / Long-Term Potential";
    horizonText =
      aT.coreText || "Ranked among top 20, candidate for long-term allocation.";
  } else if (rank <= 100) {
    investmentProfile = aT.midCap || "Mid-Cap Growth / Balanced Horizon";
    horizonText =
      aT.midCapText || "Balance of growth and risk. Medium-term positioning.";
  }

  let supplyText = aT.supplyStandard || "Tokenomics appear standard.";
  if (supplyRatio < 0.5) {
    supplyText = (aT.supplyCaution || "Only {ratio}% circulating.").replace(
      "{ratio}",
      (supplyRatio * 100).toFixed(0),
    );
  } else if (supplyRatio > 0.85) {
    supplyText = (aT.supplyFavorable || "Over {ratio}% circulating.").replace(
      "{ratio}",
      (supplyRatio * 100).toFixed(0),
    );
  }

  const athText = (aT.athText || "Down {change}% from ATH ${ath}.")
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

// --- Shareable Socials Component ---
function ShareBar({
  coinId,
  coinName,
  coinSymbol,
  locale,
  t,
}: {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  locale: string;
  t: any;
}) {
  const [copied, setCopied] = useState(false);
  const shareT = t?.coinDetails?.modal || t?.modal || {};

  const sharePageUrl = `https://kryptonal.com/${locale}/crypto-prices/${coinId}`;

  const shareText = (
    t?.coinDetails?.analysis?.shareText ||
    t?.analysis?.shareText ||
    "Check out live market metrics and analysis for {name} ({symbol})!"
  )
    .replace("{name}", coinName)
    .replace("{symbol}", coinSymbol?.toUpperCase());

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(sharePageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const url = encodeURIComponent(sharePageUrl);
  const text = encodeURIComponent(shareText);

  return (
    <div className="flex items-center gap-2">
      <p className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {shareT.share || "Share"}:
      </p>
      <button
        onClick={handleCopy}
        title="Copy Link"
        className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        {copied
          ? shareT.copied || "Copied! ✓"
          : shareT.copyLink || "Copy Link 🔗"}
      </button>
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
    </div>
  );
}

// --- Main Page Component ---
type Props = {
  details: any;
  chartData: any[];
  t: any;
  locale: string;
};

export default function CoinDetailsClient({
  details,
  chartData,
  t,
  locale,
}: Props) {
  const [view, setView] = useState<ModalView>("chart");

  const cdT = t?.coinDetails || {};
  const tabsT = cdT.tabs || t?.modal || {};
  const metricsT = cdT.metrics || t?.modal || {};
  const articleT = cdT.article || {};
  const generalT = t?.modal || {}; // fallback for older keys

  const analysis = useMemo(() => {
    return generateMarketAnalysis(details, t);
  }, [details, t]);

  if (!details) return null;

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl">
      <Link
        href={`/${locale}/crypto-prices`}
        className="mb-8 flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-emerald-400"
      >
        ← {cdT.back || generalT.back || "Back to Markets"}
      </Link>

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
                {cdT.rank || generalT.rank || "Rank"}: #
                {details?.market_cap_rank || "—"}
              </p>
              <p>
                {cdT.ath || generalT.ath || "ATH"}: $
                {details?.market_data?.ath?.usd?.toLocaleString() || "—"}
              </p>
            </div>
          </div>
        </div>
        <ShareBar
          coinId={details.id}
          coinName={details.name}
          coinSymbol={details.symbol}
          locale={locale}
          t={t}
        />
      </div>

      <div className="mb-6 flex w-fit flex-wrap gap-2 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setView("chart")}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === "chart" ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          {tabsT.chart || tabsT.priceChart || "Price Chart"}
        </button>
        <button
          onClick={() => setView("analysis")}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === "analysis" ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          {tabsT.analysis || tabsT.aiAnalysis || "AI Analysis"}
        </button>
        <button
          onClick={() => setView("about")}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${view === "about" ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white"}`}
        >
          {tabsT.about || tabsT.aboutProject || "About Project"}
        </button>
      </div>

      {view === "chart" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <p className="mb-4 text-sm font-semibold text-slate-400">
              {metricsT.history7d ||
                metricsT.priceHistory7d ||
                "7-Day Price History"}
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
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
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
                        return [`$${Number(value).toLocaleString()}`, "Price"];
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
                  {generalT.noChartData || "No chart data available."}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">
                {metricsT.currentPrice || "Current Price"}
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
                {metricsT.marketCap || "Market Cap"}
              </p>
              <p className="text-xl font-bold">
                $
                {details?.market_data?.market_cap?.usd?.toLocaleString() || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">
                {metricsT.maxSupply || "Max Supply"}
              </p>
              <p className="text-xl font-bold">
                {details?.market_data?.max_supply
                  ? details.market_data.max_supply.toLocaleString()
                  : metricsT.infinite || "Infinite"}
              </p>
            </div>
          </div>
        </div>
      )}

      {view === "analysis" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                {tabsT.analysis ||
                  generalT.aiAnalysis ||
                  "Automated Market Intelligence"}
              </p>
            </div>
            <h3 className="mb-3 text-xl font-black">
              {generalT.trend || "Trend"}: {analysis?.momentum}
            </h3>
            <p className="mb-4 leading-relaxed text-slate-300">
              {analysis?.momentumText}
            </p>
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {generalT.investmentProfile || "Investment Profile"}
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
                  {metricsT.resistance ||
                    generalT.resistanceLevel ||
                    "Resistance Level (Fib 0.618)"}
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  ${analysis?.resistanceTarget}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  {metricsT.support ||
                    generalT.supportFloor ||
                    "Support Floor (Fib 0.618)"}
                </p>
                <p className="text-xl font-bold text-red-400">
                  ${analysis?.supportTarget}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">
                {metricsT.high24h || "24h High"}
              </p>
              <p className="text-xl font-bold text-emerald-400">
                ${analysis?.high24.toLocaleString() || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">
                {metricsT.low24h || "24h Low"}
              </p>
              <p className="text-xl font-bold text-red-400">
                ${analysis?.low24.toLocaleString() || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NEW: PROGRAMMATIC SEO ARTICLE SECTION */}
      {view === "analysis" && (
        <article className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          {/* SEO Intent 1: Price Today */}
          <section>
            <h2 className="text-2xl font-black text-white">
              {articleT.priceTodayTitle
                ? articleT.priceTodayTitle
                    .replace("{name}", details?.name)
                    .replace("{symbol}", details?.symbol?.toUpperCase())
                : `${details?.name} (${details?.symbol?.toUpperCase()}) Price Today`}
            </h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              {articleT.priceTodayBody
                ? articleT.priceTodayBody
                    .replace(/{name}/g, details?.name)
                    .replace(
                      "{price}",
                      `$${details?.market_data?.current_price?.usd?.toLocaleString()}`,
                    )
                    .replace(
                      "{change}",
                      `${details?.market_data?.price_change_percentage_24h?.toFixed(2)}%`,
                    )
                    .replace(
                      "{marketCap}",
                      `$${details?.market_data?.market_cap?.usd?.toLocaleString()}`,
                    )
                    .replace("{trend}", analysis?.momentum?.toLowerCase() || "")
                : `The live price of ${details?.name} today is $${details?.market_data?.current_price?.usd?.toLocaleString()} USD. Over the last 24 hours, ${details?.name} has seen a price change of ${details?.market_data?.price_change_percentage_24h?.toFixed(2)}%, currently holding a global market cap of $${details?.market_data?.market_cap?.usd?.toLocaleString()}. As Kryptonal analyzes market trends and cycle signals, ${details?.name} is currently showing a ${analysis?.momentum?.toLowerCase()} trend.`}
            </p>
          </section>

          {/* SEO Intent 2: Historical / 2021 Data */}
          <section>
            <h2 className="text-2xl font-black text-white">
              {articleT.historicalTitle
                ? articleT.historicalTitle.replace("{name}", details?.name)
                : `${details?.name} Historical Performance & All-Time High`}
            </h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              {articleT.historicalBody
                ? articleT.historicalBody
                    .replace(/{name}/g, details?.name)
                    .replace(
                      "{ath}",
                      `$${details?.market_data?.ath?.usd?.toLocaleString()}`,
                    )
                    .replace(
                      "{athChange}",
                      Math.abs(
                        details?.market_data?.ath_change_percentage?.usd || 0,
                      ).toFixed(2),
                    )
                : `Understanding historical data is crucial for market context. ${details?.name} reached its absolute all-time high (ATH) of $${details?.market_data?.ath?.usd?.toLocaleString()}. Currently, the price is ${Math.abs(details?.market_data?.ath_change_percentage?.usd || 0).toFixed(2)}% down from its peak. By analyzing past crypto cycles, investors can better understand accumulation phases and overall risk context before making long-term decisions.`}
            </p>
          </section>

          {/* SEO Intent 3: Future Prediction / AI Analysis */}
          <section>
            <h2 className="text-2xl font-black text-white">
              {articleT.predictionTitle
                ? articleT.predictionTitle.replace("{name}", details?.name)
                : `${details?.name} Future Price Prediction & AI Analysis`}
            </h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              {articleT.predictionBody
                ? articleT.predictionBody
                    .replace(/{name}/g, details?.name)
                    .replace("{resistance}", `$${analysis?.resistanceTarget}`)
                    .replace("{support}", `$${analysis?.supportTarget}`)
                    .replace("{rank}", details?.market_cap_rank)
                    .replace("{profile}", analysis?.investmentProfile)
                : `While past performance does not guarantee future results, Kryptonal turns raw crypto data into clear cycle signals and market explanations. Based on recent volatility, immediate tactical resistance for ${details?.name} sits around $${analysis?.resistanceTarget}, with a technical support floor near $${analysis?.supportTarget}. Given its rank as #${details?.market_cap_rank}, it fits an investment profile of ${analysis?.investmentProfile}.`}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {articleT.disclaimer ||
                "Disclaimer: All information is strictly for educational purposes and should never be treated as financial advice."}
            </p>
          </section>
        </article>
      )}

      {view === "about" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-2">
            <h3 className="mb-4 text-xl font-black">
              {generalT.whatIs || "What is"} {details?.name}?
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {cleanDescription(
                details?.description?.en,
                generalT.noDescription,
              )}
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                {generalT.officialResources || "Official Resources"}
              </p>
              <div className="space-y-2">
                {details?.links?.homepage?.[0] && (
                  <a
                    href={details.links.homepage[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10 hover:text-emerald-400"
                  >
                    {generalT.officialWebsite || "Official Website"} ↗
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
