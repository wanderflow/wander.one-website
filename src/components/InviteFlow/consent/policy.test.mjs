import test from "node:test";
import assert from "node:assert/strict";
import { shouldPromptForJoinConsent, isJoinIntent } from "./policy.mjs";
test("prompts on every join after a previous skip", () => {
  assert.equal(shouldPromptForJoinConsent({consent: false, userId: "guest", ownerId: "host", promptedAt: "2026-09-01"}), true);
});
test("skips owners and users who already allow texts", () => {
  assert.equal(shouldPromptForJoinConsent({consent: false, userId: "host", ownerId: "host"}), false);
  assert.equal(shouldPromptForJoinConsent({consent: true, userId: "guest", ownerId: "host"}), false);
});
test("does not depend on RSVP, event time or community type", () => {
  assert.equal(shouldPromptForJoinConsent({consent: null, userId: "guest", ownerId: "host", rsvpEnabled: false}), true);
});

test("declining attendance is not a join", () => {
  assert.equal(isJoinIntent("cant_go"), false);
  assert.equal(isJoinIntent("going"), true);
  assert.equal(isJoinIntent("maybe"), true);
});
