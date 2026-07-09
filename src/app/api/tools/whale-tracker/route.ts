import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to your PrismaClient instance

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Query Neon using Prisma client, fetching the latest 15 alerts sorted descending
    const alerts = await prisma.whaleAlert.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 15,
    });

    // Remap properties to match what your custom frontend UI is expecting
    const uiFormattedResults = alerts.map((alert) => ({
      hash: alert.hash,
      asset: alert.asset,
      value: alert.valueDisplay,
      from: alert.fromLabel,
      to: alert.toLabel,
      sentiment: alert.sentiment,
      explanation: alert.explanation,
      network: alert.network,
      timestamp: alert.timestamp.toISOString(),
    }));

    return NextResponse.json({ result: uiFormattedResults });
  } catch (error) {
    console.error("Failed to fetch data via Prisma:", error);
    return NextResponse.json(
      { error: "Failed to fetch live whale data." },
      { status: 500 },
    );
  }
}
