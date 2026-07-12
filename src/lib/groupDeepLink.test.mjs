import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildGroupDeepLink,
  GROUP_DEEP_LINK_TYPE,
} from "./groupDeepLink.mjs";

describe("group deep linking", () => {
  it("passes the group id and message type to the app", () => {
    assert.equal(
      buildGroupDeepLink({ groupId: "group 123" }),
      "wanderone://?group_id=group+123&type=message",
    );
    assert.equal(GROUP_DEEP_LINK_TYPE, "message");
  });
});
