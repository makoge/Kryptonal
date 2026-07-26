// src/app/api/community/votes/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

    // Record or update user's vote for this timeframe (1 vote per duration cycle)
    const vote = await prisma.cryptoVote.upsert({
      where: {
        userId_duration: {
          userId: session.user.id,
          duration,
        },
      },
      update: {
        symbol: cleanSymbol,
      },
      create: {
        userId: session.user.id,
        symbol: cleanSymbol,
        duration,
      },
    });

    return NextResponse.json({ success: true, data: vote });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
