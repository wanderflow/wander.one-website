import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as resultActions from "./resultAction.mjs";

const {
  resultTriggerPage,
  shouldOpenAppBeforeStore,
} = resultActions;

describe("result action routing", () => {
  it("opens the app before the store for every completed result state", () => {
    for (const resultKind of [
      "direct_join",
      "approved",
      "pending",
      "rejected",
      "maybe",
      "cant_go",
    ]) {
      assert.equal(shouldOpenAppBeforeStore(resultKind), true);
    }
  });

  it("keeps confirmation tracking for joined outcomes", () => {
    assert.equal(resultTriggerPage("approved"), "confirmation");
    assert.equal(resultTriggerPage("direct_join"), "confirmation");
    assert.equal(resultTriggerPage("pending"), "pending");
  });

  it("shows a floating action for join and every restored result card", () => {
    assert.equal(typeof resultActions.resolveFloatingEventAction, "function");
    assert.deepEqual(resultActions.resolveFloatingEventAction("join"), {
      type: "join",
      label: "Join",
    });
    assert.deepEqual(resultActions.resolveFloatingEventAction("approved"), {
      type: "app",
      label: "Enter Chat",
      triggerPage: "confirmation",
    });
    assert.deepEqual(resultActions.resolveFloatingEventAction("pending"), {
      type: "app",
      label: "Complete your profile",
      triggerPage: "pending",
    });
    for (const eventCard of ["rejected", "maybe", "cant_go"]) {
      assert.deepEqual(resultActions.resolveFloatingEventAction(eventCard), {
        type: "reset",
        label: "Find other groups",
      });
    }
    assert.equal(resultActions.resolveFloatingEventAction("rsvp"), null);
  });
});
