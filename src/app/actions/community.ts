// app/actions/community.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Utility to create a clean, URL-friendly slug
function generateSlug(text: string): string {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Append short timestamp suffix to guarantee uniqueness
  return `${baseSlug}-${Date.now().toString().slice(-4)}`;
}

export async function createCommunityPost(title: string, content: string) {
  // 1. Verify Authentication at the execution level
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to create a post.");
  }

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  // 2. Generate slug for SEO
  const slug = generateSlug(title);

  // 3. Perform the database mutation safely
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      authorId: session.user.id,
    },
  });

  return post;
}
