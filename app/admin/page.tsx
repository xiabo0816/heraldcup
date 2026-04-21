import { redirect } from "next/navigation";
import { AdminHomePageView } from "@/components/real-pages";
import { getAdminDashboardData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminDashboardData();
  return <AdminHomePageView data={data} />;
}