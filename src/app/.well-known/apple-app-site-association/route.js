import { headers } from "next/headers";
import { buildAppleAppSiteAssociation } from "@/lib/wellKnownAppLinks.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");

  return Response.json(buildAppleAppSiteAssociation(host), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
