import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailHero } from "@/components/detail-hero";
import { Shell } from "@/components/shell";
import { getCommunityTopicBySlug } from "@/lib/queries";

export default async function CommunityTopicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getCommunityTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <Shell>
      <DetailHero
        eyebrow="Topic Detail"
        badge={<span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-rose-100">{topic.activityNote ?? "社区话题"}</span>}
        title={`#${topic.title}`}
        description={topic.description ?? "围绕这个话题的比赛、内容和招募都会汇到这里，方便你一口气追完整条线。"}
        actions={[
          { href: "/community/topics", label: "返回话题列表", variant: "solid" },
          { href: "/community", label: "回到社区首页", variant: "outline" }
        ]}
        stats={[
          { label: "关联比赛", value: topic.matches.length },
          { label: "关联内容", value: topic.contentPages.length },
          { label: "关联招募", value: topic.recruitmentPosts.length }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <article className="brand-shell p-6">
          <div className="section-kicker">关联比赛</div>
          <h2 className="section-heading">围绕这个话题，最近有哪些比赛值得追</h2>
          <div className="mt-6 space-y-3">
            {topic.matches.length ? topic.matches.map((match) => (
              <Link key={match.id} href={`/matches/${match.slug}`} className="brand-card block p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{match.status}</div>
                <div className="mt-2 text-xl font-semibold text-white">{match.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{match.homeTeamName} vs {match.awayTeamName}</p>
              </Link>
            )) : <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">这个话题下暂时还没有关联比赛。</div>}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="section-kicker">相关资讯</div>
          <h2 className="section-heading">顺着这个话题，还能继续看哪些内容</h2>
          <div className="mt-6 space-y-3">
            {topic.contentPages.length ? topic.contentPages.map((page) => (
              <Link key={page.id} href={`/content/${page.slug}`} className="brand-card block p-5 transition hover:border-rose-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{page.pageType}</div>
                <div className="mt-2 text-xl font-semibold text-white">{page.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{page.excerpt ?? "点开继续看这条话题线上的相关内容。"}</p>
              </Link>
            )) : <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">这个话题下暂时还没有关联内容。</div>}
          </div>
        </article>

        <article className="brand-shell p-6 xl:col-span-2">
          <div className="section-kicker">相关招募</div>
          <h2 className="section-heading">想参与的人，也能从这里直接进场</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {topic.recruitmentPosts.length ? topic.recruitmentPosts.map((post) => (
              <Link key={post.id} href={`/community/recruitments/${post.slug}`} className="brand-card block p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{post.teamName}</div>
                <div className="mt-2 text-xl font-semibold text-white">{post.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{post.excerpt ?? "点开这条招募，看看有没有适合你的上场机会。"}</p>
              </Link>
            )) : <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">这个话题下暂时还没有关联招募信息。</div>}
          </div>
        </article>
      </section>
    </Shell>
  );
}