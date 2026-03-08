"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useRef, useState, useEffect } from "react";
import { slideUp, textVariants } from "./animation";
import { motion, useInView } from "framer-motion";

export default function Index() {
  const container = useRef(null);
  const text = "Connect, \nbased on who you\nreally are.";
  const isInView = useInView(container, {
    threshold: 1,
    rootMargin: "0px 0px -100px 0px",
  });

  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleAnimationComplete = () => {
    if (videoRef.current) {
      setShowVideo(true);
      videoRef.current.play();
    }
  };
  const handleAnimation2Complete = () => {
    setShowButton(true);
  };

  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isInView & showVideo) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  }, [isInView, showVideo]);

  return (
    <main ref={container} className={styles.landing}>
      <Image
        src="/images/background1.png"
        className={styles.bg}
        fill={true}
        alt="background"
      />
      <div className={styles.textContainer}>
        <div className={styles.text}>
          {text.split("").map((c, index) =>
            c === "\n" ? (
              <br key={`br-${index}`} />
            ) : (
              <motion.span
                key={index}
                variants={slideUp}
                custom={index}
                initial="initial"
                animate="enter"
                onAnimationComplete={
                  index === text.length - 1
                    ? handleAnimationComplete
                    : undefined
                }
              >
                {c === " " ? "\u00A0" : c}
              </motion.span>
            )
          )}
        </div>
      </div>

      <motion.video
        ref={videoRef}
        muted
        playsInline
        autoPlay={false}
        loop={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9,
          backgroundColor: "transparent",
          objectFit: "contain",
          width: "90vw",
          height: "80vh",
          pointerEvents: "none",
        }}
        onEnded={handleAnimation2Complete}
      >
        <source src="/videos/conversation-vp9-chrome.webm" type="video/mp4" />
        <source src="/videos/conversation-hevc-safari.mp4" type="video/webm" />
      </motion.video>

      {showButton && (
        <motion.img
          variants={textVariants}
          className={styles.button}
          animate="scrollButton"
          src="/images/button.png"
          alt=""
          onClick={handleScroll}
        />
      )}
    </main>
  );
}
