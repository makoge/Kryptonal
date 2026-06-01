// src/lib/gaming/getFeaturedGames.ts

export type FeaturedGame = {
  name: string;
  genre: string;
  chain: string;
  token: string;
  activity: string;
  status: string;
  description: string;
  image?: string;
  users?: number;
  volume?: number;
};

const FALLBACK_GAMES: FeaturedGame[] = [
  {
    name: "Off The Grid",
    genre: "Battle Royale",
    chain: "Avalanche",
    token: "GUN",
    activity: "High",
    status: "Live",
    description: "Cinematic shooter with Web3 ownership.",
  },
  {
    name: "Pixels",
    genre: "Social RPG",
    chain: "Ronin",
    token: "PIXEL",
    activity: "Very High",
    status: "Live",
    description: "Farming, quests, land, and social gameplay.",
  },
];

export async function getFeaturedGames(): Promise<FeaturedGame[]> {
  try {
    const apiKey = process.env.DAPPRADAR_API_KEY;

    if (!apiKey) return FALLBACK_GAMES;

    const res = await fetch(
      "https://apis.dappradar.com/v2/dapps?category=games&sort=uaw&order=desc&limit=6",
      {
        next: { revalidate: 600 },
        headers: {
          "X-API-KEY": apiKey,
        },
      }
    );

    if (!res.ok) return FALLBACK_GAMES;

    const json = await res.json();

    const items = Array.isArray(json?.results)
      ? json.results
      : Array.isArray(json?.data)
      ? json.data
      : [];

    if (!items.length) return FALLBACK_GAMES;

    return items.slice(0, 6).map((game: any) => ({
      name: game.name || "Unknown Game",
      genre: game.category || "Web3 Game",
      chain: game.chain || game.protocol || "Multi-chain",
      token: game.tokenSymbol || game.token || "N/A",
      activity: Number(game.uaw || game.users || 0) > 10000 ? "Very High" : "Live",
      status: "Live",
      description:
        game.description ||
        "A blockchain-powered game tracked through live Web3 ecosystem data.",
      image: game.logo || game.image || "",
      users: Number(game.uaw || game.users || 0),
      volume: Number(game.volume || game.volume24h || 0),
    }));
  } catch {
    return FALLBACK_GAMES;
  }
}