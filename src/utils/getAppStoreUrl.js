const APPLE_URL =
  "https://apps.apple.com/us/app/wander-right-crowd-irl/id6474634049";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.wander.one.app";

/**
 * 根据当前环境返回对应应用商店链接：
 * - iOS (iPhone/iPad) → Apple
 * - Android → Google Play
 * - 桌面 Mac → Apple，桌面非 Mac → Google Play
 */
export function getAppStoreUrl() {
  if (typeof navigator === "undefined") return APPLE_URL;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";

  if (/iPhone|iPad|iPod/i.test(ua)) return APPLE_URL;
  if (/Android/i.test(ua)) return GOOGLE_PLAY_URL;

  const isMac = /Mac|Macintosh|iPhone|iPad/i.test(platform) || /Mac/i.test(ua);
  return isMac ? APPLE_URL : GOOGLE_PLAY_URL;
}
