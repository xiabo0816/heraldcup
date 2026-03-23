"use client";

import { useActionState } from "react";
import { createTeamAction } from "@/app/admin/teams/actions";
import { initialTeamFormState } from "@/app/admin/teams/form-state";

export function AdminTeamForm({
  seasons
}: {
  seasons: Array<{
    id: string;
    title: string;
  }>;
}) {
  const [state, formAction, pending] = useActionState(createTeamAction, initialTeamFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Team</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增队伍</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">尽量一次补齐积分、队徽、介绍和口号，前台展示会更完整，也更方便后续运营使用。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队伍名称</span>
          <input name="name" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="例如：今晚不加班" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="no-overtime" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>slogan</span>
          <input name="slogan" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="兄弟们再冲一次" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>战队积分</span>
          <input name="honorPoints" type="number" min="0" defaultValue="0" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="120" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队徽 / 头像 URL</span>
          <input name="logoUrl" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="https://..." />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>教练</span>
          <input name="coach" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="koi" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队长</span>
          <input name="captain" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="cook" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>战队介绍</span>
          <textarea name="summary" rows={4} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="这支固定队的风格、荣誉和来历。" />
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
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60"
      >
        {pending ? "创建中..." : "新增队伍"}
      </button>
    </form>
  );
}
