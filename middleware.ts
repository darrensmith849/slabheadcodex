import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GONE_ROUTES = new Set([
  "/sample-page",
  "/testpage",
  "/test-shop",
  "/hello-world",
  "/default-redirect-page",
  "/member-tos-page",
  "/public-individual-page",
  "/login-customizer",
  "/membership",
  "/subscription-plan",
  "/activate",
  "/my-account-2",
  "/my-account",
  "/member-login",
  "/register",
  "/member-logout",
  "/lost-password",
  "/checkout-page",
  "/thank-you-page",
  "/members",
  "/basket",
  "/checkout",
  "/news-feed",
]);

const PUBLIC_FILE = /\.[^/]+$/;

function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal/static/system routes to keep middleware stable on Edge.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const normalized = normalizePath(pathname);
  if (GONE_ROUTES.has(normalized)) {
    return new Response("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
