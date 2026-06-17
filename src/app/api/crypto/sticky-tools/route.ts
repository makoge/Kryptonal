import { NextResponse } from "next/server";

export const revalidate = 120;

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

function hexToGwei(hex: string) {
  const wei = parseInt(hex || "0x0", 16);
  return wei / 1_000_000_000;
}

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getMood(change24h: number, fearGreed: number) {
  const score = change24h * 0.7 + (fearGreed - 50) * 0.08;

  if (score >= 3) return "bullish";
  if (score <= -3) return "bearish";
  return "neutral";
}

function sentimentScore(change24h: number, fearGreed: number) {
  const score = 50 + change24h * 4 + (fearGreed - 50) * 0.4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getTrendKey(change24h: number, change7d: number) {
  if (change24h > 2 && change7d > 5) return "strongMomentum";
  if (change24h > 0 && change7d > 0) return "improving";
  if (change24h < -2 && change7d < -5) return "weak";
  if (change24h < 0) return "cooling";
  return "neutral";
}

function getGasLevel(value: number, type: "eth" | "btc" | "sol" | "bnb") {
  if (type === "eth") {
    if (value <= 5) return "cheap";
    if (value <= 25) return "normal";
    return "expensive";
  }

  if (type === "btc") {
    if (value <= 10) return "cheap";
    if (value <= 40) return "normal";
    return "expensive";
  }

  if (type === "bnb") {
    if (value <= 3) return "cheap";
    if (value <= 8) return "normal";
    return "expensive";
  }

  if (value <= 1000) return "cheap";
  if (value <= 10000) return "normal";
  return "expensive";
}

function getGasAction(level: string) {
  if (level === "cheap") return "goodTimeToTransact";
  if (level === "normal") return "normalNetworkCost";
  return "waitForCheaperFees";
}

function getBestNetworkNow(gas: {
  ethLevel: string;
  btcLevel: string;
  solLevel: string;
  bnbLevel: string;
}) {
  if (gas.solLevel === "cheap") return "solana";
  if (gas.bnbLevel === "cheap") return "bnb";
  if (gas.ethLevel === "cheap") return "ethereum";
  if (gas.btcLevel === "cheap") return "bitcoin";
  return "none";
}

function getMarketMoodSummary(args: {
  avgChange24h: number;
  avgChange7d: number;
  fearGreed: number;
}) {
  const { avgChange24h, avgChange7d, fearGreed } = args;

  if (fearGreed >= 70 && avgChange24h > 1) return "riskAppetiteStrong";
  if (fearGreed <= 30 && avgChange24h < 0) return "fearfulMarket";
  if (avgChange24h > 0 && avgChange7d > 0) return "momentumImproving";
  if (avgChange24h < 0 && avgChange7d < 0) return "marketCooling";
  return "mixedMomentum";
}

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const cgHeaders: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [fearRes, btcFeeRes, ethGasRes, solFeeRes, bnbGasRes, coinsRes] =
      await Promise.allSettled([
        fetch("https://api.alternative.me/fng/?limit=1", {
          next: { revalidate: 300 },
        }),

        fetch("https://mempool.space/api/v1/fees/recommended", {
          next: { revalidate: 120 },
        }),

        fetch("https://ethereum-rpc.publicnode.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_gasPrice",
            params: [],
            id: 1,
          }),
          next: { revalidate: 120 },
        }),

        fetch("https://api.mainnet-beta.solana.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getRecentPrioritizationFees",
            params: [],
          }),
          next: { revalidate: 120 },
        }),

        fetch("https://bsc-dataseed.binance.org", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_gasPrice",
            params: [],
            id: 1,
          }),
          next: { revalidate: 120 },
        }),

        fetch(
          `${COINGECKO_URL}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc&per_page=4&page=1&sparkline=true&price_change_percentage=24h,7d`,
          {
            headers: cgHeaders,
            next: { revalidate: 120 },
          }
        ),
      ]);

    let fearGreed = {
      value: 50,
      label: "Neutral",
    };

    if (fearRes.status === "fulfilled" && fearRes.value.ok) {
      const json = await fearRes.value.json();
      const item = json?.data?.[0];

      fearGreed = {
        value: num(item?.value || 50),
        label: item?.value_classification || "Neutral",
      };
    }

    let btcFee = 0;

    if (btcFeeRes.status === "fulfilled" && btcFeeRes.value.ok) {
      const json = await btcFeeRes.value.json();
      btcFee = num(json?.halfHourFee || json?.fastestFee || 0);
    }

    let ethGwei = 0;

    if (ethGasRes.status === "fulfilled" && ethGasRes.value.ok) {
      const json = await ethGasRes.value.json();
      ethGwei = hexToGwei(json?.result || "0x0");
    }

    let bnbGwei = 0;

    if (bnbGasRes.status === "fulfilled" && bnbGasRes.value.ok) {
      const json = await bnbGasRes.value.json();
      bnbGwei = hexToGwei(json?.result || "0x0");
    }

    let solFee = 0;

    if (solFeeRes.status === "fulfilled" && solFeeRes.value.ok) {
      const json = await solFeeRes.value.json();
      const fees = Array.isArray(json?.result) ? json.result : [];

      const validFees = fees
        .map((item: any) => num(item?.prioritizationFee || 0))
        .filter((fee: number) => fee > 0);

      solFee = validFees.length
        ? validFees.reduce((sum: number, fee: number) => sum + fee, 0) /
          validFees.length
        : 0;
    }

    let coins: any[] = [];

    if (coinsRes.status === "fulfilled" && coinsRes.value.ok) {
      const json = await coinsRes.value.json();

      coins = json.map((coin: any) => {
        const change24h = num(coin?.price_change_percentage_24h_in_currency);
        const change7d = num(coin?.price_change_percentage_7d_in_currency);

        return {
          id: coin.id,
          name: coin.name,
          symbol: String(coin.symbol || "").toUpperCase(),
          price: num(coin.current_price),
          change24h,
          change7d,
          sparkline: coin?.sparkline_in_7d?.price || [],
          sentiment: sentimentScore(change24h, fearGreed.value),
          mood: getMood(change24h, fearGreed.value),
          trendKey: getTrendKey(change24h, change7d),
        };
      });
    }

    const avgChange24h = coins.length
      ? coins.reduce((sum, coin) => sum + coin.change24h, 0) / coins.length
      : 0;

    const avgChange7d = coins.length
      ? coins.reduce((sum, coin) => sum + coin.change7d, 0) / coins.length
      : 0;

    const ethLevel = getGasLevel(ethGwei, "eth");
    const btcLevel = getGasLevel(btcFee, "btc");
    const solLevel = getGasLevel(solFee, "sol");
    const bnbLevel = getGasLevel(bnbGwei, "bnb");

    const gas = {
      ethGwei,
      btcSatVb: btcFee,
      solMicroLamports: solFee,
      bnbGwei,

      ethLevel,
      btcLevel,
      solLevel,
      bnbLevel,

      actions: {
        ethereum: getGasAction(ethLevel),
        bitcoin: getGasAction(btcLevel),
        solana: getGasAction(solLevel),
        bnb: getGasAction(bnbLevel),
      },
    };

    return NextResponse.json({
      updatedAt: new Date().toISOString(),

      marketMood: {
        key: getMood(avgChange24h, fearGreed.value),
        score: sentimentScore(avgChange24h, fearGreed.value),
        summaryKey: getMarketMoodSummary({
          avgChange24h,
          avgChange7d,
          fearGreed: fearGreed.value,
        }),
      },

      fearGreed,

      gas,

      bestNetworkNow: getBestNetworkNow({
        ethLevel,
        btcLevel,
        solLevel,
        bnbLevel,
      }),

      coins,

      sources: {
        fearGreed: fearRes.status === "fulfilled" && fearRes.value.ok,
        btcFees: btcFeeRes.status === "fulfilled" && btcFeeRes.value.ok,
        ethGas: ethGasRes.status === "fulfilled" && ethGasRes.value.ok,
        solFees: solFeeRes.status === "fulfilled" && solFeeRes.value.ok,
        bnbGas: bnbGasRes.status === "fulfilled" && bnbGasRes.value.ok,
        coins: coinsRes.status === "fulfilled" && coinsRes.value.ok,
      },
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),

      marketMood: {
        key: "neutral",
        score: 50,
        summaryKey: "mixedMomentum",
      },

      fearGreed: {
        value: 50,
        label: "Neutral",
      },

      gas: {
        ethGwei: 0,
        btcSatVb: 0,
        solMicroLamports: 0,
        bnbGwei: 0,

        ethLevel: "normal",
        btcLevel: "normal",
        solLevel: "normal",
        bnbLevel: "normal",

        actions: {
          ethereum: "normalNetworkCost",
          bitcoin: "normalNetworkCost",
          solana: "normalNetworkCost",
          bnb: "normalNetworkCost",
        },
      },

      bestNetworkNow: "none",
      coins: [],

      sources: {
        fearGreed: false,
        btcFees: false,
        ethGas: false,
        solFees: false,
        bnbGas: false,
        coins: false,
      },
    });
  }
}