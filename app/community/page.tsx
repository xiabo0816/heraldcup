import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Shell } from "@/components/shell";
import { getAnnouncements, getCommunityTopics, getContentPages, getMatches, getPlayers, getRecruitmentPosts, getTeams } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";

const communityDocs = [
  {
    title: "社区规则",
    description: "了解社区讨论氛围、发帖边界和招募信息该怎么写，逛社区前先把规则看清楚。",
    href: "/community/rules"
  },
  {
    title: "浏览指引",
    description: "第一次来站里，可以先看这里，快速知道比赛、资讯和社区分别该去哪一页。",
    href: "/community/guide"
  },
  {
    title: "投稿与活动",
    description: "查看观赛夜、专题活动、投稿内容和招募动态，跟着当周节奏一起参与。",
    href: "/community/activities"
  }
] as const;

export default async function CommunityPage() {
  const [contentPages, matches, teams, players, announcements, topics, recruitments] = await Promise.all([
    getContentPages(),
    getMatches(),
    getTeams(),
    getPlayers(),
    getAnnouncements(),
    getCommunityTopics(),
    getRecruitmentPosts()
  ]);

  const featuredStories = contentPages.slice(0, 4);
  const recentResults = matches.filter((match) => match.status === "FINISHED").slice(0, 4);
  const topTeams = [...teams].sort((left, right) => right.honorScore - left.honorScore).slice(0, 5);
  const spotlightPlayers = [...players]
    .sort((left, right) => right.championshipCount - left.championshipCount || right.heroCards.length - left.heroCards.length)
    .slice(0, 4);
  const featuredAnnouncement = announcements[0] ?? null;
  const featuredTopic = topics[0] ?? null;
  const featuredRecruitments = recruitments.slice(0, 3);
  const totalTopicLinks = topics.reduce((total, topic) => total + topic.matchCount + topic.contentCount + topic.recruitmentCount, 0);
  const boardLinks = [
    {
      title: featuredAnnouncement?.title ?? "置顶公告",
      description: featuredAnnouncement?.excerpt ?? "赛程变更、活动提醒和社区置顶消息都会优先发布在这里。",
      href: featuredAnnouncement ? `/community/announcements/${featuredAnnouncement.slug}` : "/community/announcements"
    },
    {
      title: featuredTopic ? `#${featuredTopic.title}` : "热门话题",
      description: featuredTopic?.description ?? "想跟上今晚最热的讨论主线，可以先从这个话题切进去。",
      href: featuredTopic ? `/community/topics/${featuredTopic.slug}` : "/community/topics"
    },
    {
      title: featuredRecruitments[0]?.title ?? "招募组队",
      description: featuredRecruitments[0]?.excerpt ?? "找队友、补位置、约训练都能在这里直接开聊，不用错过上场机会。",
      href: featuredRecruitments[0] ? `/community/recruitments/${featuredRecruitments[0].slug}` : "/community/recruitments"
    }
  ] as const;

  return (
    <Shell>
      <PageHero
        eyebrow="Community Hub"
        badge="公告、话题、活动、招募"
        title="比赛之外，也要有社区正在发生。"
        description="公告、战报、赛后讨论、招募组队和热门人物都会在这里汇合。社区首页现在不只做信息堆叠，而是把主线、热点和继续浏览的回路明确摆出来。"
        actions={[
          { href: "/community/topics", label: "打开话题主线", variant: "solid" },
          { href: "/community/recruitments", label: "查看招募", variant: "outline" }
        ]}
        stats={[
          { label: "社区公告", value: announcements.length, description: "规则更新、赛程提醒和活动通知都会落在这里。" },
          { label: "活跃话题", value: topics.length, description: "当前已经建立并持续承接内容的社区主线数量。" },
          { label: "主线连接数", value: totalTopicLinks, description: "比赛、内容和招募与话题之间已建立的聚合关系。" }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_22%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={[
          <article key="community-board" className="rounded-[32px] border border-rose-400/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(136,19,55,0.22))] p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-rose-200">今晚热区</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">先看公告和热点，再决定往哪逛。</h2>
            <div className="mt-5 space-y-3">
              {boardLinks.map((item) => (
                <Link key={item.title} href={item.href} className="block rounded-[24px] border border-white/10 bg-slate-950/55 px-4 py-4 transition hover:border-cyan-300/35">
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="mt-2 text-sm text-slate-400">{item.description}</div>
                </Link>
              ))}
            </div>
          </article>,
          <div key="topic-strip" className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">话题主线</div>
            <div className="mt-4 space-y-3">
              {topics.slice(0, 4).map((topic) => (
                <Link key={topic.id} href={`/community/topics/${topic.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 transition hover:border-rose-300/30 hover:text-white">
                  <span className="text-sm font-semibold text-white">#{topic.title}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{topic.matchCount + topic.contentCount + topic.recruitmentCount} 条连接</span>
                </Link>
              ))}
            </div>
          </div>
        ]}
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">最新战报</div>
              <h2 className="section-heading">刚结束的比赛，马上回流到社区</h2>
            </div>
            <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              全部资讯
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {featuredStories.length ? featuredStories.map((story) => (
              <Link key={story.id} href={`/content/${story.slug}`} className="brand-card p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                      <span>{story.pageType}</span>
                      {story.topicSlug ? <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-2 py-1 text-rose-100">#{story.topicTitle}</span> : null}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">{story.title}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{story.excerpt ?? "点开这条内容，继续补完整场比赛的来龙去脉。"}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-200">
                    {story.seasonTitle ?? "社区内容"}
                  </div>
                </div>
              </Link>
            )) : null}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">最近完赛</div>
              <h2 className="section-heading">结果会继续变成讨论和荣誉</h2>
            </div>
            <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
              全部比赛
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentResults.length ? recentResults.map((match) => (
              <Link key={match.slug} href={`/matches/${match.slug}`} className="brand-card block p-5 transition hover:border-amber-300/30 hover:bg-white/8">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-lg font-semibold text-white">{match.title}</div>
                    <div className="mt-2 text-sm text-slate-400">{match.homeTeamName} {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"} {match.awayTeamName}</div>
                    {match.topicSlug ? <div className="mt-3 text-xs uppercase tracking-[0.18em] text-amber-200">话题主线 #{match.topicTitle}</div> : null}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">已完赛</div>
                </div>
              </Link>
            )) : (
              <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">还没有完赛结果可供回流。</div>
            )}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">荣誉榜</div>
              <h2 className="section-heading">谁在社区里最有份量</h2>
            </div>
            <Link href="/teams" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
              战队榜
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {topTeams.map((team, index) => (
              <Link key={team.id} href={teamPath(team.id)} className="brand-card flex items-center justify-between gap-4 p-4 transition hover:border-amber-300/30 hover:bg-white/8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">#{index + 1}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{team.name}</div>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <div>积分 {team.honorScore}</div>
                  <div className="mt-1 text-slate-500">{team.championshipCount} 冠</div>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">焦点人物</div>
              <h2 className="section-heading">社区记忆点还是人</h2>
            </div>
            <Link href="/players" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              选手墙
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {spotlightPlayers.map((player) => (
              <Link key={player.id} href={playerPath(player.id)} className="brand-card p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">{player.primaryRole ?? "社区选手"}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{player.displayName}</div>
                <div className="mt-2 text-sm text-slate-300">冠军 {player.championshipCount} 次</div>
                <div className="mt-1 text-sm text-slate-400">{player.teamName}</div>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">招募组队</div>
              <h2 className="section-heading">想上场的人，可以直接在这里找到队伍</h2>
            </div>
            <Link href="/community/activities" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              活动与投稿
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {featuredRecruitments.length ? featuredRecruitments.map((post) => (
              <Link key={post.id} href={`/community/recruitments/${post.slug}`} className="brand-card block p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                      <span>{post.teamName}</span>
                      {post.topicSlug ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-cyan-100">#{post.topicTitle}</span> : null}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">{post.title}</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-200">{post.status}</div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{post.excerpt ?? "队伍需求和补位方向已经列出来了，点进去就能继续了解详情。"}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {post.neededRoles.map((role) => (
                    <span key={post.id + role} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">{role}</span>
                  ))}
                </div>
                <div className="mt-3 text-sm text-slate-300">联系方式：{post.contact ?? "站内联系"}</div>
              </Link>
            )) : (
              <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">今晚暂时没有新的招募信息，稍后再来看看有没有合适的位置。</div>
            )}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">社区导航</div>
              <h2 className="section-heading">想逛得更明白，可以从这几页继续走</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {communityDocs.map((item) => (
              <Link key={item.href} href={item.href} className="brand-card p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">继续浏览</div>
                <div className="mt-2 text-xl font-semibold text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 brand-shell p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="section-kicker text-rose-200">话题主线</div>
            <h2 className="section-heading">先找主线，再看这条线下面有哪些资源</h2>
          </div>
          <Link href="/community/topics" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-rose-300/40 hover:text-white">
            全部话题
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topics.slice(0, 6).map((topic) => (
            <Link key={topic.id} href={`/community/topics/${topic.slug}`} className="brand-card p-5 transition hover:border-rose-300/30 hover:bg-white/8">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.22em] text-rose-200">话题主线</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{topic.activityNote ?? "话题"}</div>
              </div>
              <div className="mt-3 text-xl font-semibold text-white">#{topic.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">{topic.description ?? "围绕同一条主线的比赛、内容和招募会集中到这里。"}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">比赛 {topic.matchCount}</span>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">内容 {topic.contentCount}</span>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">招募 {topic.recruitmentCount}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}