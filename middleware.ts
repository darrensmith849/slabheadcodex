import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const goneRoutes = new Set([
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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (goneRoutes.has(pathname)) {
    return new NextResponse("Gone", {
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
