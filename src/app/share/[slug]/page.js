import { headers } from "next/headers";
import SharePageClient from "./SharePageClient";
import { fetchInviteDetailForMeta } from "@/lib/fetchInviteDetail";
import {
  buildShareOgTitle,
  MESSAGING_SHARE_DESCRIPTION,
  resolveSharePreviewBucket,
  socialShareDescription,
} from "@/lib/shareLinkPreview";

const SITE = "https://wander.one";

export const dynamic = "force-dynamic";

function firstQuery(value) {
  if (value === undefined || value === null) return "";
  return Array.isArray(value) ? value[0] ?? "" : value;
}

function absoluteImageUrl(photo) {
  if (!photo || typeof photo !== "string") return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("//")) return `https:${photo}`;
  return `${SITE}${photo.startsWith("/") ? "" : "/"}${photo}`;
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const inviteCode = firstQuery(resolvedSearch?.invite_code);

  const headerList = await headers();
  const ua = headerList.get("user-agent");
  const bucket = resolveSharePreviewBucket(resolvedSearch, ua);

  const inviteLink = `wander.one/share/${slug}?invite_code=${inviteCode}`;
  const canonicalPath = `/share/${slug}${inviteCode ? `?invite_code=${encodeURIComponent(inviteCode)}` : ""}`;
  const pageUrl = `${SITE}${canonicalPath}`;

  const data = await fetchInviteDetailForMeta({ invite_link: inviteLink });

  const ogTitle = buildShareOgTitle(data?.subject);
  const description =
    bucket === "social"
      ? socialShareDescription()
      : MESSAGING_SHARE_DESCRIPTION;
  const imageUrl = absoluteImageUrl(data?.photo) || `${SITE}/wander.png`;

  return {
    title: ogTitle,
    description,
    alternates: { canonical: canonicalPath },
    icons: {
      icon: "/images/wander_logo_colorful.png",
      apple: [
        {
          url: "/images/wander_logo_colorful.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: "Wander",
      title: ogTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const inviteCode = firstQuery(resolvedSearch?.invite_code);

  return <SharePageClient slug={slug} inviteCode={inviteCode} />;
}
