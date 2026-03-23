import { deleteCommunityEventAction, updateCommunityEventAction } from "@/app/admin/events/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

export function AdminEventRow({ event, topics }: { event: { id: string; title: string; slug: string; topicId: string; topicTitle: string; summary: string | null; bodyText: string; startsAt: string; endsAt: string; location: string | null; status: string; ctaLabel: string | null; ctaHref: string | null; featured: boolean; }; topics: Array<{ id: string; title: string }>; }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">活动</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{event.title}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{event.topicTitle} · {event.status}</p>
        </div>
        <form action={deleteCommunityEventAction}>
          <input type="hidden" name="id" value={event.id} />
          <AdminFormSubmit idleLabel="删除活动" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateCommunityEventAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={event.id} />
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" defaultValue={event.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" defaultValue={event.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>关联话题</span><select name="topicId" defaultValue={event.topicId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"><option value="">暂不关联话题</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>活动状态</span><input name="status" defaultValue={event.status} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>摘要</span><textarea name="summary" defaultValue={event.summary ?? ""} rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>正文</span><textarea name="bodyText" defaultValue={event.bodyText} rows={5} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>开始时间</span><input type="datetime-local" name="startsAt" defaultValue={event.startsAt} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>结束时间</span><input type="datetime-local" name="endsAt" defaultValue={event.endsAt} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>活动地点</span><input name="location" defaultValue={event.location ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>按钮文案</span><input name="ctaLabel" defaultValue={event.ctaLabel ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>按钮链接</span><input name="ctaHref" defaultValue={event.ctaHref ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2"><input type="checkbox" name="featured" defaultChecked={event.featured} className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为重点活动</span></label>
        <div className="md:col-span-2 flex justify-end"><AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." /></div>
      </form>
    </article>
  );
}