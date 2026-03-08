"use client";
import styles from "./style.module.scss";
import { useInView, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { slideUp, opacity } from "./animation";
export default function Index() {
  const description = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(description, {
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
    <div ref={description} className={styles.description}>
      <div className={styles.body}>
        <motion.h2
          variants={slideUp}
          custom={0.3}
          animate={isInView ? "open" : "closed"}
        >
          YOUR
        </motion.h2>
        <motion.h2
          variants={slideUp}
          custom={0.6}
          animate={isInView ? "open" : "closed"}
        >
          CONNECTION
        </motion.h2>
        <motion.h2
          variants={slideUp}
          custom={0.9}
          animate={isInView ? "open" : "closed"}
        >
          OF THE DAY
        </motion.h2>
        <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>
          Every day, you will receive a unique match tailored specifically for
          you. Don&apos;t let this chance slip by connect with your daily match
          within 24 hours.
        </motion.p>
      </div>
      <motion.video
        ref={videoRef}
        muted
        playsInline
        loop={false}
        autoPlay={false}
      >
        <source
          src="/videos/friend of the day-vp9-chrome.webm"
          type='video/mp4"'
        />
        <source
          src="/videos/friend of the day-hevc-safari.mp4"
          type="video/webm"
        />
      </motion.video>
    </div>
  );
}
