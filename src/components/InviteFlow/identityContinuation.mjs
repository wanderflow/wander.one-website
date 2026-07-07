export function resultStatusToResultKind(resultStatus) {
  if (resultStatus === "approved") return "approved";
  if (resultStatus === "pending") return "pending";
  if (resultStatus === "rejected") return "rejected";
  if (resultStatus === "cant_go") return "cant_go";
  return null;
}

export function resolveIdentityContinuation({
  session,
  identity,
  rsvpIntent,
  questionCount,
}) {
  const resultKind = resultStatusToResultKind(session?.result_status);
  if (resultKind) {
    return { type: "result", resultKind };
  }

  const firstName = identity?.first_name || "";
  const needsProfile = identity?.needs_profile ?? !firstName;
  if (needsProfile) {
    return { type: "name", name: firstName };
  }

  if ((rsvpIntent === "going" || rsvpIntent === "maybe") && questionCount > 0) {
    return { type: "questions", name: firstName };
  }

  return { type: "complete", name: firstName };
}
