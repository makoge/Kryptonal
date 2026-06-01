import { NextRequest, NextResponse } from "next/server";
import { isValidToolSlug } from "@/lib/tools/tools";

const memoryStore = new Map<string, number>();
const rateLimit = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").trim();

    if (!isValidToolSlug(slug)) {
      return NextResponse.json(
        { ok: false, error: "Invalid tool slug" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const rateKey = `${ip}:${slug}`;
    const now = Date.now();
    const lastClick = rateLimit.get(rateKey) || 0;

    if (now - lastClick < 10_000) {
      return NextResponse.json(
        { ok: false, error: "Too many clicks" },
        { status: 429 }
      );
    }

    rateLimit.set(rateKey, now);

    const current = memoryStore.get(slug) || 0;
    const usageCount = current + 1;
    memoryStore.set(slug, usageCount);

    return NextResponse.json({
      ok: true,
      slug,
      usageCount,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request" },
      { status: 400 }
    );
  }
}