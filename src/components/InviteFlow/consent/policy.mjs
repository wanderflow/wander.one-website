export function shouldPromptForJoinConsent({consent, userId, ownerId}) {
  return !!userId && userId !== ownerId && consent !== true;
}

export function isJoinIntent(rsvpIntent) {
  return rsvpIntent === "going" || rsvpIntent === "maybe";
}
