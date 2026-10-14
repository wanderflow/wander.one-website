import { it } from "node:test";
import assert from "node:assert/strict";
import { createFlowState, inviteFlowReducer } from "./machine.js";

it("keeps birthday selection and answers when returning from questions", () => {
  let state = { ...createFlowState(), view: "name", answers: { q1: "Saved answer" } };
  state = inviteFlowReducer(state, { type: "CONTINUE_TO_BIRTHDAY" });
  assert.equal(state.view, "birthday");
  for (const [field, value] of Object.entries({ birthMonth: "2", birthDay: "29", birthYear: "2000" })) {
    state = inviteFlowReducer(state, { type: "UPDATE_PROFILE", field, value });
  }
  state = inviteFlowReducer(state, { type: "CONTINUE_TO_QUESTIONS" });
  state = inviteFlowReducer(state, { type: "BACK" });
  assert.equal(state.view, "birthday");
  assert.equal(state.profile.birthYear, "2000");
  assert.deepEqual(state.answers, { q1: "Saved answer" });
  state = inviteFlowReducer(state, { type: "BACK" });
  assert.equal(state.view, "name");
});

it("returns to verification when the name page was skipped", () => {
  let state = { ...createFlowState(), view: "otp" };
  state = inviteFlowReducer(state, { type: "CONTINUE_TO_BIRTHDAY" });
  state = inviteFlowReducer(state, { type: "BACK" });
  assert.equal(state.view, "otp");
});

it("returns signed-in users to RSVP when no verification page was visited", () => {
  let state = { ...createFlowState(), eventCard: "rsvp" };
  state = inviteFlowReducer(state, { type: "CONTINUE_TO_BIRTHDAY" });
  state = inviteFlowReducer(state, { type: "BACK" });
  assert.equal(state.view, "event");
  assert.equal(state.eventCard, "rsvp");
});
