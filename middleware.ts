// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example: Read properties from the request so it is actively used
  const currentPath = request.nextUrl.pathname;
  console.log(`[Kryptonal Middleware] Incoming request for: ${currentPath}`);

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     *
     * AND explicitly exclude:
     * - Dynamic Open Graph & Twitter image routes
     * - All public files with static extensions (.svg, .png, .jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*opengraph-image.*|.*twitter-image.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2)).*)",
  ],
};
