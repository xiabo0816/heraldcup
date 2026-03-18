"use client";

import { useActionState } from "react";
import { createMatchAction } from "@/app/admin/matches/actions";
import { initialMatchFormState } from "@/app/admin/matches/form-state";

const matchStatuses = ["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"] as const;

export function AdminMatchForm({
  seasons,
  teams
}: {
  seasons: Array<{ id: string; title: string }>;
  teams: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(createMatchAction, initialMatchFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Match</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增比赛</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">比赛 slug 会直接被选手高光比赛 ID 和后续内容页复用。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>比赛标题</span>
          <input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup-s11-final" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>外部比赛 ID</span>
          <input name="externalMatchId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>开赛时间</span>
          <input type="datetime-local" name="scheduledAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛制</span>
          <input name="format" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="BO3" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>状态</span>
          <select name="status" defaultValue="SCHEDULED" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {matchStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>主队</span>
          <select name="homeTeamId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">待定</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>客队</span>
          <select name="awayTeamId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">待定</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>主队比分</span>
          <input name="scoreHome" type="number" min="0" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>客队比分</span>
          <input name="scoreAway" type="number" min="0" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>所属赛季</span>
          <select name="seasonId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不绑定赛季</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>直播链接</span>
          <input name="streamUrl" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>比赛摘要</span>
          <textarea name="summary" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "创建中..." : "新增比赛"}
      </button>
    </form>
  );
}
