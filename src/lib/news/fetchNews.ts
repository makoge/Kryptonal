import { fallbackNews } from "./fallbackNews";
import { normalizeNewsItem, removeDuplicateNews } from "./normalizeNews";
import type { NormalizedNews } from "./types";

async function fetchNewsApi(): Promise<NormalizedNews[]> {
  const key = process.env.NEWSAPI_KEY;

  if (!key) {
    console.log("NEWSAPI_KEY missing");
    return [];
  }

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set(
    "q",
    "(crypto OR bitcoin OR ethereum OR blockchain OR web3)"
  );
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "20");
  url.searchParams.set("apiKey", key);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.log("NewsAPI error:", res.status, errorText);
    return [];
  }

  const data = await res.json();

  return (data.articles || [])
    .map((item: any) => normalizeNewsItem(item, "NewsAPI"))
    .filter(Boolean);
}

async function fetchNewsData(): Promise<NormalizedNews[]> {
  const key = process.env.NEWSDATA_API_KEY;

  if (!key) {
    console.log("NEWSDATA_API_KEY missing");
    return [];
  }

  const url = new URL("https://newsdata.io/api/1/news");
  url.searchParams.set("apikey", key);
  url.searchParams.set("q", "crypto OR bitcoin OR ethereum OR blockchain");
  url.searchParams.set("language", "en");

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.log("NewsData error:", res.status, errorText);
    return [];
  }

  const data = await res.json();

  return (data.results || [])
    .map((item: any) => normalizeNewsItem(item, "NewsData"))
    .filter(Boolean);
}

export async function fetchLatestNews() {
  const results = await Promise.allSettled([fetchNewsApi(), fetchNewsData()]);

  const news = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  const cleanNews = removeDuplicateNews(news)
    .filter((item) => item.url && item.url !== "#")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, 30);

  if (!cleanNews.length) {
    console.log("Using fallback news");
    return fallbackNews;
  }

  return cleanNews;
}