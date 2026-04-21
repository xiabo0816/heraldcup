import { MatchDetailPageView } from "@/components/real-pages";
import { getMatchDetailData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function MatchDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const routeParams = await params;
  const [viewer, data] = await Promise.all([getViewer(), getMatchDetailData(routeParams.slug)]);

  return <MatchDetailPageView data={data} viewer={viewer} />;
}