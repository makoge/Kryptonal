export interface TokenSeoData {
  slug: string;
  symbol: string;
  name: string;
  defaultUnlock: number;
  coingeckoId: string;
}

export interface ProtocolSeoData {
  slug: string;
  name: string;
  id: string;
  defaultUserPoints: number;
  totalPoints: number;
  defaultFdv: number;
  airdropPct: number;
  defaultGas: number;
}

export interface NetworkSeoData {
  slug: string;
  name: string;
  symbol: string;
  addressFormatExample: string;
}

export interface RoiTokenSeoData {
  slug: string;
  symbol: string;
  name: string;
  coingeckoId: string;
}

export const SEO_TOKENS: TokenSeoData[] = [
  {
    slug: "aptos",
    symbol: "APT",
    name: "Aptos",
    defaultUnlock: 11310000,
    coingeckoId: "aptos",
  },
  {
    slug: "arbitrum",
    symbol: "ARB",
    name: "Arbitrum",
    defaultUnlock: 92600000,
    coingeckoId: "arbitrum",
  },
  {
    slug: "optimism",
    symbol: "OP",
    name: "Optimism",
    defaultUnlock: 31400000,
    coingeckoId: "optimism-ethereum",
  },
  {
    slug: "sui",
    symbol: "SUI",
    name: "Sui Network",
    defaultUnlock: 64000000,
    coingeckoId: "sui",
  },
  {
    slug: "kaito",
    symbol: "KAITO",
    name: "Kaito AI",
    defaultUnlock: 12500000,
    coingeckoId: "kaito",
  },
  {
    slug: "beat",
    symbol: "BEAT",
    name: "Audiera",
    defaultUnlock: 22000000,
    coingeckoId: "audiera",
  },
];

export const SEO_PROTOCOLS: ProtocolSeoData[] = [
  {
    slug: "eigenlayer",
    name: "EigenLayer",
    id: "eigen",
    defaultUserPoints: 150000,
    totalPoints: 2500000000,
    defaultFdv: 7000000000,
    airdropPct: 10,
    defaultGas: 120,
  },
  {
    slug: "symbiotic",
    name: "Symbiotic",
    id: "symbiotic",
    defaultUserPoints: 85000,
    totalPoints: 1200000000,
    defaultFdv: 3500000000,
    airdropPct: 8,
    defaultGas: 65,
  },
  {
    slug: "karak",
    name: "Karak Network",
    id: "karak",
    defaultUserPoints: 50000,
    totalPoints: 800000000,
    defaultFdv: 2000000000,
    airdropPct: 12,
    defaultGas: 45,
  },
  {
    slug: "hyperliquid",
    name: "Hyperliquid",
    id: "hyperliquid",
    defaultUserPoints: 12000,
    totalPoints: 350000000,
    defaultFdv: 4000000000,
    airdropPct: 15,
    defaultGas: 25,
  },
];

export const SEO_NETWORKS: NetworkSeoData[] = [
  {
    slug: "solana",
    name: "Solana",
    symbol: "SOL",
    addressFormatExample: "7xKXtg... or Mint Address",
  },
  {
    slug: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    addressFormatExample: "bc1q... or 1...",
  },
  {
    slug: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    addressFormatExample: "0x71C...",
  },
  {
    slug: "binance-smart-chain",
    name: "BNB Smart Chain",
    symbol: "BNB",
    addressFormatExample: "0x483...",
  },
  {
    slug: "tron",
    name: "TRON",
    symbol: "TRX",
    addressFormatExample: "T9yD...",
  },
  {
    slug: "cardano",
    name: "Cardano",
    symbol: "ADA",
    addressFormatExample: "addr1...",
  },
  {
    slug: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    addressFormatExample: "0x388...",
  },
];

export const SEO_ROI_TOKENS: RoiTokenSeoData[] = [
  { slug: "bitcoin", symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  {
    slug: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    coingeckoId: "ethereum",
  },
  { slug: "solana", symbol: "SOL", name: "Solana", coingeckoId: "solana" },
  {
    slug: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    coingeckoId: "binancecoin",
  },
  { slug: "ripple", symbol: "XRP", name: "XRP", coingeckoId: "ripple" },
  { slug: "cardano", symbol: "ADA", name: "Cardano", coingeckoId: "cardano" },
  {
    slug: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    coingeckoId: "dogecoin",
  },
];
