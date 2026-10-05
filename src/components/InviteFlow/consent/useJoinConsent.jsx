"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import ConsentModal from "./ConsentModal";
import { shouldPromptForJoinConsent } from "./policy.mjs";

async function consentRequest(body) {
  const response = await fetch("/api/text-message-consent", {method: body ? "POST" : "GET", headers: body ? {"Content-Type": "application/json"} : {}, body: body ? JSON.stringify(body) : undefined, cache: "no-store"});
  const payload = await response.json();
  if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to load text settings. Please retry.");
  return payload;
}
export function useJoinConsent({ownerId, fallbackPhone, trackEvent}) {
  const clerk = useClerk();
  const [prompt, setPrompt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [verification, setVerification] = useState(null);
  const continuation = useRef(null);
  const answeredAttempt = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; continuation.current?.(false); continuation.current = null; };
  }, []);
  const requireConsent = useCallback(async (userId, attemptId) => {
    if (!mounted.current) return false;
    if (userId === ownerId) return true;
    const key = `${userId}:${attemptId}`;
    if (answeredAttempt.current === key) return true;
    let state;
    try { state = await consentRequest(); }
    catch (e) { if (!mounted.current) return false; throw e; }
    if (!mounted.current) return false;
    if (state.user_id !== userId) throw new Error("Your signed-in account changed. Please retry.");
    if (!shouldPromptForJoinConsent({consent: state.text_message_consent, userId, ownerId})) return true;
    setError(""); setVerification(null);
    setPrompt({userId, key, phone: state.phone_number || clerk.user?.primaryPhoneNumber?.phoneNumber || fallbackPhone || ""});
    trackEvent("text_consent_shown", {source: "web_join"});
    return new Promise((resolve) => { continuation.current = resolve; });
  }, [clerk, fallbackPhone, ownerId, trackEvent]);
  const save = async (allow, phone, code = "") => {
    if (!prompt || busy) return;
    setBusy(true); setError("");
    try {
      if (!clerk.user || clerk.user.id !== prompt.userId) throw new Error("Please sign in again.");
      if (allow) {
        const user = clerk.user;
        let verified = user.phoneNumbers.find((p) => p.phoneNumber === phone && p.verification?.status === "verified");
        if (!verified) {
          if (!verification) {
            const resource = user.phoneNumbers.find((p) => p.phoneNumber === phone) || await user.createPhoneNumber({phoneNumber: phone});
            await resource.prepareVerification();
            setVerification(resource);
            return;
          }
          verified = await verification.attemptVerification({code});
          if (verified.verification?.status !== "verified") throw new Error("Enter the code sent to your phone.");
        }
        phone = verified.phoneNumber;
      }
      trackEvent("text_consent_selected", {source: "web_join", choice: allow ? "allow" : "skip"});
      if (allow || prompt.phone) await consentRequest({phone_number: allow ? phone : prompt.phone, text_message_consent: allow});
      if (!mounted.current) return;
      answeredAttempt.current = prompt.key;
      setPrompt(null); setVerification(null);
      continuation.current?.(true); continuation.current = null;
    } catch (e) {
      setError(e?.errors?.[0]?.longMessage || e.message || "Unable to save text settings. Please retry.");
    } finally { setBusy(false); }
  };
  return {requireConsent, consentModal: prompt ? <ConsentModal key={prompt.key} phoneNumber={prompt.phone} busy={busy} error={error} needsVerification={!!verification} onAllow={(phone, code) => { void save(true, phone, code); }} onSkip={() => { void save(false, prompt.phone); }} /> : null};
}
