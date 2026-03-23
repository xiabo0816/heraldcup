"use client";

import { useActionState } from "react";
import { createRecruitmentPostAction } from "@/app/admin/recruitments/actions";
import { initialRecruitmentPostFormState } from "@/app/admin/recruitments/form-state";

export function AdminRecruitmentForm({ topics }: { topics: Array<{ id: string; title: string }> }) {
  const [state, formAction, pending] = useActionState(createRecruitmentPostAction, initialRecruitmentPostFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Recruitment</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增招募帖</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">发布后会直接出现在社区招募区，方便用户快速看到补位和组队需求。</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>队伍名称</span><input name="teamName" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>关联话题</span><select name="topicId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"><option value="">暂不关联话题</option>{topics.map((topic) => (<option key={topic.id} value={topic.id}>{topic.title}</option>))}</select></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>联系方式</span><input name="contact" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>状态</span><input name="status" defaultValue="OPEN" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>招募位置</span><textarea name="neededRolesText" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="Support, Mid, Offlane" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>摘要</span><textarea name="excerpt" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2"><input type="checkbox" name="featured" className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为重点招募</span></label>
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>
      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">{pending ? "创建中..." : "新增招募帖"}</button>
    </form>
  );
}