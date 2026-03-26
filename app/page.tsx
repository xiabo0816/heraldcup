import Link from "next/link";
import { HeroChip } from "@/components/hero-chip";
import { HomeIdentitySpotlight } from "@/components/home-identity-spotlight";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/team-mark";
import { getCurrentIdentitySnapshot } from "@/lib/identity";
import {
  getAnnouncements,
  getCommunityTopics,
  getContentPages,
  getMatchSeasonGraphs,
  getMatches,
  getPlayers,
  getRecruitmentPosts,
  getTeams
} from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";
import { getTournamentTheme } from "@/lib/tournament-theme";

function formatDateLabel(value: Date | string | null) {
  if (!value) {
    return "时间待定";
  }

  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatParticipantLabel(match: {
  participantTeamNames?: string[];
  homeTeamName?: string | null;
  awayTeamName?: string | null;
}) {
  const names = match.participantTeamNames?.filter(Boolean) ?? [];
  if (names.length >= 3) {
    return names.join(" / ");
  }

  if (names.length === 2) {
    return `${names[0]} vs ${names[1]}`;
  }

  return [match.homeTeamName, match.awayTeamName].filter(Boolean).join(" vs ") || "对阵待定";
}

export default async function HomePage() {
  const [matches, teams, players, seasonGraphs, contentPages, announcements, topics, recruitmentPosts, identity] = await Promise.all([
    getMatches(),
    getTeams(),
    getPlayers(),
    getMatchSeasonGraphs(),
    getContentPages(),
    getAnnouncements(),
    getCommunityTopics(),
    getRecruitmentPosts(),
    getCurrentIdentitySnapshot()
  ]);

  const featuredSeason = seasonGraphs.find((season) => season.featured) ?? seasonGraphs[0] ?? null;
  const featuredSeasonMatches = featuredSeason?.stages.flatMap((stage) => stage.matches).slice(0, 3) ?? [];
  const featuredNewsSource = contentPages.filter((page) => page.featured);
  const featuredPlayersSource = players.filter((player) => player.featured);
  const featuredNews = (featuredNewsSource.length ? featuredNewsSource : contentPages).slice(0, 3);
  const featuredPlayers = (featuredPlayersSource.length
    ? featuredPlayersSource
    : [...players].sort((left, right) => right.championshipCount - left.championshipCount || right.heroCards.length - left.heroCards.length)
  ).slice(0, 4);
  const topTeams = [...teams]
    .sort((left, right) => right.honorScore - left.honorScore || right.championshipCount - left.championshipCount)
    .slice(0, 5);
  const upcomingMatches = [...matches]
    .filter((match) => match.status !== "FINISHED" && match.status !== "CANCELLED")
    .sort((left, right) => {
      const leftValue = left.scheduledAt ? new Date(left.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
      const rightValue = right.scheduledAt ? new Date(right.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
      return leftValue - rightValue;
    })
    .slice(0, 3);
  const featuredAnnouncement = announcements[0] ?? null;
  const featuredTopic = topics[0] ?? null;
  const featuredRecruitment = recruitmentPosts[0] ?? null;
  const featuredSeasonMatchCount = featuredSeason?.stages.reduce((total, stage) => total + stage.matches.length, 0) ?? 0;
  const featuredTheme = getTournamentTheme(featuredSeason?.tournamentKind, featuredSeason?.tournamentName ?? featuredSeason?.title);
  const recentResults = [...matches].filter((match) => match.status === "FINISHED" || match.status === "ARCHIVED").slice(0, 3);
  const tournamentKinds = Array.from(new Set(seasonGraphs.map((season) => getTournamentTheme(season.tournamentKind, season.tournamentName ?? season.title).label)));

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[7fr_3fr] xl:items-start">
        <div className="space-y-6 xl:order-1">
          <article className="page-hero bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))]">
            <div className="hero-grid">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em] ${featuredTheme.badgeClass}`}>
                    Dota2 社区赛事平台
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">深色竞技底盘 + 社区荣誉氛围 + 内容化赛事门户</span>
                </div>

                <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  今晚就来
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-9 text-slate-300 md:text-lg">
                  从先锋到冠绝，每个人都能在这里找到自己的比赛、战队、人物和赛后故事。首页先给赛事主舞台，再把你的身份、OpenDota 和社区回流压进同一张桌面。
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/matches" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                    查看当前赛季
                  </Link>
                  <Link href="/community" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white">
                    进入社区主线
                  </Link>
                  <Link href="/my" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
                    我的身份
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 text-sm text-slate-200">
                  {tournamentKinds.map((kind) => (
                    <span key={kind} className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2">
                      {kind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                <article className="rounded-[28px] border border-white/12 bg-slate-950/60 p-5">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">首页主推赛季</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{featuredSeason?.title ?? "待设置"}</div>
                  <div className="mt-2 text-sm text-slate-300">{featuredSeason?.tournamentName ?? "未关联赛事"}</div>
                  <div className={`mt-3 text-sm font-semibold ${featuredTheme.accentText}`}>{featuredSeason?.statusLabel ?? "状态待设置"}</div>
                </article>

                <article className="rounded-[28px] border border-white/12 bg-slate-950/60 p-5 md:col-span-2 xl:col-span-1">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">今晚最值得继续看的三条线</div>
                  <div className="mt-4 space-y-3">
                    <Link href="/matches" className="block rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.06]">
                      <div className="text-sm font-semibold text-white">赛季图谱</div>
                      <div className="mt-1 text-sm text-slate-400">从赛事体系和届次开始进入，不先把你丢进单场比赛。</div>
                    </Link>
                    <Link href="/content" className="block rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.06]">
                      <div className="text-sm font-semibold text-white">战报回流</div>
                      <div className="mt-1 text-sm text-slate-400">看完比分之后，继续看人物、冠军和复盘内容。</div>
                    </Link>
                    <Link href="/community" className="block rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.06]">
                      <div className="text-sm font-semibold text-white">社区主线</div>
                      <div className="mt-1 text-sm text-slate-400">公告、话题、招募和活动会把今晚的人留在站里继续逛。</div>
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          </article>

          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="brand-shell overflow-hidden p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="section-kicker text-emerald-200">首页推荐赛季</div>
                  <h2 className="section-heading">{featuredSeason ? featuredSeason.title : "推荐赛季待设置"}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {featuredSeason
                      ? featuredSeason.summary ?? "赛季简介暂未填写。"
                      : "后台设置首页推荐赛季后，这里会显示赛季概况、参赛队伍和重点对局。"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2">
                    {featuredSeason?.tournamentName ?? "未关联赛事"}
                  </span>
                  <span className={`rounded-full border px-4 py-2 ${featuredTheme.badgeClass}`}>
                    {featuredSeason?.statusLabel ?? "状态待设置"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="grid gap-4 sm:grid-cols-3">
                <article className="brand-card p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">参赛队伍</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{featuredSeason?.participants.length ?? 0}</div>
                  <div className="mt-2 text-sm text-slate-400">已进入赛季图谱的正式队伍</div>
                </article>
                <article className="brand-card p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">赛程总数</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{featuredSeasonMatchCount}</div>
                  <div className="mt-2 text-sm text-slate-400">当前赛季已维护的比赛场次</div>
                </article>
                <article className="brand-card p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">阶段数量</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{featuredSeason?.stages.length ?? 0}</div>
                  <div className="mt-2 text-sm text-slate-400">包括预选、半决赛、总决赛等阶段</div>
                </article>
              </div>

                <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">赛季参赛队</div>
                  {featuredSeason?.participants.length ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {featuredSeason.participants.slice(0, 4).map((participant) => (
                        <Link key={participant.teamId} href={participant.teamSlug ? teamPath(participant.teamId) : "/teams"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-300/30 hover:bg-white/8">
                          <div className="flex items-center gap-3">
                            <TeamMark name={participant.teamName} logoUrl={participant.logoUrl} size="sm" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold text-white">{participant.teamName}</div>
                              <div className="mt-1 text-xs text-slate-500">种子 {participant.seedNumber ?? "-"} · {participant.wins} 胜 {participant.losses} 负</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-sm leading-7 text-slate-400">推荐赛季已设置，但参赛队和阶段信息还没有完全录入。</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">赛季重点对局</div>
                    <div className="mt-2 text-lg font-semibold text-white">从推荐赛季里先看最重要的几场</div>
                  </div>
                  <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
                    查看赛季页
                  </Link>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {featuredSeasonMatches.length ? featuredSeasonMatches.map((match) => (
                    <Link key={match.id} href={`/matches/${match.slug}`} className="brand-card p-4 transition hover:border-emerald-300/30 hover:bg-white/8">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{match.stageName ?? "赛季对局"}</div>
                      <div className="mt-3 text-lg font-semibold text-white">{match.title}</div>
                      <div className="mt-2 text-sm text-slate-300">{formatParticipantLabel(match)}</div>
                      <div className="mt-2 text-sm text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
                    </Link>
                  )) : (
                    <div className="brand-card border-dashed p-5 text-sm leading-7 text-slate-400 md:col-span-3">
                      这个赛季的重点对局还没整理完，先去比赛页查看完整赛程。
                    </div>
                  )}
                </div>
              </div>
            </article>

            <HomeIdentitySpotlight identity={identity} players={players} teams={teams} matches={matches} />
          </section>

          <article className="brand-shell p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker text-rose-200">内容与社区动态</div>
                <h2 className="section-heading">战报、公告和话题不再散着放</h2>
              </div>
              <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-rose-300/40 hover:text-white">
                全部资讯
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {featuredNews.length ? featuredNews.map((story, index) => (
                <Link key={story.id} href={`/content/${story.slug}`} className="brand-card p-5 transition hover:border-rose-300/30 hover:bg-white/8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                        <span>{index === 0 ? "首页主推" : "热门内容"}</span>
                        <span>{story.pageType}</span>
                        {story.topicSlug ? <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-2 py-1 text-rose-100">#{story.topicTitle}</span> : null}
                      </div>
                      <div className="mt-3 text-xl font-semibold text-white">{story.title}</div>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{story.excerpt ?? "这条内容已经被后台置顶，会作为首页重点新闻优先展示。"}</p>
                    </div>

                    <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-200">
                      {story.publishedAt ? formatDateLabel(story.publishedAt) : (story.seasonTitle ?? "社区内容")}
                    </div>
                  </div>

                  {(story.homeTeamName || story.awayTeamName || story.tournamentName) ? (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                      {(story.homeTeamName || story.awayTeamName) ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{[story.homeTeamName, story.awayTeamName].filter(Boolean).join(" vs ")}</span> : null}
                      {story.tournamentName ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{story.tournamentName}</span> : null}
                    </div>
                  ) : null}
                </Link>
              )) : (
                <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">热门新闻还没有在后台置顶，先去内容后台补充推荐。</div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link href={featuredAnnouncement ? `/community/announcements/${featuredAnnouncement.slug}` : "/community/announcements"} className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-4 transition hover:border-cyan-300/35">
                <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">重点公告</div>
                <div className="mt-2 text-lg font-semibold text-white">{featuredAnnouncement?.title ?? "公告待补充"}</div>
                <p className="mt-2 text-sm leading-7 text-cyan-50/80">{featuredAnnouncement?.excerpt ?? "站内重点提醒会先放到这里。"}</p>
              </Link>
              <Link href={featuredTopic ? `/community/topics/${featuredTopic.slug}` : "/community/topics"} className="rounded-[24px] border border-rose-300/20 bg-rose-300/10 p-4 transition hover:border-rose-300/35">
                <div className="text-[11px] uppercase tracking-[0.24em] text-rose-100">热门话题</div>
                <div className="mt-2 text-lg font-semibold text-white">{featuredTopic ? `#${featuredTopic.title}` : "主线待补充"}</div>
                <p className="mt-2 text-sm leading-7 text-rose-50/80">{featuredTopic?.description ?? "比赛、内容和招募会在这里形成同一条叙事线。"}</p>
              </Link>
              <Link href={featuredRecruitment ? `/community/recruitments/${featuredRecruitment.slug}` : "/community/recruitments"} className="rounded-[24px] border border-sky-300/20 bg-sky-300/10 p-4 transition hover:border-sky-300/35">
                <div className="text-[11px] uppercase tracking-[0.24em] text-sky-100">招募入口</div>
                <div className="mt-2 text-lg font-semibold text-white">{featuredRecruitment?.title ?? "招募待补充"}</div>
                <p className="mt-2 text-sm leading-7 text-sky-50/80">{featuredRecruitment?.excerpt ?? "缺人补位、约训练和建队入口会优先出现在这里。"}</p>
              </Link>
            </div>
          </article>

          <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <article className="brand-shell p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="section-kicker text-emerald-200">焦点比赛区</div>
                  <h2 className="section-heading">近期待开赛和最近完赛都留在首页</h2>
                </div>
                <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
                  全部比赛
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {upcomingMatches.map((match) => (
                  <Link key={`upcoming-${match.slug}`} href={`/matches/${match.slug}`} className="brand-card p-5 transition hover:border-emerald-300/30 hover:bg-white/8">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">即将开打</div>
                    <div className="mt-2 text-lg font-semibold text-white">{match.title}</div>
                    <div className="mt-2 text-sm text-slate-300">{formatParticipantLabel(match)}</div>
                    <div className="mt-2 text-sm text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
                  </Link>
                ))}
                {recentResults.map((match) => (
                  <Link key={`result-${match.slug}`} href={`/matches/${match.slug}`} className="brand-card p-5 transition hover:border-amber-300/30 hover:bg-white/8">
                    <div className="text-xs uppercase tracking-[0.22em] text-amber-200">最近完赛</div>
                    <div className="mt-2 text-lg font-semibold text-white">{match.title}</div>
                    <div className="mt-2 text-sm text-slate-300">{formatParticipantLabel(match)}</div>
                    <div className="mt-2 text-sm text-slate-400">{match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</div>
                  </Link>
                ))}
              </div>
            </article>

            <article className="brand-shell p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="section-kicker text-amber-200">荣誉与热门战队</div>
                  <h2 className="section-heading">首页也要让战队有门面感</h2>
                </div>
                <Link href="/teams" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
                  战队榜
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {topTeams.slice(0, 4).map((team, index) => (
                  <article key={team.id} className="brand-card flex items-center gap-3 p-4 transition hover:border-amber-300/30 hover:bg-white/8">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm font-semibold text-amber-100">
                      {index + 1}
                    </div>
                    <TeamMark name={team.name} logoUrl={team.logoUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link href={teamPath(team.id)} className="truncate text-sm font-semibold text-white transition hover:text-amber-200">
                        {team.name}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">{team.championshipCount} 冠军 · {team.wins}-{team.losses}-{team.draws}</div>
                    </div>
                    <div className="text-right text-sm font-semibold text-white">{team.honorScore}</div>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <article className="brand-shell p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker text-cyan-200">热门选手</div>
                <h2 className="section-heading">后台标记的重点人物</h2>
              </div>
              <Link href="/players" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
                全部选手
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {featuredPlayers.length ? featuredPlayers.map((player) => (
                <article key={player.id} className="brand-card p-5 transition hover:border-cyan-300/25 hover:bg-white/8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">{player.primaryRole ?? "社区选手"}</div>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        <Link href={playerPath(player.id)} className="transition hover:text-cyan-100">
                          {player.displayName}
                        </Link>
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-200">
                      {player.championshipCount} 冠
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    所属战队：
                    {player.teamId ? <Link href={teamPath(player.teamId)} className="transition hover:text-cyan-100">{player.teamName}</Link> : player.teamName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {player.heroCards.length ? player.heroCards.slice(0, 4).map((hero) => (
                      <HeroChip key={`${player.slug}-${hero.label}`} hero={hero} compact />
                    )) : <span className="text-sm text-slate-500">暂未维护英雄池</span>}
                  </div>
                </article>
              )) : (
                <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400 md:col-span-2">热门选手还没有在后台标记，先去选手管理页勾选。</div>
              )}
            </div>
          </article>
        </div>

        <aside className="order-2 space-y-4 xl:sticky xl:top-28">
          <article className="brand-shell p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="section-kicker text-amber-200">平台总览</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">今晚站内节奏</h2>
              </div>
              <Link href="/teams" className="text-sm font-semibold text-amber-100 transition hover:text-white">
                查看全部
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <article className="brand-card p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">赛事体系</div>
                <div className="mt-2 text-lg font-semibold text-white">{tournamentKinds.join(" / ")}</div>
              </article>
              <article className="brand-card p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">主推赛季</div>
                <div className="mt-2 text-lg font-semibold text-white">{featuredSeason?.title ?? "待设置"}</div>
              </article>
              <article className="brand-card p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">重点内容</div>
                <div className="mt-2 text-lg font-semibold text-white">{featuredNews.length} 条已上首页</div>
              </article>
            </div>
          </article>

          <article className="brand-shell p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="section-kicker text-emerald-200">即将开打</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">近期赛程</h2>
              </div>
              <Link href="/matches" className="text-sm font-semibold text-emerald-100 transition hover:text-white">
                查看全部
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingMatches.length ? upcomingMatches.map((match) => (
                <Link key={match.slug} href={`/matches/${match.slug}`} className="brand-card block p-4 transition hover:border-emerald-300/30 hover:bg-white/8">
                  <div className="text-sm font-semibold text-white">{match.title}</div>
                  <div className="mt-2 text-sm text-slate-300">{formatParticipantLabel(match)}</div>
                  <div className="mt-2 text-xs text-slate-500">{formatDateLabel(match.scheduledAt)}</div>
                </Link>
              )) : (
                <div className="text-sm leading-7 text-slate-400">近期还没有新的公开赛程。</div>
              )}
            </div>
          </article>

          <div className="grid gap-4 xl:grid-cols-1">
            <Link href={featuredAnnouncement ? `/community/announcements/${featuredAnnouncement.slug}` : "/community/announcements"} className="brand-shell block p-5 transition hover:border-cyan-300/30 hover:bg-white/8">
              <div className="section-kicker text-cyan-200">重点公告</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{featuredAnnouncement?.title ?? "社区公告待补充"}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{featuredAnnouncement?.excerpt ?? "后台勾选重点公告后，这里会优先承接站内提醒。"}</p>
            </Link>

            <Link href={featuredTopic ? `/community/topics/${featuredTopic.slug}` : "/community/topics"} className="brand-shell block p-5 transition hover:border-rose-300/30 hover:bg-white/8">
              <div className="section-kicker text-rose-200">热门话题</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{featuredTopic ? `#${featuredTopic.title}` : "社区主线待补充"}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{featuredTopic?.description ?? "热门话题会把比赛、内容和招募串成一条主线。"}</p>
            </Link>

            <Link href={featuredRecruitment ? `/community/recruitments/${featuredRecruitment.slug}` : "/community/recruitments"} className="brand-shell block p-5 transition hover:border-sky-300/30 hover:bg-white/8">
              <div className="section-kicker text-sky-200">招募组队</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{featuredRecruitment?.title ?? "招募入口待补充"}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{featuredRecruitment?.excerpt ?? "如果今晚有人补位、组队或约训练，这里会承接最快的入口。"}</p>
            </Link>
          </div>
        </aside>
      </section>
    </Shell>
  );
}
