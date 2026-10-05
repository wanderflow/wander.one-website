"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./consent.module.scss";

const countries = [{id: "CA", flag: "🇨🇦", code: "+1", name: "Canada"}, {id: "US", flag: "🇺🇸", code: "+1", name: "United States"}, {flag: "🇬🇧", code: "+44", name: "United Kingdom"}, {flag: "🇩🇪", code: "+49", name: "Germany"}, {flag: "🇫🇷", code: "+33", name: "France"}, {flag: "🇨🇳", code: "+86", name: "China"}, {flag: "🇮🇳", code: "+91", name: "India"}, {flag: "🇦🇺", code: "+61", name: "Australia"}];
export default function ConsentModal({phoneNumber, busy, error, needsVerification, onAllow, onSkip}) {
  const match = countries.find((c) => phoneNumber?.startsWith(c.code));
  const [country, setCountry] = useState(match?.id || match?.code || "CA");
  const [digits, setDigits] = useState(match ? phoneNumber.slice(match.code.length) : phoneNumber || "");
  const [code, setCode] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const countryPicker = useRef(null);
  const countryButton = useRef(null);
  const dialog = useRef(null);
  const skip = useRef(onSkip);
  useEffect(() => { skip.current = onSkip; }, [onSkip]);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus?.(); };
  }, []);
  useEffect(() => {
    if (!showCountries) return;
    const dismiss = (event) => { if (!countryPicker.current?.contains(event.target)) setShowCountries(false); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [showCountries]);
  const selectedCountry = countries.find((c) => (c.id || c.code) === country);
  function handleCountryKeys(event) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const options = [...countryPicker.current.querySelectorAll('[role="option"]')];
    const index = options.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
    options[next]?.focus();
  }
  const phone = digits.startsWith("+") ? digits.replace(/[^+\d]/g, "") : selectedCountry.code + digits.replace(/\D/g, "");
  function handleKeys(event) {
    if (event.key === "Escape" && showCountries) { event.preventDefault(); setShowCountries(false); countryButton.current?.focus(); return; }
    if (event.key === "Escape" && !busy) { event.preventDefault(); skip.current(); }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled)')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first?.focus(); }
  }
  return <div className={styles.overlay}>
    <section ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="text-consent-title" tabIndex={-1} onKeyDown={handleKeys}>
      <button className={styles.close} onClick={onSkip} disabled={busy} aria-label="Skip text updates">×</button>
      <img className={styles.star} src="/text-consent-star.png" alt="" aria-hidden="true" />
      <h2 id="text-consent-title">Stay updated</h2><p className={styles.subtitle}>Just for group updates. No spam.</p>
      <form onSubmit={(event) => { event.preventDefault(); onAllow(phone, code); }}>
        <div className={styles.phoneRow}><div ref={countryPicker} className={styles.countryPicker}>
          <button ref={countryButton} type="button" className={styles.countryButton} disabled={busy || needsVerification} aria-label="Country code" aria-expanded={showCountries} aria-haspopup="listbox" aria-controls="consent-country-options" onClick={() => setShowCountries(!showCountries)}>{selectedCountry.flag} {selectedCountry.code} ⌄</button>
          {showCountries && <div id="consent-country-options" className={styles.countries} role="listbox" aria-label="Country codes" onKeyDown={handleCountryKeys}>{countries.map((c) => <button type="button" role="option" aria-selected={country === (c.id || c.code)} key={c.id || c.code} className={styles.countryOption} onClick={() => { setCountry(c.id || c.code); setShowCountries(false); countryButton.current?.focus(); }}>{c.flag} {c.code} {c.name}</button>)}</div>}
        </div><input type="tel" autoComplete="tel-national" value={digits} onChange={(e) => setDigits(e.target.value)} disabled={busy || needsVerification} aria-label="Phone number" placeholder="Phone number" /></div>
        {needsVerification && <input className={styles.code} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="Verification code" aria-label="Verification code" disabled={busy} />}
        <p className={styles.terms}>By continuing, you agree to receive text updates about your groups. Reply STOP to unsubscribe. Msg &amp; data rates may apply.</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.allow} disabled={busy || !/^\+[1-9]\d{7,14}$/.test(phone) || (needsVerification && code.length !== 6)}>{busy ? "Saving…" : needsVerification ? "Verify & get updates" : "Get updates"}</button>
      </form>
      <button className={styles.skip} onClick={onSkip} disabled={busy}>Skip</button>
    </section>
  </div>;
}
