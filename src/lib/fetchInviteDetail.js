const INVITE_DETAIL_URL = "https://api.wander.one/ai-topics/invite_links/detail";

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
