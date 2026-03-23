import { deleteCommunityTopicAction, updateCommunityTopicAction } from "@/app/admin/topics/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

export function AdminTopicRow({ topic }: { topic: { id: string; title: string; slug: string; description: string | null; activityNote: string | null; featured: boolean; }; }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">话题</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{topic.title}</h2>
        </div>
        <form action={deleteCommunityTopicAction}>
          <input type="hidden" name="id" value={topic.id} />
          <AdminFormSubmit idleLabel="删除话题" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateCommunityTopicAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={topic.id} />
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" defaultValue={topic.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" defaultValue={topic.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>描述</span><textarea name="description" defaultValue={topic.description ?? ""} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>活动标签</span><input name="activityNote" defaultValue={topic.activityNote ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="featured" defaultChecked={topic.featured} className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为热门话题</span></label>
        <div className="md:col-span-2 flex justify-end"><AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." /></div>
      </form>
    </article>
  );
}