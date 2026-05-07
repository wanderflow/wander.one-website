"use client";
import Link from 'next/link'
import Image from 'next/image'
import { UPCOMING_EVENTS } from '@/data/events'
import { getAppStoreUrl } from '@/utils/getAppStoreUrl'
import styles from './style.module.scss'

const MAX_VISIBLE_EVENTS = 4
const FIRST_CARD_HREF = '/share/hg7mlujl7i?invite_code=1563'

export default function EventGallery() {
  const visibleEvents = UPCOMING_EVENTS.slice(0, MAX_VISIBLE_EVENTS)

  return (
    <section
      id="events"
      className={styles.section}
      aria-labelledby="events-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="events-heading" className={styles.title}>
            Upcoming on Wander
          </h2>
          <p className={styles.subtitle}>
            Explore real events and hangouts hosted by the Wander community.
          </p>
        </header>

        <ul className={styles.grid}>
          {visibleEvents.map((event, i) => {
            const isFirst = i === 0
            const cardContent = (
              <>
                <div className={styles.posterFrame}>
                  <div className={styles.posterWrap}>
                    <Image
                      src={event.posterSrc}
                      alt=""
                      className={styles.poster}
                      width={480}
                      height={640}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className={styles.posterShine} aria-hidden="true" />
                  </div>
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
              </>
            )

            return (
              <li key={event.id} className={styles.gridItem}>
                {isFirst ? (
                  <Link
                    href={FIRST_CARD_HREF}
                    className={styles.card}
                    aria-label={`${event.title}, ${event.dateLabel}, ${event.locationLabel}`}
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div className={styles.card}>{cardContent}</div>
                )}
              </li>
            )
          })}
        </ul>

        <div className={styles.ctaRow}>
          <a
            href="#"
            className={styles.secondaryCta}
            onClick={(e) => {
              e.preventDefault()
              window.open(getAppStoreUrl(), '_blank')
            }}
          >
            Explore upcoming events
          </a>
        </div>
      </div>
    </section>
  )
}
