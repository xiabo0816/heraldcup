import { redirect } from "next/navigation";
import { AdminEntityPageView } from "@/components/real-pages";
import { getAdminEntityData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminTournamentsPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminEntityData("tournaments");

  return <AdminEntityPageView columns={["赛事", "类型", "简介", "创建时间"]} description="真实数据库中的赛事实体。" eyebrow="后台赛事" rows={data.map((tournament) => [tournament.name, tournament.kind, tournament.description ?? "未填写简介", new Date(tournament.createdAt).toLocaleString("zh-CN")])} title="赛事维护" />;
}