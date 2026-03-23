"use client";

import { useActionState } from "react";
import { createCommunityTopicAction } from "@/app/admin/topics/actions";
import { initialCommunityTopicFormState } from "@/app/admin/topics/form-state";

export function AdminTopicForm() {
  const [state, formAction, pending] = useActionState(createCommunityTopicAction, initialCommunityTopicFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Topic</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增热门话题</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">创建后会直接进入社区页热区，用来聚合相关比赛、内容和招募。</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>描述</span><textarea name="description" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>活动标签</span><input name="activityNote" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="总决赛周 / 热门 / 长期开放" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="featured" className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为热门话题</span></label>
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>
      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">{pending ? "创建中..." : "新增话题"}</button>
    </form>
  );
}