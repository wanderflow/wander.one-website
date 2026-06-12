import { formatPhoneNumber, normalizePhoneDigits } from "../utils";

export default function PhoneScreen({
  styles,
  rsvpIntent,
  profile,
  onBack,
  onUpdateProfile,
  onContinue,
  isSubmitting = false,
  error = "",
  authReady = true,
}) {
  const isCantGo = rsvpIntent === "cant_go";
  const title = isCantGo ? "Can't make it this time?" : "What's your number?";
  const subtitle = isCantGo
    ? "Leave your number and we'll let you know about similar hangouts"
    : "We'll text you updates about this event.";

  return (
    <>
      <div className={styles.flowTopBar}>
        <button
          type="button"
          onClick={onBack}
          className={styles.backButton}
          disabled={isSubmitting}
        >
          &#8249;
        </button>
      </div>
      <div className={styles.flowContent}>
        <div className={styles.formFields}>
          <h1 className={styles.flowTitle}>{title}</h1>
          <p className={styles.flowSubtitle}>{subtitle}</p>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Phone Number</label>
            <div className={styles.phoneRow}>
              <div className={styles.countrySelectWrap}>
                <div className={styles.countryDisplay} aria-hidden="true">
                  <span className={styles.countryFlag}>
                    {profile.country === "us" ? "🇺🇸" : "🇨🇦"}
                  </span>
                  <span className={styles.countryCode}>+1</span>
                </div>
                <select
                  value={profile.country}
                  onChange={(event) =>
                    onUpdateProfile("country", event.target.value)
                  }
                  className={styles.countrySelect}
                  disabled={isSubmitting}
                >
                  <option value="ca">Canada +1</option>
                  <option value="us">United States +1</option>
                </select>
                <span className={styles.countryCaret}>▾</span>
              </div>
              <input
                value={formatPhoneNumber(profile.phoneDigits)}
                onChange={(event) =>
                  onUpdateProfile(
                    "phoneDigits",
                    normalizePhoneDigits(event.target.value),
                  )
                }
                className={styles.phoneInput}
                placeholder="123-123-123"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className={styles.formBottom}>
          <p className={styles.helperFootnote}>
            By continuing, you agree to receive a text confirmation.
          </p>
          {error && <p className={styles.flowError}>{error}</p>}

          <button
            type="button"
            onClick={onContinue}
            className={styles.primaryButton}
            disabled={isSubmitting || !authReady || profile.phoneDigits.length < 10}
          >
            {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isSubmitting ? "Sending..." : "Next"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
