import { NextResponse } from "next/server";
import { fetchLatestNews } from "@/lib/news/fetchNews";
import type { NewsCategory } from "@/lib/news/types";

export const revalidate = 300;

const allowedCategories = [
  "crypto",
  "politics",
  "web3",
  "gaming",
  "regulation",
  "macro",
] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category") as NewsCategory | null;
  const limitParam = Number(searchParams.get("limit") || 20);
  const limit = Math.min(Math.max(limitParam, 1), 30);

  const news = await fetchLatestNews();

  const filtered =
    category && allowedCategories.includes(category)
      ? news.filter((item) => item.category === category)
      : news;

  return NextResponse.json({
    ok: true,
    count: filtered.length,
    news: filtered.slice(0, limit),
  });
}