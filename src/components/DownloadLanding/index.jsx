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
              src="/images/download_backgroup_image.png"
              alt=""
              fill
              className={styles.cardBgImg}
              sizes="(max-width: 380px) 100vw, 380px"
            />
          </div>

        </div>
        <div className={styles.cardBottom}>
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

      
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <Image
            src="/images/wander_logo_colorful.png"
            alt="Wander"
            width={24}
            height={24}
            className={styles.footerLogo}
          />
          <span className={styles.footerTitle}>Wander</span>

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
              width={30}
              height={30}
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
              width={30}
              height={30}
              className={styles.socialIcon}
            />
          </Link>
        </div>
      </footer>
    </div>
  );
}
