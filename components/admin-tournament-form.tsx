"use client";

import { useActionState } from "react";
import { createTournamentSeasonAction } from "@/app/admin/tournaments/actions";
import { initialTournamentFormState } from "@/app/admin/tournaments/form-state";

const tournamentKinds = ["PIONEER", "GUANJUE", "LEGEND", "CUSTOM"] as const;

export function AdminTournamentForm() {
  const [state, formAction, pending] = useActionState(createTournamentSeasonAction, initialTournamentFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Tournament</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增赛事或赛季</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">若赛事 slug 已存在，会复用同一赛事系列并为其新增届次。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛事名称</span>
          <input name="tournamentName" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="先锋杯" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛事 slug</span>
          <input name="tournamentSlug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛事类型</span>
          <select name="tournamentKind" defaultValue="PIONEER" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {tournamentKinds.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>届次标题</span>
          <input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="第十一届先锋杯" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛季 slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup-s11" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>届次编号</span>
          <input name="seasonNumber" type="number" min="1" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="11" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>状态标签</span>
          <input name="statusLabel" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="总决赛周" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>主题色</span>
          <input name="themeColor" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="cyan" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>赛事描述</span>
          <textarea name="tournamentDescription" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>赛季摘要</span>
          <textarea name="summary" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="featured" className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>设为首页推荐赛季</span>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "创建中..." : "新增赛事或赛季"}
      </button>
    </form>
  );
}
