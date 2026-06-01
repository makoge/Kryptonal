import type { MetadataRoute } from "next";
import { locales } from "@/lib/getDictionary";
import en from "@/messages/en.json";

const siteUrl = "https://kryptonal.com";

const pages = [
  "",
  "/crypto-prices",
  "/market-cap",
  "/analysis",
  "/tools",
  "/blog",
  "/gaming-crypto",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency:
        page === ""
          ? ("weekly" as const)
          : page === "/crypto-prices" || page === "/tools"
          ? ("daily" as const)
          : ("monthly" as const),
      priority:
        page === ""
          ? 1
          : page === "/crypto-prices"
          ? 0.95
          : page === "/tools"
          ? 0.9
          : 0.8,
    }))
  );

  const blogPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    en.blog.articles.map((article) => ({
      url: `${siteUrl}/${locale}/blog/${article.slug}`,
      lastModified: new Date(article.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }))
  );

  return [...staticPages, ...blogPages];
}