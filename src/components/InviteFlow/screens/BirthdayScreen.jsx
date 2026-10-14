import { buildBirthday } from "../birthday.mjs";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BirthdayScreen({ styles, profile, onBack, onUpdateProfile, onContinue, isSubmitting = false, error = "" }) {
  const selection = { month: profile.birthMonth, day: profile.birthDay, year: profile.birthYear };
  const birthday = buildBirthday(selection);
  const isComplete = Object.values(selection).every(Boolean);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className={styles.flowTopBar}>
        <button type="button" onClick={onBack} className={styles.backButton} disabled={isSubmitting} aria-label="Back">&#8249;</button>
      </div>
      <div className={styles.flowContent}>
        <div className={styles.formFields}>
          <h1 className={styles.flowTitle}>When&apos;s your birthday?</h1>
          <p className={styles.flowSubtitle}>Enter your date of birth to continue.</p>
          <fieldset className={styles.birthdayFields}>
            <legend className={styles.fieldLabel}>Date of birth</legend>
            <div className={styles.birthdayRow}>
              <select aria-label="Month" className={styles.textInput} value={profile.birthMonth} onChange={(event) => onUpdateProfile("birthMonth", event.target.value)} disabled={isSubmitting}>
                <option value="">Month</option>
                {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
              </select>
              <select aria-label="Day" className={styles.textInput} value={profile.birthDay} onChange={(event) => onUpdateProfile("birthDay", event.target.value)} disabled={isSubmitting}>
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
              </select>
              <select aria-label="Year" className={styles.textInput} value={profile.birthYear} onChange={(event) => onUpdateProfile("birthYear", event.target.value)} disabled={isSubmitting}>
                <option value="">Year</option>
                {Array.from({ length: currentYear - 1899 }, (_, index) => <option key={currentYear - index} value={currentYear - index}>{currentYear - index}</option>)}
              </select>
            </div>
          </fieldset>
          {isComplete && !birthday && <p className={styles.flowError} role="alert">Enter a valid date of birth that isn&apos;t in the future.</p>}
        </div>
        <div className={styles.formBottom}>
          {error && <p className={styles.flowError} role="alert">{error}</p>}
          <button type="button" onClick={() => onContinue(birthday)} className={styles.primaryButton} disabled={isSubmitting || !birthday}>
            {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isSubmitting ? "Saving..." : "Continue"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
