"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.scss";
import { useInView, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { slideUp } from "./animation";
export default function Index() {
  const container = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(container, {
    threshold: 1,
    rootMargin: "0px 0px -100px 0px",
  });

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);
  return (
    <div ref={container} className={styles.container}>
      <div className={styles.body}>
        <motion.h2
          variants={slideUp}
          custom={0.3}
          animate={isInView ? "open" : "closed"}
        >
          Try out the app
        </motion.h2>
        <motion.p
          variants={slideUp}
          custom={0.6}
          animate={isInView ? "open" : "closed"}
        >
          Download now to experience a new way to socialize.
        </motion.p>

        <motion.div
          className={styles.btnContainer}
          variants={slideUp}
          custom={0.9}
          animate={isInView ? "open" : "closed"}
        >
          <Link
            href="https://apps.apple.com/app/apple-store/id6474634049?pt=126456033&ct=website&mt=8"
            passHref
          >
            <Image
              src="/images/apple.png"
              alt="Apple Logo"
              width={268}
              height={76}
              className={styles.responsiveImage}
            />
          </Link>
          {/* <Image
            src="/images/googleplay.png"
            alt=""
            width={268}
            height={76}
            className={styles.responsiveImage}
          /> */}
        </motion.div>

        <motion.video
          ref={videoRef}
          muted
          playsInline
          loop={false}
          autoPlay={false}
        >
          <source src="/videos/downloadpic-vp9-chrome.webm" type='video/mp4"' />
          <source src="/videos/downloadpic-hevc-safari.mp4" type="video/webm" />
        </motion.video>
      </div>
    </div>
  );
}
