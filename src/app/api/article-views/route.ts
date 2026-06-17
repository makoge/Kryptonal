import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ views: 0 });
  }

  const result = await sql`
    SELECT views
    FROM article_views
    WHERE slug = ${slug}
  `;

  return NextResponse.json({
    views: result[0]?.views || 0,
  });
}

export async function POST(req: Request) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400 }
    );
  }

  await sql`
    INSERT INTO article_views (slug, views)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE
    SET views = article_views.views + 1
  `;

  const result = await sql`
    SELECT views
    FROM article_views
    WHERE slug = ${slug}
  `;

  return NextResponse.json({
    views: result[0]?.views || 0,
  });
}