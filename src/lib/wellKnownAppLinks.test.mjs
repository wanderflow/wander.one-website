import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAndroidAssetLinks,
  buildAppleAppSiteAssociation,
} from "./wellKnownAppLinks.mjs";

describe("well-known app link files", () => {
  it("only enables iOS universal links on links.wander.one", () => {
    assert.deepEqual(
      buildAppleAppSiteAssociation("wander.one").applinks.details,
      [],
    );
    assert.deepEqual(
      buildAppleAppSiteAssociation("www.wander.one").applinks.details,
      [],
    );
    assert.deepEqual(
      buildAppleAppSiteAssociation("links.wander.one").applinks.details[0].paths,
      ["/share/*"],
    );
  });

  it("only enables Android app links on links.wander.one", () => {
    assert.deepEqual(buildAndroidAssetLinks("wander.one"), []);
    assert.deepEqual(buildAndroidAssetLinks("www.wander.one"), []);
    assert.equal(
      buildAndroidAssetLinks("links.wander.one")[0].target.package_name,
      "com.wander.one.app",
    );
  });
});
