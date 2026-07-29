export function shouldOpenAppBeforeStore(resultKind) {
  return Boolean(resultKind);
}

export function resultTriggerPage(resultKind) {
  if (resultKind === "approved" || resultKind === "direct_join") {
    return "confirmation";
  }
  return resultKind || "confirmation";
}

export function resolveFloatingEventAction(eventCard) {
  if (eventCard === "join") {
    return {
      type: "join",
      label: "Join",
    };
  }

  if (eventCard === "approved") {
    return {
      type: "app",
      label: "Enter Chat",
      triggerPage: "confirmation",
    };
  }

  if (eventCard === "pending") {
    return {
      type: "app",
      label: "Complete your profile",
      triggerPage: "pending",
    };
  }

  if (
    eventCard === "rejected" ||
    eventCard === "maybe" ||
    eventCard === "cant_go"
  ) {
    return {
      type: "reset",
      label: "Find other groups",
    };
  }

  return null;
}
