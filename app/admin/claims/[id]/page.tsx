import { redirect } from "next/navigation";
import { AdminClaimDetailPageView } from "@/components/real-pages";
import { getAdminClaimDetailData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminClaimDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const routeParams = await params;
  const data = await getAdminClaimDetailData(routeParams.id);

  return <AdminClaimDetailPageView claim={data} />;
}