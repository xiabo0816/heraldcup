import { redirect } from "next/navigation";
import { AdminEntityPageView } from "@/components/real-pages";
import { getAdminEntityData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminMatchesPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminEntityData("matches");

  return <AdminEntityPageView columns={["比赛", "赛季", "状态", "时间"]} description="真实数据库中的比赛实体。" eyebrow="后台比赛" rows={data.map((match) => [match.title, match.season?.title ?? "未归属赛季", match.status, match.scheduledAt ? new Date(match.scheduledAt).toLocaleString("zh-CN") : "待定"])} title="比赛维护" />;
}