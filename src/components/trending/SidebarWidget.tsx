// src/components/SidebarWidget.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface SidebarDict {
  liveMarket?: string;
  proTools?: string;
  exploreTools?: string;
  smartWatchlists?: string;
  advancedCalculators?: string;
  addressValidator?: string;
}

interface SidebarProps {
  dict?: SidebarDict;
  locale?: string;
}

export default function SidebarWidget({ dict, locale = "en" }: SidebarProps) {
  // Dictionary fallbacks
  const titleLiveMarket = dict?.liveMarket || "Live Market";
  const titleProTools = dict?.proTools || "Interactive Tools";
  const textExplore = dict?.exploreTools || "Explore All Tools";
  const textWatchlists = dict?.smartWatchlists || "Smart Watchlists";
  const textCalculators =
    dict?.advancedCalculators || "Advanced Crypto Calculators";
  const textValidator = dict?.addressValidator || "Wallet Address Validator";

  // State for real-time market data
  const [marketData, setMarketData] = useState({
    btc: { price: 0, change: 0 },
    eth: { price: 0, change: 0 },
    isLoading: true,
  });

  // Fetch real prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true",
        );
        const data = await res.json();

        setMarketData({
          btc: {
            price: data.bitcoin.usd,
            change: data.bitcoin.usd_24h_change,
          },
          eth: {
            price: data.ethereum.usd,
            change: data.ethereum.usd_24h_change,
          },
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch live prices:", error);
        setMarketData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchPrices();

    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Market Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{titleLiveMarket}</h3>

        <div className="space-y-4">
          {/* Bitcoin Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold">
                ₿
              </div>
              <span className="font-medium text-slate-200">BTC</span>
            </div>
            <div className="text-right">
              {marketData.isLoading ? (
                <div className="h-5 w-20 bg-white/10 animate-pulse rounded mb-1" />
              ) : (
                <div className="text-white font-semibold">
                  $
                  {marketData.btc.price.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}

              {marketData.isLoading ? (
                <div className="h-4 w-12 bg-white/10 animate-pulse rounded ml-auto" />
              ) : (
                <div
                  className={`text-sm font-medium ${
                    marketData.btc.change >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {marketData.btc.change > 0 ? "+" : ""}
                  {marketData.btc.change.toFixed(2)}%
                </div>
              )}
            </div>
          </div>

          {/* Ethereum Row */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                Ξ
              </div>
              <span className="font-medium text-slate-200">ETH</span>
            </div>
            <div className="text-right">
              {marketData.isLoading ? (
                <div className="h-5 w-20 bg-white/10 animate-pulse rounded mb-1" />
              ) : (
                <div className="text-white font-semibold">
                  $
                  {marketData.eth.price.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}

              {marketData.isLoading ? (
                <div className="h-4 w-12 bg-white/10 animate-pulse rounded ml-auto" />
              ) : (
                <div
                  className={`text-sm font-medium ${
                    marketData.eth.change >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {marketData.eth.change > 0 ? "+" : ""}
                  {marketData.eth.change.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tools Promotion Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden group">
        {/* Emerald glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 group-hover:from-emerald-500/10 transition-colors duration-500" />

        <h3 className="relative text-lg font-bold text-white mb-4 z-10">
          {titleProTools}
        </h3>

        <div className="relative z-10 space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            <span className="text-sm font-medium">{textWatchlists}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            <span className="text-sm font-medium">{textCalculators}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            <span className="text-sm font-medium">{textValidator}</span>
          </div>
        </div>

        <Link
          href={`/${locale}/tools`}
          className="relative z-10 block w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-center rounded-xl font-semibold transition-all"
        >
          {textExplore} →
        </Link>
      </div>
    </div>
  );
}
