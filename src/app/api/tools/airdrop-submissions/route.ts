import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminKey = req.nextUrl.searchParams.get("adminKey");
  const isAdmin = adminKey === process.env.AIRDROP_ADMIN_KEY;

  const submissions = await prisma.airdropSubmission.findMany({
    where: isAdmin ? {} : { status: "approved" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.platform || !body.description || !body.officialUrl) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  const submission = await prisma.airdropSubmission.create({
    data: {
      name: String(body.name).slice(0, 80),
      token: String(body.token || "TBA").slice(0, 30),
      platform: String(body.platform).slice(0, 80),
      chain: String(body.chain || "Unknown").slice(0, 50),
      description: String(body.description).slice(0, 600),
      officialUrl: String(body.officialUrl).slice(0, 200),
      twitterUrl: body.twitterUrl
        ? String(body.twitterUrl).slice(0, 200)
        : null,
      status: "pending",
    },
  });

  return NextResponse.json({ success: true, submission });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  if (body.adminKey !== process.env.AIRDROP_ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const allowed = ["approved", "rejected", "pending"];

  if (!body.id || !allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await prisma.airdropSubmission.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ success: true });
}
