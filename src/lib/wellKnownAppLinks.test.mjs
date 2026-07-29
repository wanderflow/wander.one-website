import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as appLinks from "./wellKnownAppLinks.mjs";

const {
  buildAndroidAssetLinks,
  buildAppleAppSiteAssociation,
} = appLinks;

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

  it("uses the app store fallback when an app link is not claimed", () => {
    assert.equal(typeof appLinks.resolveShareRewrite, "function");
    assert.deepEqual(
      appLinks.resolveShareRewrite({
        host: "links.wander.one",
        slug: "summer",
      }),
      { pathname: "/download", slug: null },
    );
    assert.deepEqual(
      appLinks.resolveShareRewrite({
        host: "www.wander.one",
        slug: "summer",
      }),
      { pathname: "/download", slug: "summer" },
    );
  });
});
