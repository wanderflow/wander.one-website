"use client";

import DownloadLanding from "@/components/DownloadLanding";

export default function SharePageClient({ slug, inviteCode }) {
  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <DownloadLanding slug={slug} inviteCode={inviteCode} />
    </main>
  );
}
