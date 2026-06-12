const ANALYTICS_SESSION_KEY = "wander_web_analytics_session_id";
const WEB_JOIN_ENTITY_TYPE = "web_join_flow";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getAnalyticsSessionId() {
  if (typeof window === "undefined") return createId();

  try {
    const existing = window.localStorage.getItem(ANALYTICS_SESSION_KEY);
    if (existing) return existing;

    const next = createId();
    window.localStorage.setItem(ANALYTICS_SESSION_KEY, next);
    return next;
  } catch {
    return createId();
  }
}

export function getTrafficSource() {
  if (typeof window === "undefined") return "direct";

  const params = new URLSearchParams(window.location.search);
  const explicitSource =
    params.get("source") ||
    params.get("utm_source") ||
    params.get("ref");
  if (explicitSource) return explicitSource.trim().toLowerCase();

  const referrer = document.referrer || "";
  if (!referrer) return "direct";
  try {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.hostname.includes("wander.one")) return "direct";
    return "social";
  } catch {
    return "direct";
  }
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") || null;
}

export function buildInviteTrackingContext({
  invite,
  webSession,
  slug,
  userId,
}) {
  const raw = invite?.raw || {};
  const inviteRecord = raw.invite || {};
  const detail = raw.detail || {};
  const groupInfo = detail.group_info || detail.group || detail.target || detail;
  const sessionId = getAnalyticsSessionId();
  const eventId = firstValue(
    webSession?.group_id,
    inviteRecord.group_id,
    groupInfo.group_id,
    detail.group_id,
    slug,
  );
  const hostId = firstValue(
    invite?.creator_user_id,
    inviteRecord.user_id,
    groupInfo.creator_user_id,
    detail.creator_user_id,
  );

  return {
    session_id: sessionId,
    web_session_id: webSession?.session_id || null,
    user_id: userId || `anon_${sessionId}`,
    event_id: eventId,
    host_id: hostId,
    source: getTrafficSource(),
    platform: "web",
  };
}

export function trackWebJoinEvent(eventType, context, properties = {}, options = {}) {
  if (typeof window === "undefined" || !context) {
    return Promise.resolve(null);
  }

  const trackingEventId = createId();
  const payload = {
    tracking_event_id: trackingEventId,
    user_id: context.user_id,
    event_type: eventType,
    entity_type: WEB_JOIN_ENTITY_TYPE,
    entity_id: context.event_id || "unknown",
    event_data: {
      ...context,
      ...properties,
      tracking_event_id: trackingEventId,
      occurred_at_ms: Date.now(),
    },
  };

  const body = JSON.stringify(payload);

  if (options.preferBeacon && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/events/track", blob)) {
      return Promise.resolve({ queued: true });
    }
  }

  return fetch("/api/events/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: Boolean(options.keepalive),
  }).catch((error) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[web tracking] failed:", eventType, error);
    }
    return null;
  });
}
