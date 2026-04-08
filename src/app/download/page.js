import DownloadLanding from "@/components/DownloadLanding";
import styles from "./page.module.scss";

const DEFAULT_CHANNEL_URL = "group_quarter_life_crisis_support_group_c2b20867";
const DEFAULT_USER_ID = "user_2bmyvhCgC9EiYoN1y8tlCWmi9wh";

const title = "Get Wander";
const description =
  "Explore trending topics in your community and connect with people who share your interests.";

export const metadata = {
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

export default async function DownloadPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const slug = params.slug || "";
  const inviteCode = params.invite_code || "";

  return (
    <main className={styles.page}>
      <DownloadLanding
        slug={slug}
        inviteCode={inviteCode}
        channelUrl={slug ? undefined : DEFAULT_CHANNEL_URL}
        userId={slug ? undefined : DEFAULT_USER_ID}
      />
    </main>
  );
}
