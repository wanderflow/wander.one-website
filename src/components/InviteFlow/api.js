async function ensureOk(response) {
  if (response.ok) return response;
  const text = await response.text();
  throw new Error(text || `Request failed with ${response.status}`);
}

export function normalizeInviteDetail(payload) {
  const detail = payload?.detail ?? payload ?? {};
  const questions = Array.isArray(detail.preference_question)
    ? detail.preference_question
    : [];

  return {
    subject: detail.subject || detail.group_subject || "Wander event",
    photo: detail.photo || detail.group_photo || "",
    time: detail.time || detail.group_time || null,
    location: detail.location || detail.group_location || "",
    description: detail.description || detail.group_content || "",
    creator_user_id: detail.creator_user_id || "",
    member_count: detail.member_count ?? detail.members?.length ?? 0,
    members: detail.members || detail.group_members || [],
    join_questions: questions.map((question, index) => {
      const options = question.predefined_options || question.options || [];
      const questionText = question.question || question.label || "";
      return {
        id: question.question_id || `question_${index}`,
        question: questionText,
        label: `Q${index + 1}: (${questionText})`,
        type: options.length > 0 ? "choice" : "text",
        options,
        placeholder: "Type your answer...",
      };
    }),
    raw: payload,
  };
}

export function resultStatusToEventCard(resultStatus) {
  if (resultStatus === "approved") return "approved";
  if (resultStatus === "pending") return "pending";
  if (resultStatus === "rejected") return "rejected";
  if (resultStatus === "cant_go") return "cant_go";
  return null;
}

export function resultStatusToResultKind(resultStatus) {
  if (resultStatus === "approved") return "approved";
  if (resultStatus === "pending") return "pending";
  if (resultStatus === "rejected") return "rejected";
  if (resultStatus === "cant_go") return "cant_go";
  return null;
}

export async function fetchWebInvite({ slug, inviteCode, clerkUserId }) {
  const params = new URLSearchParams();
  if (inviteCode) params.set("invite_code", inviteCode);
  if (clerkUserId) params.set("clerk_user_id", clerkUserId);
  const response = await fetch(`/api/web-onboarding/invites/${slug}?${params}`, {
    cache: "no-store",
  });
  const okResponse = await ensureOk(response);
  return okResponse.json();
}

export async function createWebSession({ slug, inviteCode }) {
  const response = await fetch("/api/web-onboarding/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, invite_code: inviteCode }),
  });
  const okResponse = await ensureOk(response);
  return okResponse.json();
}

export async function updateWebRsvp({ sessionId, rsvpStatus }) {
  const response = await fetch(`/api/web-onboarding/sessions/${sessionId}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rsvp_status: rsvpStatus }),
  });
  const okResponse = await ensureOk(response);
  return okResponse.json();
}

export async function submitWebAnswers({ sessionId, clerkUserId, questions, answers }) {
  const response = await fetch(`/api/web-onboarding/sessions/${sessionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      answers: questions.map((question) => ({
        question_id: question.id,
        question: question.question || question.label,
        answer: answers[question.id] || "",
      })),
    }),
  });
  const okResponse = await ensureOk(response);
  return okResponse.json();
}

export async function fetchWebIdentityStatus({
  sessionId,
  clerkUserId,
  displayName,
}) {
  const response = await fetch(`/api/web-onboarding/sessions/${sessionId}/identity-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      display_name: displayName,
    }),
  });
  const okResponse = await ensureOk(response);
  return okResponse.json();
}

export async function completeWebSession({
  sessionId,
  clerkUserId,
  displayName,
}) {
  const response = await fetch(`/api/web-onboarding/sessions/${sessionId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      display_name: displayName,
    }),
  });
  const okResponse = await ensureOk(response);
  return okResponse.json();
}
