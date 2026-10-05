import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveShareRewrite } from "./lib/wellKnownAppLinks.mjs";

const textConsentMiddleware = clerkMiddleware();

export function middleware(request, event) {
  if (request.nextUrl.pathname === "/api/text-message-consent") {
    if (!process.env.CLERK_SECRET_KEY) {
      return NextResponse.json({ detail: "Text updates are temporarily unavailable. Please try again later." }, { status: 503 });
    }
    return textConsentMiddleware(request, event);
  }
  const sharePrefix = "/share/";
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(sharePrefix)) {
    return NextResponse.next();
  }

  const slug = pathname.slice(sharePrefix.length);
  if (!slug || slug.includes("/")) {
    return NextResponse.next();
  }

  const rewrite = resolveShareRewrite({
    host: request.headers.get("host") || request.nextUrl.host,
    slug,
  });
  const url = request.nextUrl.clone();
  url.pathname = rewrite.pathname;
  if (rewrite.slug) {
    url.searchParams.set("slug", rewrite.slug);
  } else {
    url.searchParams.delete("slug");
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/share/:path*", "/api/text-message-consent"],
};
