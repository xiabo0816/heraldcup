import Link from "next/link";
import { Shell } from "@/components/shell";
import { getRecruitmentPosts } from "@/lib/queries";

export default async function CommunityRecruitmentsPage() {
  const posts = await getRecruitmentPosts();

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="text-xs uppercase tracking-[0.3em] text-amber-200">Recruitments</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">招募组队与补位信息</h1>
        <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">想找队、补位、约训练或临时组车，都可以先来这里看看。社区不只负责观看，也欢迎真正想上场的人加入进来。</p>
      </section>

      <section className="mt-6 grid gap-4">
        {posts.length ? posts.map((post) => (
          <Link key={post.id} href={`/community/recruitments/${post.slug}`} className="brand-shell p-6 transition hover:border-amber-300/30 hover:bg-white/8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <span>{post.teamName}</span>
                  {post.topicSlug ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-cyan-100">#{post.topicTitle}</span> : null}
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">{post.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{post.excerpt ?? "点开这条招募，继续看队伍需求和联系方式。"}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {post.neededRoles.map((role) => (
                    <span key={post.id + role} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">{role}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-200">{post.status}</div>
            </div>
          </Link>
        )) : (
          <div className="brand-shell border-dashed p-6 text-sm leading-7 text-slate-400">当前还没有新的招募信息，稍后再来看看有没有适合的位置。</div>
        )}
      </section>
    </Shell>
  );
}