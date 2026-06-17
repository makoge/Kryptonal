// src/app/api/tools/crypto-roi/route.ts

import { NextResponse } from "next/server";

export const revalidate = 300;

const COINS: Record<
  string,
  { name: string; symbol: string; llamaKey: string; geckoId: string }
> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC", llamaKey: "coingecko:bitcoin", geckoId: "bitcoin" },
  ethereum: { name: "Ethereum", symbol: "ETH", llamaKey: "coingecko:ethereum", geckoId: "ethereum" },
  solana: { name: "Solana", symbol: "SOL", llamaKey: "coingecko:solana", geckoId: "solana" },
  binancecoin: { name: "BNB", symbol: "BNB", llamaKey: "coingecko:binancecoin", geckoId: "binancecoin" },
  ripple: { name: "XRP", symbol: "XRP", llamaKey: "coingecko:ripple", geckoId: "ripple" },
  cardano: { name: "Cardano", symbol: "ADA", llamaKey: "coingecko:cardano", geckoId: "cardano" },
  dogecoin: { name: "Dogecoin", symbol: "DOGE", llamaKey: "coingecko:dogecoin", geckoId: "dogecoin" },
  shiba: { name: "Shiba Inu", symbol: "SHIB", llamaKey: "coingecko:shiba-inu", geckoId: "shiba-inu" },
  pepe: { name: "Pepe", symbol: "PEPE", llamaKey: "coingecko:pepe", geckoId: "pepe" },
  floki: { name: "FLOKI", symbol: "FLOKI", llamaKey: "coingecko:floki", geckoId: "floki" },
};

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toUnix(date: string) {
  const time = new Date(`${date}T00:00:00Z`).getTime();
  return Number.isFinite(time) ? Math.floor(time / 1000) : 0;
}

function pct(now: number, old: number) {
  return old > 0 ? ((now - old) / old) * 100 : 0;
}

function calcMaxDrawdown(values: number[]) {
  if (!values.length) return 0;

  let peak = values[0];
  let maxDrawdown = 0;

  for (const value of values) {
    if (value > peak) peak = value;

    if (peak > 0) {
      const drawdown = ((value - peak) / peak) * 100;
      if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

function normalizePrices(json: any): [number, number][] {
  return Array.isArray(json?.prices)
    ? json.prices
        .map((p: any): [number, number] => [num(p[0]), num(p[1])])
      .filter((item: [number, number]) => item[1] > 0)
  : [];
}

function buildDca(
  prices: [number, number][],
  contribution: number,
  frequency: string,
  fromUnix: number,
  toUnix: number
) {
  if (!prices.length || contribution <= 0) {
    return {
      totalInvested: 0,
      coinsAccumulated: 0,
      averageBuyPrice: 0,
      buyCount: 0,
      buys: [],
    };
  }

  const sortedPrices = [...prices].sort((a, b) => a[0] - b[0]);
  const intervalDays = frequency === "monthly" ? 30 : 7;

  let buyTime = fromUnix * 1000;
  const endTime = toUnix * 1000;

  let totalInvested = 0;
  let coinsAccumulated = 0;

  const buys: {
    date: string;
    price: number;
    contribution: number;
    coins: number;
  }[] = [];

  while (buyTime <= endTime) {
    const nearest = sortedPrices.find(([time]) => time >= buyTime);

    if (nearest) {
      const [timestamp, price] = nearest;

      if (price > 0) {
        const coins = contribution / price;

        totalInvested += contribution;
        coinsAccumulated += coins;

        buys.push({
          date: new Date(timestamp).toISOString().slice(0, 10),
          price,
          contribution,
          coins,
        });
      }
    }

    buyTime += intervalDays * 86_400_000;
  }

  return {
    totalInvested,
    coinsAccumulated,
    averageBuyPrice:
      coinsAccumulated > 0 ? totalInvested / coinsAccumulated : 0,
    buyCount: buys.length,
    buys,
  };
}

function getRealityLevel(multiple: number) {
  if (multiple >= 100) return "extreme";
  if (multiple >= 25) return "veryHard";
  if (multiple >= 10) return "hard";
  if (multiple >= 3) return "possibleButDifficult";
  return "closer";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const coinId = searchParams.get("coin") || "bitcoin";
    const date = searchParams.get("date") || "2020-01-01";
    const mode = searchParams.get("mode") === "dca" ? "dca" : "lumpSum";
    const frequency = searchParams.get("frequency") === "monthly" ? "monthly" : "weekly";

    const investment = Math.max(0, num(searchParams.get("investment") || 1000));
    const contribution = Math.max(0, num(searchParams.get("contribution") || investment));
    const futurePrice = Math.max(0, num(searchParams.get("futurePrice") || 0));
    const targetPrice = Math.max(0, num(searchParams.get("targetPrice") || 1));

    const coin = COINS[coinId] || COINS.bitcoin;
    const from = toUnix(date);
    const to = Math.floor(Date.now() / 1000);

    if (!from || from >= to) {
      return NextResponse.json({ error: true, reason: "invalid_date" });
    }

    const [
      currentRes,
      historicalRes,
      rangeRes,
      marketRes,
      btcCurrentRes,
      btcHistoricalRes,
      btcRangeRes,
    ] = await Promise.all([
      fetch(`https://coins.llama.fi/prices/current/${coin.llamaKey}`, {
        next: { revalidate: 300 },
      }),
      fetch(`https://coins.llama.fi/prices/historical/${from}/${coin.llamaKey}`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.geckoId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin.geckoId}`,
        { next: { revalidate: 300 } }
      ),
      fetch(`https://coins.llama.fi/prices/current/coingecko:bitcoin`, {
        next: { revalidate: 300 },
      }),
      fetch(`https://coins.llama.fi/prices/historical/${from}/coingecko:bitcoin`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!currentRes.ok || !historicalRes.ok) {
      throw new Error("Price API failed");
    }

    const currentJson = await currentRes.json();
    const historicalJson = await historicalRes.json();
    const rangeJson = rangeRes.ok ? await rangeRes.json() : {};
    const marketJson = marketRes.ok ? await marketRes.json() : [];
    const btcCurrentJson = btcCurrentRes.ok ? await btcCurrentRes.json() : {};
    const btcHistoricalJson = btcHistoricalRes.ok ? await btcHistoricalRes.json() : {};
    const btcRangeJson = btcRangeRes.ok ? await btcRangeRes.json() : {};

    const currentPrice = num(currentJson?.coins?.[coin.llamaKey]?.price);
    const historicalPrice = num(historicalJson?.coins?.[coin.llamaKey]?.price);

    const btcCurrentPrice = num(btcCurrentJson?.coins?.["coingecko:bitcoin"]?.price);
    const btcHistoricalPrice = num(
      btcHistoricalJson?.coins?.["coingecko:bitcoin"]?.price
    );

    const prices = normalizePrices(rangeJson);

    const fallbackPrices: [number, number][] =
  prices.length > 0
    ? prices
    : [[from * 1000, historicalPrice]];

    const btcPrices = normalizePrices(btcRangeJson);

    const lumpCoins = historicalPrice > 0 ? investment / historicalPrice : 0;
    const lumpCurrentValue = lumpCoins * currentPrice;

    const dca = buildDca(fallbackPrices, contribution, frequency, from, to);
    const dcaCurrentValue = dca.coinsAccumulated * currentPrice;

    const activeInvested = mode === "dca" ? dca.totalInvested : investment;
    const activeCoins = mode === "dca" ? dca.coinsAccumulated : lumpCoins;
    const activeCurrentValue = activeCoins * currentPrice;
    const activeProfit = activeCurrentValue - activeInvested;
    const activeProfitPct = pct(activeCurrentValue, activeInvested);
    const activeMultiple =
      activeInvested > 0 ? activeCurrentValue / activeInvested : 0;

    const activeFutureValue = futurePrice > 0 ? activeCoins * futurePrice : 0;
    const activeFutureProfit = activeFutureValue - activeInvested;
    const activeFutureProfitPct = pct(activeFutureValue, activeInvested);

    const timeline = fallbackPrices.map(([time, price]: [number, number]) => {
      let value = 0;

      if (mode === "dca") {
        const coinsUntilDate = dca.buys
          .filter((buy) => new Date(buy.date).getTime() <= time)
          .reduce((sum, buy) => sum + buy.coins, 0);

        value = coinsUntilDate * price;
      } else {
        value = lumpCoins * price;
      }

      return {
        date: new Date(time).toISOString().slice(0, 10),
        price,
        value,
      };
    });

    const values = timeline.map((p) => p.value).filter((v) => v > 0);
    const maxValue = values.length ? Math.max(...values) : activeCurrentValue;
    const minValue = values.length ? Math.min(...values) : activeCurrentValue;
    const maxDrawdown = calcMaxDrawdown(values);

    const btcDca = buildDca(btcPrices, contribution, frequency, from, to);
    const btcLumpCoins = btcHistoricalPrice > 0 ? investment / btcHistoricalPrice : 0;

    const btcValue =
      mode === "dca"
        ? btcDca.coinsAccumulated * btcCurrentPrice
        : btcLumpCoins * btcCurrentPrice;

    const cashValue = activeInvested;

    const market = Array.isArray(marketJson) ? marketJson[0] : {};
    const circulatingSupply = num(market?.circulating_supply);
    const currentMarketCap = num(market?.market_cap);

    const targetMarketCap = targetPrice * circulatingSupply;
    const marketCapMultiple =
      currentMarketCap > 0 ? targetMarketCap / currentMarketCap : 0;
    const priceMultiple = currentPrice > 0 ? targetPrice / currentPrice : 0;

    return NextResponse.json({
      coin: {
        id: coinId,
        name: coin.name,
        symbol: coin.symbol,
      },

      mode,
      frequency,
      date,

      investment,
      contribution,
      investedAmount: activeInvested,

      currentPrice,
      historicalPrice,

      coinsBought: activeCoins,
      currentValue: activeCurrentValue,
      profit: activeProfit,
      profitPct: activeProfitPct,
      multiple: activeMultiple,

      futurePrice,
      futureValue: activeFutureValue,
      futureProfit: activeFutureProfit,
      futureProfitPct: activeFutureProfitPct,

      maxValue,
      minValue,
      maxDrawdown,

      lumpSum: {
        invested: investment,
        coinsBought: lumpCoins,
        currentValue: lumpCurrentValue,
        profit: lumpCurrentValue - investment,
        profitPct: pct(lumpCurrentValue, investment),
      },

      dca: {
        totalInvested: dca.totalInvested,
        coinsAccumulated: dca.coinsAccumulated,
        averageBuyPrice: dca.averageBuyPrice,
        currentValue: dcaCurrentValue,
        profit: dcaCurrentValue - dca.totalInvested,
        profitPct: pct(dcaCurrentValue, dca.totalInvested),
        buyCount: dca.buys.length,
      },

      comparison: {
        cashValue,
        btcValue,
        selectedCoinValue: activeCurrentValue,
      },

      targetReality: {
        targetPrice,
        circulatingSupply,
        currentMarketCap,
        targetMarketCap,
        marketCapMultiple,
        priceMultiple,
        realityLevel: getRealityLevel(marketCapMultiple),
      },

      timeline: timeline.slice(-365),
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        error: true,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}