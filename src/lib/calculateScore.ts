export interface EngagementMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: Date | string;
}

export interface TrendingScoreResult {
  score: number; // e.g., 92
  formatted: string; // e.g., "92 Trending"
  badgeColor: string; // Tailwind classes for the UI badge
  isHot: boolean; // Score >= 85
}

// Default baseline expectations for 100% score normalization
const DEFAULT_CONFIG = {
  maxExpectedViews: 50000,
  likeRateTarget: 0.05, // 5% engagement
  commentRateTarget: 0.02, // 2% engagement
  shareRateTarget: 0.01, // 1% engagement
  decayHalfLifeHours: 24, // Freshness drops by half every 24 hours
};

/**
 * Calculates the dynamic Trending Score (0-100) based on weighted engagement and recency.
 *
 * Formula Weights:
 * - 30% Views
 * - 20% Likes
 * - 20% Comments
 * - 15% Shares
 * - 15% Recency / Freshness
 */
export function calculateTrendingScore(
  metrics: EngagementMetrics,
  config = DEFAULT_CONFIG,
): TrendingScoreResult {
  const publishedDate = new Date(metrics.publishedAt);
  const now = new Date();

  // 1. Normalize Views (30%)
  const normalizedViews = Math.min(
    (metrics.views / config.maxExpectedViews) * 100,
    100,
  );

  // 2. Normalize Engagement Rates against Views (20% Likes, 20% Comments, 15% Shares)
  const viewCount = Math.max(metrics.views, 1);
  const likeRate = metrics.likes / viewCount;
  const commentRate = metrics.comments / viewCount;
  const shareRate = metrics.shares / viewCount;

  const normalizedLikes = Math.min(
    (likeRate / config.likeRateTarget) * 100,
    100,
  );
  const normalizedComments = Math.min(
    (commentRate / config.commentRateTarget) * 100,
    100,
  );
  const normalizedShares = Math.min(
    (shareRate / config.shareRateTarget) * 100,
    100,
  );

  // 3. Recency / Freshness Decay (15%)
  const hoursOld = Math.max(
    0,
    (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60),
  );
  const freshnessScore =
    100 * Math.pow(0.5, hoursOld / config.decayHalfLifeHours);

  // 4. Calculate Final Weighted Score
  const rawScore =
    normalizedViews * 0.3 +
    normalizedLikes * 0.2 +
    normalizedComments * 0.2 +
    normalizedShares * 0.15 +
    freshnessScore * 0.15;

  const score = Math.min(Math.max(Math.round(rawScore), 0), 100);

  // 5. Compute UI badge colors based on score tiers
  let badgeColor = "bg-slate-500/20 text-slate-400 border-slate-500/30";
  if (score >= 85) {
    badgeColor = "bg-orange-500/20 text-orange-400 border-orange-500/30"; // Hot / Viral
  } else if (score >= 60) {
    badgeColor = "bg-blue-500/20 text-blue-400 border-blue-500/30"; // High Trend
  } else if (score >= 30) {
    badgeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"; // Steady
  }

  return {
    score,
    formatted: `${score} Trending`,
    badgeColor,
    isHot: score >= 85,
  };
}

/**
 * Array sorting helper to sort stories by Trending Score descending
 */
export function sortByTrendingScore<T extends { metrics: EngagementMetrics }>(
  stories: T[],
): T[] {
  return [...stories].sort((a, b) => {
    const scoreA = calculateTrendingScore(a.metrics).score;
    const scoreB = calculateTrendingScore(b.metrics).score;
    return scoreB - scoreA;
  });
}
