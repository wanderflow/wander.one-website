export default function QuestionsScreen({
  styles,
  questions,
  answers,
  hostName = "the host",
  onBack,
  onUpdateAnswer,
  onSubmit,
  isSubmitting = false,
  joinedAsName = "",
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
          <h1 className={styles.flowTitle}>Quick Question from {hostName}</h1>
          <p className={styles.flowSubtitle}>Only The Host will see your answer</p>

          <div className={styles.questionsList}>
            {questions.map((question) => {
              if (question.type === "choice") {
                return (
                  <div key={question.id} className={styles.questionBlock}>
                    <label className={styles.questionLabel}>{question.label}</label>
                    <div className={styles.choiceList}>
                      {question.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => onUpdateAnswer(question.id, option)}
                          disabled={isSubmitting}
                          className={
                            answers[question.id] === option
                              ? `${styles.choiceButton} ${styles.choiceButtonSelected}`
                              : styles.choiceButton
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={question.id} className={styles.questionBlock}>
                  <label className={styles.questionLabel}>{question.label}</label>
                  <textarea
                    value={answers[question.id] ?? ""}
                    onChange={(event) =>
                      onUpdateAnswer(question.id, event.target.value)
                    }
                    className={styles.answerInput}
                    placeholder={question.placeholder}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.formBottom}>
          <button
            type="button"
            onClick={onSubmit}
            className={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
          {joinedAsName && (
            <p className={styles.joiningAsText}>Joining as ({joinedAsName})</p>
          )}
          {error && <p className={styles.flowError}>{error}</p>}
        </div>
      </div>
    </>
  );
}
