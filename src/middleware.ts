import { NextResponse } from "next/server";

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
  "/news-feed",
]);

const PUBLIC_FILE = /\.[^/]+$/;

function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function middleware(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/.well-known") ||
      pathname === "/favicon.ico" ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      PUBLIC_FILE.test(pathname)
    ) {
      return NextResponse.next({ request: { headers: requestHeaders } });
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

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/:path*"],
};
