import type { MetadataRoute } from "next";
import { locales } from "@/lib/getDictionary";
import {
  SEO_TOKENS,
  SEO_PROTOCOLS,
  SEO_NETWORKS,
  SEO_ROI_TOKENS,
} from "@/lib/seo-tools";
import en from "@/messages/en.json";

const siteUrl = "https://kryptonal.com";

const pages = [
  "",
  "/trending",
  "/community",
  "/crypto-prices",
  "/market-cap",
  "/analysis",
  "/tools",
  "/blog",
  "/gaming-crypto",

  // Learn Pages
  "/learn",
  "/learn/crypto-chart-analyzer",
  "/learn/free-cryptocurrency-courses",
  "/learn/crypto-trading-course",
  "/learn/blockchain",
  "/learn/cryptocurrency-investment",
  "/learn/cryptocurrency-stocks",
  "/learn/fidelity-cryptocurrency",

  // Tool Pages
  "/tools/crypto-portfolio-tracker",
  "/tools/high-yield-finder",
  "/tools/roi-calculator",
  "/tools/airdrop-radar",
  "/tools/address-validator",
  "/tools/wallet-security-checker",
  "/tools/crypto-scam-risk-checker",
  "/tools/cryptocurrency-converter",
  "/tools/crypto-etf-tracker",
  "/tools/cryptocurrency-tax-calculator",
  "/tools/honeypot-checker",
  "/tools/token-unlock-impact",
  "/tools/airdrop-calculator",
  "/tools/rugpull-analyzer",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static Pages Across Locales
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency:
        page === ""
          ? ("weekly" as const)
          : page === "/crypto-prices" ||
              page === "/trending" ||
              page === "/community" ||
              page === "/tools" ||
              page.startsWith("/tools/")
            ? ("daily" as const)
            : page.startsWith("/learn")
              ? ("monthly" as const)
              : ("monthly" as const),
      priority:
        page === ""
          ? 1
          : page === "/crypto-prices"
            ? 0.95
            : page === "/trending" || page === "/community"
              ? 0.92
              : page === "/tools" || page === "/learn"
                ? 0.9
                : page.startsWith("/tools/")
                  ? 0.88
                  : page.startsWith("/learn/")
                    ? 0.85
                    : 0.8,
    })),
  );

  // 2. Programmatic SEO (pSEO) Tool Pages
  const pseoPages: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const routes: MetadataRoute.Sitemap = [];

    // Token Unlock Impact pSEO Pages
    for (const token of SEO_TOKENS) {
      routes.push({
        url: `${siteUrl}/${locale}/tools/token-unlock-impact/${token.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    // Airdrop Calculator pSEO Pages
    for (const protocol of SEO_PROTOCOLS) {
      routes.push({
        url: `${siteUrl}/${locale}/tools/airdrop-calculator/${protocol.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    // Address Validator pSEO Pages
    for (const net of SEO_NETWORKS) {
      routes.push({
        url: `${siteUrl}/${locale}/tools/address-validator/${net.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    // Wallet Security Checker pSEO Pages
    for (const net of SEO_NETWORKS) {
      routes.push({
        url: `${siteUrl}/${locale}/tools/wallet-security-checker/${net.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    // Portfolio Tracker pSEO Pages
    for (const token of SEO_ROI_TOKENS) {
      routes.push({
        url: `${siteUrl}/${locale}/tools/crypto-portfolio-tracker/${token.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    // ROI Calculator pSEO Pages
    for (const token of SEO_ROI_TOKENS) {
      routes.push({
        url: `${siteUrl}/${locale}/tools/roi-calculator/${token.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    return routes;
  });

  // 3. Blog Article Pages Across Locales
  const blogPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    en.blog.articles.map((article) => ({
      url: `${siteUrl}/${locale}/blog/${article.slug}`,
      lastModified: new Date(article.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  );

  return [...staticPages, ...pseoPages, ...blogPages];
}
