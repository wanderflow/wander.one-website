import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildBirthday } from "./birthday.mjs";

describe("birthday selection", () => {
  const today = new Date(2026, 9, 14);
  it("requires all three date fields", () => {
    assert.equal(buildBirthday({ year: "2000", month: "1", day: "" }, today), "");
  });
  it("serializes a valid birthday without a timezone shift", () => {
    assert.equal(buildBirthday({ year: "2000", month: "1", day: "9" }, today), "2000-01-09");
  });
  it("rejects impossible dates and accepts leap days", () => {
    assert.equal(buildBirthday({ year: "2001", month: "2", day: "29" }, today), "");
    assert.equal(buildBirthday({ year: "2000", month: "2", day: "29" }, today), "2000-02-29");
  });
  it("rejects future birthdays but allows today's date", () => {
    assert.equal(buildBirthday({ year: "2026", month: "10", day: "15" }, today), "");
    assert.equal(buildBirthday({ year: "2026", month: "10", day: "14" }, today), "2026-10-14");
  });
});
