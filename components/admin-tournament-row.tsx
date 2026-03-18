import {
  deleteTournamentSeasonAction,
  updateTournamentSeasonAction
} from "@/app/admin/tournaments/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

const tournamentKinds = ["PIONEER", "GUANJUE", "LEGEND", "CUSTOM"] as const;

export function AdminTournamentRow({
  season
}: {
  season: {
    id: string;
    tournamentId: string;
    tournamentName: string;
    tournamentSlug: string;
    tournamentKind: string;
    tournamentDescription: string | null;
    title: string;
    slug: string;
    seasonNumber: number;
    statusLabel: string | null;
    themeColor: string | null;
    summary: string | null;
    featured: boolean;
    teamCount: number;
    matchCount: number;
  };
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">{season.tournamentName}</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{season.title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {season.teamCount} 支队伍 · {season.matchCount} 场比赛 · {season.featured ? "首页推荐中" : "未推荐"}
          </p>
        </div>
        <form action={deleteTournamentSeasonAction}>
          <input type="hidden" name="id" value={season.id} />
          <AdminFormSubmit idleLabel="删除赛季" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateTournamentSeasonAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={season.id} />
        <input type="hidden" name="tournamentId" value={season.tournamentId} />
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛事名称</span>
          <input name="tournamentName" defaultValue={season.tournamentName} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛事 slug</span>
          <input name="tournamentSlug" defaultValue={season.tournamentSlug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛事类型</span>
          <select name="tournamentKind" defaultValue={season.tournamentKind} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {tournamentKinds.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>届次标题</span>
          <input name="title" defaultValue={season.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛季 slug</span>
          <input name="slug" defaultValue={season.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>届次编号</span>
          <input name="seasonNumber" type="number" min="1" defaultValue={season.seasonNumber} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>状态标签</span>
          <input name="statusLabel" defaultValue={season.statusLabel ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>主题色</span>
          <input name="themeColor" defaultValue={season.themeColor ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>赛事描述</span>
          <textarea name="tournamentDescription" defaultValue={season.tournamentDescription ?? ""} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>赛季摘要</span>
          <textarea name="summary" defaultValue={season.summary ?? ""} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="featured" defaultChecked={season.featured} className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>设为首页推荐赛季</span>
        </label>
        <div className="md:col-span-2 flex justify-end">
          <AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." />
        </div>
      </form>
    </article>
  );
}
