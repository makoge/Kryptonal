import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import React from "react";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Crypto Intelligence";
    const badge = searchParams.get("badge") || "TOOL";
    const statLabel = searchParams.get("statLabel") || "LATEST VALUE";
    const statValue = searchParams.get("statValue") || "--";
    const status = searchParams.get("status") || "LIVE";
    const isPositive = !statValue.startsWith("-");

    // Parentheses wrapping the entire JSX element is required
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(45,212,191,0.22), transparent 40%), radial-gradient(circle at 90% 80%, rgba(56,189,248,0.18), transparent 40%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(52, 211, 153, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              color: "#6ee7b7",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            {`KRYPTONAL • ${badge.toUpperCase()}`}
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#94a3b8" }}>
            Live Market Data
          </div>
        </div>

        {/* Central Card Body */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            {statLabel.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 900,
              color: isPositive ? "#34d399" : "#f87171",
              marginTop: 10,
            }}
          >
            {statValue}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#e2e8f0",
              marginTop: 12,
              fontWeight: 600,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 30,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#cbd5e1" }}>
            {`Status: `}
            <span style={{ color: "#38bdf8", fontWeight: 800, marginLeft: 8 }}>
              {status.toUpperCase()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#38bdf8",
              fontWeight: 700,
            }}
          >
            kryptonal.com → Open Tool
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
