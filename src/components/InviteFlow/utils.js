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

export function detectInAppBrowser() {
  if (typeof navigator === "undefined") {
    return {
      isInAppBrowser: false,
      appName: "",
      recommendedBrowser: "Safari or Chrome",
      instruction: "Use the menu to open this page in your browser.",
    };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isAndroid = /Android/i.test(ua);
  const isIos =
    /iPhone|iPad|iPod/i.test(ua) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const appMatchers = [
    { name: "Instagram", pattern: /Instagram/i },
    { name: "WeChat", pattern: /MicroMessenger|WeChat/i },
    { name: "Messenger", pattern: /Messenger/i },
    { name: "Facebook", pattern: /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i },
    { name: "TikTok", pattern: /TikTok|Bytedance|musical_ly|Aweme/i },
    { name: "Snapchat", pattern: /Snapchat/i },
    { name: "LINE", pattern: /Line\//i },
    { name: "QQ", pattern: /\bQQ\//i },
    { name: "Weibo", pattern: /Weibo/i },
    { name: "Telegram", pattern: /Telegram/i },
  ];
  const matchedApp = appMatchers.find((app) => app.pattern.test(ua));
  const recommendedBrowser = isIos ? "Safari or Chrome" : isAndroid ? "Chrome" : "Safari or Chrome";
  const appName = matchedApp?.name || "";

  return {
    isInAppBrowser: Boolean(matchedApp),
    appName,
    recommendedBrowser,
    instruction: "Use the menu to open this page in your browser.",
  };
}

export function triggerDeepLink({ slug, inviteCode, onFallback, onOpened }) {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isAndroid = /Android/i.test(ua);
  const isIos =
    /iPhone|iPad|iPod/i.test(ua) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const encodedSlug = encodeURIComponent(slug);
  const encodedInviteCode = encodeURIComponent(inviteCode || "");

  if (isAndroid) {
    const fallbackUrl = encodeURIComponent(
      "https://play.google.com/store/apps/details?id=com.wander.one.app",
    );
    window.location.href = `intent://share/${encodedSlug}?invite_code=${encodedInviteCode}#Intent;scheme=wanderone;package=com.wander.one.app;S.browser_fallback_url=${fallbackUrl};end`;
    return;
  }

  if (!isIos) {
    onFallback?.();
    return;
  }

  const schemeUrl = `wanderone://share/${encodedSlug}?invite_code=${encodedInviteCode}`;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = schemeUrl;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 500);

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

function formatGroups(number, groups) {
  const parts = [];
  let cursor = 0;

  for (const size of groups) {
    if (cursor >= number.length) break;
    parts.push(number.slice(cursor, cursor + size));
    cursor += size;
  }

  if (cursor < number.length) {
    parts.push(number.slice(cursor));
  }

  return parts.filter(Boolean).join(" ");
}

function formatNorthAmerica(number) {
  if (number.length <= 3) return number;
  if (number.length <= 6) {
    return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  }

  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
}

function formatGermany(number) {
  return formatGroups(number, number.length > 10 ? [3, 4, 4] : [3, 3, 4]);
}

function formatNewZealand(number) {
  if (number.length <= 8) return formatGroups(number, [2, 3, 3]);
  if (number.length === 9) return formatGroups(number, [2, 3, 4]);
  return formatGroups(number, [2, 4, 4]);
}

export const PHONE_COUNTRIES = [
  {
    id: "ca",
    name: "Canada",
    code: "+1",
    flag: "🇨🇦",
    minLength: 10,
    maxLength: 10,
    format: formatNorthAmerica,
    example: "(555) 123-4567",
  },
  {
    id: "us",
    name: "United States",
    code: "+1",
    flag: "🇺🇸",
    minLength: 10,
    maxLength: 10,
    format: formatNorthAmerica,
    example: "(555) 123-4567",
  },
  {
    id: "au",
    name: "Australia",
    code: "+61",
    flag: "🇦🇺",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [3, 3, 3]),
    example: "412 345 678",
  },
  {
    id: "cn",
    name: "China",
    code: "+86",
    flag: "🇨🇳",
    minLength: 11,
    maxLength: 11,
    format: (number) => formatGroups(number, [3, 4, 4]),
    example: "138 0013 8000",
  },
  {
    id: "fr",
    name: "France",
    code: "+33",
    flag: "🇫🇷",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [1, 2, 2, 2, 2]),
    example: "6 12 34 56 78",
  },
  {
    id: "de",
    name: "Germany",
    code: "+49",
    flag: "🇩🇪",
    minLength: 10,
    maxLength: 11,
    format: formatGermany,
    example: "151 12345678",
  },
  {
    id: "hk",
    name: "Hong Kong",
    code: "+852",
    flag: "🇭🇰",
    minLength: 8,
    maxLength: 8,
    format: (number) => formatGroups(number, [4, 4]),
    example: "5123 4567",
  },
  {
    id: "ie",
    name: "Ireland",
    code: "+353",
    flag: "🇮🇪",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [2, 3, 4]),
    example: "85 123 4567",
  },
  {
    id: "jp",
    name: "Japan",
    code: "+81",
    flag: "🇯🇵",
    minLength: 10,
    maxLength: 10,
    format: (number) => formatGroups(number, [2, 4, 4]),
    example: "90 1234 5678",
  },
  {
    id: "nl",
    name: "Netherlands",
    code: "+31",
    flag: "🇳🇱",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [1, 4, 4]),
    example: "6 1234 5678",
  },
  {
    id: "nz",
    name: "New Zealand",
    code: "+64",
    flag: "🇳🇿",
    minLength: 8,
    maxLength: 10,
    format: formatNewZealand,
    example: "21 123 4567",
  },
  {
    id: "no",
    name: "Norway",
    code: "+47",
    flag: "🇳🇴",
    minLength: 8,
    maxLength: 8,
    format: (number) => formatGroups(number, [3, 2, 3]),
    example: "412 34 567",
  },
  {
    id: "sg",
    name: "Singapore",
    code: "+65",
    flag: "🇸🇬",
    minLength: 8,
    maxLength: 8,
    format: (number) => formatGroups(number, [4, 4]),
    example: "8123 4567",
  },
  {
    id: "kr",
    name: "South Korea",
    code: "+82",
    flag: "🇰🇷",
    minLength: 10,
    maxLength: 10,
    format: (number) => formatGroups(number, [2, 4, 4]),
    example: "10 1234 5678",
  },
  {
    id: "se",
    name: "Sweden",
    code: "+46",
    flag: "🇸🇪",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [2, 3, 2, 2]),
    example: "70 123 45 67",
  },
  {
    id: "ch",
    name: "Switzerland",
    code: "+41",
    flag: "🇨🇭",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [2, 3, 2, 2]),
    example: "79 123 45 67",
  },
  {
    id: "tw",
    name: "Taiwan",
    code: "+886",
    flag: "🇹🇼",
    minLength: 9,
    maxLength: 9,
    format: (number) => formatGroups(number, [3, 3, 3]),
    example: "912 345 678",
  },
  {
    id: "gb",
    name: "United Kingdom",
    code: "+44",
    flag: "🇬🇧",
    minLength: 10,
    maxLength: 10,
    format: (number) => formatGroups(number, [4, 6]),
    example: "7911 123456",
  },
];

export function getPhoneCountry(countryId) {
  return (
    PHONE_COUNTRIES.find((country) => country.id === countryId) ||
    PHONE_COUNTRIES[0]
  );
}

export function normalizePhoneDigits(value, countryId = "ca") {
  const country = getPhoneCountry(countryId);
  return value.replace(/\D/g, "").slice(0, country.maxLength);
}

export function formatPhoneNumber(value, countryId = "ca") {
  const country = getPhoneCountry(countryId);
  const digits = normalizePhoneDigits(value, country.id);
  return country.format(digits);
}

export function isPhoneNumberComplete(value, countryId = "ca") {
  const country = getPhoneCountry(countryId);
  const digits = normalizePhoneDigits(value, country.id);
  return (
    digits.length >= country.minLength && digits.length <= country.maxLength
  );
}

export function toE164PhoneNumber(value, countryId = "ca") {
  const country = getPhoneCountry(countryId);
  const digits = normalizePhoneDigits(value, country.id);
  if (!isPhoneNumberComplete(digits, country.id)) return "";
  return `${country.code}${digits}`;
}
