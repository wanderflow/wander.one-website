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
  const firstName = identity?.first_name || "";
  const needsName = identity?.needs_name ?? !firstName;
  if (needsName) {
    return { type: "name", name: firstName };
  }

  if (identity?.needs_birthday !== false) {
    return { type: "birthday", name: firstName };
  }

  const resultKind = resultStatusToResultKind(session?.result_status);
  if (resultKind) {
    return { type: "result", resultKind };
  }

  if ((rsvpIntent === "going" || rsvpIntent === "maybe") && questionCount > 0 && !session?.parent_expression_id) {
    return { type: "questions", name: firstName };
  }

  return { type: "complete", name: firstName };
}
