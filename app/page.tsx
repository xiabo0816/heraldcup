import Link from "next/link";
import { Search } from "lucide-react";
import { HeroChip } from "@/components/hero-chip";
import { HomeIdentitySpotlight } from "@/components/home-identity-spotlight";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/team-mark";
import { getContentPages, getHomeDashboard, getMatches, getPlayers, getTeams } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";

const pageTypeLabels: Record<string, string> = {
  poster: "海报",
  champion: "冠军",
  news: "快报",
  recap: "战报",
  custom: "自定义"
};

const matchStatusLabels: Record<string, string> = {
  SCHEDULED: "即将开打",
  ONGOING: "正在进行",
  FINISHED: "已完赛",
  CANCELLED: "已取消"
};

const metricLinks: Record<string, { href: string; action: string }> = {
  赛事系列: { href: "/matches", action: "赛事总览" },
  选手池: { href: "/players", action: "浏览名册" },
  队伍池: { href: "/teams", action: "查看战队" },
  比赛池: { href: "/matches", action: "打开赛程" },
  历史赛季: { href: "/matches", action: "查看历届" },
  社区战队: { href: "/teams", action: "查看榜单" },
  "Dota2 英雄库": { href: "/players", action: "看英雄池" }
};

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

function formatPublishedLabel(value: Date | string | null) {
  if (!value) {
    return "刚刚归档";
  }

  return new Date(value).toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric"
  });
}

function formatCountdown(value: Date | string | null) {
  if (!value) {
    return "时间待定";
  }

  const diff = new Date(value).getTime() - Date.now();
  if (diff <= 0) {
    return "已到开赛时间";
  }

  const minutes = Math.round(diff / 60000);
  if (minutes < 60) {
    return `${minutes} 分钟后`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} 小时后`;
  }

  const days = Math.round(hours / 24);
  return `${days} 天后`;
}

function sortByScheduledAsc<T extends { scheduledAt: Date | string | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftValue = left.scheduledAt ? new Date(left.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const rightValue = right.scheduledAt ? new Date(right.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    return leftValue - rightValue;
  });
}

export default async function HomePage() {
  const [dashboard, contentPages, matches, teams, players] = await Promise.all([
    getHomeDashboard(),
    getContentPages(),
    getMatches(),
    getTeams(),
    getPlayers()
  ]);

  const upcomingMatches = sortByScheduledAsc(matches.filter((match) => match.status !== "FINISHED" && match.status !== "CANCELLED")).slice(0, 5);
  const ongoingMatches = matches.filter((match) => match.status === "ONGOING").slice(0, 3);
  const recentResults = matches.filter((match) => match.status === "FINISHED").slice(0, 4);
  const latestStories = contentPages.slice(0, 4);
  const topTeams = [...teams]
    .sort((left, right) => right.honorScore - left.honorScore || right.championshipCount - left.championshipCount)
    .slice(0, 5);
  const spotlightPlayers = [...players]
    .sort((left, right) => right.championshipCount - left.championshipCount || right.heroCards.length - left.heroCards.length)
    .slice(0, 4);

  const heroMetrics = dashboard.metrics.slice(0, 4);
  const nextMatch = ongoingMatches[0] ?? upcomingMatches[0] ?? matches[0] ?? null;
  const latestStory = latestStories[0] ?? null;
  const bestTeam = topTeams[0] ?? null;

  const pulseItems = [
    {
      label: ongoingMatches.length ? "正在进行" : "下一场",
      value: ongoingMatches.length ? `${ongoingMatches.length} 场比赛正在首页挂起` : nextMatch ? `${formatCountdown(nextMatch.scheduledAt)} · ${nextMatch.title}` : "等待赛程录入",
      href: "/matches"
    },
    {
      label: "刚更新",
      value: latestStory ? latestStory.title : "等待第一篇战报",
      href: latestStory ? `/content/${latestStory.slug}` : "/content"
    },
    {
      label: "榜首战队",
      value: bestTeam ? `${bestTeam.name} · ${bestTeam.honorScore} 分` : "等待榜单形成",
      href: bestTeam ? teamPath(bestTeam.id) : "/teams"
    },
    {
      label: "搜索",
      value: "按 Command + K 直接找人、队、比赛",
      href: "/players"
    }
  ];

  return (
    <Shell>
      <section className="brand-shell relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(79,209,197,0.16),transparent_28%),linear-gradient(180deg,rgba(8,16,29,0.98),rgba(15,23,42,0.96))] p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute left-10 top-10 h-px w-32 bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
          <div className="absolute right-12 top-12 h-28 w-28 rounded-full border border-white/10 bg-cyan-300/10 blur-2xl" />
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
        </div>

        <div className="relative flex flex-wrap gap-2">
          {pulseItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="brand-chip border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/35 hover:text-white"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className="normal-case tracking-normal text-slate-100">{item.value}</span>
            </Link>
          ))}
        </div>

        <div className="relative mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div>
            <div className="brand-chip border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              Tonight Control Panel
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              今晚先看什么，
              <span className="block bg-gradient-to-r from-emerald-200 via-cyan-100 to-amber-200 bg-clip-text text-transparent">
                一屏就该决定。
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
              首页只先给你今晚主赛、你的入口、刚更新的内容和榜首动态。比赛是第一层，选手、战队和战报是第二层，不再把整个社区一次性摊平。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/matches" className="rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                今晚赛程
              </Link>
              <Link href="/my" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
                我的比赛
              </Link>
              <Link href="/content" className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-300/40 hover:text-white">
                刚更新内容
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroMetrics.map((item) => {
                const metricLink = metricLinks[item.label] ?? { href: "/matches", action: "查看详情" };

                return (
                  <Link
                    key={item.label}
                    href={metricLink.href}
                    className="brand-card group p-4 transition hover:border-cyan-300/30 hover:bg-white/8"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{item.label}</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
                    <div className="mt-3 text-sm text-slate-400 transition group-hover:text-cyan-100">{metricLink.action}</div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
              <article className="brand-card border-emerald-300/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(6,78,59,0.24))] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="section-kicker text-emerald-200">今晚主赛</div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{nextMatch?.title ?? dashboard.featuredMatch.title}</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                    {nextMatch?.format ?? dashboard.featuredMatch.format ?? "TBD"}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span>{nextMatch?.homeTeamName ?? dashboard.featuredMatch.homeTeamName}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">VS</span>
                  <span>{nextMatch?.awayTeamName ?? dashboard.featuredMatch.awayTeamName}</span>
                </div>

                <div className="mt-4 text-sm leading-7 text-slate-300">
                  {nextMatch ? `${matchStatusLabels[nextMatch.status] ?? nextMatch.status} · ${formatDateLabel(nextMatch.scheduledAt)}` : `${dashboard.featuredSeason.title} · ${dashboard.featuredSeason.statusLabel}`}
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {nextMatch?.summary ?? dashboard.featuredSeason.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={nextMatch ? `/matches/${nextMatch.slug}` : "/matches"} className="rounded-full border border-emerald-300/40 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200/60">
                    直接去比赛页
                  </Link>
                  <Link href="/matches" className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white">
                    打开完整赛程
                  </Link>
                </div>
              </article>

              <article className="brand-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="section-kicker">刚更新的内容</div>
                    <h2 className="mt-2 text-xl font-semibold text-white">{latestStory?.title ?? "等待第一篇战报"}</h2>
                  </div>
                  <Search className="h-5 w-5 text-slate-500" />
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {latestStory?.excerpt ?? "比赛结束后的海报、快报和战报，都会第一时间汇总到这里。"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                  {latestStory?.seasonTitle ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{latestStory.seasonTitle}</span> : null}
                  {latestStory?.homeTeamName ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{latestStory.homeTeamName}</span> : null}
                  {latestStory?.awayTeamName ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{latestStory.awayTeamName}</span> : null}
                  {latestStory ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-100">{pageTypeLabels[latestStory.pageType] ?? latestStory.pageType}</span> : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={latestStory ? `/content/${latestStory.slug}` : "/content"} className="rounded-full border border-cyan-300/30 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50">
                    打开最新内容
                  </Link>
                  <Link href="/content" className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white">
                    全部内容
                  </Link>
                </div>
              </article>
            </div>
          </div>

          <div className="grid gap-4">
            <HomeIdentitySpotlight players={players} teams={teams} matches={matches} />

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="brand-card p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">比赛状态</div>
                <div className="mt-3 text-2xl font-semibold text-white">{ongoingMatches.length ? `${ongoingMatches.length} 场正在打` : nextMatch ? formatCountdown(nextMatch.scheduledAt) : "等待排期"}</div>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {ongoingMatches.length ? "优先把进行中的比赛挂在首页右上侧，用户扫一眼就知道当前社区是否活着。" : "没有进行中的比赛时，首页退回到下一场倒计时，不让首屏出现信息真空。"}
                </p>
              </article>

              <article className="brand-card p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">快速搜索</div>
                <div className="mt-3 text-2xl font-semibold text-white">Command + K</div>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  头部已支持直接搜索选手、战队、比赛和战报。首页不再承担所有导航职责，把高频直达入口还给搜索。
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">今晚赛程</div>
              <h2 className="section-heading">先看现在该点哪一场</h2>
            </div>
            <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              全部比赛
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {upcomingMatches.length ? upcomingMatches.map((match, index) => (
              <article key={match.slug} className="brand-card p-5 transition hover:border-cyan-300/25 hover:bg-white/8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                      <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-slate-300">{index === 0 ? "下一场" : "稍后"}</span>
                      <span className="text-cyan-200">{matchStatusLabels[match.status] ?? match.status}</span>
                      <span>{formatDateLabel(match.scheduledAt)}</span>
                    </div>

                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      <Link href={`/matches/${match.slug}`} className="transition hover:text-cyan-100">
                        {match.title}
                      </Link>
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                      {match.homeTeamId ? (
                        <Link href={teamPath(match.homeTeamId)} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 transition hover:border-cyan-300/30 hover:text-white">
                          {match.homeTeamName}
                        </Link>
                      ) : <span>{match.homeTeamName}</span>}
                      <span className="text-slate-500">vs</span>
                      {match.awayTeamId ? (
                        <Link href={teamPath(match.awayTeamId)} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 transition hover:border-amber-300/30 hover:text-white">
                          {match.awayTeamName}
                        </Link>
                      ) : <span>{match.awayTeamName}</span>}
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-400">{match.summary ?? "这场对局的看点正在整理中，先锁定对阵和开赛时间。"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-200">
                    {match.format ?? "TBD"}
                  </div>
                </div>
              </article>
            )) : (
              <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">
                赛程一更新，这里就会第一时间挂出下一场焦点对局。
              </div>
            )}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">社区正在发生</div>
              <h2 className="section-heading">先扫一眼，再决定往哪走</h2>
            </div>
            <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
              内容流
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <article className="brand-card p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">刚更新</div>
              <div className="mt-4 space-y-3">
                {latestStories.length ? latestStories.slice(0, 3).map((page, index) => (
                  <Link key={page.id} href={`/content/${page.slug}`} className="block rounded-[20px] border border-white/10 bg-slate-950/55 px-4 py-3 transition hover:border-rose-300/30">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{page.title}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{index === 0 ? "头条" : formatPublishedLabel(page.publishedAt)}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-400">{page.excerpt ?? "补一句摘要，首页点开率会明显更高。"}</div>
                  </Link>
                )) : <div className="text-sm leading-7 text-slate-400">等待第一篇海报或战报出现。</div>}
              </div>
            </article>

            <article className="brand-card p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">最近完赛</div>
              <div className="mt-4 space-y-3">
                {recentResults.length ? recentResults.map((match) => (
                  <Link key={match.slug} href={`/matches/${match.slug}`} className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-slate-950/55 px-4 py-3 transition hover:border-cyan-300/30">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{match.title}</div>
                      <div className="mt-1 text-sm text-slate-400">{match.homeTeamName} {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"} {match.awayTeamName}</div>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">已完赛</span>
                  </Link>
                )) : <div className="text-sm leading-7 text-slate-400">最近完赛结果还没积起来。</div>}
              </div>
            </article>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">社区榜单</div>
              <h2 className="section-heading">谁在前面，一眼就知道</h2>
            </div>
            <Link href="/teams" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
              战队主页
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {topTeams.map((team, index) => (
              <article key={team.id} className="brand-card flex items-center gap-4 p-4 transition hover:border-amber-300/25 hover:bg-white/8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm font-semibold text-amber-100">
                  {index + 1}
                </div>
                <TeamMark name={team.name} logoUrl={team.logoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <Link href={teamPath(team.id)} className="text-lg font-semibold text-white transition hover:text-amber-200">
                    {team.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">{team.summary ?? team.slogan ?? "继续补队伍介绍，榜单的记忆点会更强。"}</p>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <div>积分 {team.honorScore}</div>
                  <div className="mt-1 text-slate-500">{team.wins}-{team.losses}-{team.draws}</div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">最新战报</div>
              <h2 className="section-heading">内容流要像赛后面板，而不是文章堆</h2>
            </div>
            <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-rose-300/40 hover:text-white">
              全部内容
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {latestStories.length ? latestStories.map((page, index) => (
              <article key={page.id} className="brand-card p-5 transition hover:border-rose-300/25 hover:bg-white/8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em]">
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-accent-gold">{pageTypeLabels[page.pageType] ?? page.pageType}</span>
                    {page.featured ? <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-cyan-100">推荐</span> : null}
                    <span className="text-slate-500">{index === 0 ? "头条" : formatPublishedLabel(page.publishedAt)}</span>
                  </div>
                  {page.matchSlug ? (
                    <Link href={`/matches/${page.matchSlug}`} className="text-xs font-semibold text-slate-400 transition hover:text-white">
                      对应比赛
                    </Link>
                  ) : null}
                </div>

                <h3 className="mt-3 text-xl font-semibold text-white">
                  <Link href={`/content/${page.slug}`} className="transition hover:text-amber-200">
                    {page.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">{page.excerpt ?? "这篇内容的导语正在整理中，点进去看完整内容。"}</p>

                {(page.homeTeamName || page.awayTeamName || page.seasonTitle) ? (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    {page.seasonTitle ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{page.seasonTitle}</span> : null}
                    {page.homeTeamName ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{page.homeTeamName}</span> : null}
                    {page.awayTeamName ? <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{page.awayTeamName}</span> : null}
                  </div>
                ) : null}
              </article>
            )) : (
              <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">
                内容区正在持续上新，稍后就能在这里看到最新海报和战报。
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">焦点选手</div>
              <h2 className="section-heading">人是社区最强的记忆点</h2>
            </div>
            <Link href="/players" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              全部选手
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {spotlightPlayers.map((player) => (
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
                  当前队伍：
                  {player.teamId ? <Link href={teamPath(player.teamId)} className="transition hover:text-cyan-100">{player.teamName}</Link> : player.teamName}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {player.heroCards.length ? player.heroCards.slice(0, 4).map((hero) => (
                    <HeroChip key={`${player.slug}-${hero.label}`} hero={hero} compact />
                  )) : <span className="text-sm text-slate-500">暂未维护英雄池</span>}
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="brand-shell p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-kicker">社区资产</div>
              <h2 className="section-heading">把赛季、人物和内容继续沉淀下去</h2>
            </div>
            <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
              赛事档案
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-100">先锋杯</div>
              <div className="mt-2 text-lg font-semibold text-white">赛季主线</div>
              <p className="mt-2 text-sm leading-7 text-emerald-50/80">用届次、对阵、冠军和战报，把整个社区的长期记忆积下来。</p>
            </article>
            <article className="rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-amber-100">冠绝杯</div>
              <div className="mt-2 text-lg font-semibold text-white">周更激活</div>
              <p className="mt-2 text-sm leading-7 text-amber-50/80">用快节奏小赛保持首页活性，让海报和快报有稳定内容源。</p>
            </article>
            <article className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">社区档案</div>
              <div className="mt-2 text-lg font-semibold text-white">人、队、内容闭环</div>
              <p className="mt-2 text-sm leading-7 text-cyan-50/80">用户先从比赛进，再沉到选手、战队和往届内容里。</p>
            </article>
          </div>

          <div className="mt-5 brand-card p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">首页规则</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">先给今晚主赛，再给已绑定用户的个人入口，再给刚更新内容和榜单。解释型文案退到后台，首页只保留面向用户的行动信息。</p>
          </div>
        </article>
      </section>
    </Shell>
  );
}