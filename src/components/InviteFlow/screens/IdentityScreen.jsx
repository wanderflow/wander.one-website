import { formatPhoneNumber, normalizePhoneDigits } from "../utils";

export default function IdentityScreen({
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
  const isJoinRequest = rsvpIntent === "going" || rsvpIntent === "maybe";
  const title = isJoinRequest ? "Who are you?" : "That's okay";
  const subtitle = isJoinRequest
    ? "The host will see your info"
    : "We'll still keep you in the loop closer to the date.";

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
            <label className={styles.fieldLabel}>Your Name</label>
            <input
              value={profile.name}
              onChange={(event) => onUpdateProfile("name", event.target.value)}
              className={styles.textInput}
              placeholder="Enter your name"
              disabled={isSubmitting}
            />
          </div>

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
                placeholder="(123) 456-7890"
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
            disabled={
              isSubmitting ||
              !authReady ||
              !profile.name.trim() ||
              profile.phoneDigits.length < 10
            }
          >
            {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isSubmitting ? "Sending..." : "Next"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
