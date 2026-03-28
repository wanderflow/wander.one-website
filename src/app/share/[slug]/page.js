"use client";

import { useSearchParams } from "next/navigation";
import { use } from "react";
import DownloadLanding from "@/components/DownloadLanding";

export default function SharePage({ params }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite_code") || "";

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <DownloadLanding slug={slug} inviteCode={inviteCode} />
    </main>
  );
}
