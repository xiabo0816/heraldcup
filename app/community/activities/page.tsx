import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Shell } from "@/components/shell";
import { getAnnouncements, getCommunityEvents, getCommunityTopics, getContentPages, getRecruitmentPosts } from "@/lib/queries";

const activityGroups = [
  {
    title: "投稿内容",
    description: "适合海报、快报、赛后复盘、选手观察和社区纪念内容。"
  },
  {
    title: "招募组队",
    description: "适合找队、补位、固定车队和下一届赛事的临时组队信息。"
  },
  {
    title: "社区活动",
    description: "适合赛季竞猜、冠军投票、海报征集和社区专题企划。"
  }
] as const;

export default async function CommunityActivitiesPage() {
  const [announcements, events, topics, contentPages, recruitments] = await Promise.all([
    getAnnouncements(),
    getCommunityEvents(),
    getCommunityTopics(),
    getContentPages(),
    getRecruitmentPosts()
  ]);
  const featuredAnnouncement = announcements[0] ?? null;
  const featuredEvents = events.slice(0, 3);
  const hotTopics = topics.slice(0, 3);
  const activeRecruitments = recruitments.slice(0, 3);
  const recentStories = contentPages.slice(0, 3);
  const activeEventCount = events.filter((event) => event.status !== "ARCHIVED" && event.status !== "ENDED").length;

  return (
    <Shell>
      <PageHero
        eyebrow="Activities"
        badge="活动、投稿、观赛企划"
        title="投稿、活动和观赛企划都在这里集合。"
        description="无论你想参加社区活动、关注观赛夜，还是看看近期有哪些专题内容，这一页都会把当周最值得参与的安排整理给你。活动页负责把公告、活动、招募和内容一起组织成一个可参与的入口。"
        actions={[
          { href: featuredAnnouncement ? `/community/announcements/${featuredAnnouncement.slug}` : "/community/announcements", label: "查看活动公告", variant: "solid" },
          { href: "/community", label: "回到社区首页", variant: "outline" }
        ]}
        stats={[
          { label: "活动总数", value: events.length, description: "当前站内可浏览的社区活动与企划总量。" },
          { label: "活跃活动", value: activeEventCount, description: "当前仍在推进或可参与的活动数量。" },
          { label: "活动主线", value: hotTopics.length, description: "当前活动相关的重点话题数量。" }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={[
          <article key="activity-announcement" className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">本周提醒</div>
            <div className="mt-3 text-xl font-semibold text-white">{featuredAnnouncement?.title ?? "本周活动与赛程提醒会集中发布在这里"}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{featuredAnnouncement?.excerpt ?? "想知道本周活动节奏、参与方式和赛程变更，先看这条提醒就够了。"}</p>
          </article>,
          <div key="activity-guide" className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">推荐逛法</div>
            <p className="mt-3 text-sm leading-7 text-slate-400">先看活动公告，再看活动日历和相关招募，最后顺着专题内容继续追当周热度。</p>
          </div>
        ]}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-3">
          {activityGroups.map((group) => (
            <article key={group.title} className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
              <div className="text-xl font-semibold text-white">{group.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">{group.description}</p>
            </article>
          ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-100">本周提醒</div>
            <div className="mt-3 text-2xl font-semibold text-white">{featuredAnnouncement?.title ?? "本周活动与赛程提醒会集中发布在这里"}</div>
            <p className="mt-3 text-sm leading-7 text-cyan-50/80">{featuredAnnouncement?.excerpt ?? "想知道本周活动节奏、参与方式和赛程变更，先看这条提醒就够了。"}</p>
            <div className="mt-5">
              <Link href={featuredAnnouncement ? `/community/announcements/${featuredAnnouncement.slug}` : "/community/announcements"} className="rounded-full border border-cyan-100/30 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/50 hover:text-white">
                查看活动公告
              </Link>
            </div>
          </article>

          <article className="rounded-[24px] border border-rose-300/20 bg-rose-300/10 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-rose-100">活动主线</div>
            <div className="mt-4 space-y-3">
              {hotTopics.length ? hotTopics.map((topic) => (
                <Link key={topic.id} href={`/community/topics/${topic.slug}`} className="block rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 transition hover:border-rose-200/40">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">#{topic.title}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-rose-100">{topic.activityNote ?? "话题"}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">{topic.matchCount} 场比赛 · {topic.contentCount} 条内容 · {topic.recruitmentCount} 条招募</div>
                </Link>
              )) : <div className="text-sm leading-7 text-slate-300">本周热门话题稍后更新。</div>}
            </div>
          </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-amber-100">参与方式</div>
            <p className="mt-3 text-sm leading-7 text-amber-50/80">当前活动会通过内容页、社区页和专题内容持续更新，想参与的话，先沿着本页给出的活动线索继续看下去。</p>
          </article>
          <article className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-100">推荐逛法</div>
            <p className="mt-3 text-sm leading-7 text-cyan-50/80">先看活动公告，再看活动日历和相关招募，最后顺着专题内容继续追当周热度。</p>
          </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <article className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5 xl:col-span-2">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-100">活动日历</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {featuredEvents.length ? featuredEvents.map((event) => (
                <Link key={event.id} href={`/community/activities/${event.slug}`} className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-emerald-300/35">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{event.title}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{event.status}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{event.topicTitle ? `#${event.topicTitle}` : event.summary ?? "点开查看完整活动安排。"}</div>
                </Link>
              )) : <div className="text-sm leading-7 text-slate-400 md:col-span-3">近期活动安排稍后更新。</div>}
            </div>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-amber-100">正在招募中</div>
            <div className="mt-4 space-y-3">
              {activeRecruitments.length ? activeRecruitments.map((post) => (
                <Link key={post.id} href={`/community/recruitments/${post.slug}`} className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-amber-300/35">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{post.title}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{post.status}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{post.teamName}{post.topicTitle ? ` · #${post.topicTitle}` : ""}</div>
                </Link>
              )) : <div className="text-sm leading-7 text-slate-400">当前没有活跃招募，可以先看看专题内容和社区公告。</div>}
            </div>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-100">可参与内容</div>
            <div className="mt-4 space-y-3">
              {recentStories.length ? recentStories.map((story) => (
                <Link key={story.id} href={`/content/${story.slug}`} className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-cyan-300/35">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{story.title}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{story.pageType}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{story.topicTitle ? `所属话题 #${story.topicTitle}` : story.excerpt ?? "点开继续看完整内容。"}</div>
                </Link>
              )) : <div className="text-sm leading-7 text-slate-400">近期专题内容稍后更新。</div>}
            </div>
          </article>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/community" className="rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            回到社区首页
          </Link>
          <Link href="/content" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
            去看资讯流
          </Link>
        </div>
    </Shell>
  );
}