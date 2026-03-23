import { deleteRecruitmentPostAction, updateRecruitmentPostAction } from "@/app/admin/recruitments/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

export function AdminRecruitmentRow({ post, topics }: { post: { id: string; title: string; slug: string; teamName: string; contact: string | null; neededRoles: string[]; status: string; excerpt: string | null; featured: boolean; topicId: string; topicTitle: string; }; topics: Array<{ id: string; title: string }>; }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">招募帖</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{post.title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">{post.teamName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{post.topicTitle}</p>
        </div>
        <form action={deleteRecruitmentPostAction}>
          <input type="hidden" name="id" value={post.id} />
          <AdminFormSubmit idleLabel="删除招募帖" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateRecruitmentPostAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={post.id} />
        <label className="grid gap-2 text-sm text-slate-300"><span>标题</span><input name="title" defaultValue={post.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>slug</span><input name="slug" defaultValue={post.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>队伍名称</span><input name="teamName" defaultValue={post.teamName} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>关联话题</span><select name="topicId" defaultValue={post.topicId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"><option value="">暂不关联话题</option>{topics.map((topic) => (<option key={topic.id} value={topic.id}>{topic.title}</option>))}</select></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>联系方式</span><input name="contact" defaultValue={post.contact ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>状态</span><input name="status" defaultValue={post.status} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300"><span>招募位置</span><textarea name="neededRolesText" defaultValue={post.neededRoles.join(", ")} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2"><span>摘要</span><textarea name="excerpt" defaultValue={post.excerpt ?? ""} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" /></label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2"><input type="checkbox" name="featured" defaultChecked={post.featured} className="h-4 w-4 rounded border-white/10 bg-ink" /><span>标记为重点招募</span></label>
        <div className="md:col-span-2 flex justify-end"><AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." /></div>
      </form>
    </article>
  );
}