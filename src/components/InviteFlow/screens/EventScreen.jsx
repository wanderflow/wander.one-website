import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RSVP_OPTIONS } from "../constants";

function EventCard({
  styles,
  eventCard,
  eventTitle,
  selectedRsvp,
  onSelectRsvp,
  onContinueRsvp,
  onJoin,
  onStoreOpen,
  onResetToJoin,
  hostName,
  isJoining = false,
  joinCardRef = null,
  error = "",
}) {
  if (eventCard === "pending") {
    return (
      <section className={styles.sheetCard}>
        <div className={styles.statusTitleRow}>
          <span className={styles.statusIcon}>⌛</span>
          <h2 className={styles.sheetTitle}>Request pending</h2>
        </div>
        <p className={styles.sheetText}>
          We&apos;ll let you know once you&apos;re approved. Help the host put a
          face to the name. download Wander to add your photo.
        </p>
        <button
          type="button"
          onClick={() => onStoreOpen("pending")}
          className={styles.primaryButton}
        >
          Complete your profile
        </button>
      </section>
    );
  }

  if (eventCard === "approved") {
    return (
      <section className={styles.sheetCard}>
        <div className={styles.statusTitleRow}>
          <span className={styles.statusIcon}>👍</span>
          <h2 className={styles.sheetTitle}>You&apos;re on the list</h2>
        </div>
        <p className={styles.sheetText}>
          Download Wander to chat with the group.
        </p>
        <button
          type="button"
          onClick={() => onStoreOpen("confirmation")}
          className={styles.primaryButton}
        >
          Enter Chat
        </button>
      </section>
    );
  }

  if (eventCard === "rejected") {
    return (
      <section className={styles.sheetCard}>
        <div className={styles.statusTitleRow}>
          <span className={`${styles.statusIcon} ${styles.statusIconRejected}`}>✕</span>
          <h2 className={styles.sheetTitle}>You weren&apos;t added</h2>
        </div>
        <p className={styles.sheetText}>
          {hostName} wasn&apos;t able to add you this time. You can still explore
          other groups on Wander.
        </p>
        <button
          type="button"
          onClick={onResetToJoin}
          className={styles.primaryButton}
        >
          Find other groups
        </button>
      </section>
    );
  }

  if (eventCard === "maybe") {
    return (
      <section className={styles.sheetCard}>
        <div className={styles.statusTitleRow}>
          <span className={styles.statusIcon}>🤔</span>
          <h2 className={styles.sheetTitle}>You&apos;re marked as maybe</h2>
        </div>
        <p className={styles.sheetText}>
          We&apos;ll check in closer to the date. Download Wander to explore
          more groups.
        </p>
        <button
          type="button"
          onClick={onResetToJoin}
          className={styles.primaryButton}
        >
          Find other groups
        </button>
      </section>
    );
  }

  if (eventCard === "cant_go") {
    return (
      <section className={styles.sheetCard}>
        <div className={styles.statusTitleRow}>
          <span className={styles.statusIcon}>🥲</span>
          <h2 className={styles.sheetTitle}>You can&apos;t make it</h2>
        </div>
        <p className={styles.sheetText}>
          Download Wander to explore more groups you might enjoy.
        </p>
        <button
          type="button"
          onClick={onResetToJoin}
          className={styles.primaryButton}
        >
          Find other groups
        </button>
      </section>
    );
  }

  return (
    <section ref={joinCardRef} className={styles.joinCard}>
      <h2 className={styles.joinCardTitle}>See who&apos;s going</h2>
      <p className={styles.joinCardText}>
        Join the list to see everyone attending {eventTitle}.
      </p>
      <button
        type="button"
        onClick={onJoin}
        className={styles.primaryButton}
        disabled={isJoining}
      >
        {isJoining && <span className={styles.buttonSpinner} aria-hidden="true" />}
        <span>{isJoining ? "Loading..." : "Join"}</span>
      </button>
      {error && <p className={styles.flowError}>{error}</p>}
    </section>
  );
}

function RsvpModal({
  styles,
  selectedRsvp,
  onSelectRsvp,
  onContinueRsvp,
  onClose,
  isSubmitting = false,
  error = "",
}) {
  return (
    <div
      className={styles.rsvpModalBackdrop}
      onClick={isSubmitting ? undefined : onClose}
      role="presentation"
    >
      <section
        className={styles.rsvpModal}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.rsvpModalHandleButton}
          onClick={isSubmitting ? undefined : onClose}
          disabled={isSubmitting}
          aria-label="Close RSVP options"
        >
          <span className={styles.rsvpModalHandle} />
        </button>
        <h2 className={styles.rsvpModalTitle}>You in?</h2>
        <div className={styles.rsvpGrid}>
          {RSVP_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectRsvp(option.id)}
              disabled={isSubmitting}
              className={
                selectedRsvp === option.id
                  ? `${styles.rsvpOption} ${styles.rsvpOptionSelected}`
                  : styles.rsvpOption
              }
            >
              <span className={styles.rsvpEmoji}>{option.emoji}</span>
              <span className={styles.rsvpLabel}>{option.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onContinueRsvp}
          className={styles.rsvpModalButton}
          disabled={isSubmitting}
        >
          {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
          <span>{isSubmitting ? "Loading..." : "Next"}</span>
        </button>
        {error && <p className={styles.flowError}>{error}</p>}
      </section>
    </div>
  );
}

export default function EventScreen({
  styles,
  gradientCss,
  data,
  eventTitle,
  detailDate,
  venue,
  address,
  mapUrl,
  creator,
  hostName,
  attendeeCount,
  displayMembers,
  eventCard,
  selectedRsvp,
  onSelectRsvp,
  onContinueRsvp,
  onJoin,
  onStoreOpen,
  onResetToJoin,
  isJoining = false,
  isSubmittingRsvp = false,
  error = "",
}) {
  const isRsvpModalOpen = eventCard === "rsvp";
  const showFloatingJoin = eventCard === "join" && !isRsvpModalOpen;
  const joinCardRef = useRef(null);
  const [isJoinCardVisible, setIsJoinCardVisible] = useState(false);

  useEffect(() => {
    if (!showFloatingJoin || !joinCardRef.current) {
      setIsJoinCardVisible(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsJoinCardVisible(Boolean(entry?.isIntersecting));
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(joinCardRef.current);
    return () => observer.disconnect();
  }, [showFloatingJoin]);

  return (
    <div className={styles.eventViewport}>
      <div
        className={
          isRsvpModalOpen
            ? `${styles.eventScene} ${styles.eventSceneDimmed}`
            : styles.eventScene
        }
      >
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Image
              src="/images/wander_logo_colorful.png"
              alt="Wander"
              width={34}
              height={34}
            />
            <span className={styles.headerTitle}>Wander</span>
          </div>
          <div
            className={styles.downloadBtnOuter}
            style={{ background: gradientCss }}
          >
            <button
              type="button"
              onClick={() => onStoreOpen("detail")}
              className={styles.downloadBtnInner}
            >
              <span
                className={styles.downloadBtnText}
                style={{ backgroundImage: gradientCss }}
              >
                Download
              </span>
            </button>
          </div>
        </header>

        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>{eventTitle}</h1>

          <div className={styles.heroCard}>
            {data.photo ? (
              <Image
                src={data.photo}
                alt={eventTitle}
                fill
                priority
                className={styles.heroImage}
                sizes="(max-width: 480px) 100vw, 380px"
              />
            ) : (
              <div className={styles.heroFallback} />
            )}
          </div>

          <section className={styles.detailSection}>
            {detailDate && (
              <div className={styles.dateBlock}>
                <span className={styles.dateLine}>{detailDate.dateLine}</span>
                <span className={styles.timeLine}>{detailDate.timeLine}</span>
              </div>
            )}

            {venue && (
              <div className={styles.detailRow}>
                <Image
                  src="/images/group_location.png"
                  alt=""
                  width={28}
                  height={28}
                  className={styles.detailIcon}
                />
                <div className={styles.detailText}>
                  <span className={styles.detailPrimary}>{venue}</span>
                  {address && (
                    <span className={styles.detailSecondary}>{address}</span>
                  )}
                </div>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.detailMapLink}
                    aria-label={`Open ${venue} in Maps`}
                  >
                    <Image
                      src="/images/group_map.png"
                      alt=""
                      width={28}
                      height={28}
                      className={styles.detailMapIcon}
                    />
                  </a>
                )}
              </div>
            )}

            {creator && (
              <div className={styles.detailRow}>
                <Image
                  src="/images/group_hoster.png"
                  alt=""
                  width={28}
                  height={28}
                  className={styles.detailIcon}
                />
                <div className={styles.hostBlock}>
                  <span className={styles.hostLabel}>Hosted by</span>
                  <div className={styles.hostUser}>
                    {creator.avatar ? (
                      <Image
                        src={creator.avatar}
                        alt={creator.first_name || "Host"}
                        width={32}
                        height={32}
                        className={styles.hostAvatar}
                      />
                    ) : (
                      <span className={styles.hostAvatarFallback} />
                    )}
                    <span className={styles.hostName}>{creator.first_name}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {data.description && (
            <section className={styles.descriptionSection}>
              <p className={styles.descriptionText}>{data.description}</p>
            </section>
          )}

          <section className={styles.membersSection}>
            <h2 className={styles.membersTitle}>{attendeeCount} going</h2>
            {displayMembers.length > 0 && (
              <div className={styles.membersRow}>
                {displayMembers.map((member) => (
                  <div key={member.user_id} className={styles.memberItem}>
                    <div className={styles.memberAvatarWrap}>
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.first_name || "Member"}
                          width={48}
                          height={48}
                          className={styles.memberAvatar}
                        />
                      ) : (
                        <span className={styles.memberAvatarFallback} />
                      )}
                    </div>
                    <span className={styles.memberName}>{member.first_name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {!isRsvpModalOpen && (
            <EventCard
              styles={styles}
              eventCard={eventCard}
              eventTitle={eventTitle}
              selectedRsvp={selectedRsvp}
              onSelectRsvp={onSelectRsvp}
              onContinueRsvp={onContinueRsvp}
              onJoin={onJoin}
              onStoreOpen={onStoreOpen}
              onResetToJoin={onResetToJoin}
              hostName={hostName}
              isJoining={isJoining}
              joinCardRef={joinCardRef}
              error={error}
            />
          )}
        </div>

        {!isRsvpModalOpen && (
          <footer className={styles.footer}>
            <div className={styles.footerLeft}>
              <Image
                src="/images/wander_logo_colorful.png"
                alt="Wander"
                width={36}
                height={36}
                className={styles.footerLogo}
              />
              <div className={styles.footerBrandTitle}>
                <span className={styles.footerTitle}>Wander</span>
                <span
                  className={styles.footerSlogan}
                  style={{ backgroundImage: gradientCss }}
                >
                  Wander finds the gang to plan your hangout
                </span>
              </div>
            </div>
            <div className={styles.footerRight}>
              <Link
                href="https://www.instagram.com/wanderwithnewfriends/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image
                  src="/images/Instagram.png"
                  alt="Instagram"
                  width={32}
                  height={32}
                  className={styles.socialIcon}
                />
              </Link>
              <a href="mailto:quinn@wander.one" aria-label="Email">
                <Image
                  src="/images/send_email.png"
                  alt="Email"
                  width={32}
                  height={32}
                  className={styles.socialIcon}
                />
              </a>
            </div>
          </footer>
        )}
      </div>

      {showFloatingJoin && (
        <div
          className={
            isJoinCardVisible
              ? `${styles.floatingJoinBar} ${styles.floatingJoinBarHidden}`
              : styles.floatingJoinBar
          }
        >
          <button
            type="button"
            onClick={onJoin}
            className={styles.floatingJoinButton}
            disabled={isJoining}
          >
            {isJoining && <span className={styles.buttonSpinner} aria-hidden="true" />}
            <span>{isJoining ? "Loading..." : "Join"}</span>
          </button>
        </div>
      )}

      {isRsvpModalOpen && (
        <RsvpModal
          styles={styles}
          selectedRsvp={selectedRsvp}
          onSelectRsvp={onSelectRsvp}
          onContinueRsvp={onContinueRsvp}
          onClose={onResetToJoin}
          isSubmitting={isSubmittingRsvp}
          error={error}
        />
      )}
    </div>
  );
}
