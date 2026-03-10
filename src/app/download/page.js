"use client";

import { useRef } from "react";
import Header from "@/components/Header";
import DownloadLanding from "@/components/DownloadLanding";
import styles from "./page.module.scss";

export default function DownloadPage() {
  const topRef = useRef(null);
  const refs = {
    landingRef: topRef,
    descriptionRef: topRef,
    expressRef: topRef,
    encounterRef: topRef,
    downloadRef: topRef,
    contactRef: topRef,
  };

  return (
    <main ref={topRef} className={styles.page}>
      <Header refs={refs} logoSrc="/images/wander_logo_colorful.png" logoSrcScrolled="/images/wander_logo_colorful.png" />
      <DownloadLanding />
    </main>
  );
}
