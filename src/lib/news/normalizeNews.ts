import type { NormalizedNews, NewsCategory, NewsSentiment } from "./types";

function cleanText(value: unknown) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\[\+\d+\s*chars\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeId(title: string, url: string) {
  return `${title}-${url}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const trustedSources = [
  "cointelegraph.com",
  "coindesk.com",
  "decrypt.co",
  "blockworks.co",
  "theblock.co",
  "bitcoinmagazine.com",
  "bitcoin.com",
  "cryptoslate.com",
  "coinpedia.org",
  "beincrypto.com",
  "cnbc.com",
  "reuters.com",
  "bloomberg.com",
  "forbes.com",
];

function isTrustedSource(url: string) {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return trustedSources.some((source) => hostname.includes(source));
  } catch {
    return false;
  }
}

function isBadUrl(url: string) {
  const value = url.toLowerCase();

  return (
    !value.startsWith("http") ||
    value.includes("consent.yahoo.com") ||
    value.includes("localhost") ||
    value.includes("#") ||
    value.includes("/privacy") ||
    value.includes("/cookies")
  );
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function isRelevantCryptoNews(text: string) {
  const cryptoKeywords = [
    "bitcoin",
    "btc",
    "ethereum",
    "eth",
    "crypto",
    "cryptocurrency",
    "blockchain",
    "web3",
    "defi",
    "stablecoin",
    "stablecoins",
    "solana",
    "xrp",
    "bnb",
    "cardano",
    "dogecoin",
    "memecoin",
    "altcoin",
    "altcoins",
    "token",
    "tokens",
    "coinbase",
    "binance",
    "okx",
    "kraken",
    "etf",
    "nft",
    "gamefi",
    "layer 2",
    "l2",
    "wallet",
    "on-chain",
    "smart contract",
    "dex",
    "rwa",
    "mining",
    "halving",
  ];

  const macroCryptoKeywords = [
    "federal reserve",
    "fed",
    "interest rate",
    "inflation",
    "liquidity",
    "nasdaq",
    "wall street",
    "sec",
    "cftc",
    "regulation",
    "treasury",
  ];

  return hasAny(text, cryptoKeywords) || hasAny(text, macroCryptoKeywords);
}

function detectCategory(text: string): NewsCategory {
  const value = text.toLowerCase();

  const gaming = [
    "gaming",
    "gamefi",
    "play-to-earn",
    "p2e",
    "nft game",
    "metaverse game",
  ];

  const web3 = [
    "web3",
    "dao",
    "decentralized identity",
    "did",
    "wallet",
    "dapp",
    "depin",
    "on-chain",
  ];

  const regulation = [
    "regulation",
    "regulatory",
    "sec",
    "cftc",
    "lawsuit",
    "court",
    "judge",
    "law",
    "bill",
    "senate",
    "congress",
    "compliance",
    "doj",
    "etf approval",
    "approval",
    "clarity act",
  ];

  const politics = [
    "election",
    "politic",
    "president",
    "white house",
    "trump",
    "biden",
    "senator",
    "government",
    "policy",
    "geopolitical",
    "war",
    "ceasefire",
  ];

  const macro = [
    "fed",
    "federal reserve",
    "interest rate",
    "rate cut",
    "inflation",
    "cpi",
    "jobs report",
    "unemployment",
    "liquidity",
    "recession",
    "bond",
    "treasury",
    "dollar",
    "nasdaq",
    "stocks",
    "wall street",
  ];

  if (hasAny(value, gaming)) return "gaming";
  if (hasAny(value, regulation)) return "regulation";
  if (hasAny(value, politics)) return "politics";
  if (hasAny(value, web3)) return "web3";
  if (hasAny(value, macro)) return "macro";

  return "crypto";
}

function detectSentiment(text: string): NewsSentiment {
  const value = text.toLowerCase();

  const breakingWords = [
    "breaking",
    "urgent",
    "just in",
    "approved",
    "approval",
    "passes",
    "lawsuit",
    "hack",
    "exploit",
    "seizure",
    "ban",
  ];

  const hotWords = [
    "surge",
    "rally",
    "soars",
    "jumps",
    "climbs",
    "record",
    "all-time high",
    "ath",
    "launches",
    "raises",
    "investment",
    "adoption",
  ];

  if (hasAny(value, breakingWords)) return "breaking";
  if (hasAny(value, hotWords)) return "hot";

  return "neutral";
}

function generateSummary(title: string, excerpt: string) {
  const text = `${title}. ${excerpt}`
    .replace(/The post .* appeared first on .*$/gi, "")
    .replace(/\[\+\d+\schars\]/gi, "")
    .replace(/If you click ['"]Accept all['"].*$/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences.slice(0, 2).join(". ") + ".";
}

export function normalizeNewsItem(
  item: any,
  sourceName: string
): NormalizedNews | null {
  const title = cleanText(item.title);
  const excerpt = cleanText(
    item.description || item.summary || item.body || item.content
  );

  const url = String(item.url || item.link || "").trim();

  if (!title || !url || isBadUrl(url)) return null;

  if (!isTrustedSource(url)) return null;

  const text = `${title} ${excerpt}`.toLowerCase();

  if (!isRelevantCryptoNews(text)) return null;

  const image =
    item.image_url ||
    item.urlToImage ||
    item.image ||
    item.thumbnail ||
    undefined;

  return {
    id: makeId(title, url),
    title,
    excerpt: generateSummary(
  title,
  excerpt || "Read the full story from the original source."
),
    url,
    image,
    source:
      item.source_id ||
      item.source?.name ||
      item.creator?.[0] ||
      sourceName,
    publishedAt:
      item.publishedAt ||
      item.pubDate ||
      item.published_on ||
      new Date().toISOString(),
    category: detectCategory(text),
    sentiment: detectSentiment(text),
  };
}

export function removeDuplicateNews(news: NormalizedNews[]) {
  const seen = new Set<string>();

  return news.filter((item) => {
    const cleanTitle = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    const key = item.url || cleanTitle;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}