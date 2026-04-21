import { HomePageView } from "@/components/real-pages";
import { getHomePageData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function HomePage() {
  const viewer = await getViewer();
  const data = await getHomePageData(viewer);

  return <HomePageView data={data} viewer={viewer} />;
}