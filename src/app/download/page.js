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
      <Header refs={refs} logoSrc="/images/logo_white.png" logoSrcScrolled="/wander.png" />
      <DownloadLanding />
    </main>
  );
}
