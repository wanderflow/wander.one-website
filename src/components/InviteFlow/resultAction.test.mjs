import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resultTriggerPage,
  shouldOpenAppBeforeStore,
} from "./resultAction.mjs";

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
});
