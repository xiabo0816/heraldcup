import { deletePlayerAction, updatePlayerAction } from "@/app/admin/players/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

export function AdminPlayerRow({
  player
}: {
  player: {
    id: string;
    displayName: string;
    slug: string;
    steamId: string | null;
    primaryRole: string | null;
    preferredRoles: string[];
    heroPool: string[];
    ladderScore: number | null;
    gameYears: number | null;
    playStyles: string[];
    highlightMatchIds: string[];
    bio: string | null;
    gameUnderstanding: string | null;
    active: boolean;
    teamName: string;
  };
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">{player.teamName}</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{player.displayName}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">{player.primaryRole ?? "未分配位置"}</p>
        </div>
        <form action={deletePlayerAction}>
          <input type="hidden" name="id" value={player.id} />
          <AdminFormSubmit idleLabel="删除选手" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updatePlayerAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={player.id} />
        <label className="grid gap-2 text-sm text-slate-300">
          <span>选手名称</span>
          <input name="displayName" defaultValue={player.displayName} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" defaultValue={player.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>SteamID</span>
          <input name="steamId" defaultValue={player.steamId ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>位置</span>
          <input name="primaryRole" defaultValue={player.primaryRole ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>天梯分数</span>
          <input name="ladderScore" type="number" min="0" defaultValue={player.ladderScore ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>游戏年数</span>
          <input name="gameYears" type="number" min="0" defaultValue={player.gameYears ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>擅长位置</span>
          <textarea name="preferredRolesText" defaultValue={player.preferredRoles.join(", ")} rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>擅长英雄</span>
          <textarea name="heroPoolText" defaultValue={player.heroPool.join(", ")} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>打法风格</span>
          <textarea name="playStylesText" defaultValue={player.playStyles.join(", ")} rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>高光比赛 ID</span>
          <textarea name="highlightMatchIdsText" defaultValue={player.highlightMatchIds.join(", ")} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>简介</span>
          <textarea name="bio" defaultValue={player.bio ?? ""} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>我的游戏理解</span>
          <textarea name="gameUnderstanding" defaultValue={player.gameUnderstanding ?? ""} rows={5} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="active" defaultChecked={player.active} className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>当前活跃</span>
        </label>
        <div className="md:col-span-2 flex justify-end">
          <AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." />
        </div>
      </form>
    </article>
  );
}
