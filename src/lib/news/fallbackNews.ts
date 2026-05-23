import type { NormalizedNews } from "./types";

export const fallbackNews: NormalizedNews[] = [
  {
    id: "bitcoin-market-cycle-watch",
    title: "Bitcoin Market Cycle Watch: What Traders Are Monitoring",
    excerpt:
      "Bitcoin dominance, liquidity, ETF demand, and macro policy remain key signals for crypto market direction.",
    url: "#",
    image: undefined,
    source: "Kryptonal",
    publishedAt: new Date().toISOString(),
    category: "crypto",
    sentiment: "hot",
  },
  {
    id: "crypto-regulation-update",
    title: "Crypto Regulation Remains a Major Market Driver",
    excerpt:
      "Regulatory headlines can quickly change investor confidence, especially around exchanges, stablecoins, and ETFs.",
    url: "#",
    image: undefined,
    source: "Kryptonal",
    publishedAt: new Date().toISOString(),
    category: "regulation",
    sentiment: "neutral",
  },
  {
    id: "gaming-crypto-research",
    title: "Gaming Crypto Projects Are Fighting for Real Users",
    excerpt:
      "The next phase of gaming crypto may depend more on gameplay, retention, and token utility than hype.",
    url: "#",
    image: undefined,
    source: "Kryptonal",
    publishedAt: new Date().toISOString(),
    category: "gaming",
    sentiment: "neutral",
  },
];