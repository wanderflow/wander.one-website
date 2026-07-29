export const APP_LINK_BASE_URL = "https://links.wander.one";
export const SHARE_BASE_URL = "https://www.wander.one";

function buildSharePath(slug) {
  return `/share/${encodeURIComponent(String(slug || "").trim())}`;
}

function appendInviteCode(url, inviteCode) {
  const code = String(inviteCode || "").trim();
  if (code) {
    url.search = `?invite_code=${encodeURIComponent(code)}`;
  }
  return url.toString();
}

export function buildInviteAppLink({
  slug,
  inviteCode,
  baseUrl = APP_LINK_BASE_URL,
}) {
  const url = new URL(buildSharePath(slug), baseUrl);
  return appendInviteCode(url, inviteCode);
}

export function buildInviteShareUrl({
  slug,
  inviteCode,
  baseUrl = SHARE_BASE_URL,
}) {
  const url = new URL(buildSharePath(slug), baseUrl);
  return appendInviteCode(url, inviteCode);
}

export function resolveInviteLaunchTarget({ slug, inviteCode }) {
  const normalizedSlug = String(slug || "").trim();
  const normalizedInviteCode = String(inviteCode || "").trim();

  if (!normalizedSlug || !normalizedInviteCode) {
    return { type: "store" };
  }

  return {
    type: "app_link",
    url: buildInviteAppLink({
      slug: normalizedSlug,
      inviteCode: normalizedInviteCode,
    }),
  };
}

export function buildCustomSchemeUrl({ slug, inviteCode }) {
  const encodedSlug = encodeURIComponent(String(slug || "").trim());
  const encodedInviteCode = encodeURIComponent(String(inviteCode || "").trim());
  const query = encodedInviteCode ? `?invite_code=${encodedInviteCode}` : "";
  return `wanderone://share/${encodedSlug}${query}`;
}

export function isAppLinkHost(href, baseUrl = APP_LINK_BASE_URL) {
  try {
    return new URL(href).host === new URL(baseUrl).host;
  } catch {
    return false;
  }
}
