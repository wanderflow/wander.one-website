/**
 * @typedef {Object} EventCard
 * @property {string} id
 * @property {string} title
 * @property {string} posterSrc
 * @property {string} dateLabel
 * @property {string} locationLabel
 */

/** @type {EventCard[]} */
export const UPCOMING_EVENTS = [
  {
    id: 'riverside-run',
    title: 'AMPM Dating Show',
    posterSrc: '/images/events/1.png',
    dateLabel: 'Sat - 7:00 AM',
    locationLabel: 'Waterfront',
  },
  {
    id: 'vinyl-night',
    title: "Winnie's great picnic",
    posterSrc: '/images/events/2.png',
    dateLabel: 'Fri - 8:30 PM',
    locationLabel: 'Downtown loft',
  },
  {
    id: 'picnic-park',
    title: 'Uoft picnic',
    posterSrc: '/images/events/3.png',
    dateLabel: 'Sun - 2:00 PM',
    locationLabel: 'Central Park meadow',
  },
  {
    id: 'gallery-walk',
    title: 'Coffee party',
    posterSrc: '/images/events/4.png',
    dateLabel: 'Thu - 5:30 PM',
    locationLabel: 'Arts district',
  },
  {
    id: 'boardgame-cafe',
    title: 'Board game cafe meet',
    posterSrc: 'https://picsum.photos/seed/wander-board/480/640',
    dateLabel: 'Wed - 6:00 PM',
    locationLabel: 'Queen St.',
  },
  {
    id: 'hike-lookout',
    title: 'Lookout trail hike',
    posterSrc: 'https://picsum.photos/seed/wander-hike/480/640',
    dateLabel: 'Sat - 9:00 AM',
    locationLabel: 'North ridge trailhead',
  },
  {
    id: 'open-mic',
    title: 'Open mic & chill',
    posterSrc: 'https://picsum.photos/seed/wander-mic/480/640',
    dateLabel: 'Tue - 7:30 PM',
    locationLabel: 'The Backroom',
  },
  {
    id: 'brunch-club',
    title: 'Sunday brunch club',
    posterSrc: 'https://picsum.photos/seed/wander-brunch/480/640',
    dateLabel: 'Sun - 11:00 AM',
    locationLabel: 'Market district',
  },
]
