import { ClaimsPageView } from "@/components/real-pages";
import { getClaimsData } from "@/lib/queries";
import { getViewer } from "@/lib/session";

export default async function MyClaimsPage() {
  const viewer = await getViewer();
  const data = await getClaimsData(viewer);

  return <ClaimsPageView claims={data} viewer={viewer} />;
}