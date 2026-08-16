import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isValidToolSlug } from "@/lib/tools/tools";

const prisma = new PrismaClient();

// Keep in-memory rate limiting to protect the database from spam
const rateLimit = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").trim();

    if (!isValidToolSlug(slug)) {
      return NextResponse.json(
        { ok: false, error: "Invalid tool slug" },
        { status: 400 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const rateKey = `${ip}:${slug}`;
    const now = Date.now();
    const lastClick = rateLimit.get(rateKey) || 0;

    // Rate limit: 1 click per IP per tool every 10 seconds
    if (now - lastClick < 10_000) {
      return NextResponse.json(
        { ok: false, error: "Too many clicks" },
        { status: 429 },
      );
    }

    rateLimit.set(rateKey, now);

    // Persist click directly to PostgreSQL database
    const updatedTool = await prisma.tool_usage.upsert({
      where: { slug },
      update: { views: { increment: 1 } },
      create: { slug, views: 1 },
    });

    return NextResponse.json({
      ok: true,
      slug,
      usageCount: updatedTool.views,
    });
  } catch (error) {
    console.error("Error updating tool usage count:", error);
    return NextResponse.json(
      { ok: false, error: "Server error updating usage" },
      { status: 500 },
    );
  }
}
