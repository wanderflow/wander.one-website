import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  buildCustomSchemeUrl,
  buildInviteAppLink,
  buildInviteShareUrl,
  isAppLinkHost,
} from "./deepLinking.mjs";

describe("invite deep linking", () => {
  it("builds a verified app link on the links domain with the invite code", () => {
    assert.equal(
      buildInviteAppLink({ slug: "summer dinner", inviteCode: "0123" }),
      "https://links.wander.one/share/summer%20dinner?invite_code=0123",
    );
  });

  it("builds the canonical share link used for clipboard fallback", () => {
    assert.equal(
      buildInviteShareUrl({ slug: "abc", inviteCode: "9 8" }),
      "https://wander.one/share/abc?invite_code=9%208",
    );
  });

  it("builds the custom scheme link for last-resort same-host retries", () => {
    assert.equal(
      buildCustomSchemeUrl({ slug: "abc", inviteCode: "0123" }),
      "wanderone://share/abc?invite_code=0123",
    );
  });

  it("detects when the current host is already the verified app-link host", () => {
    assert.equal(isAppLinkHost("https://links.wander.one/download"), true);
    assert.equal(isAppLinkHost("https://wander.one/share/abc"), false);
  });
});
