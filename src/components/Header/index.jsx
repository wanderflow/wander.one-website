"use client";
import Link from 'next/link'
import Image from 'next/image'
import styles from './style.module.scss'
import { getAppStoreUrl } from '@/utils/getAppStoreUrl'

const INSTAGRAM_URL = 'https://www.instagram.com/wanderwithnewfriends/'
const LOGO_MARK_SRC = '/images/wander-logo-mark.png'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Image
            src={LOGO_MARK_SRC}
            alt=""
            width={40}
            height={40}
            className={styles.logoMark}
          />
          <span className={styles.wordmark}>Wander</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <a
            href={INSTAGRAM_URL}
            className={styles.iconLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wander on Instagram (opens in a new tab)"
          >
            <InstagramGlyph />
          </a>
          <a
            href="#"
            className={styles.cta}
            onClick={(e) => {
              e.preventDefault()
              window.open(getAppStoreUrl(), '_blank')
            }}
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  )
}

function InstagramGlyph() {
  return (
    <svg
      className={styles.ig}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  )
}
