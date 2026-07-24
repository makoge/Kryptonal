export interface LiveStory {
  id: string;
  title: string;
  summary: string;
  category: string;
  slug: string;
  url: string;
  publishedAt: string;
  source: string; // Added this to track the publisher
  trendingScore: number;
  views: number;
  comments: number;
  likes: number;
  imageUrl?: string;
  isHot?: boolean;
  isBreaking?: boolean;
}

// Add as many free RSS feeds here as you want
const RSS_FEEDS = [
  { name: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { name: "CryptoPotato", url: "https://cryptopotato.com/feed/" },
];

export async function getLiveNews(): Promise<LiveStory[]> {
  try {
    // 1. Fetch all feeds simultaneously for maximum speed
    const fetchPromises = RSS_FEEDS.map(async (feed) => {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;

      const res = await fetch(apiUrl, { next: { revalidate: 60 } });
      if (!res.ok) return null;

      const data = await res.json();
      if (data.status !== "ok") return null;

      // 2. Map the data and inject the source name
      return data.items.map((post: any, index: number) => {
        const slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        const cleanSummary =
          post.description.replace(/<[^>]*>?/gm, "").substring(0, 150) + "...";

        let extractedImage = post.thumbnail || post.enclosure?.link || "";

        // If no explicit thumbnail, use regex to dig it out of the HTML body
        if (!extractedImage) {
          const imgMatch = (post.content || post.description || "").match(
            /<img[^>]+src="([^">]+)"/,
          );
          if (imgMatch) {
            extractedImage = imgMatch[1];
          }
        }
        return {
          id: post.guid || `${feed.name}-${index}`,
          title: post.title,
          summary: cleanSummary,
          category: post.categories?.[0] || "Crypto",
          slug: slug,
          url: post.link,
          rawDate: new Date(post.pubDate), // Keep raw date for sorting
          publishedAt: new Date(post.pubDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          source: feed.name,
          imageUrl: extractedImage,
          trendingScore: Math.floor(Math.random() * (99 - 75 + 1)) + 75,
          views: Math.floor(Math.random() * 50000) + 1000,
          comments: Math.floor(Math.random() * 300),
          likes: Math.floor(Math.random() * 5000),
        };
      });
    });

    // Wait for all fetches to finish
    const results = await Promise.all(fetchPromises);

    // 3. Flatten the array, filter out failures, and sort by newest first
    const allStories = results
      .flat()
      .filter((story) => story !== null)
      .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime()); // Newest first

    // 4. Assign Hot/Breaking tags to the absolute newest across all platforms, then return top 15
    return allStories.slice(0, 15).map((story, index) => {
      // Remove rawDate before sending to the client components
      const { rawDate, ...cleanStory } = story;
      return {
        ...cleanStory,
        isHot: index < 2,
        isBreaking: index === 0,
      };
    });
  } catch (error) {
    console.error("Error fetching live news via multiple RSS:", error);
    return [];
  }
}
