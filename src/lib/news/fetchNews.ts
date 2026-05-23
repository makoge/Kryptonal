import { fallbackNews } from "./fallbackNews";
import { normalizeNewsItem, removeDuplicateNews } from "./normalizeNews";
import type { NormalizedNews } from "./types";

async function fetchNewsApi(): Promise<NormalizedNews[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", "crypto OR bitcoin OR blockchain OR web3 OR ethereum");
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "20");
  url.searchParams.set("apiKey", key);

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const data = await res.json();
  return (data.articles || [])
    .map((item: any) => normalizeNewsItem(item, "NewsAPI"))
    .filter(Boolean);
}

async function fetchNewsData(): Promise<NormalizedNews[]> {
  const key = process.env.NEWSDATA_API_KEY;
  if (!key) return [];

  const url = new URL("https://newsdata.io/api/1/news");
  url.searchParams.set("apikey", key);
  url.searchParams.set("q", "crypto OR bitcoin OR blockchain OR web3");
  url.searchParams.set("language", "en");

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const data = await res.json();
  return (data.results || [])
    .map((item: any) => normalizeNewsItem(item, "NewsData"))
    .filter(Boolean);
}

export async function fetchLatestNews() {
  try {
    const results = await Promise.allSettled([fetchNewsApi(), fetchNewsData()]);

    const news = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );

    const cleanNews = removeDuplicateNews(news).slice(0, 30);

    return cleanNews.length ? cleanNews : fallbackNews;
  } catch {
    return fallbackNews;
  }
}