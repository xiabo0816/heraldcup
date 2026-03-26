import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Shell } from "@/components/shell";
import { getCommunityTopics } from "@/lib/queries";

export default async function CommunityTopicsPage() {
  const topics = await getCommunityTopics();
  const totalConnections = topics.reduce((total, topic) => total + topic.matchCount + topic.contentCount + topic.recruitmentCount, 0);
  const featuredTopics = topics.filter((topic) => topic.featured).slice(0, 4);
  const hotspotTopics = [...topics].sort((left, right) => (right.matchCount + right.contentCount + right.recruitmentCount) - (left.matchCount + left.contentCount + left.recruitmentCount)).slice(0, 3);

  return (
    <Shell>
      <PageHero
        eyebrow="Topics"
        badge="社区主线聚合页"
        title="社区热门话题"
        description="热门话题负责把讨论重心公开出来，让用户一进社区就知道今天该看什么、聊什么、跟什么。这里会明确展示每条主线已经承接了多少比赛、内容和招募。"
        actions={[
          { href: "/community", label: "回到社区首页", variant: "solid" },
          { href: "/content", label: "先看内容流", variant: "outline" }
        ]}
        stats={[
          { label: "主线数量", value: topics.length, description: "当前已经建立并可直接浏览的社区主线。" },
          { label: "总连接数", value: totalConnections, description: "比赛、内容和招募被主线接住的总次数。" },
          { label: "重点主线", value: featuredTopics.length, description: "后台显式标记为 featured 的主线数量。" }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={[
          <div key="topic-hotspots" className="rounded-[28px] border border-rose-300/20 bg-rose-300/10 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-rose-100">最热主线</div>
            <div className="mt-4 space-y-3">
              {hotspotTopics.map((topic) => (
                <Link key={topic.id} href={`/community/topics/${topic.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 transition hover:border-rose-300/35">
                  <span className="text-sm font-semibold text-white">#{topic.title}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-rose-100">{topic.matchCount + topic.contentCount + topic.recruitmentCount} 条</span>
                </Link>
              ))}
            </div>
          </div>,
          <div key="topic-guide" className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">逛法建议</div>
            <p className="mt-3 text-sm leading-7 text-slate-400">先找一条主线，再顺着它进入关联比赛、内容和招募，这样最接近产品文档要求的社区浏览路径。</p>
          </div>
        ]}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <Link key={topic.id} href={`/community/topics/${topic.slug}`} className="brand-shell p-6 transition hover:border-rose-300/30 hover:bg-white/8">
            <div className="text-xs uppercase tracking-[0.22em] text-rose-200">{topic.activityNote ?? (topic.featured ? "热门话题" : "社区话题")}</div>
            <div className="mt-2 text-2xl font-semibold text-white">#{topic.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-400">{topic.description ?? "点开这个话题，继续追它在社区里的全部延展。"}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">{topic.matchCount} 场比赛</span>
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">{topic.contentCount} 条内容</span>
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">{topic.recruitmentCount} 条招募</span>
            </div>
          </Link>
        ))}
      </section>
    </Shell>
  );
}