// src/app/api/tools/crypto-roi/route.ts

import { NextResponse } from "next/server";

export const revalidate = 300;

const COINS: Record<string, string> = {
  bitcoin: "coingecko:bitcoin",
  ethereum: "coingecko:ethereum",
  solana: "coingecko:solana",
  binancecoin: "coingecko:binancecoin",
  ripple: "coingecko:ripple",
  cardano: "coingecko:cardano",
  dogecoin: "coingecko:dogecoin",
  litecoin: "coingecko:litecoin",
  chainlink: "coingecko:chainlink",
  polkadot: "coingecko:polkadot",
  avalanche: "coingecko:avalanche-2",
  tron: "coingecko:tron",
  stellar: "coingecko:stellar",
  bitcoinCash: "coingecko:bitcoin-cash",
  monero: "coingecko:monero",
  shiba: "coingecko:shiba-inu",
  pepe: "coingecko:pepe",
  floki: "coingecko:floki"
};

function toUnix(date: string) {
  return Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const coin = searchParams.get("coin") || "bitcoin";
    const date = searchParams.get("date") || "2020-01-01";

    const coinKey = COINS[coin] || COINS.bitcoin;
    const timestamp = toUnix(date);

    const [currentRes, historicalRes] = await Promise.all([
      fetch(`https://coins.llama.fi/prices/current/${coinKey}`, {
        next: { revalidate: 300 },
      }),
      fetch(`https://coins.llama.fi/prices/historical/${timestamp}/${coinKey}`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!currentRes.ok || !historicalRes.ok) {
      throw new Error("DefiLlama price API failed");
    }

    const currentJson = await currentRes.json();
    const historicalJson = await historicalRes.json();

    const currentPrice = Number(currentJson?.coins?.[coinKey]?.price || 0);
    const historicalPrice = Number(historicalJson?.coins?.[coinKey]?.price || 0);

    return NextResponse.json({
      coin,
      currentPrice,
      historicalPrice,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        currentPrice: 0,
        historicalPrice: 0,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}