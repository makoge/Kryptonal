// src/lib/gaming/getGamingEcosystems.ts

export type GamingEcosystem = {
  id: string;
  name: string;
  token: string;
  coinGeckoId: string;
  chain: string;
  category: string;
  description: string;
  howToStart: string[];
  advantages: string[];
  risks: string[];
  games: string[];
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
};

const ECOSYSTEMS = [
  {
    id: "ronin",
    name: "Ronin",
    token: "RON",
    coinGeckoId: "ronin",
    chain: "Ronin",
    category: "Gaming Chain",
    description:
      "Ronin is a gaming-focused blockchain known for Axie Infinity, Pixels, Apeiron, and other play-to-earn style games.",
    howToStart: [
      "Create a Ronin Wallet",
      "Fund the wallet with RON or supported assets",
      "Connect your wallet to a Ronin game",
      "Start playing, earning, trading, or exploring game assets",
    ],
    advantages: [
      "Strong gaming community",
      "Low-cost gaming transactions",
      "Popular Web3 games already live",
    ],
    risks: [
      "Game rewards can change",
      "Token price can be volatile",
      "Some games require time or capital to progress",
    ],
    games: ["Pixels", "Axie Infinity", "Apeiron", "The Machines Arena"],
  },
  {
    id: "immutable",
    name: "Immutable",
    token: "IMX",
    coinGeckoId: "immutable-x",
    chain: "Immutable",
    category: "Gaming Infrastructure",
    description:
      "Immutable is a Web3 gaming ecosystem built for NFT games, digital ownership, and scalable game economies.",
    howToStart: [
      "Create a wallet supported by Immutable",
      "Choose a game in the Immutable ecosystem",
      "Connect wallet and create your player profile",
      "Explore games, NFTs, quests, and marketplaces",
    ],
    advantages: [
      "Large Web3 gaming ecosystem",
      "Strong NFT gaming infrastructure",
      "Many upcoming and live games",
    ],
    risks: [
      "Some games are still early",
      "NFT demand can rise and fall",
      "Gaming adoption may take time",
    ],
    games: ["Illuvium", "Gods Unchained", "Guild of Guardians", "Ember Sword"],
  },
  {
    id: "floki",
    name: "FLOKI / Valhalla",
    token: "FLOKI",
    coinGeckoId: "floki",
    chain: "Ethereum / BNB Chain",
    category: "Metaverse Game",
    description:
      "FLOKI’s gaming ecosystem is centered around Valhalla, a metaverse-style blockchain game connected to the FLOKI token.",
    howToStart: [
      "Research Valhalla and the FLOKI ecosystem",
      "Create a compatible crypto wallet",
      "Connect to the game platform when available",
      "Learn the game economy before buying assets",
    ],
    advantages: [
      "Strong community awareness",
      "Gaming plus metaverse positioning",
      "Easy for beginners to recognize",
    ],
    risks: [
      "Meme-driven volatility",
      "High hype risk",
      "Game adoption must support token value",
    ],
    games: ["Valhalla"],
  },
  {
    id: "gala",
    name: "Gala Games",
    token: "GALA",
    coinGeckoId: "gala",
    chain: "GalaChain / Ethereum",
    category: "Gaming Platform",
    description:
      "Gala Games is a gaming platform with multiple blockchain-powered games, digital assets, and creator-focused entertainment products.",
    howToStart: [
      "Create a Gala account",
      "Explore available Gala games",
      "Connect or set up a wallet",
      "Try free games before buying assets",
    ],
    advantages: [
      "Multiple games in one ecosystem",
      "Recognizable gaming crypto brand",
      "Entertainment and gaming focus",
    ],
    risks: [
      "Game quality varies",
      "Token utility depends on ecosystem growth",
      "Assets can lose value",
    ],
    games: ["Town Star", "Mirandus", "Spider Tanks", "Last Expedition"],
  },
  {
    id: "beam",
    name: "Beam",
    token: "BEAM",
    coinGeckoId: "beam-2",
    chain: "Beam",
    category: "Gaming Network",
    description:
      "Beam is a gaming-focused network connected to the Merit Circle ecosystem, built to support blockchain games and gaming economies.",
    howToStart: [
      "Research Beam ecosystem games",
      "Set up a supported wallet",
      "Bridge or acquire BEAM if needed",
      "Explore supported games and marketplaces",
    ],
    advantages: [
      "Gaming-native network",
      "Backed by a strong gaming DAO history",
      "Focused on game infrastructure",
    ],
    risks: [
      "Still developing ecosystem",
      "Game adoption is not guaranteed",
      "Token volatility remains high",
    ],
    games: ["Trial Xtreme", "Walker World", "Hash Rush"],
  },
];

export async function getGamingEcosystems(): Promise<GamingEcosystem[]> {
  try {
    const ids = ECOSYSTEMS.map((x) => x.coinGeckoId).join(",");

    const headers: HeadersInit = process.env.COINGECKO_API_KEY
      ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
      : {};

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
      {
        next: { revalidate: 300 },
        headers,
      }
    );

    if (!res.ok) throw new Error("CoinGecko failed");

    const coins = await res.json();
    const safeCoins = Array.isArray(coins) ? coins : [];

    return ECOSYSTEMS.map((eco) => {
      const coin = safeCoins.find((c: any) => c.id === eco.coinGeckoId);

      return {
        ...eco,
        price: Number(coin?.current_price || 0),
        change24h: Number(coin?.price_change_percentage_24h || 0),
        marketCap: Number(coin?.market_cap || 0),
        volume24h: Number(coin?.total_volume || 0),
        image: String(coin?.image || ""),
      };
    });
  } catch {
    return ECOSYSTEMS.map((eco) => ({
      ...eco,
      price: 0,
      change24h: 0,
      marketCap: 0,
      volume24h: 0,
      image: "",
    }));
  }
}