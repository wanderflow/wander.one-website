export default function NameScreen({
  styles,
  profile,
  onBack,
  onUpdateProfile,
  onContinue,
  isSubmitting = false,
  error = "",
}) {
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
          <h1 className={styles.flowTitle}>What&apos;s your name?</h1>
          <p className={styles.flowSubtitle}>The host will see your info</p>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Your Name</label>
            <input
              value={profile.name}
              onChange={(event) => onUpdateProfile("name", event.target.value)}
              className={styles.textInput}
              placeholder="Enter your name"
              autoComplete="given-name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.formBottom}>
          {error && <p className={styles.flowError}>{error}</p>}
          <button
            type="button"
            onClick={onContinue}
            className={styles.primaryButton}
            disabled={isSubmitting || !profile.name.trim()}
          >
            {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isSubmitting ? "Saving..." : "Next"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
