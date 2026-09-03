import { NextResponse } from "next/server";

export const revalidate = 120;

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

// --- IN-MEMORY CACHE ---
let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds
// -----------------------

function hexToGwei(hex: string) {
  const wei = parseInt(hex || "0x0", 16);
  return wei / 1_000_000_000;
}

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
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

function getBestNetworkNow(gas: {
  ethGwei: number;
  btcSatVb: number;
  solMicroLamports: number;
  bnbGwei: number;
  ethUsd: number;
  btcUsd: number;
  solUsd: number;
  bnbUsd: number;
}) {
  // 1. Ethereum Opportunity: Under 6 Gwei is an exceptional window for on-chain DeFi / NFT transfers
  if (gas.ethGwei > 0 && gas.ethGwei <= 6) {
    return {
      network: "ethereum",
      statusKey: "ethDiscount",
      tag: "DeFi Fee Discount",
    };
  }

  // 2. Bitcoin Opportunity: Mempool is clear (< 8 sat/vB), ideal for on-chain transfers
  if (gas.btcSatVb > 0 && gas.btcSatVb <= 8) {
    return {
      network: "bitcoin",
      statusKey: "btcClear",
      tag: "Mempool Clear",
    };
  }

  // 3. BNB Chain Opportunity: Sub-2 Gwei
  if (gas.bnbGwei > 0 && gas.bnbGwei <= 2) {
    return {
      network: "bnb",
      statusKey: "bnbLow",
      tag: "Ultra-Low Fees",
    };
  }

  // 4. Default: Solana provides the lowest cost baseline
  return {
    network: "solana",
    statusKey: "solanaOptimal",
    tag: "Lowest Base Cost",
  };
}

export async function GET() {
  try {
    // 1. RAM Cache check
    if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
      return NextResponse.json(cachedData);
    }

    const apiKey = process.env.COINGECKO_API_KEY;
    const cgHeaders: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [fearRes, btcFeeRes, ethGasRes, solFeeRes, bnbGasRes, coinsRes] =
      await Promise.allSettled([
        fetch("https://api.alternative.me/fng/?limit=1", {
          cache: "no-store",
        }),

        fetch("https://mempool.space/api/v1/fees/recommended", {
          cache: "no-store",
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
          cache: "no-store",
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
          cache: "no-store",
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
          cache: "no-store",
        }),

        fetch(
          `${COINGECKO_URL}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc&per_page=4&page=1&sparkline=true&price_change_percentage=24h,7d`,
          {
            headers: cgHeaders,
            cache: "no-store",
          },
        ),
      ]);

    // Parse Fear & Greed
    let fearGreed = { value: 50, label: "Neutral" };
    if (fearRes.status === "fulfilled" && fearRes.value.ok) {
      const json = await fearRes.value.json();
      const item = json?.data?.[0];
      fearGreed = {
        value: num(item?.value || 50),
        label: item?.value_classification || "Neutral",
      };
    }

    // Parse Bitcoin Fee (sat/vB)
    let btcSatVb = 0;
    if (btcFeeRes.status === "fulfilled" && btcFeeRes.value.ok) {
      const json = await btcFeeRes.value.json();
      btcSatVb = num(json?.halfHourFee || json?.fastestFee || 15);
    }

    // Parse Ethereum Gas (Gwei)
    let ethGwei = 0;
    if (ethGasRes.status === "fulfilled" && ethGasRes.value.ok) {
      const json = await ethGasRes.value.json();
      ethGwei = hexToGwei(json?.result || "0x0");
    }

    // Parse BNB Gas (Gwei)
    let bnbGwei = 0;
    if (bnbGasRes.status === "fulfilled" && bnbGasRes.value.ok) {
      const json = await bnbGasRes.value.json();
      bnbGwei = hexToGwei(json?.result || "0x0");
    }

    // Parse Solana Fee (microLamports)
    let solMicroLamports = 0;
    if (solFeeRes.status === "fulfilled" && solFeeRes.value.ok) {
      const json = await solFeeRes.value.json();
      const fees = Array.isArray(json?.result) ? json.result : [];
      const validFees = fees
        .map((item: any) => num(item?.prioritizationFee || 0))
        .filter((fee: number) => fee > 0);

      solMicroLamports = validFees.length
        ? validFees.reduce((sum: number, fee: number) => sum + fee, 0) /
          validFees.length
        : 0;
    }

    // Parse Coins & Live Prices
    let coins: any[] = [];
    const priceMap: Record<string, number> = {
      BTC: 0,
      ETH: 0,
      SOL: 0,
      BNB: 0,
    };

    if (coinsRes.status === "fulfilled" && coinsRes.value.ok) {
      const json = await coinsRes.value.json();

      coins = json.map((coin: any) => {
        const change24h = num(coin?.price_change_percentage_24h_in_currency);
        const change7d = num(coin?.price_change_percentage_7d_in_currency);
        const symbol = String(coin.symbol || "").toUpperCase();
        const price = num(coin.current_price);

        if (priceMap[symbol] !== undefined) {
          priceMap[symbol] = price;
        }

        return {
          id: coin.id,
          name: coin.name,
          symbol,
          price,
          change24h,
          change7d,
          sparkline: coin?.sparkline_in_7d?.price || [],
          sentiment: sentimentScore(change24h, fearGreed.value),
          trendKey: getTrendKey(change24h, change7d),
        };
      });
    }

    // 🚀 DYNAMIC LIVE USD CALCULATIONS
    // 1. Ethereum: (Gwei * 1e-9) * 21,000 gas * live ETH price
    const ethUsd =
      ethGwei > 0 && priceMap.ETH > 0
        ? ethGwei * 1e-9 * 21_000 * priceMap.ETH
        : 0;

    // 2. Bitcoin: (sat/vB * 140 vB) * (live BTC price / 100,000,000 sats)
    const btcUsd =
      btcSatVb > 0 && priceMap.BTC > 0
        ? (btcSatVb * 140 * priceMap.BTC) / 100_000_000
        : 0;

    // 3. Solana: Base fee (5,000 lamports) + prioritization fee in SOL * live SOL price
    const solLamports = 5000 + solMicroLamports / 1_000_000;
    const solUsd =
      priceMap.SOL > 0 ? (solLamports / 1_000_000_000) * priceMap.SOL : 0.0008;

    // 4. BNB Chain: (Gwei * 1e-9) * 21,000 gas * live BNB price
    const bnbUsd =
      bnbGwei > 0 && priceMap.BNB > 0
        ? bnbGwei * 1e-9 * 21_000 * priceMap.BNB
        : 0;

    const gas = {
      ethUsd,
      btcUsd,
      solUsd,
      bnbUsd,
      ethGwei,
      btcSatVb,
      solMicroLamports,
      bnbGwei,
    };

    const bestOpportunity = getBestNetworkNow(gas);

    cachedData = {
      updatedAt: new Date().toISOString(),
      fearGreed,
      gas,
      bestOpportunity,
      bestNetworkNow: bestOpportunity.network,
      coins,
    };

    return NextResponse.json(cachedData);
  } catch (error) {
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        fearGreed: { value: 50, label: "Neutral" },
        gas: { ethUsd: 0, btcUsd: 0, solUsd: 0, bnbUsd: 0 },
        bestNetworkNow: "none",
        coins: [],
      },
      { status: 200 },
    );
  }
}
