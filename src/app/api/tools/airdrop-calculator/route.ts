import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userPoints, totalPoints, fdv, airdropPct, gasSpent } = body;

    if (!userPoints || !totalPoints || !fdv || !airdropPct) {
      return NextResponse.json(
        { error: "Missing calculation inputs" },
        { status: 400 },
      );
    }

    const sharePct = (userPoints / totalPoints) * 100;
    const poolUsd = fdv * (airdropPct / 100);
    const grossVal = (userPoints / totalPoints) * poolUsd;
    const netVal = grossVal - (gasSpent || 0);

    return NextResponse.json({
      success: true,
      data: {
        sharePct: Number(sharePct.toFixed(6)),
        grossEstimatedUsd: Math.round(grossVal),
        netProfitUsd: Math.round(netVal),
        roiPct: gasSpent ? Math.round((netVal / gasSpent) * 100) : 0,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
