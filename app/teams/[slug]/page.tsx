import { TeamDetailPageView } from "@/components/real-pages";
import { getTeamDetailData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function TeamDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const routeParams = await params;
  const [viewer, data] = await Promise.all([getViewer(), getTeamDetailData(routeParams.slug)]);

  return <TeamDetailPageView data={data} viewer={viewer} />;
}