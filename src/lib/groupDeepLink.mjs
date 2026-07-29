export const GROUP_DEEP_LINK_TYPE = "message";

export function buildGroupDeepLink({ groupId }) {
  const normalizedGroupId = String(groupId || "").trim();
  const params = new URLSearchParams({
    group_id: normalizedGroupId,
    type: GROUP_DEEP_LINK_TYPE,
  });

  return `wanderone://?${params.toString()}`;
}
