import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { resolveIdentityContinuation } from "./identityContinuation.mjs";

describe("resolveIdentityContinuation", () => {
  it("returns the backend result when the logged-in user already has an outcome", () => {
    const nextStep = resolveIdentityContinuation({
      session: { result_status: "approved" },
      identity: { first_name: "Ada", needs_profile: false, needs_birthday: false },
      rsvpIntent: "going",
      questionCount: 2,
    });

    assert.deepEqual(nextStep, {
      type: "result",
      resultKind: "approved",
    });
  });

  it("asks for a name when the logged-in user has no profile name", () => {
    const nextStep = resolveIdentityContinuation({
      session: { result_status: null },
      identity: { first_name: "", needs_profile: true },
      rsvpIntent: "going",
      questionCount: 0,
    });

    assert.deepEqual(nextStep, {
      type: "name",
      name: "",
    });
  });

  it("continues to questions before completion when RSVP requires answers", () => {
    const nextStep = resolveIdentityContinuation({
      session: { result_status: null },
      identity: { first_name: "Ada", needs_profile: false, needs_birthday: false },
      rsvpIntent: "maybe",
      questionCount: 1,
    });

    assert.deepEqual(nextStep, {
      type: "questions",
      name: "Ada",
    });
  });

  it("continues directly to completion when no profile or question step is needed", () => {
    const nextStep = resolveIdentityContinuation({
      session: { result_status: null },
      identity: { first_name: "Ada", needs_profile: false, needs_birthday: false },
      rsvpIntent: "cant_go",
      questionCount: 3,
    });

    assert.deepEqual(nextStep, {
      type: "complete",
      name: "Ada",
    });
  });

  it("requires a birthday even when the event has no join questions", () => {
    assert.deepEqual(resolveIdentityContinuation({
      session: {},
      identity: { first_name: "Ada", needs_name: false, needs_birthday: true, needs_profile: true },
      rsvpIntent: "going",
      questionCount: 0,
    }), { type: "birthday", name: "Ada" });
  });

  it("asks for a name before asking for a missing birthday", () => {
    assert.deepEqual(resolveIdentityContinuation({
      session: {},
      identity: { first_name: "", needs_name: true, needs_birthday: true, needs_profile: true },
      rsvpIntent: "going",
      questionCount: 1,
    }), { type: "name", name: "" });
  });

  it("collects missing birthday before showing an existing application outcome", () => {
    assert.deepEqual(resolveIdentityContinuation({
      session: { result_status: "pending" },
      identity: { first_name: "Ada", needs_name: false, needs_birthday: true },
      rsvpIntent: "going",
      questionCount: 1,
    }), { type: "birthday", name: "Ada" });
  });

  it("resumes completion without repeating saved answers after the birthday is supplied", () => {
    assert.deepEqual(resolveIdentityContinuation({
      session: { parent_expression_id: "saved-answers" },
      identity: { first_name: "Ada", needs_name: false, needs_birthday: false },
      rsvpIntent: "going",
      questionCount: 1,
    }), { type: "complete", name: "Ada" });
  });
});
