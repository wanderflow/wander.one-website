"use client";
import { useEffect, useId, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './style.module.scss'

const WORDS = [
  'run club hangout',
  'night out',
  'concert meet-up',
  'picnic',
  'and more',
]

const ROTATE_INTERVAL_MS = 1300

export function RotatingWordPill() {
  const [index, setIndex] = useState(0)
  const liveId = useId()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length)
    }, ROTATE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <span className={styles.wrap}>
        <span className={styles.pill}>
          <span className={styles.wordStatic}>
            run club hangout, night out and more
          </span>
        </span>
      </span>
    )
  }

  return (
    <span className={styles.wrap}>
      <span id={liveId} className="sr-only" aria-live="polite">
        {WORDS[index]}
      </span>
      <span className={styles.pill} aria-hidden="true">
        <span className={styles.pillSizer} aria-hidden>
          {WORDS[index]}
        </span>
        {WORDS.map((word, i) => (
          <span
            key={word}
            className={
              i === index
                ? `${styles.word} ${styles.wordActive}`
                : styles.word
            }
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}
