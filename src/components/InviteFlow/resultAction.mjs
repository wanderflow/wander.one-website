export function shouldOpenAppBeforeStore(resultKind) {
  return Boolean(resultKind);
}

export function resultTriggerPage(resultKind) {
  if (resultKind === "approved" || resultKind === "direct_join") {
    return "confirmation";
  }
  return resultKind || "confirmation";
}
