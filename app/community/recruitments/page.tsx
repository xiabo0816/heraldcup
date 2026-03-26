import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Shell } from "@/components/shell";
import { getRecruitmentPosts } from "@/lib/queries";

export default async function CommunityRecruitmentsPage() {
  const posts = await getRecruitmentPosts();
  const activePosts = posts.filter((post) => post.status !== "CLOSED" && post.status !== "ARCHIVED");
  const totalRoleNeeds = posts.reduce((total, post) => total + post.neededRoles.length, 0);
  const topicLinkedCount = posts.filter((post) => post.topicSlug).length;

  return (
    <Shell>
      <PageHero
        eyebrow="Recruitments"
        badge="找队、补位、约训练"
        title="招募组队与补位信息"
        description="想找队、补位、约训练或临时组车，都可以先来这里看看。招募页现在会明确告诉用户还有多少活跃招募、多少位置需求，以及多少帖子已经挂到社区主线里。"
        actions={[
          { href: "/community/topics", label: "先看主线", variant: "solid" },
          { href: "/community/activities", label: "活动与投稿", variant: "outline" }
        ]}
        stats={[
          { label: "招募总数", value: posts.length, description: "当前已录入的招募帖子总量。" },
          { label: "活跃招募", value: activePosts.length, description: "仍可继续联系和参与的招募帖子。" },
          { label: "位置需求", value: totalRoleNeeds, description: "当前公开列出的所有补位需求数量。" }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={[
          <div key="recruitment-topic-link" className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">主线承接</div>
            <div className="mt-3 text-3xl font-semibold text-white">{topicLinkedCount}</div>
            <p className="mt-2 text-sm leading-7 text-slate-300">条招募已经挂到具体社区主线下，用户点进前就能感知这不是孤立帖子。</p>
          </div>,
          <div key="recruitment-guide" className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">使用建议</div>
            <p className="mt-3 text-sm leading-7 text-slate-400">先筛状态，再看需求位置和所属话题；如果帖子挂了话题，优先顺着那条主线看相关比赛和内容。</p>
          </div>
        ]}
      />

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