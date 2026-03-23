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
      <p className="mt-3 text-sm leading-7 text-slate-400">代表比赛建议直接填写比赛 slug，方便前台详情页和人物内容自动关联。</p>

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
        <label className="grid gap-2 text-sm text-slate-300">
          <span>天梯分数</span>
          <input name="ladderScore" type="number" min="0" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="6500" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>游戏年数</span>
          <input name="gameYears" type="number" min="0" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="8" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>擅长位置</span>
          <textarea name="preferredRolesText" rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="1 号位, 2 号位, 游走" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>擅长英雄</span>
          <textarea name="heroPoolText" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="Juggernaut, Slark, Phantom Assassin" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>打法风格</span>
          <textarea name="playStylesText" rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="埋头猛冲的战斗狂人, 节奏指挥, 后期收割手" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>高光比赛 ID</span>
          <textarea name="highlightMatchIdsText" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup-s11-final" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>简介</span>
          <textarea name="bio" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>我的游戏理解</span>
          <textarea name="gameUnderstanding" rows={5} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="我更擅长在中期判断地图重心，优先帮队伍拿视野、控肉山和滚节奏。" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>仍在活跃名单中</span>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "创建中..." : "新增选手"}
      </button>
    </form>
  );
}
