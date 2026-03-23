import { deleteContentPageAction, updateContentPageAction } from "@/app/admin/content-pages/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

const pageTypes = ["poster", "champion", "news", "recap", "custom"] as const;

export function AdminContentPageRow({
  page,
  matches,
  topics
}: {
  page: {
    id: string;
    title: string;
    slug: string;
    pageType: string;
    excerpt: string | null;
    bodyText: string;
    publishedAt: string;
    featured: boolean;
    matchId: string;
    matchTitle: string;
    topicId: string;
    topicTitle: string;
  };
  matches: Array<{ id: string; title: string }>;
  topics: Array<{ id: string; title: string }>;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">{page.pageType}</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{page.title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">{page.matchTitle}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{page.topicTitle}</p>
        </div>
        <form action={deleteContentPageAction}>
          <input type="hidden" name="id" value={page.id} />
          <AdminFormSubmit idleLabel="删除内容页" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateContentPageAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={page.id} />
        <label className="grid gap-2 text-sm text-slate-300">
          <span>标题</span>
          <input name="title" defaultValue={page.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" defaultValue={page.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>页面类型</span>
          <select name="pageType" defaultValue={page.pageType} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {pageTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>发布时间</span>
          <input type="datetime-local" name="publishedAt" defaultValue={page.publishedAt} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>关联比赛</span>
          <select name="matchId" defaultValue={page.matchId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不关联比赛</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>关联话题</span>
          <select name="topicId" defaultValue={page.topicId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不关联话题</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>摘要</span>
          <textarea name="excerpt" defaultValue={page.excerpt ?? ""} rows={2} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>正文</span>
          <textarea name="bodyText" defaultValue={page.bodyText} rows={8} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" name="featured" defaultChecked={page.featured} className="h-4 w-4 rounded border-white/10 bg-ink" />
          <span>标记为推荐内容</span>
        </label>
        <div className="md:col-span-2 flex justify-end">
          <AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." />
        </div>
      </form>
    </article>
  );
}
