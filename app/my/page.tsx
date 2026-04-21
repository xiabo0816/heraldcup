import { MyPageView } from "@/components/real-pages";
import { getMyPageData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function MyPage() {
  const viewer = await getViewer();
  const data = await getMyPageData(viewer);

  return <MyPageView data={data} viewer={viewer} />;
}