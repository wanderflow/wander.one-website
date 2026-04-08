/**
 * Link unfurl (OG) is one HTML response per URL. To vary copy per “channel family” we use:
 * 1) Query param (reliable): ?share_style=messaging | social  (short: ?ss=m | ss=s)
 * 2) User-Agent hints for known crawlers (best-effort; iMessage often looks like Safari)
 */

const DISPLAY_HOST = process.env.NEXT_PUBLIC_WANDER_WEB_HOST || "wander.one";

export const MESSAGING_SHARE_DESCRIPTION = "right crowd IRL";

export function socialShareDescription() {
  return `网页：${DISPLAY_HOST}`;
}

function normalizeParam(value) {
  if (value === undefined || value === null) return "";
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || "").toLowerCase().trim();
}

/**
 * @param {Record<string, string | string[] | undefined> | undefined} searchParams
 * @param {string | null} userAgent
 * @returns {"messaging" | "social"}
 */
export function resolveSharePreviewBucket(searchParams, userAgent) {
  const style = normalizeParam(searchParams?.share_style);
  const short = normalizeParam(searchParams?.ss);

  if (style === "social" || short === "social" || short === "s") return "social";
  if (style === "messaging" || short === "messaging" || short === "m") {
    return "messaging";
  }

  const ua = (userAgent || "").toLowerCase();

  if (
    /instagram|tiktok|snapchat|bytespider|bytedance|musical\.ly/i.test(ua)
  ) {
    return "social";
  }

  if (
    /whatsapp|discord|telegram|slack|facebookexternalhit|facebot|applebot|linkedinexternalhit/i.test(
      ua,
    )
  ) {
    return "messaging";
  }

  return "messaging";
}

export function buildShareOgTitle(subject) {
  const s = subject && String(subject).trim();
  const head = s || "Join a group";
  return `${head} | Wander`;
}
