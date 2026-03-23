"use client";

import { useActionState } from "react";
import { createAnnouncementAction } from "@/app/admin/announcements/actions";
import { initialAnnouncementFormState } from "@/app/admin/announcements/form-state";

export function AdminAnnouncementForm() {
  const [state, formAction, pending] = useActionState(createAnnouncementAction, initialAnnouncementFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Announcement</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增公告</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">发布后会优先展示在社区首页，用于承接赛程提醒和重要通知。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>摘要</span><textarea name="excerpt" rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>正文</span><textarea name="bodyText" rows={6} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>发布时间</span><input type="datetime-local" name="publishedAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="featured" className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为重点公告</span></label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>
      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">{pending ? "创建中..." : "新增公告"}</button>
    </form>
  );
}