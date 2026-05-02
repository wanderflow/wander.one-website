"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";
import { getAppStoreUrl } from "@/utils/getAppStoreUrl";

const API_URL = "/api/group-detail";

const GRADIENT_COLORS = [
  "#4BC4FF", "#1A9AFF", "#9676FF", "#BE64FE",
  "#E157CB", "#EF5794", "#FD683F", "#FE7C2B", "#FFA10B",
];

const GRADIENT_CSS = `linear-gradient(90deg, ${GRADIENT_COLORS.join(", ")})`;

function formatDateTag(date) {
  if (!date) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[date.getDay()];

  const formatTime = () => {
    const hours = date.getHours();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    return ` ${displayHours}${ampm}`;
  };

  if (diffDays === 0) return `Today${formatTime()}`;
  if (diffDays === 1) return `Tomorrow${formatTime()}`;
  if (diffDays >= 2 && diffDays <= 6) return `${dayName}${formatTime()}`;

  const month = date.getMonth() + 1;
  const dateNum = date.getDate();
  return `${dayName} ${month}/${dateNum}`;
}

function formatDetailDate(date) {
  if (!date) return null;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dateLine = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;

  const hours = date.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;
  const timeLine = `${displayHours}${ampm}`;

  return { dateLine, timeLine };
}

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      execCopyFallback(text);
    });
  } else {
    execCopyFallback(text);
  }
}

function execCopyFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function triggerDeepLink(slug, inviteCode) {
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);

  if (isAndroid) {
    window.location.href = `intent://share/${slug}?invite_code=${inviteCode}#Intent;scheme=wanderone;package=com.wander.one.app;end`;
    return;
  }

  const schemeUrl = `wanderone://share/${slug}?invite_code=${inviteCode}`;

  // Use hidden iframe to attempt scheme without navigating the page away
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = schemeUrl;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 500);

  // Also try direct location for Safari which may ignore iframe schemes
  window.location.href = schemeUrl;

  // Fallback: if page is still visible after timeout, open App Store in new tab
  const timer = setTimeout(() => {
    if (!document.hidden) {
      window.open(getAppStoreUrl(), "_blank");
    }
  }, 2500);

  const onVisibilityChange = () => {
    if (document.hidden) {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
}

export default function DownloadLanding({ slug, inviteCode, channelUrl, userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const deepLinkFiredRef = useRef(false);
  const toastTimerRef = useRef(null);

  const isShareMode = Boolean(slug);
  const inviteLink = isShareMode
    ? `wander.one/share/${slug}?invite_code=${inviteCode}`
    : null;
  const fullShareUrl = isShareMode
    ? `https://wander.one/share/${slug}?invite_code=${inviteCode}`
    : null;

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const handleDeepLink = useCallback(() => {
    if (!isShareMode) return;
    copyToClipboard(fullShareUrl);
    triggerDeepLink(slug, inviteCode);
  }, [isShareMode, fullShareUrl, slug, inviteCode]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = isShareMode
        ? { invite_link: inviteLink }
        : { user_id: userId, channel_url: channelUrl };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isShareMode, inviteLink, userId, channelUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!data || !isShareMode || deepLinkFiredRef.current) return;
    deepLinkFiredRef.current = true;
    handleDeepLink();
  }, [data, isShareMode, handleDeepLink]);

  const timeDate = data?.time ? new Date(data.time) : null;
  const pillTime = formatDateTag(timeDate);
  const detailDate = formatDetailDate(timeDate);
  const hasPill = pillTime || data?.location;

  const creator = data?.creator_user_id
    ? data.members?.find((m) => m.user_id === data.creator_user_id)
    : null;

  const displayMembers = data?.members?.slice(0, 4) ?? [];

  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.wrap}>
        <div className={styles.errorState}>
          <p>Failed to load group details</p>
          <button onClick={fetchData} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Image
            src="/images/wander_logo_colorful.png"
            alt="Wander"
            width={36}
            height={36}
          />
          <span className={styles.headerTitle}>Wander</span>
        </div>
        <div
          className={styles.joinBtnOuter}
          style={{ background: GRADIENT_CSS }}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDeepLink();
            }}
            className={styles.joinBtnInner}
          >
            <span
              className={styles.joinBtnText}
              style={{ backgroundImage: GRADIENT_CSS }}
            >
              Join
            </span>
          </a>
        </div>
      </header>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Group Card */}
        <div className={styles.groupCard}>
          <div className={styles.cardBg}>
            {data.photo ? (
              <Image
                src={data.photo}
                alt={data.subject || ""}
                fill
                priority
                className={styles.cardBgImg}
                sizes="(max-width: 512px) 100vw, 512px"
              />
            ) : null}
          </div>
          <div className={styles.cardTopOverlay} />

          {hasPill && (
            <div className={styles.cardPill}>
              {pillTime && <span className={styles.pillTime}>{pillTime}</span>}
              {pillTime && data.location && <span className={styles.pillSep}> </span>}
              {data.location && (
                <span className={styles.pillLocation}>{data.location}</span>
              )}
            </div>
          )}

          <div className={styles.cardDots}>
            <span>&#x2022;&#x2022;&#x2022;</span>
          </div>

          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{data.subject}</h2>
            {data.description && (
              <p className={styles.cardDesc}>{data.description}</p>
            )}
          </div>
        </div>

        {/* Detail Rows */}
        <div className={styles.detailSection}>
          {detailDate && (
            <div className={styles.detailRow}>
              <Image
                src="/images/group_calendar.png"
                alt="Calendar"
                width={24}
                height={24}
                className={styles.detailIcon}
              />
              <div className={styles.detailText}>
                <span className={styles.detailPrimary}>{detailDate.dateLine}</span>
                <span className={styles.detailSecondary}>{detailDate.timeLine}</span>
              </div>
            </div>
          )}

          {data.location && (
            <div className={styles.detailRow}>
              <Image
                src="/images/group_location.png"
                alt="Location"
                width={24}
                height={24}
                className={styles.detailIcon}
              />
              <div className={styles.detailText}>
                <span className={styles.detailPrimary}>{data.location}</span>
              </div>
              <Image
                src="/images/group_map.png"
                alt="Map"
                width={24}
                height={24}
                className={styles.detailMapIcon}
              />
            </div>
          )}

          {creator && (
            <div className={styles.detailRow}>
              <Image
                src="/images/group_hoster.png"
                alt="Host"
                width={24}
                height={24}
                className={styles.detailIcon}
              />
              <div className={styles.detailHostInfo}>
                <span className={styles.detailHostLabel}>Hosted by</span>
                <div className={styles.detailHostUser}>
                  <Image
                    src={creator.avatar}
                    alt={creator.first_name}
                    width={24}
                    height={24}
                    className={styles.detailHostAvatar}
                  />
                  <span className={styles.detailHostName}>{creator.first_name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Download Card */}
        <div className={styles.downloadCard}>
          <p className={styles.downloadText}>
            {isShareMode
              ? "Wander finds the right people to plan your next hangout. Download the app and enter the code to join!"
              : "Wander finds the right people to plan your next hangout. Download the app and enter the code to join!"}
          </p>

          {isShareMode && inviteCode && (
            <div className={styles.codeRow}>
              <span className={styles.codeText}>{inviteCode}</span>
              <button
                className={styles.copyBtn}
                onClick={() => {
                  copyToClipboard(inviteCode);
                  showToast("Copied!");
                }}
                aria-label="Copy invite code"
              >
                <Image
                  src="/images/image_copy.png"
                  alt="Copy"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          )}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(fullShareUrl);
              window.open(getAppStoreUrl(), "_blank");
            }}
            className={styles.downloadBtn}
          >
            Download
          </a>
        </div>

        {/* Group Description */}
        {data.description && (
          <div className={styles.descriptionSection}>
            <p className={styles.descriptionText}>{data.description}</p>
          </div>
        )}

        {/* Members */}
        <div className={styles.membersSection}>
          <h3 className={styles.membersTitle}>
            <strong>{data.member_count ?? 0}</strong> in the group
          </h3>
          {displayMembers.length > 0 && (
            <div className={styles.membersRow}>
              {displayMembers.map((member) => (
                <div key={member.user_id} className={styles.memberItem}>
                  <div className={styles.memberAvatarWrap}>
                    <Image
                      src={member.avatar}
                      alt={member.first_name}
                      width={48}
                      height={48}
                      className={styles.memberAvatar}
                    />
                  </div>
                  <span className={styles.memberName}>{member.first_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}

      {/* Footer */}
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
              style={{ backgroundImage: GRADIENT_CSS }}
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
              width={30}
              height={30}
              className={styles.socialIcon}
            />
          </Link>
          <a
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
          </a>
        </div>
      </footer>
    </div>
  );
}
