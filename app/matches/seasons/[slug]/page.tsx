import { SeasonDetailPageView } from "@/components/real-pages";
import { getSeasonDetailData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function SeasonPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const routeParams = await params;
  const [viewer, data] = await Promise.all([getViewer(), getSeasonDetailData(routeParams.slug)]);

  return <SeasonDetailPageView data={data} viewer={viewer} />;
}