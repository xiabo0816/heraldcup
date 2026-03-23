"use client";

import { useActionState } from "react";
import { createCommunityEventAction } from "@/app/admin/events/actions";
import { initialCommunityEventFormState } from "@/app/admin/events/form-state";

export function AdminEventForm({ topics }: { topics: Array<{ id: string; title: string }> }) {
  const [state, formAction, pending] = useActionState(createCommunityEventAction, initialCommunityEventFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Event</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增社区活动</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">发布后会同步出现在活动页和搜索结果中，方便用户找到当周活动安排。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>关联话题</span><select name="topicId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"><option value="">暂不关联话题</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>活动状态</span><input name="status" defaultValue="UPCOMING" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>摘要</span><textarea name="summary" rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>正文</span><textarea name="bodyText" rows={5} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>开始时间</span><input type="datetime-local" name="startsAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>结束时间</span><input type="datetime-local" name="endsAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>活动地点</span><input name="location" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>按钮文案</span><input name="ctaLabel" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>按钮链接</span><input name="ctaHref" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2"><input type="checkbox" name="featured" className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为重点活动</span></label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>
      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">{pending ? "创建中..." : "新增活动"}</button>
    </form>
  );
}