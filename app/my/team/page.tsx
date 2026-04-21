import { TeamWorkspacePageView } from "@/components/real-pages";
import { getMyPageData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function MyTeamPage() {
  const viewer = await getViewer();
  const data = await getMyPageData(viewer);

  return <TeamWorkspacePageView data={data} viewer={viewer} />;
}