import { redirect } from "next/navigation";
import { AdminClaimsPageView } from "@/components/real-pages";
import { getAdminClaimsData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminClaimsPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminClaimsData();
  return <AdminClaimsPageView claims={data} />;
}