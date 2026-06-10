import { OTP_LENGTH } from "../constants";
import { normalizePhoneDigits } from "../utils";

export default function OtpScreen({
  styles,
  otpCode,
  onBack,
  onChangeCode,
  onContinue,
  onResend,
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
          <h1 className={styles.flowTitle}>Check your texts</h1>
          <label className={styles.otpRow} aria-label="Verification code">
            <input
              value={otpCode}
              onChange={(event) =>
                onChangeCode(
                  normalizePhoneDigits(event.target.value).slice(0, OTP_LENGTH),
                )
              }
              className={styles.otpHiddenInput}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={OTP_LENGTH}
              autoFocus
              disabled={isSubmitting}
            />
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <div key={index} className={styles.otpCell}>
                {otpCode[index] ?? ""}
              </div>
            ))}
          </label>
        </div>

        <div className={styles.formBottom}>
          <p className={styles.otpHelper}>
            Didn&apos;t get it?{" "}
            <button
              type="button"
              className={styles.inlineButton}
              onClick={onResend}
              disabled={isSubmitting}
            >
              Resend Code
            </button>
          </p>
          {error && <p className={styles.flowError}>{error}</p>}
          <button
            type="button"
            onClick={onContinue}
            className={styles.primaryButton}
            disabled={isSubmitting || otpCode.length !== OTP_LENGTH}
          >
            {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isSubmitting ? "Checking..." : "Next"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
