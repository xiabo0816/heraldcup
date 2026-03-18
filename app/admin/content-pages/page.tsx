import { Shell } from "@/components/shell";
import { AdminContentPageForm } from "@/components/admin-content-page-form";
import { AdminContentPageRow } from "@/components/admin-content-page-row";
import { getAdminContentPagesData } from "@/lib/admin-queries";

export default async function AdminContentPagesPage() {
  const data = await getAdminContentPagesData();

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminContentPageForm matches={data.matches} />

        <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">内容页管理</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              这里统一维护海报页、冠军页、新闻快报和赛后战报，并将其挂载到具体比赛下。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {data.pages.map((page) => (
              <AdminContentPageRow key={page.id} page={page} matches={data.matches} />
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
