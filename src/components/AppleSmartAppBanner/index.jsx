"use client";

import { useEffect } from "react";

const APP_ID = "6474634049";

export default function AppleSmartAppBanner() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "apple-itunes-app";
    meta.content = `app-id=${APP_ID}`;
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
  return null;
}
