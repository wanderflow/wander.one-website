import { fetchInviteDetailForMeta } from "@/lib/fetchInviteDetail";
import {
  buildShareOgTitle,
  MESSAGING_SHARE_DESCRIPTION,
  resolveSharePreviewBucket,
  socialShareDescription,
} from "@/lib/shareLinkPreview";

const DEFAULT_SITE = "https://wander.one";
const FALLBACK_IMAGE_PATH = "/images/wander_logo_colorful.png";

export function firstQuery(value) {
  if (value === undefined || value === null) return "";
  return Array.isArray(value) ? value[0] ?? "" : value;
}

function siteOriginFromHeaders(headerList) {
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return DEFAULT_SITE;
  const proto = headerList.get("x-forwarded-proto") || "https";
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return DEFAULT_SITE;
  }
  return `${proto}://${host}`;
}

function absolutePhotoUrl(photo) {
  if (!photo || typeof photo !== "string") return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("//")) return `https:${photo}`;
  return `${DEFAULT_SITE}${photo.startsWith("/") ? "" : "/"}${photo}`;
}

/**
 * 供 /share/[slug] 与经 middleware 重写后的 /download?slug=… 共用，
 * 保证分享链接的 OG/Twitter 图与标题一致。
 */
export async function buildSharePageMetadata({
  slug,
  inviteCode,
  resolvedSearch,
  headerList,
}) {
  const ua = headerList.get("user-agent");
  const bucket = resolveSharePreviewBucket(resolvedSearch, ua);
  const pageOrigin = siteOriginFromHeaders(headerList);

  const inviteLink = `wander.one/share/${slug}?invite_code=${inviteCode}`;
  const canonicalPath = `/share/${slug}${inviteCode ? `?invite_code=${encodeURIComponent(inviteCode)}` : ""}`;
  const pageUrl = `${pageOrigin}${canonicalPath}`;

  const data = await fetchInviteDetailForMeta({ invite_link: inviteLink });

  const ogTitle = buildShareOgTitle(data?.subject);
  const description =
    bucket === "social"
      ? socialShareDescription()
      : MESSAGING_SHARE_DESCRIPTION;
  const imageUrl =
    absolutePhotoUrl(data?.photo) || `${pageOrigin}${FALLBACK_IMAGE_PATH}`;

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
