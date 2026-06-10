const RESULT_CONTENT = {
  direct_join: {
    icon: "👍",
    title: "You're on the list",
    body: "Without host review, you joined right away. Download Wander to chat with the group.",
    cta: "Enter Chat",
  },
  approved: {
    icon: "👍",
    title: "You're on the list",
    body: "We'll text you before the event. Download Wander to chat with the group.",
    cta: "Enter Chat",
  },
  pending: {
    icon: "⌛",
    title: "Request pending",
    body: "We'll let you know once you're approved. Help the host put a face to the name. download Wander to add your photo.",
    cta: "Complete your profile",
  },
  rejected: {
    icon: "✕",
    title: "You weren't added",
    body: ({ hostName }) =>
      `${hostName} wasn't able to add you this time. You can still explore other groups on Wander.`,
    cta: "Find other groups",
  },
  maybe: {
    icon: "🤔",
    title: "You're marked as maybe",
    body: "We'll check in closer to the date. Download Wander to explore more groups.",
    cta: "Find other groups",
  },
  cant_go: {
    icon: "🥲",
    title: "Maybe next time",
    body: ({ hostName }) =>
      `${hostName} will know you can't make it. Download Wander to explore more groups.`,
    cta: "Find other groups",
  },
};

export default function ResultScreen({
  styles,
  resultKind,
  hostName = "The host",
  onContinue,
}) {
  const content = RESULT_CONTENT[resultKind];
  const body =
    typeof content.body === "function"
      ? content.body({ hostName })
      : content.body;

  return (
    <div className={styles.resultViewport}>
      <div className={styles.pendingScreen}>
        <div className={styles.pendingIcon}>{content.icon}</div>
        <h1 className={styles.pendingTitle}>{content.title}</h1>
        <p className={styles.pendingBody}>{body}</p>
      </div>
      <div className={styles.pendingAction}>
        <button
          type="button"
          onClick={onContinue}
          className={styles.resultPrimaryButton}
        >
          {content.cta}
        </button>
      </div>
    </div>
  );
}
