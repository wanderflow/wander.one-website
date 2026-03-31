import { NextResponse } from "next/server";

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

  const url = request.nextUrl.clone();
  url.pathname = "/download";
  url.searchParams.set("slug", slug);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/share/:path*"],
};
