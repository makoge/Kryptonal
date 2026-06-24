import { NextResponse } from "next/server";

export const revalidate = 60;

const COINS: Record<string, { name: string; symbol: string; key: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC", key: "coingecko:bitcoin" },
  ethereum: { name: "Ethereum", symbol: "ETH", key: "coingecko:ethereum" },
  solana: { name: "Solana", symbol: "SOL", key: "coingecko:solana" },
  binancecoin: { name: "BNB", symbol: "BNB", key: "coingecko:binancecoin" },
  ripple: { name: "XRP", symbol: "XRP", key: "coingecko:ripple" },
  cardano: { name: "Cardano", symbol: "ADA", key: "coingecko:cardano" },
  dogecoin: { name: "Dogecoin", symbol: "DOGE", key: "coingecko:dogecoin" },
  tron: { name: "TRON", symbol: "TRX", key: "coingecko:tron" },
  chainlink: { name: "Chainlink", symbol: "LINK", key: "coingecko:chainlink" },
  avalanche: {
    name: "Avalanche",
    symbol: "AVAX",
    key: "coingecko:avalanche-2",
  },
  polkadot: { name: "Polkadot", symbol: "DOT", key: "coingecko:polkadot" },
  polygon: {
    name: "Polygon",
    symbol: "POL",
    key: "coingecko:polygon-ecosystem-token",
  },
  litecoin: { name: "Litecoin", symbol: "LTC", key: "coingecko:litecoin" },
  bitcoinCash: {
    name: "Bitcoin Cash",
    symbol: "BCH",
    key: "coingecko:bitcoin-cash",
  },
  stellar: { name: "Stellar", symbol: "XLM", key: "coingecko:stellar" },
  monero: { name: "Monero", symbol: "XMR", key: "coingecko:monero" },

  arbitrum: { name: "Arbitrum", symbol: "ARB", key: "coingecko:arbitrum" },
  optimism: { name: "Optimism", symbol: "OP", key: "coingecko:optimism" },
  render: { name: "Render", symbol: "RENDER", key: "coingecko:render-token" },
  near: { name: "NEAR Protocol", symbol: "NEAR", key: "coingecko:near" },
  aptos: { name: "Aptos", symbol: "APT", key: "coingecko:aptos" },
  sui: { name: "Sui", symbol: "SUI", key: "coingecko:sui" },
  injective: {
    name: "Injective",
    symbol: "INJ",
    key: "coingecko:injective-protocol",
  },
  cosmos: { name: "Cosmos", symbol: "ATOM", key: "coingecko:cosmos" },
  internetComputer: {
    name: "Internet Computer",
    symbol: "ICP",
    key: "coingecko:internet-computer",
  },

  uniswap: { name: "Uniswap", symbol: "UNI", key: "coingecko:uniswap" },
  aave: { name: "Aave", symbol: "AAVE", key: "coingecko:aave" },
  maker: { name: "Maker", symbol: "MKR", key: "coingecko:maker" },
  lido: { name: "Lido DAO", symbol: "LDO", key: "coingecko:lido-dao" },
  curve: { name: "Curve DAO", symbol: "CRV", key: "coingecko:curve-dao-token" },
  pendle: { name: "Pendle", symbol: "PENDLE", key: "coingecko:pendle" },
  etherfi: { name: "Ether.fi", symbol: "ETHFI", key: "coingecko:ether-fi" },
  eigenlayer: {
    name: "EigenLayer",
    symbol: "EIGEN",
    key: "coingecko:eigenlayer",
  },

  immutable: { name: "Immutable", symbol: "IMX", key: "coingecko:immutable-x" },
  gala: { name: "Gala", symbol: "GALA", key: "coingecko:gala" },
  ronin: { name: "Ronin", symbol: "RON", key: "coingecko:ronin" },
  beam: { name: "Beam", symbol: "BEAM", key: "coingecko:beam-2" },
  sandbox: {
    name: "The Sandbox",
    symbol: "SAND",
    key: "coingecko:the-sandbox",
  },
  decentraland: {
    name: "Decentraland",
    symbol: "MANA",
    key: "coingecko:decentraland",
  },

  fetchai: {
    name: "Artificial Superintelligence Alliance",
    symbol: "FET",
    key: "coingecko:fetch-ai",
  },
  bittensor: { name: "Bittensor", symbol: "TAO", key: "coingecko:bittensor" },
  akash: {
    name: "Akash Network",
    symbol: "AKT",
    key: "coingecko:akash-network",
  },
  grass: { name: "Grass", symbol: "GRASS", key: "coingecko:grass" },
  virtuals: {
    name: "Virtuals Protocol",
    symbol: "VIRTUAL",
    key: "coingecko:virtual-protocol",
  },
  kaito: { name: "Kaito", symbol: "KAITO", key: "coingecko:kaito" },
  worldcoin: {
    name: "Worldcoin",
    symbol: "WLD",
    key: "coingecko:worldcoin-wld",
  },

  dogwifhat: { name: "dogwifhat", symbol: "WIF", key: "coingecko:dogwifcoin" },
  bonk: { name: "Bonk", symbol: "BONK", key: "coingecko:bonk" },
  pepe: { name: "Pepe", symbol: "PEPE", key: "coingecko:pepe" },
  shiba: { name: "Shiba Inu", symbol: "SHIB", key: "coingecko:shiba-inu" },
  floki: { name: "FLOKI", symbol: "FLOKI", key: "coingecko:floki" },
  mubarak: { name: "Mubarak", symbol: "MUBARAK", key: "coingecko:mubarak" },

  tether: { name: "Tether", symbol: "USDT", key: "coingecko:tether" },
  usdCoin: { name: "USDC", symbol: "USDC", key: "coingecko:usd-coin" },
  dai: { name: "Dai", symbol: "DAI", key: "coingecko:dai" },
};

const CATEGORIES: Record<string, string> = {
  bitcoin: "Bitcoin",

  ethereum: "Layer 1",
  solana: "Layer 1",
  cardano: "Layer 1",
  avalanche: "Layer 1",
  near: "Layer 1",
  aptos: "Layer 1",
  sui: "Layer 1",

  arbitrum: "Layer 2",
  optimism: "Layer 2",
  polygon: "Layer 2",

  chainlink: "Infrastructure",
  render: "AI",
  fetchai: "AI",
  bittensor: "AI",
  akash: "AI",
  grass: "AI",
  virtuals: "AI",
  kaito: "AI",
  worldcoin: "AI",

  immutable: "Gaming",
  gala: "Gaming",
  ronin: "Gaming",
  beam: "Gaming",
  sandbox: "Gaming",
  decentraland: "Gaming",

  uniswap: "DeFi",
  aave: "DeFi",
  maker: "DeFi",
  curve: "DeFi",
  pendle: "DeFi",
  lido: "DeFi",
  etherfi: "DeFi",
  eigenlayer: "DeFi",

  dogecoin: "Meme",
  pepe: "Meme",
  bonk: "Meme",
  dogwifhat: "Meme",
  floki: "Meme",
  shiba: "Meme",
  mubarak: "Meme",

  tether: "Stablecoin",
  usdCoin: "Stablecoin",
  dai: "Stablecoin",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const ids =
      searchParams
        .get("ids")
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .slice(0, 100) || [];

    const selected = ids
      .filter((id) => COINS[id])
      .map((id) => ({ id, ...COINS[id] }));

    if (!selected.length) {
      return NextResponse.json({
        updatedAt: new Date().toISOString(),
        coins: [],
      });
    }

    const llamaKeys = selected.map((coin) => coin.key).join(",");

    const res = await fetch(
      `https://coins.llama.fi/prices/current/${llamaKeys}`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) throw new Error("Price API failed");

    const json = await res.json();

    const coins = selected.map((coin) => {
      const data = json?.coins?.[coin.key];

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        category: CATEGORIES[coin.id] || "Other",
        price: Number(data?.price || 0),
        change24h: Number(data?.priceChange24h || 0),
        timestamp: data?.timestamp || null,
      };
    });

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      coins,
    });
  } catch {
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      coins: [],
    });
  }
}
