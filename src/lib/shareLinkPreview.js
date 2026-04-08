/**
 * 同一 URL 只有一套 OG meta。按渠道分开展示依赖：
 * 1) 查询参数（推荐）：?share_style=messaging 或 ?share_style=social，简写 ?ss=m / ?ss=s
 * 2) 常见爬虫 User-Agent（尽力而为；部分客户端 UA 与普通浏览器无异）
 */

/** 标题格式与 OGP 规范一致：「群主题 | Wander」（半角竖线） */
export const SHARE_TITLE_BAR = "|";

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
 * @returns {"messaging" 或 "social"}
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

/**
 * 例：Dinner tonight 🍝 | Wander
 */
export function buildShareOgTitle(subject) {
  const s = subject && String(subject).trim();
  const head = s || "Join a group";
  return `${head} ${SHARE_TITLE_BAR} Wander`;
}
