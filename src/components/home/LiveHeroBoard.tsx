"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Shared Constants (Must match full tracker exactly) ---
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

type Tab = "gainers" | "favorites" | "portfolio";
type ModalView = "chart" | "analysis" | "about";

type CoinItem = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  image?: string;
};
type PortfolioPrice = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
};

// Portfolio format exactly matching your full tracker
type Holding = {
  id: string;
  amount: string;
  entryPrice: string;
  alertAbove: string;
  alertBelow: string;
};

// --- Helper Functions ---
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

// --- Custom Hook for Analytics Modal ---
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
        if (!res.ok) throw new Error("Failed to fetch proxy");
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

// --- Algorithmic Analysis Engine ---
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

  const supplyRatio = md.max_supply
    ? md.circulating_supply / md.max_supply
    : md.total_supply
      ? md.circulating_supply / md.total_supply
      : 1;

  let momentum = t?.cryptoPrices?.analysis?.neutral || "Neutral ⚖️";
  let momentumText =
    t?.cryptoPrices?.analysis?.neutralText || "The asset is consolidating.";

  if (change24 > 5) {
    momentum = t?.cryptoPrices?.analysis?.strongBullish || "Strong Bullish 🐂";
    momentumText = (
      t?.cryptoPrices?.analysis?.strongBullishText || "Up {change}%"
    )
      .replace("{change}", change24.toFixed(2))
      .replace("{high}", high24.toLocaleString());
  } else if (change24 < -5) {
    momentum = t?.cryptoPrices?.analysis?.strongBearish || "Strong Bearish 🐻";
    momentumText = (
      t?.cryptoPrices?.analysis?.strongBearishText || "Down {change}%"
    )
      .replace("{change}", Math.abs(change24).toFixed(2))
      .replace("{low}", low24.toLocaleString());
  } else if (change24 > 0) {
    momentum =
      t?.cryptoPrices?.analysis?.slightlyBullish || "Slightly Bullish 📈";
    momentumText =
      t?.cryptoPrices?.analysis?.slightlyBullishText || "Mild momentum.";
  } else if (change24 < 0) {
    momentum =
      t?.cryptoPrices?.analysis?.slightlyBearish || "Slightly Bearish 📉";
    momentumText =
      t?.cryptoPrices?.analysis?.slightlyBearishText || "Mild pressure.";
  }

  let investmentProfile =
    t?.cryptoPrices?.analysis?.speculativeFocus || "Speculative / Short-Term";
  let horizonText =
    t?.cryptoPrices?.analysis?.speculativeText || "Higher volatility.";

  if (rank <= 20) {
    investmentProfile =
      t?.cryptoPrices?.analysis?.coreAsset ||
      "Core Asset / Long-Term Potential";
    horizonText = t?.cryptoPrices?.analysis?.coreText || "Top 20 asset.";
  } else if (rank <= 100) {
    investmentProfile = t?.cryptoPrices?.analysis?.midCap || "Mid-Cap Growth";
    horizonText =
      t?.cryptoPrices?.analysis?.midCapText || "Balanced risk and growth.";
  }

  let supplyText =
    t?.cryptoPrices?.analysis?.supplyStandard || "Standard tokenomics.";
  if (supplyRatio < 0.5) {
    supplyText = (
      t?.cryptoPrices?.analysis?.supplyCaution || "Only {ratio}% circulating."
    ).replace("{ratio}", (supplyRatio * 100).toFixed(0));
  } else if (supplyRatio > 0.85) {
    supplyText = (
      t?.cryptoPrices?.analysis?.supplyFavorable || "Over {ratio}% circulating."
    ).replace("{ratio}", (supplyRatio * 100).toFixed(0));
  }

  const athText = (
    t?.cryptoPrices?.analysis?.athText || "Down {change}% from ATH ${ath}."
  )
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

// --- Main Hero Board Component ---
export default function LiveHeroBoard({
  panelTitle,
  panelNote,
  t,
  lang = "en",
}: {
  panelTitle?: string;
  panelNote?: string;
  t?: any;
  lang?: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("gainers");
  const [gainers, setGainers] = useState<CoinItem[]>([]);
  const [allCoins, setAllCoins] = useState<CoinItem[]>([]);
  const [loadingGainers, setLoadingGainers] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  // Favorites Watchlist (Local)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favSearch, setFavSearch] = useState("");

  // Synced Portfolio Tracker
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioPrices, setPortfolioPrices] = useState<PortfolioPrice[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCoinId, setNewCoinId] = useState("bitcoin");
  const [newCoinAmount, setNewCoinAmount] = useState("");
  const [newCoinEntryPrice, setNewCoinEntryPrice] = useState("");

  // Load Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("kryptonal_hero_favs");
      if (savedFavs)
        try {
          setFavorites(JSON.parse(savedFavs));
        } catch (e) {}

      // Read from the EXACT key the full tracker uses
      const savedPortfolio = localStorage.getItem("kryptonal-portfolio");
      if (savedPortfolio)
        try {
          setHoldings(JSON.parse(savedPortfolio));
        } catch (e) {}
    }

    loadHeroGainers();
    const interval = setInterval(loadHeroGainers, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Top Gainers
  async function loadHeroGainers() {
    try {
      const res = await fetch("/api/home/hero-market", { cache: "no-store" });
      const data = await res.json();
      if (data.gainers) setGainers(data.gainers);
      if (data.allCoins) setAllCoins(data.allCoins); // <-- STORE ALL 200 COINS
      setUpdatedAt(
        data.updatedAt
          ? new Date(data.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      );
    } catch {
      // Ignore
    } finally {
      setLoadingGainers(false);
    }
  }

  // Fetch Portfolio Prices (using same API as full tracker)
  useEffect(() => {
    const ids = holdings
      .map((h) => h.id)
      .filter(Boolean)
      .join(",");
    if (!ids) {
      setPortfolioPrices([]);
      return;
    }
    async function loadPortfolioPrices() {
      try {
        const res = await fetch(`/api/tools/watchlist-prices?ids=${ids}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setPortfolioPrices(json.coins || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadPortfolioPrices();
    const timer = setInterval(loadPortfolioPrices, 60000);
    return () => clearInterval(timer);
  }, [holdings]);

  // Actions
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    let updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    if (typeof window !== "undefined")
      localStorage.setItem("kryptonal_hero_favs", JSON.stringify(updated));
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoinId || !newCoinAmount || !newCoinEntryPrice) return;

    const newHolding: Holding = {
      id: newCoinId,
      amount: newCoinAmount,
      entryPrice: newCoinEntryPrice,
      alertAbove: "",
      alertBelow: "",
    };

    const updated = [...holdings, newHolding];
    setHoldings(updated);
    if (typeof window !== "undefined")
      localStorage.setItem("kryptonal-portfolio", JSON.stringify(updated));

    setNewCoinAmount("");
    setNewCoinEntryPrice("");
    setShowAddModal(false);
  };

  const removeHolding = (index: number) => {
    const updated = holdings.filter((_, i) => i !== index);
    setHoldings(updated);
    if (typeof window !== "undefined")
      localStorage.setItem("kryptonal-portfolio", JSON.stringify(updated));
  };

  // Compute Live Portfolio Metrics
  const portfolioMetrics = useMemo(() => {
    let totalInvested = 0;
    let totalCurrent = 0;
    let bestCoin = { symbol: "—", pnlPercent: -999 };
    let worstCoin = { symbol: "—", pnlPercent: 999 };

    holdings.forEach((h) => {
      const priceObj = portfolioPrices.find((p) => p.id === h.id);
      const coinDef = AVAILABLE_COINS.find((c) => c.id === h.id);
      const sym = priceObj?.symbol || coinDef?.symbol || h.id;

      const currentPrice = priceObj?.price || 0;
      const amt = parseFloat(h.amount) || 0;
      const buyPrice = parseFloat(h.entryPrice) || 0;

      const cost = amt * buyPrice;
      const val = amt * currentPrice;
      const pnlPercent =
        buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;

      totalInvested += cost;
      totalCurrent += val;

      if (cost > 0) {
        if (pnlPercent > bestCoin.pnlPercent)
          bestCoin = { symbol: sym, pnlPercent };
        if (pnlPercent < worstCoin.pnlPercent)
          worstCoin = { symbol: sym, pnlPercent };
      }
    });

    const totalProfit = totalCurrent - totalInvested;
    const totalRoi =
      totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrent,
      totalProfit,
      totalRoi,
      bestCoin,
      worstCoin,
    };
  }, [holdings, portfolioPrices]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl sm:p-4">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-4 sm:p-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">
              {panelTitle || t?.heroBoard?.title || "Live Market Radar"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {t?.heroBoard?.subtitle ||
                "Click any coin for live analysis & charts"}
            </p>
          </div>
          <span className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live {updatedAt ? `· ${updatedAt}` : ""}
          </span>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          <button
            onClick={() => setActiveTab("gainers")}
            className={`flex-1 rounded-lg py-2 font-bold transition ${activeTab === "gainers" ? "bg-emerald-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            🔥 {t?.heroBoard?.tabs?.gainers || "Top Gainers"}
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 rounded-lg py-2 font-bold transition ${activeTab === "favorites" ? "bg-emerald-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            ⭐ {t?.heroBoard?.tabs?.favorites || "Favorites"}
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 rounded-lg py-2 font-bold transition ${activeTab === "portfolio" ? "bg-emerald-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            💼 {t?.heroBoard?.tabs?.portfolio || "Portfolio"}
          </button>
        </div>

        {/* TAB 1: GAINERS */}
        {activeTab === "gainers" && (
          <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
            {loadingGainers ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
                />
              ))
            ) : gainers.length > 0 ? (
              gainers.map((coin, index) => (
                <div
                  key={coin.id}
                  onClick={() => setSelectedCoinId(coin.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-emerald-400/40 hover:bg-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {coin.image && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                          {coin.name}
                        </p>
                        <p className="text-[10px] uppercase text-slate-400">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">
                      ${coin.price ? coin.price.toLocaleString() : "—"}
                    </p>
                    <span className="inline-block rounded bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      +{coin.change24h ? coin.change24h.toFixed(2) : "0.00"}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-500">
                No gainers available.
              </p>
            )}
          </div>
        )}

        {/* TAB 2: FAVORITES */}
        {activeTab === "favorites" && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={favSearch}
              onChange={(e) => setFavSearch(e.target.value)}
              placeholder={
                t?.heroBoard?.searchPlaceholder || "Search any top 200 coin..."
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
            <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {(allCoins.length > 0 ? allCoins : gainers)
                .filter((c) => {
                  if (favSearch) {
                    return (
                      c.name.toLowerCase().includes(favSearch.toLowerCase()) ||
                      c.symbol.toLowerCase().includes(favSearch.toLowerCase())
                    );
                  }
                  return favorites.includes(c.id);
                })
                .map((coin) => {
                  const isFav = favorites.includes(coin.id);
                  return (
                    <div
                      key={coin.id}
                      onClick={() => setSelectedCoinId(coin.id)}
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-emerald-400/40 hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleFavorite(e, coin.id)}
                          className="text-sm transition hover:scale-125"
                          title={isFav ? "Unpin coin" : "Pin coin"}
                        >
                          {isFav ? "⭐" : "☆"}
                        </button>
                        <div className="flex items-center gap-2">
                          {coin.image && (
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="h-5 w-5 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                              {coin.name}
                            </p>
                            <p className="text-[10px] uppercase text-slate-400">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">
                          ${coin.price ? coin.price.toLocaleString() : "—"}
                        </p>
                        <p
                          className={`text-[10px] font-bold ${
                            coin.change24h >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {coin.change24h >= 0 ? "+" : ""}
                          {coin.change24h ? coin.change24h.toFixed(2) : "0.00"}%
                        </p>
                      </div>
                    </div>
                  );
                })}

              {favorites.length === 0 && !favSearch && (
                <div className="py-8 text-center text-xs text-slate-500">
                  {t?.heroBoard?.emptyFavs ||
                    "No favorites pinned yet. Type above to search & pin top 200 coins!"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIO */}
        {activeTab === "portfolio" && (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {t?.heroBoard?.portfolioTotal || "Portfolio Value"}
                  </p>
                  <p className="text-lg font-black text-white sm:text-xl">
                    $
                    {portfolioMetrics.totalCurrent.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {t?.heroBoard?.totalPnl || "Net P/L"}
                  </p>
                  <p
                    className={`text-sm font-bold ${portfolioMetrics.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {portfolioMetrics.totalProfit >= 0 ? "+" : ""}$
                    {portfolioMetrics.totalProfit.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    ({portfolioMetrics.totalRoi.toFixed(2)}%)
                  </p>
                </div>
              </div>
              {holdings.length > 0 &&
                portfolioMetrics.bestCoin.symbol !== "—" && (
                  <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-[10px]">
                    <p className="text-slate-400">
                      🚀 {t?.heroBoard?.best || "Best"}:{" "}
                      <span className="font-bold text-emerald-400">
                        {portfolioMetrics.bestCoin.symbol}
                      </span>
                    </p>
                    <p className="text-slate-400">
                      📉 {t?.heroBoard?.worst || "Worst"}:{" "}
                      <span className="font-bold text-red-400">
                        {portfolioMetrics.worstCoin.symbol}
                      </span>
                    </p>
                  </div>
                )}
            </div>

            <div className="max-h-[160px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {holdings.map((h, idx) => {
                const coinDef = AVAILABLE_COINS.find((c) => c.id === h.id);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-xs transition hover:border-emerald-400/40 hover:bg-white/[0.08]"
                  >
                    <div>
                      <p className="font-bold text-white">
                        {coinDef?.name || h.id}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {h.amount} @ $
                        {parseFloat(h.entryPrice).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeHolding(idx)}
                      className="text-slate-500 hover:text-red-400 text-xs p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {holdings.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-500">
                  Track your portfolio easily!
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/20"
              >
                + {t?.heroBoard?.addAsset || "Add Asset"}
              </button>
              <Link
                href={`/${lang || "en"}/tools/crypto-portfolio-tracker`}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {t?.heroBoard?.fullTracker || "Full Tracker ↗"}
              </Link>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-100">
          {panelNote ||
            t?.heroBoard?.note ||
            "Click any coin for instant analytics. Data saved privately on your device."}
        </div>
      </div>

      {/* Analytics Modal */}
      {selectedCoinId && (
        <CoinAnalyticsModal
          id={selectedCoinId}
          onClose={() => setSelectedCoinId(null)}
          t={t}
        />
      )}

      {/* Add Holding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">
              {t?.heroBoard?.addModalTitle || "Track Asset"}
            </h3>
            <form onSubmit={handleAddHolding} className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] uppercase text-slate-400">
                  Select Coin
                </label>
                <select
                  value={newCoinId}
                  onChange={(e) => setNewCoinId(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white outline-none focus:border-emerald-400"
                  required
                >
                  {AVAILABLE_COINS.map((coin) => (
                    <option
                      key={coin.id}
                      value={coin.id}
                      className="bg-slate-900"
                    >
                      {coin.name} ({coin.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400">
                  Amount Held
                </label>
                <input
                  type="number"
                  step="any"
                  value={newCoinAmount}
                  onChange={(e) => setNewCoinAmount(e.target.value)}
                  placeholder="0.5"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white outline-none focus:border-emerald-400"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400">
                  Buy Price ($)
                </label>
                <input
                  type="number"
                  step="any"
                  value={newCoinEntryPrice}
                  onChange={(e) => setNewCoinEntryPrice(e.target.value)}
                  placeholder="65000"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white outline-none focus:border-emerald-400"
                  required
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-300"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Analytics Modal Wrapper ---
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
          className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>

        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
            <p className="text-sm text-slate-400">
              {t?.modal?.loadingIntelligence || "Loading intelligence..."}
            </p>
          </div>
        ) : error || !details ? (
          <div className="flex h-72 flex-col items-center justify-center gap-2">
            <p className="text-xl font-bold text-red-400">
              {t?.modal?.unableToLoad || "Unable to load data"}
            </p>
            <p className="text-sm text-slate-400">
              {t?.modal?.apiLimitReached ||
                "The API limit was reached, or data is missing."}
            </p>
          </div>
        ) : (
          <div className="pt-2">
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
                    {details?.name}{" "}
                    <span className="text-xl uppercase text-slate-500">
                      {details?.symbol}
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Rank: #{details?.market_cap_rank || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex gap-2 rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setView("chart")}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${view === "chart" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}
              >
                {t?.modal?.priceChart || "Price Chart"}
              </button>
              <button
                onClick={() => setView("analysis")}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${view === "analysis" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}
              >
                {t?.modal?.aiAnalysis || "AI Analysis"}
              </button>
              <button
                onClick={() => setView("about")}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${view === "about" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}
              >
                {t?.modal?.aboutProject || "About Project"}
              </button>
            </div>

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
                              id="heroColorPrice2"
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
                            tickFormatter={(v) => `$${v.toLocaleString()}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                            itemStyle={{ color: "#34d399", fontWeight: "bold" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#34d399"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#heroColorPrice2)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        {t?.modal?.noChartData || "No chart data available"}
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
                </div>
              </div>
            )}

            {view === "analysis" && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
                <h3 className="mb-2 text-xl font-black">
                  {t?.modal?.trend || "Trend"}: {analysis?.momentum}
                </h3>
                <p className="mb-4 text-sm text-slate-300">
                  {analysis?.momentumText}
                </p>
                <p className="mb-4 text-sm text-slate-300">
                  {analysis?.supplyText}
                </p>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      {t?.modal?.resistanceLevel ||
                        "Resistance Level (Fib 0.618)"}
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      ${analysis?.resistanceTarget}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">
                      {t?.modal?.supportFloor || "Support Floor (Fib 0.618)"}
                    </p>
                    <p className="text-lg font-bold text-red-400">
                      ${analysis?.supportTarget}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {view === "about" && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 text-xl font-black">
                  {t?.modal?.aboutProject || "About Project"}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {cleanDescription(details?.description?.en)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
