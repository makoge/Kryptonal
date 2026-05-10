import type { MetadataRoute } from "next";
import { locales } from "@/lib/getDictionary";

const siteUrl = "https://kryptonal.com";

const pages = [
  "",
  "/market-cap",
  "/analysis",
  "/blog",
  "/gaming-crypto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1 : 0.8,
    }))
  );
}