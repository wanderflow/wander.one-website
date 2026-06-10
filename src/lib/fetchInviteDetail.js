const API_BASE_URL = process.env.WANDER_API_BASE_URL || "https://api.wander.one";
const INVITE_DETAIL_URL = `${API_BASE_URL}/ai-topics/invite_links/detail`;

export async function fetchInviteDetailForMeta(body) {
  try {
    const res = await fetch(INVITE_DETAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
