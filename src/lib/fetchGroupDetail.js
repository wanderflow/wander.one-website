import { cache } from "react";

const API_BASE_URL = process.env.WANDER_API_BASE_URL || "https://api.wander.one";
const GROUP_DETAIL_URL = `${API_BASE_URL}/ai-topics/group_room_detail`;

export const fetchGroupDetail = cache(async (groupId) => {
  const normalizedGroupId = String(groupId || "").trim();
  if (!normalizedGroupId) return null;

  const response = await fetch(GROUP_DETAIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      group_id: normalizedGroupId,
      members_limit: 50,
      members_offset: 0,
    }),
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to load group details (${response.status})`);
  }

  const data = await response.json();
  return data?.target_type === "group" ? data : null;
});
