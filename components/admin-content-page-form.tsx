"use client";

import { useActionState } from "react";
import { createContentPageAction } from "@/app/admin/content-pages/actions";
import { initialContentPageFormState } from "@/app/admin/content-pages/form-state";

const pageTypes = ["poster", "champion", "news", "recap", "custom"] as const;

export function AdminContentPageForm({
  matches
}: {
  matches: Array<{ id: string; title: string }>;
}) {
  const [state, formAction, pending] = useActionState(createContentPageAction, initialContentPageFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Content</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增内容页</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">可用来维护海报页、冠军页、快报页和赛后战报，后续统一从比赛详情页挂出。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>标题</span>
          <input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup-s11-final-poster" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>页面类型</span>
          <select name="pageType" defaultValue="poster" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {pageTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>发布时间</span>
          <input type="datetime-local" name="publishedAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>关联比赛</span>
          <select name="matchId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不关联比赛</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>摘要</span>
          <textarea name="excerpt" rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>正文</span>
          <textarea name="bodyText" rows={8} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="featured" className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>标记为推荐内容</span>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "创建中..." : "新增内容页"}
      </button>
    </form>
  );
}
