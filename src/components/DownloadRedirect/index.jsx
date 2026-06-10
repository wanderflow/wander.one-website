"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  APPLE_APP_STORE_URL,
  GOOGLE_PLAY_STORE_URL,
  getAppStoreUrl,
} from "@/utils/getAppStoreUrl";
import styles from "./style.module.scss";

export default function DownloadRedirect() {
  const [downloadUrl, setDownloadUrl] = useState(APPLE_APP_STORE_URL);

  useEffect(() => {
    const url = getAppStoreUrl();
    setDownloadUrl(url);
    window.location.replace(url);
  }, []);

  return (
    <section className={styles.downloadRedirect}>
      <Image
        className={styles.logo}
        src="/images/wander_logo_colorful.png"
        alt=""
        width="56"
        height="56"
      />
      <h1>Download Wander</h1>
      <p>If the app store does not open automatically, choose your platform.</p>
      <div className={styles.actions}>
        <a href={downloadUrl}>Open app store</a>
        <a href={APPLE_APP_STORE_URL}>iPhone</a>
        <a href={GOOGLE_PLAY_STORE_URL}>Android</a>
      </div>
    </section>
  );
}
