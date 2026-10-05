import { NextResponse } from "next/server";
import { resolveShareRewrite } from "./lib/wellKnownAppLinks.mjs";

export function middleware(request) {
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
  matcher: ["/share/:path*"],
};
