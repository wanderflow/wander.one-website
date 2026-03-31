import DownloadLanding from "@/components/DownloadLanding";
import styles from "./page.module.scss";

const DEFAULT_CHANNEL_URL = "group_quarter_life_crisis_support_group_c2b20867";
const DEFAULT_USER_ID = "user_2bmyvhCgC9EiYoN1y8tlCWmi9wh";

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
