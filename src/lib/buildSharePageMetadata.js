import { fetchInviteDetailForMeta } from "@/lib/fetchInviteDetail";
import {
  buildShareOgTitle,
  MESSAGING_SHARE_DESCRIPTION,
  resolveSharePreviewBucket,
  socialShareDescription,
} from "@/lib/shareLinkPreview";

/** 规范中 og:url 使用的站点根（永久 ID，与访问时的隧道域名无关） */
const DEFAULT_SITE = "https://wander.one";

/** 品牌 Logo：只用于 favicon / apple-touch-icon，不作为 og:image 封面 */
const BRAND_LOGO_PATH = "/images/wander_logo_colorful.png";

/** 无群图时的 OG 大图占位（横版场景图，不是品牌角标） */
const OG_COVER_FALLBACK_PATH = "/images/download_backgroup_image.png";

/** 与静态回退图一致，供 og:image:width / og:image:height（https://ogp.me/ 结构化属性） */
const OG_FALLBACK_PIXEL_WIDTH = 1536;
const OG_FALLBACK_PIXEL_HEIGHT = 2856;

export function firstQuery(value) {
  if (value === undefined || value === null) return "";
  return Array.isArray(value) ? value[0] ?? "" : value;
}

function absolutePhotoUrl(photo) {
  if (!photo || typeof photo !== "string") return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("//")) return `https:${photo}`;
  return `${DEFAULT_SITE}${photo.startsWith("/") ? "" : "/"}${photo}`;
}

function resolveShareDisplayDetail(data) {
  if (data?.target_type === "room" && data?.room && typeof data.room === "object") {
    return data.room;
  }
  return data || {};
}

function displaySubject(detail) {
  return detail.subject || detail.room_subject || detail.group_subject;
}

function displayPhoto(detail) {
  return detail.photo || detail.room_photo || detail.group_photo;
}

function appendInviteCodeToTitle(title, inviteCode) {
  const code = String(inviteCode || "").trim();
  if (!code) return title;
  return `${title} [${code}]`;
}

/**
 * 按 https://ogp.me/ 为单张 og:image 提供结构化字段（url / secure_url / type / width / height / alt）。
 * 远程群图未知尺寸时不填 width、height，避免与规范不符的虚假数值。
 */
function ogImageDescriptor(imageUrl, alt, pixelSize) {
  const pathForExt = imageUrl.split("?")[0];
  const ext = pathForExt.includes(".")
    ? pathForExt.split(".").pop()?.toLowerCase()
    : "";
  const type =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "gif"
          ? "image/gif"
          : ext === "webp"
            ? "image/webp"
            : undefined;

  const desc = {
    url: imageUrl,
    alt,
    ...(type ? { type } : {}),
    ...(imageUrl.startsWith("https://") ? { secureUrl: imageUrl } : {}),
    ...(pixelSize
      ? { width: pixelSize.width, height: pixelSize.height }
      : {}),
  };

  return desc;
}

/**
 * 供 /share/[slug] 与经 middleware 重写后的 /download?slug=… 共用。
 * Open Graph 四项基本要求：og:title、og:type、og:image、og:url（见 https://ogp.me/）。
 */
export async function buildSharePageMetadata({
  slug,
  inviteCode,
  resolvedSearch,
  headerList,
}) {
  const ua = headerList.get("user-agent");
  const bucket = resolveSharePreviewBucket(resolvedSearch, ua);

  const inviteLink = `wander.one/share/${slug}?invite_code=${inviteCode}`;
  const canonicalPath = `/share/${slug}${inviteCode ? `?invite_code=${encodeURIComponent(inviteCode)}` : ""}`;
  /** 规范：og:url 为对象的规范永久 URL，使用正式站点而非 ngrok */
  const canonicalObjectUrl = `${DEFAULT_SITE}${canonicalPath}`;

  const data = await fetchInviteDetailForMeta({ invite_link: inviteLink });
  const displayDetail = resolveShareDisplayDetail(data);

  const ogTitle = appendInviteCodeToTitle(
    buildShareOgTitle(displaySubject(displayDetail)),
    inviteCode,
  );
  const description =
    bucket === "social"
      ? socialShareDescription()
      : MESSAGING_SHARE_DESCRIPTION;
  const groupImageUrl = absolutePhotoUrl(displayPhoto(displayDetail));
  const staticCoverUrl = `${DEFAULT_SITE}${OG_COVER_FALLBACK_PATH}`;
  const coverImageUrl = groupImageUrl || staticCoverUrl;

  const ogImage = ogImageDescriptor(
    coverImageUrl,
    ogTitle,
    groupImageUrl
      ? undefined
      : { width: OG_FALLBACK_PIXEL_WIDTH, height: OG_FALLBACK_PIXEL_HEIGHT },
  );

  return {
    title: ogTitle,
    description,
    alternates: { canonical: canonicalObjectUrl },
    icons: {
      icon: BRAND_LOGO_PATH,
      apple: [
        {
          url: BRAND_LOGO_PATH,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      type: "website",
      url: canonicalObjectUrl,
      siteName: "Wander",
      title: ogTitle,
      description,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}
