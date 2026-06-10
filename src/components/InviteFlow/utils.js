export function formatDetailDate(date) {
  if (!date) return null;

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateLine = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;
  const timeLine = minutes
    ? `${displayHours}:${String(minutes).padStart(2, "0")}${ampm}`
    : `${displayHours}${ampm}`;

  return { dateLine, timeLine };
}

export function splitLocation(location) {
  if (!location) return { venue: "", address: "" };

  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return { venue: location, address: "" };
  }

  return {
    venue: parts[0],
    address: parts.slice(1).join(", "),
  };
}

export function buildMapSearchUrl({ venue, address }) {
  const query = [venue, address]
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join(", ");

  if (!query) return "";

  const encodedQuery = encodeURIComponent(query);
  if (typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent || "")) {
    return `https://maps.apple.com/?q=${encodedQuery}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

export function copyToClipboard(text) {
  if (!text) return;

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

export function triggerDeepLink({ slug, inviteCode, onFallback, onOpened }) {
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);

  if (isAndroid) {
    window.location.href = `intent://share/${slug}?invite_code=${inviteCode}#Intent;scheme=wanderone;package=com.wander.one.app;end`;
    onOpened?.();
    return;
  }

  const schemeUrl = `wanderone://share/${slug}?invite_code=${inviteCode}`;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = schemeUrl;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 500);

  window.location.href = schemeUrl;

  const timer = setTimeout(() => {
    if (!document.hidden) {
      onFallback?.();
    }
  }, 2500);

  const onVisibilityChange = () => {
    if (document.hidden) {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      onOpened?.();
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
}

export function normalizePhoneDigits(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function formatPhoneNumber(value) {
  const digits = normalizePhoneDigits(value);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
