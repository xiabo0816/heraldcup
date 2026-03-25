import { deleteTeamAction, updateTeamAction } from "@/app/admin/teams/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

export function AdminTeamRow({
  team
}: {
  team: {
    id: string;
    name: string;
    slug: string;
    slogan: string | null;
    logoUrl: string | null;
    honorPoints: number;
    coach: string | null;
    captain: string | null;
    summary: string | null;
    latestSeasonTitle: string;
    seasonCount: number;
    memberCount: number;
  };
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-gold">{team.latestSeasonTitle}</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{team.name}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">当前现役成员：{team.memberCount} 人 · 已关联 {team.seasonCount} 个赛季</p>
        </div>
        <form action={deleteTeamAction}>
          <input type="hidden" name="id" value={team.id} />
          <AdminFormSubmit idleLabel="删除队伍" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateTeamAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={team.id} />
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队伍名称</span>
          <input
            name="name"
            defaultValue={team.name}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input
            name="slug"
            defaultValue={team.slug}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>slogan</span>
          <input
            name="slogan"
            defaultValue={team.slogan ?? ""}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>战队积分</span>
          <input
            name="honorPoints"
            type="number"
            min="0"
            defaultValue={team.honorPoints}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队徽 / 头像 URL</span>
          <input
            name="logoUrl"
            defaultValue={team.logoUrl ?? ""}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>教练</span>
          <input
            name="coach"
            defaultValue={team.coach ?? ""}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队长</span>
          <input
            name="captain"
            defaultValue={team.captain ?? ""}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>战队介绍</span>
          <textarea
            name="summary"
            defaultValue={team.summary ?? ""}
            rows={4}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          />
        </label>
        <div className="md:col-span-2 flex justify-end">
          <AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." />
        </div>
      </form>
    </article>
  );
}
