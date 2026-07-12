import { notFound } from "next/navigation";
import GroupPageClient from "./GroupPageClient";
import { fetchGroupDetail } from "@/lib/fetchGroupDetail";

export const dynamic = "force-dynamic";

function groupTitle(group) {
  return group?.subject || "Group on Wander";
}

export async function generateMetadata({ params }) {
  const { groupId } = await params;

  try {
    const group = await fetchGroupDetail(groupId);
    if (!group) return { title: "Group not found | Wander" };

    const title = `${groupTitle(group)} | Wander`;
    const description =
      group.description || "See this group and its members on Wander.";
    const canonical = `/group/${encodeURIComponent(groupId)}`;
    const images = group.photo
      ? [{ url: group.photo, alt: groupTitle(group) }]
      : [{ url: "/images/wander_logo_colorful.png", alt: "Wander" }];

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        siteName: "Wander",
        title,
        description,
        images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: images.map((image) => image.url),
      },
    };
  } catch {
    return {
      title: "Group on Wander",
      description: "See this group and its members on Wander.",
    };
  }
}

export default async function GroupPage({ params }) {
  const { groupId } = await params;
  const group = await fetchGroupDetail(groupId);

  if (!group) notFound();

  return <GroupPageClient groupId={groupId} group={group} />;
}
