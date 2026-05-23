import type { NormalizedNews, NewsCategory, NewsSentiment } from "./types";

function cleanText(value: unknown) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeId(title: string, url: string) {
  return `${title}-${url}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function detectCategory(text: string): NewsCategory {
  const value = text.toLowerCase();

  if (value.includes("regulation") || value.includes("sec") || value.includes("law")) {
    return "regulation";
  }

  if (value.includes("election") || value.includes("trump") || value.includes("biden") || value.includes("politic")) {
    return "politics";
  }

  if (value.includes("web3") || value.includes("dao")) return "web3";
  if (value.includes("gaming") || value.includes("gamefi")) return "gaming";
  if (value.includes("inflation") || value.includes("fed") || value.includes("rate")) return "macro";

  return "crypto";
}

function detectSentiment(text: string): NewsSentiment {
  const value = text.toLowerCase();

  if (value.includes("breaking") || value.includes("urgent")) return "breaking";
  if (value.includes("surge") || value.includes("rally") || value.includes("hot")) return "hot";

  return "neutral";
}

export function normalizeNewsItem(item: any, sourceName: string): NormalizedNews | null {
  const title = cleanText(item.title);
  const excerpt = cleanText(item.description || item.summary || item.body || item.content);
  const url = String(item.url || item.link || "").trim();

  if (!title || !url) return null;

  const text = `${title} ${excerpt}`;

  return {
    id: makeId(title, url),
    title,
    excerpt: excerpt || "Read the full story from the original source.",
    url,
    image: item.image_url || item.urlToImage || item.image || undefined,
    source: sourceName,
    publishedAt: item.publishedAt || item.pubDate || item.published_on || new Date().toISOString(),
    category: detectCategory(text),
    sentiment: detectSentiment(text),
  };
}

export function removeDuplicateNews(news: NormalizedNews[]) {
  const seen = new Set<string>();

  return news.filter((item) => {
    const key = item.url || item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}