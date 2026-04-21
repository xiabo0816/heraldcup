import { PlayerDetailPageView } from "@/components/real-pages";
import { getPlayerDetailData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function PlayerDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const routeParams = await params;
  const [viewer, data] = await Promise.all([getViewer(), getPlayerDetailData(routeParams.slug)]);

  return <PlayerDetailPageView data={data} viewer={viewer} />;
}