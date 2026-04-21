import { SeasonFinalPageView } from "@/components/real-pages";
import { getSeasonDetailData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function SeasonFinalPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const routeParams = await params;
  const [viewer, data] = await Promise.all([getViewer(), getSeasonDetailData(routeParams.slug)]);

  return <SeasonFinalPageView data={data} viewer={viewer} />;
}