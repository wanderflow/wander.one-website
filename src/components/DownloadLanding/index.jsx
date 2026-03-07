"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";
import { getAppStoreUrl } from "@/utils/getAppStoreUrl";

const RECOMMENDED_GROUPS = [
  "dog walk",
  "gymn",
  "Morning Run",
  "Book Club",
];

function handleJoin(e) {
  e.preventDefault();
  const url = getAppStoreUrl();
  window.open(url, "_blank");
}

export default function DownloadLanding() {
  return (
    <div className={styles.wrap}>
      <div className={styles.brand}>
        <h1 className={styles.title}>Wander</h1>
        <p className={styles.subtitle}>
          Make a big city feel like a group chat
        </p>
      </div>

      <div className={styles.mainColumn}>
      <div className={styles.phoneMock}>
        <div className={styles.cardInner}>
          <div className={styles.cardBg} aria-hidden>
            <Image
              src="/images/group_backgoud_image.png"
              alt=""
              fill
              className={styles.cardBgImg}
              sizes="(max-width: 380px) 100vw, 380px"
            />
          </div>
          <header className={styles.topBar}>
            <div className={styles.topBarPill}>
              <span className={styles.topBarLeft}>Sat 8pm</span>
              <span className={styles.topBarCenter}>
                Nokia Toronto Downtown (14th...
              </span>
            </div>
            <span className={styles.topBarRight}>
              <Image
                src="/images/more_three_dot.png"
                alt=""
                width={24}
                height={24}
                className={styles.topBarRightImg}
              />
            </span>
          </header>
          <div className={styles.groupCard}>
            <span className={styles.groupLabel}>
              <Image
                src="/images/group_info_inner_star.png"
                alt=""
                width={12}
                height={12}
                className={styles.groupLabelStar}
              />
              Main Group
            </span>
            <h2 className={styles.groupTitle}>Apartment 118</h2>
            <p className={styles.groupDesc}>
              If u live in apartment 118, join the group chat and lets hang out
            </p>
            <div className={styles.avatarRow}>
              <div className={styles.avatarWrap} style={{ zIndex: 1 }}>
                <Image
                  src="/images/avatar_no_blur_01.png"
                  alt=""
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.avatarWrap} style={{ zIndex: 2 }}>
                <Image
                  src="/images/avatar_with_blur_01.png"
                  alt=""
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.avatarWrap} style={{ zIndex: 3 }}>
                <Image
                  src="/images/avatar_with_blur_02.png"
                  alt=""
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.avatarWrap} style={{ zIndex: 4 }}>
                <Image
                  src="/images/more_people_plus_2.png"
                  alt="+2"
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardBottom}>
        <h3 className={styles.recommendedHeading}>Rooms in Apartment 118</h3>
        <div className={styles.recommendedGrid}>
          {RECOMMENDED_GROUPS.map((name) => (
            <div key={name} className={styles.recommendedCard}>
              <div className={styles.recommendedHead}>
                <span className={styles.recommendedTitle}>{name}</span>
              </div>
              <div className={styles.recommendedBottom}>
                <div className={styles.avatarRowSmall}>
                  <div className={styles.avatarWrapSm} style={{ zIndex: 1 }}>
                    <Image
                      src="/images/avatar_no_blur_01.png"
                      alt=""
                      width={28}
                      height={28}
                      className={styles.avatarSm}
                    />
                  </div>
                  <div className={styles.avatarWrapSm} style={{ zIndex: 2 }}>
                    <Image
                      src="/images/avatar_no_blur_02.png"
                      alt=""
                      width={28}
                      height={28}
                      className={styles.avatarSm}
                    />
                  </div>
                  <div className={styles.avatarWrapSm} style={{ zIndex: 3 }}>
                    <Image
                      src="/images/avatar_no_blur_03.png"
                      alt=""
                      width={28}
                      height={28}
                      className={styles.avatarSm}
                    />
                  </div>
                  <div className={styles.avatarWrapSm} style={{ zIndex: 4 }}>
                    <Image
                      src="/images/more_people_plus_6.png"
                      alt="+6"
                      width={28}
                      height={28}
                      className={styles.avatarSm}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.joinSmall}
                  onClick={handleJoin}
                >
                  <span className={styles.joinSmallText}>Join</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://apps.apple.com/us/app/wander-right-crowd-irl/id6474634049"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.joinMain}
          onClick={(e) => {
            e.preventDefault();
            handleJoin(e);
          }}
        >
          Join!
        </a>
      </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <Image
            src="/images/logo_grey.png"
            alt="Wander"
            width={24}
            height={24}
            className={styles.footerLogo}
          />
          <span className={styles.footerTitle}>Wander</span>
          <span className={styles.footerSlogan}>
            Make a big city feel like a group chat
          </span>
        </div>
        <div className={styles.footerRight}>
          <Link
            href="https://www.instagram.com/wanderforsocial/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              src="/images/Instagram.png"
              alt="Instagram"
              width={24}
              height={24}
              className={styles.socialIcon}
            />
          </Link>
          <Link
            href="mailto:quinn@wander.one"
            aria-label="Email"
          >
            <Image
              src="/images/send_email.png"
              alt="Email"
              width={24}
              height={24}
              className={styles.socialIcon}
            />
          </Link>
        </div>
      </footer>
    </div>
  );
}
