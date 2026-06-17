export type ToolStatus = "live" | "beta" | "coming-soon";

export type ToolCategory =
  | "all"
  | "market"
  | "bitcoin"
  | "defi"
  | "chains"
  | "gaming"
  | "risk"
  | "education";

export type KryptonalTool = {
  slug: string;
  nameKey: string;
  descriptionKey: string;
  benefitKey: string;
  category: Exclude<ToolCategory, "all">;
  status: ToolStatus;
  href: string;
  icon: string;
  usageCount: number;
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  "all",
  "market",
  "bitcoin",
  "defi",
  "chains",
  "gaming",
  "risk",
  "education",
];

export const KRYPTONAL_TOOLS: KryptonalTool[] = [
  {
    slug: "address-validator",
    nameKey: "addressValidator.name",
    descriptionKey: "addressValidator.description",
    benefitKey: "addressValidator.benefit",
    category: "risk",
    status: "live",
    href: "/tools/address-validator",
    icon: "🛡️",
    usageCount: 1000,
  },
  {
    slug: "market-cap-analysis",
    nameKey: "marketCap.name",
    descriptionKey: "marketCap.description",
    benefitKey: "marketCap.benefit",
    category: "market",
    status: "live",
    href: "/market-cap#marketcap-analysis",
    icon: "📊",
    usageCount: 245,
  },
  {
    slug: "analysis-engine",
    nameKey: "analysisEngine.name",
    descriptionKey: "analysisEngine.description",
    benefitKey: "analysisEngine.benefit",
    category: "market",
    status: "beta",
    href: "/analysis#analysis-engine",
    icon: "🧠",
    usageCount: 894,
  },
  {
    slug: "wallet-security-checker",
    nameKey: "walletSecurity.name",
    descriptionKey: "walletSecurity.description",
    benefitKey: "walletSecurity.benefit",
    category: "risk",
    status: "live",
    href: "/tools/wallet-security",
    icon: "🕵️",
    usageCount: 100,
  },
  {
    slug: "privacy-watchlist",
    nameKey: "privacyWatchlist.name",
    descriptionKey: "privacyWatchlist.description",
    benefitKey: "privacyWatchlist.benefit",
    category: "market",
    status: "live",
    href: "/tools/watchlist",
    icon: "🔐",
    usageCount: 1,
  },
  {
    slug: "crypto-profit-simulator",
    nameKey: "cryptoRoiVision.name",
    descriptionKey: "cryptoRoiVision.description",
    benefitKey: "cryptoRoiVision.benefit",
    category: "market",
    status: "live",
    href: "/tools/roi-calculator",
    icon: "📈",
    usageCount: 0,
  },
  {
    slug: "high-yield-finder",
    nameKey: "highYieldFinder.name",
    descriptionKey: "highYieldFinder.description",
    benefitKey: "highYieldFinder.benefit",
    category: "defi",
    status: "live",
    href: "/tools/high-yield-finder",
    icon: "🌾",
    usageCount: 3,
  },
  {
    slug: "bitcoin-cycle-tracker",
    nameKey: "bitcoinCycle.name",
    descriptionKey: "bitcoinCycle.description",
    benefitKey: "bitcoinCycle.benefit",
    category: "bitcoin",
    status: "live",
    href: "/#cycle-comparison",
    icon: "₿",
    usageCount: 32,
  },
  {
    slug: "stablecoin-liquidity-tracker",
    nameKey: "stablecoin.name",
    descriptionKey: "stablecoin.description",
    benefitKey: "stablecoin.benefit",
    category: "defi",
    status: "live",
    href: "/analysis#stablecoin-liquidity",
    icon: "💧",
    usageCount: 321,
  },
  {
    slug: "chain-strength-tracker",
    nameKey: "chainStrength.name",
    descriptionKey: "chainStrength.description",
    benefitKey: "chainStrength.benefit",
    category: "chains",
    status: "live",
    href: "/analysis#chain-strength",
    icon: "⛓️",
    usageCount: 208,
  },
  {
    slug: "sector-rotation-heatmap",
    nameKey: "sectorRotation.name",
    descriptionKey: "sectorRotation.description",
    benefitKey: "sectorRotation.benefit",
    category: "defi",
    status: "beta",
    href: "/analysis#sector-rotation",
    icon: "🔥",
    usageCount: 111,
  },
  {
    slug: "airdrop-radar",
    nameKey: "airdropRadar.name",
    descriptionKey: "airdropRadar.description",
    benefitKey: "airdropRadar.benefit",
    category: "defi",
    status: "live",
    href: "/tools/airdrop-radar",
    icon: "🪂",
    usageCount: 0,
  },
  {
    slug: "gaming-crypto-pulse",
    nameKey: "gamingPulse.name",
    descriptionKey: "gamingPulse.description",
    benefitKey: "gamingPulse.benefit",
    category: "gaming",
    status: "live",
    href: "/gaming-crypto",
    icon: "🎮",
    usageCount: 356,
  },
  {
    slug: "risk-signal-dashboard",
    nameKey: "riskSignal.name",
    descriptionKey: "riskSignal.description",
    benefitKey: "riskSignal.benefit",
    category: "risk",
    status: "coming-soon",
    href: "#",
    icon: "🛡️",
    usageCount: 0,
  },
];

export function isValidToolSlug(slug: string) {
  return KRYPTONAL_TOOLS.some((tool) => tool.slug === slug);
}
