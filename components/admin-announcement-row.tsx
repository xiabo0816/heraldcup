import { deleteAnnouncementAction, updateAnnouncementAction } from "@/app/admin/announcements/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

export function AdminAnnouncementRow({ announcement }: { announcement: { id: string; title: string; slug: string; excerpt: string | null; bodyText: string; publishedAt: string; featured: boolean; }; }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">公告</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{announcement.title}</h2>
        </div>
        <form action={deleteAnnouncementAction}>
          <input type="hidden" name="id" value={announcement.id} />
          <AdminFormSubmit idleLabel="删除公告" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateAnnouncementAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={announcement.id} />
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" defaultValue={announcement.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" defaultValue={announcement.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>摘要</span><textarea name="excerpt" defaultValue={announcement.excerpt ?? ""} rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>正文</span><textarea name="bodyText" defaultValue={announcement.bodyText} rows={6} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>发布时间</span><input type="datetime-local" name="publishedAt" defaultValue={announcement.publishedAt} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="featured" defaultChecked={announcement.featured} className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为重点公告</span></label>
        <div className="md:col-span-2 flex justify-end"><AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." /></div>
      </form>
    </article>
  );
}