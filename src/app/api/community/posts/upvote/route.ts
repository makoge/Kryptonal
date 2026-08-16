import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json({ upvotes: updatedPost.upvotes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
