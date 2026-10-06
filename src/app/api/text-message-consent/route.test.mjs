import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

async function loadRoute({signedIn = true, verified = true} = {}) {
  const requests = [];
  const context = vm.createContext({Response, process: {env: {}}, fetch: async (url, options) => {
    requests.push({url, ...options});
    return Response.json({text_message_consent: true});
  }});
  const sdk = new vm.SyntheticModule(["auth", "currentUser"], function () {
    this.setExport("auth", async () => ({userId: signedIn ? "authenticated-user" : null, getToken: async () => "session-token"}));
    this.setExport("currentUser", async () => ({phoneNumbers: [{phoneNumber: "+14165550123", verification: {status: verified ? "verified" : "unverified"}}]}));
  }, {context});
  const source = await readFile(new URL("./route.js", import.meta.url), "utf8");
  const route = new vm.SourceTextModule(source, {context});
  await route.link(() => sdk);
  await route.evaluate();
  return {api: route.namespace, requests};
}
function request(body) { return new Request("http://localhost/api/text-message-consent", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)}); }
test("unauthenticated reads never reach the backend", async () => {
  const {api, requests} = await loadRoute({signedIn: false});
  assert.equal((await api.GET(new Request("http://localhost/api/text-message-consent"))).status, 401);
  assert.equal(requests.length, 0);
});
test("unverified phone cannot opt in", async () => {
  const {api, requests} = await loadRoute({verified: false});
  assert.equal((await api.POST(request({phone_number: "+14165550123", text_message_consent: true}))).status, 400);
  assert.equal(requests.length, 0);
});
test("verified allow uses authenticated identity, ignoring a supplied user ID", async () => {
  const {api, requests} = await loadRoute();
  assert.equal((await api.POST(request({user_id: "another-user", phone_number: "+14165550123", text_message_consent: true}))).status, 200);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].headers.Authorization, "Bearer session-token");
  assert.deepEqual(JSON.parse(requests[0].body), {user_id: "authenticated-user", phone_number: "+14165550123", text_message_consent: true});
});
test("skip explicitly persists false", async () => {
  const {api, requests} = await loadRoute();
  await api.POST(request({phone_number: "+14165550123", text_message_consent: false}));
  assert.equal(JSON.parse(requests[0].body).text_message_consent, false);
});
test("rejects string booleans and a different phone", async () => {
  const {api, requests} = await loadRoute();
  assert.equal((await api.POST(request({phone_number: "+14165550123", text_message_consent: "true"}))).status, 400);
  assert.equal((await api.POST(request({phone_number: "+14165550999", text_message_consent: true}))).status, 400);
  assert.equal(requests.length, 0);
});
