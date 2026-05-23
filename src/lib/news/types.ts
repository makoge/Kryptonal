export type NewsCategory =
  | "crypto"
  | "politics"
  | "web3"
  | "gaming"
  | "regulation"
  | "macro";

export type NewsSentiment = "hot" | "breaking" | "neutral";

export type NormalizedNews = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  image?: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
  sentiment: NewsSentiment;
};