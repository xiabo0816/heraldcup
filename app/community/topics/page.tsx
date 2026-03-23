import Link from "next/link";
import { Shell } from "@/components/shell";
import { getCommunityTopics } from "@/lib/queries";

export default async function CommunityTopicsPage() {
  const topics = await getCommunityTopics();

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="text-xs uppercase tracking-[0.3em] text-rose-200">Topics</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">社区热门话题</h1>
        <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">热门话题负责把讨论重心公开出来，让用户一进社区就知道今天该看什么、聊什么、跟什么。</p>
      </section>

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