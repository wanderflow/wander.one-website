"use client";
import Link from 'next/link'
import { getAppStoreUrl } from '@/utils/getAppStoreUrl'
import styles from './style.module.scss'

const FOOTER_LINKS = [
  { label: 'Terms', href: '/tc' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Help Center', href: '/help-center' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Footer">
          <ul className={styles.list}>
            {FOOTER_LINKS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="#"
                className={styles.link}
                onClick={(e) => {
                  e.preventDefault()
                  window.open(getAppStoreUrl(), '_blank')
                }}
              >
                Download
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.legal}>
          <p className={styles.copy}>
            Copyright {'©'} ActEarn Inc. All Rights Reserved.
          </p>
          <p className={styles.address}>
            2275 Upper Middle Road East Suite 101, Oakville
          </p>
        </div>
      </div>
    </footer>
  )
}
