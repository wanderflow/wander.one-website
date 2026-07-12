"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { buildGroupDeepLink } from "@/lib/groupDeepLink.mjs";
import {
  buildMapSearchUrl,
  formatDetailDate,
  splitLocation,
} from "@/components/InviteFlow/utils";
import styles from "./style.module.scss";

function memberName(member, fallback = "Wander member") {
  return String(member?.first_name || "").trim() || fallback;
}

export default function GroupPageClient({ groupId, group }) {
  const [isOpenPromptVisible, setIsOpenPromptVisible] = useState(true);

  const members = Array.isArray(group.members) ? group.members : [];
  const owner =
    group.owner ||
    members.find((member) => member.user_id === group.creator_user_id) ||
    null;
  const visibleMembers = members.slice(0, 8);
  const memberCount = Number(group.member_count) || members.length;
  const { venue, address } = splitLocation(group.location);
  const groupDate = group.time ? new Date(group.time) : null;
  const detailDate =
    groupDate && !Number.isNaN(groupDate.getTime())
      ? formatDetailDate(groupDate)
      : null;
  const mapUrl = useMemo(
    () => buildMapSearchUrl({ venue, address }),
    [venue, address],
  );

  const openApp = () => {
    window.location.href = buildGroupDeepLink({ groupId });
    setIsOpenPromptVisible(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <Image
              src="/images/wander_logo_colorful.png"
              alt="Wander"
              width={34}
              height={34}
              priority
            />
            <span>Wander</span>
          </div>
          <button type="button" className={styles.headerAction} onClick={openApp}>
            Open app
          </button>
        </header>

        <article className={styles.content}>
          <h1 className={styles.title}>{group.subject || "Wander group"}</h1>

          <div className={styles.hero}>
            {group.photo ? (
              <Image
                src={group.photo}
                alt={group.subject || "Wander group"}
                fill
                priority
                className={styles.heroImage}
                sizes="(max-width: 520px) 100vw, 480px"
              />
            ) : (
              <div className={styles.heroFallback} aria-hidden="true" />
            )}
          </div>

          <section className={styles.details} aria-label="Group details">
            {detailDate && (
              <div className={styles.dateBlock}>
                <strong>{detailDate.dateLine}</strong>
                <span>{detailDate.timeLine}</span>
              </div>
            )}

            {venue && (
              <div className={styles.detailRow}>
                <Image src="/images/group_location.png" alt="" width={22} height={22} />
                <div className={styles.detailCopy}>
                  <strong>{venue}</strong>
                  {address && <span>{address}</span>}
                </div>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                    aria-label={`Open ${venue} in Maps`}
                  >
                    <Image src="/images/group_map.png" alt="" width={26} height={26} />
                  </a>
                )}
              </div>
            )}

            <div className={styles.detailRow}>
              <Image src="/images/group_hoster.png" alt="" width={22} height={22} />
              <div className={styles.ownerBlock}>
                <span className={styles.detailLabel}>Hosted by</span>
                <div className={styles.owner}>
                  {owner?.avatar ? (
                    <Image
                      src={owner.avatar}
                      alt={memberName(owner, "Group owner")}
                      width={34}
                      height={34}
                      className={styles.ownerAvatar}
                    />
                  ) : (
                    <span className={styles.avatarFallback} aria-hidden="true" />
                  )}
                  <strong>{memberName(owner, "Group owner")}</strong>
                </div>
              </div>
            </div>
          </section>

          {group.description && (
            <section className={styles.description} aria-label="About this group">
              <h2>About</h2>
              <p>{group.description}</p>
            </section>
          )}

          <section className={styles.members} aria-label="Group members">
            <h2>{memberCount} {memberCount === 1 ? "member" : "members"}</h2>
            {visibleMembers.length > 0 && (
              <div className={styles.memberList}>
                {visibleMembers.map((member) => (
                  <div key={member.user_id} className={styles.member}>
                    <div className={styles.memberAvatarWrap}>
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={memberName(member)}
                          width={52}
                          height={52}
                          className={styles.memberAvatar}
                        />
                      ) : (
                        <span className={styles.memberAvatarFallback} aria-hidden="true" />
                      )}
                    </div>
                    <span>{memberName(member)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <button type="button" className={styles.primaryAction} onClick={openApp}>
            Open group in Wander
          </button>
        </article>

        <footer className={styles.footer}>
          <Image
            src="/images/wander_logo_colorful.png"
            alt=""
            width={30}
            height={30}
          />
          <span>right crowd IRL</span>
        </footer>
      </div>

      {isOpenPromptVisible && (
        <div className={styles.promptBackdrop} role="presentation">
          <section
            className={styles.prompt}
            role="dialog"
            aria-modal="true"
            aria-labelledby="open-app-title"
          >
            <div className={styles.promptBrand}>
              <Image
                src="/images/wander_logo_colorful.png"
                alt=""
                width={48}
                height={48}
              />
            </div>
            <h2 id="open-app-title">Open this group in Wander?</h2>
            <p>Go straight to the group conversation in the app.</p>
            <div className={styles.promptActions}>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => setIsOpenPromptVisible(false)}
              >
                Stay here
              </button>
              <button type="button" className={styles.promptPrimary} onClick={openApp}>
                Open app
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
