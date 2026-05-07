"use client";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './style.module.scss'

const HELP_CATEGORIES = [
  {
    title: 'Events',
    items: [
      {
        title: 'RSVP and join a hangout',
        blurb:
          'What happens after you RSVP, reminders, and how to connect with the host.',
      },
      {
        title: 'Event details and updates',
        blurb:
          'How hosts share time, place, and changes so everyone stays in sync.',
      },
    ],
  },
  {
    title: 'Hosts',
    items: [
      {
        title: 'Create and manage a listing',
        blurb:
          'Set up your hangout, cover image, capacity, and guest questions.',
      },
      {
        title: 'Guest list and check-in',
        blurb:
          'See who is coming, manage waitlists, and run smooth in-person meetups.',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Profile and notifications',
        blurb:
          'Update your photo, bio, and choose what Wander can email or push to you.',
      },
      {
        title: 'Safety and reporting',
        blurb:
          'How to report concerns and what we do to keep the community respectful.',
      },
    ],
  },
  {
    title: 'FAQ',
    items: [
      {
        title: 'Payments and tickets',
        blurb:
          'Placeholder for paid events, refunds, and receipts when you enable billing.',
      },
      {
        title: 'Data and privacy',
        blurb:
          'High-level overview; link to your Privacy Policy for full legal text.',
      },
    ],
  },
]

export default function HelpCenterPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.inner}>
          <header className={styles.hero}>
            <h1 className={styles.title}>Help Center</h1>
            <p className={styles.subtitle}>How can we help?</p>
          </header>

          {HELP_CATEGORIES.map((cat) => (
            <section key={cat.title} className={styles.category}>
              <h2 className={styles.categoryTitle}>{cat.title}</h2>
              <div className={styles.grid}>
                {cat.items.map((item) => (
                  <a
                    key={item.title}
                    href="#"
                    className={styles.card}
                    onClick={(e) => e.preventDefault()}
                  >
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardBlurb}>{item.blurb}</p>
                  </a>
                ))}
              </div>
            </section>
          ))}

          <div className={styles.bottom}>
            <p className={styles.bottomTitle}>
              Didn&apos;t find what you are looking for?
            </p>
            <a className={styles.bottomLink} href="#">
              Contact us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
