import { NextResponse } from "next/server";

export const revalidate = 60;

const COINS: Record<string, { name: string; symbol: string; key: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC", key: "coingecko:bitcoin" },
  ethereum: { name: "Ethereum", symbol: "ETH", key: "coingecko:ethereum" },
  solana: { name: "Solana", symbol: "SOL", key: "coingecko:solana" },
  binancecoin: { name: "BNB", symbol: "BNB", key: "coingecko:binancecoin" },
  ripple: { name: "XRP", symbol: "XRP", key: "coingecko:ripple" },
  cardano: { name: "Cardano", symbol: "ADA", key: "coingecko:cardano" },
  litecoin: { name: "Litecoin", symbol: "LTC", key: "coingecko:litecoin" },
  chainlink: { name: "Chainlink", symbol: "LINK", key: "coingecko:chainlink" },
  polkadot: { name: "Polkadot", symbol: "DOT", key: "coingecko:polkadot" },
  avalanche: { name: "Avalanche", symbol: "AVAX", key: "coingecko:avalanche-2" },
  tron: { name: "TRON", symbol: "TRX", key: "coingecko:tron" },
  stellar: { name: "Stellar", symbol: "XLM", key: "coingecko:stellar" },
  bitcoinCash: { name: "Bitcoin Cash", symbol: "BCH", key: "coingecko:bitcoin-cash" },
  monero: { name: "Monero", symbol: "XMR", key: "coingecko:monero" },
 shiba: { name: "Shiba Inu", symbol: "SHIB", key: "coingecko:shiba-inu" },
 pepe: { name: "Pepe", symbol: "PEPE", key: "coingecko:pepe" },
 dogecoin: { name: "Dogecoin", symbol: "DOGE", key: "coingecko:dogecoin" },
 floki: { name: "FLOKI", symbol: "FLOKI", key: "coingecko:floki" },
 kaito: {
  name: "Kaito",
  symbol: "KAITO",
  key: "coingecko:kaito"
},

worldcoin: {
  name: "Worldcoin",
  symbol: "WLD",
  key: "coingecko:worldcoin-wld"
},

mubarak: {
  name: "Mubarak",
  symbol: "MUBARAK",
  key: "coingecko:mubarak"
},

bonk: {
  name: "Bonk",
  symbol: "BONK",
  key: "coingecko:bonk"
},
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) || [];

    const selected = ids
      .filter((id) => COINS[id])
      .map((id) => ({ id, ...COINS[id] }));

    if (selected.length === 0) {
      return NextResponse.json({ coins: [] });
    }

    const llamaKeys = selected.map((coin) => coin.key).join(",");

    const res = await fetch(
      `https://coins.llama.fi/prices/current/${llamaKeys}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("DefiLlama price API failed");

    const json = await res.json();

    const coins = selected.map((coin) => {
      const data = json?.coins?.[coin.key];

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: Number(data?.price || 0),
      };
    });

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      coins,
    });
  } catch {
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), coins: [] },
      { status: 200 }
    );
  }
}