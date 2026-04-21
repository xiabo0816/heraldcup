import { redirect } from "next/navigation";
import { AdminEntityPageView } from "@/components/real-pages";
import { getAdminEntityData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminSeasonsPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminEntityData("seasons");

  return <AdminEntityPageView columns={["赛季", "赛事", "状态", "创建时间"]} description="真实数据库中的赛季实体。" eyebrow="后台赛季" rows={data.map((season) => [season.title, season.tournament.name, season.statusLabel ?? "进行中", new Date(season.createdAt).toLocaleString("zh-CN")])} title="赛季维护" />;
}