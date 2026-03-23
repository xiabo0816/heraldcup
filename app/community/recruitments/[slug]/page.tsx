import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { getRecruitmentPostBySlug } from "@/lib/queries";

export default async function CommunityRecruitmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getRecruitmentPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-100">{post.status}</div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">{post.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">{post.excerpt ?? "这是一条面向社区成员的招募信息，继续往下看就能了解位置需求和联系方式。"}</p>
        <div className="mt-6 text-sm text-slate-400">队伍：{post.teamName}</div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <article className="brand-shell p-6">
          <div className="section-kicker">招募需求</div>
          <h2 className="section-heading">这支队伍现在在找什么位置</h2>
          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            {post.neededRoles.map((role) => (
              <span key={post.id + role} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">{role}</span>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            联系方式：{post.contact ?? "可先通过站内渠道联系"}
          </div>
          {post.topic ? (
            <Link href={`/community/topics/${post.topic.slug}`} className="mt-4 block rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5 transition hover:border-cyan-300/40">
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-100">所属话题</div>
              <div className="mt-2 text-xl font-semibold text-white">#{post.topic.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.topic.description ?? "回到这个话题，还能继续追比赛、内容和其他招募动态。"}</p>
            </Link>
          ) : null}
        </article>

        <article className="brand-shell p-6">
          <div className="section-kicker">关系网</div>
          <h2 className="section-heading">从这条招募继续进入相关比赛和内容</h2>
          <div className="mt-6 space-y-4">
            {post.relatedMatches.length ? post.relatedMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.slug}`} className="brand-card block p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{match.status}</div>
                <div className="mt-2 text-xl font-semibold text-white">{match.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{match.homeTeamName} vs {match.awayTeamName}</p>
              </Link>
            )) : null}
            {post.relatedContentPages.length ? post.relatedContentPages.map((page) => (
              <Link key={page.id} href={`/content/${page.slug}`} className="brand-card block p-5 transition hover:border-rose-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{page.pageType}</div>
                <div className="mt-2 text-xl font-semibold text-white">{page.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{page.excerpt ?? "点开继续看这条招募关联的内容主线。"}</p>
              </Link>
            )) : null}
            {post.siblingRecruitments.length ? post.siblingRecruitments.map((item) => (
              <Link key={item.id} href={`/community/recruitments/${item.slug}`} className="brand-card block p-5 transition hover:border-amber-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">同话题招募</div>
                <div className="mt-2 text-xl font-semibold text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.excerpt ?? item.teamName}</p>
              </Link>
            )) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/community/recruitments" className="brand-card p-5 transition hover:border-amber-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">招募列表</div>
                <div className="mt-2 text-xl font-semibold text-white">返回全部招募帖</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">继续看看其他队伍现在在招什么位置。</p>
              </Link>
              <Link href="/community" className="brand-card p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">社区首页</div>
                <div className="mt-2 text-xl font-semibold text-white">回到社区热区</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">回到社区继续看公告、话题、战报和荣誉榜。</p>
              </Link>
            </div>
          </div>
        </article>
      </section>
    </Shell>
  );
}