import { redirect } from "next/navigation";
import { AdminEntityPageView } from "@/components/real-pages";
import { getAdminEntityData } from "@/lib/queries";
import { getViewer, isAdmin } from "@/lib/session";

export default async function AdminPlayersPage() {
  const viewer = await getViewer();
  if (!isAdmin(viewer)) {
    redirect("/login");
  }

  const data = await getAdminEntityData("players");

  return <AdminEntityPageView columns={["选手", "队伍", "位置", "创建时间"]} description="真实数据库中的选手实体。" eyebrow="后台选手" rows={data.map((player) => [player.displayName, player.teamMemberships[0]?.team.name ?? "自由选手", player.primaryRole ?? "暂未填写", new Date(player.createdAt).toLocaleString("zh-CN")])} title="选手维护" />;
}