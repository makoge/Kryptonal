import { NextResponse } from "next/server";

export const revalidate = 120;

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

function hexToGwei(hex: string) {
  const wei = parseInt(hex, 16);
  return wei / 1_000_000_000;
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

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const cgHeaders: HeadersInit = apiKey
      ? { "x-cg-demo-api-key": apiKey }
      : {};

    const [fearRes, btcFeeRes, ethGasRes, solFeeRes, coinsRes] =
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
        fetch(
          `${COINGECKO_URL}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=true&price_change_percentage=24h,7d`,
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
        value: Number(item?.value || 50),
        label: item?.value_classification || "Neutral",
      };
    }

    let btcFee = 0;

    if (btcFeeRes.status === "fulfilled" && btcFeeRes.value.ok) {
      const json = await btcFeeRes.value.json();
      btcFee = Number(json?.halfHourFee || json?.fastestFee || 0);
    }

    let ethGwei = 0;

    if (ethGasRes.status === "fulfilled" && ethGasRes.value.ok) {
      const json = await ethGasRes.value.json();
      ethGwei = hexToGwei(json?.result || "0x0");
    }

    let solFee = 0;

    if (solFeeRes.status === "fulfilled" && solFeeRes.value.ok) {
      const json = await solFeeRes.value.json();
      const fees = Array.isArray(json?.result) ? json.result : [];
      const validFees = fees
        .map((item: any) => Number(item?.prioritizationFee || 0))
        .filter((fee: number) => fee > 0);

      solFee = validFees.length
        ? validFees.reduce((sum: number, fee: number) => sum + fee, 0) /
          validFees.length
        : 0;
    }

    let coins = [];

    if (coinsRes.status === "fulfilled" && coinsRes.value.ok) {
      const json = await coinsRes.value.json();

      coins = json.map((coin: any) => {
        const change24h = Number(
          coin?.price_change_percentage_24h_in_currency || 0
        );

        return {
          id: coin.id,
          name: coin.name,
          symbol: String(coin.symbol || "").toUpperCase(),
          price: Number(coin.current_price || 0),
          change24h,
          change7d: Number(coin.price_change_percentage_7d_in_currency || 0),
          sparkline: coin?.sparkline_in_7d?.price || [],
          sentiment: sentimentScore(change24h, fearGreed.value),
          mood: getMood(change24h, fearGreed.value),
        };
      });
    }

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      fearGreed,
      gas: {
        ethGwei,
        btcSatVb: btcFee,
        solMicroLamports: solFee,
      },
      coins,
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      fearGreed: {
        value: 50,
        label: "Neutral",
      },
      gas: {
        ethGwei: 0,
        btcSatVb: 0,
        solMicroLamports: 0,
      },
      coins: [],
    });
  }
}