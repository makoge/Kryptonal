import { ImageResponse } from "next/og";
import { getCoinData } from "@/lib/getCoinData";

// Dimensions recommended for Open Graph cards
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Image({ params }: Props) {
  const { id } = await params;
  const data = await getCoinData(id);

  // Fallback defaults if API fails
  const name = data?.details?.name || id.toUpperCase();
  const symbol = (data?.details?.symbol || id).toUpperCase();
  const rawPrice = data?.details?.market_data?.current_price?.usd;
  const price =
    rawPrice !== undefined ? `$${rawPrice.toLocaleString()}` : "Live Data";
  const change24h =
    data?.details?.market_data?.price_change_percentage_24h ?? 0;
  const isPositive = change24h >= 0;
  const rank = data?.details?.market_cap_rank || "—";
  const iconUrl = data?.details?.image?.large;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#060a12",
        backgroundImage:
          "radial-gradient(circle at 90% 15%, rgba(16, 185, 129, 0.22), transparent 45%), radial-gradient(circle at 10% 90%, rgba(56, 189, 248, 0.15), transparent 40%)",
        padding: "60px 70px",
        fontFamily: "sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Top Header: Brand Name & Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: "900",
              color: "#03140f",
            }}
          >
            K
          </div>
          <span
            style={{
              fontSize: "30px",
              fontWeight: "900",
              letterSpacing: "-0.5px",
              color: "#ffffff",
            }}
          >
            KRYPTONAL
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(52, 211, 153, 0.3)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fontSize: "16px",
            fontWeight: "700",
            color: "#34d399",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#34d399",
            }}
          />
          AI Market Intelligence
        </div>
      </div>

      {/* Center: Coin Identity & Real-time Metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Coin Brand Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={name}
              width="84"
              height="84"
              style={{ borderRadius: "999px" }}
            />
          ) : null}
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
            <span
              style={{
                fontSize: "64px",
                fontWeight: "900",
                letterSpacing: "-1px",
                color: "#ffffff",
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#64748b",
              }}
            >
              {symbol}
            </span>
          </div>
        </div>

        {/* Metrics Pill Grid */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {/* Live Price */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 28px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
            }}
          >
            <span
              style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}
            >
              LIVE PRICE
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#ffffff",
                marginTop: "4px",
              }}
            >
              {price}
            </span>
          </div>

          {/* 24h Change */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 28px",
              borderRadius: "20px",
              border: `1px solid ${isPositive ? "rgba(52, 211, 153, 0.2)" : "rgba(248, 113, 113, 0.2)"}`,
              backgroundColor: isPositive
                ? "rgba(16, 185, 129, 0.08)"
                : "rgba(239, 68, 68, 0.08)",
            }}
          >
            <span
              style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}
            >
              24H CHANGE
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: isPositive ? "#34d399" : "#f87171",
                marginTop: "4px",
              }}
            >
              {isPositive ? "+" : ""}
              {change24h.toFixed(2)}%
            </span>
          </div>

          {/* Market Cap Rank */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 28px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
            }}
          >
            <span
              style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}
            >
              RANK
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#38bdf8",
                marginTop: "4px",
              }}
            >
              #{rank}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Feature Taglines & Domain */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "24px" }}>
          <span
            style={{ fontSize: "18px", color: "#94a3b8", fontWeight: "600" }}
          >
            • Automated Risk Analysis
          </span>
          <span
            style={{ fontSize: "18px", color: "#94a3b8", fontWeight: "600" }}
          >
            • Cycle Intelligence
          </span>
          <span
            style={{ fontSize: "18px", color: "#94a3b8", fontWeight: "600" }}
          >
            • Fibonacci Targets
          </span>
        </div>
        <span style={{ fontSize: "18px", color: "#64748b", fontWeight: "700" }}>
          kryptonal.com
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
