// src/app/api/community/holdings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: Retrieve Top 10 most logged coins grouped by duration
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const duration = searchParams.get("duration") || "LONG_TERM";

  try {
    // Group holdings by symbol and count entries for the given duration
    const topHoldings = await prisma.cryptoHoldEntry.groupBy({
      by: ["symbol"],
      where: { duration: duration as any },
      _count: { symbol: true },
      orderBy: { _count: { symbol: "desc" } },
      take: 10,
    });

    // Also fetch the total votes for these top symbols in this duration category
    const votes = await prisma.cryptoVote.groupBy({
      by: ["symbol"],
      where: { duration: duration as any },
      _count: { symbol: true },
    });

    const voteCountMap = new Map(votes.map((v) => [v.symbol, v._count.symbol]));

    const formattedResults = topHoldings.map((item) => ({
      symbol: item.symbol,
      holdCount: item._count.symbol,
      voteCount: voteCountMap.get(item.symbol) || 0,
    }));

    return NextResponse.json({ success: true, data: formattedResults });
  } catch (error) {
    console.error("Error fetching top holdings:", error);
    return NextResponse.json(
      { error: "Failed to fetch top holdings" },
      { status: 500 },
    );
  }
}

// POST: Add a new crypto holding for the authenticated user
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { symbol, duration } = await req.json();

    if (!symbol || !duration) {
      return NextResponse.json(
        { error: "Missing symbol or duration" },
        { status: 400 },
      );
    }

    const cleanSymbol = symbol.trim().toUpperCase();

    // Upsert or create hold entry (unique per user + symbol + duration)
    const entry = await prisma.cryptoHoldEntry.upsert({
      where: {
        userId_symbol_duration: {
          userId: session.user.id,
          symbol: cleanSymbol,
          duration,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        symbol: cleanSymbol,
        name: cleanSymbol,
        duration,
      },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error("Error logging holding:", error);
    return NextResponse.json(
      { error: "Failed to log holding" },
      { status: 500 },
    );
  }
}
