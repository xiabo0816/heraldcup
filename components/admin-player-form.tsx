"use client";

import { useActionState } from "react";
import { createPlayerAction } from "@/app/admin/players/actions";
import { initialPlayerFormState } from "@/app/admin/players/form-state";

export function AdminPlayerForm() {
  const [state, formAction, pending] = useActionState(createPlayerAction, initialPlayerFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Player</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增选手</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">高光比赛 ID 推荐填写比赛 slug，这样后续可直接关联到比赛详情页。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>选手名称</span>
          <input name="displayName" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="cook" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>SteamID</span>
          <input name="steamId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="7656119xxxxxxxxxx" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>位置</span>
          <input name="primaryRole" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="Carry / Support" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>擅长英雄</span>
          <textarea name="heroPoolText" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="Juggernaut, Slark, Phantom Assassin" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>高光比赛 ID</span>
          <textarea name="highlightMatchIdsText" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup-s11-final" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>简介</span>
          <textarea name="bio" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>当前活跃</span>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "创建中..." : "新增选手"}
      </button>
    </form>
  );
}
