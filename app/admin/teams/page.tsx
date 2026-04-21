import { redirect } from "next/navigation";
import { AdminEntityPageView } from "@/components/real-pages";
import { getAdminEntityData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminTeamsPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminEntityData("teams");

  return <AdminEntityPageView columns={["战队", "队长", "状态", "创建时间"]} description="真实数据库中的战队实体。" eyebrow="后台战队" rows={data.map((team) => [team.name, team.captain ?? "待公布", team.active ? "运作中" : "已停用", new Date(team.createdAt).toLocaleString("zh-CN")])} title="战队维护" />;
}