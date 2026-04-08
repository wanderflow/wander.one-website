import { headers } from "next/headers";
import SharePageClient from "./SharePageClient";
import {
  buildSharePageMetadata,
  firstQuery,
} from "@/lib/buildSharePageMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const inviteCode = firstQuery(resolvedSearch?.invite_code);
  const headerList = await headers();

  return buildSharePageMetadata({
    slug,
    inviteCode,
    resolvedSearch,
    headerList,
  });
}

export default async function SharePage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const inviteCode = firstQuery(resolvedSearch?.invite_code);

  return <SharePageClient slug={slug} inviteCode={inviteCode} />;
}
