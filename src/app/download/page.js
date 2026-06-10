import { headers } from "next/headers";
import DownloadLanding from "@/components/DownloadLanding";
import DownloadRedirect from "@/components/DownloadRedirect";
import {
  buildSharePageMetadata,
  firstQuery,
} from "@/lib/buildSharePageMetadata";
import styles from "./page.module.scss";

const title = "Get Wander";
const description =
  "Explore trending topics in your community and connect with people who share your interests.";

const defaultMetadata = {
  title,
  description,
  alternates: { canonical: "/download" },
  openGraph: {
    type: "website",
    url: "/download",
    siteName: "Wander",
    title,
    description,
    images: [{ url: "/images/wander_logo_colorful.png", alt: "Wander" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/wander_logo_colorful.png"],
  },
};

export async function generateMetadata({ searchParams }) {
  const params = (await searchParams) ?? {};
  const slug = firstQuery(params.slug);
  if (!slug) {
    return defaultMetadata;
  }

  const headerList = await headers();
  return buildSharePageMetadata({
    slug,
    inviteCode: firstQuery(params.invite_code),
    resolvedSearch: params,
    headerList,
  });
}

export default async function DownloadPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const slug = firstQuery(params.slug);
  const inviteCode = firstQuery(params.invite_code);

  if (!slug) {
    return (
      <main className={styles.page}>
        <DownloadRedirect />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DownloadLanding slug={slug} inviteCode={inviteCode} />
    </main>
  );
}
