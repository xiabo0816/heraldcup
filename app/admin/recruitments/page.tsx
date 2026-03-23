import Link from "next/link";
import { Shell } from "@/components/shell";
import { AdminRecruitmentForm } from "@/components/admin-recruitment-form";
import { AdminRecruitmentRow } from "@/components/admin-recruitment-row";
import { getAdminRecruitmentPostsData } from "@/lib/admin-queries";

export default async function AdminRecruitmentsPage() {
  const data = await getAdminRecruitmentPostsData();

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminRecruitmentForm topics={data.topics} />

        <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
              <h1 className="mt-2 text-3xl font-semibold text-white">招募帖管理</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">在这里维护社区页展示的招募信息、补位需求和联系方式。</p>
            </div>
            <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">返回后台首页</Link>
          </div>

          <div className="mt-6 space-y-4">
            {data.posts.map((post) => (
              <AdminRecruitmentRow key={post.id} post={post} topics={data.topics} />
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}