import Link from "next/link";
import { HeroChip } from "@/components/hero-chip";
import { HomeIdentitySpotlight } from "@/components/home-identity-spotlight";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/team-mark";
import { getCommunityTopics, getMatches, getPlayers, getRecruitmentPosts, getTeams } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";

const matchStatusLabels: Record<string, string> = {
  SCHEDULED: "即将开打",
  ONGOING: "正在进行",
  FINISHED: "已完赛",
  CANCELLED: "已取消"
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

function sortByScheduledDesc<T extends { scheduledAt: Date | string | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftValue = left.scheduledAt ? new Date(left.scheduledAt).getTime() : 0;
    const rightValue = right.scheduledAt ? new Date(right.scheduledAt).getTime() : 0;
    return rightValue - leftValue;
  });
}

function formatParticipantLabel(match: {
  participantTeamNames?: string[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  const names = match.participantTeamNames?.filter(Boolean) ?? [];
  if (names.length >= 3) {
    return names.join(" / ");
  }

  if (names.length === 2) {
    return `${names[0]} vs ${names[1]}`;
  }

  return `${match.homeTeamName} vs ${match.awayTeamName}`;
}

export default async function HomePage() {
  const [matches, teams, players, topics, recruitmentPosts] = await Promise.all([
    getMatches(),
    getTeams(),
    getPlayers(),
    getCommunityTopics(),
    getRecruitmentPosts()
  ]);

  const upcomingMatches = sortByScheduledAsc(matches.filter((match) => match.status !== "FINISHED" && match.status !== "CANCELLED")).slice(0, 5);
  const ongoingMatches = sortByScheduledAsc(matches.filter((match) => match.status === "ONGOING")).slice(0, 3);
  const recentResults = sortByScheduledDesc(matches.filter((match) => match.status === "FINISHED")).slice(0, 4);
  const topTeams = [...teams]
    .sort((left, right) => right.honorScore - left.honorScore || right.championshipCount - left.championshipCount)
    .slice(0, 5);
  const spotlightPlayers = [...players]
    .sort((left, right) => right.championshipCount - left.championshipCount || right.heroCards.length - left.heroCards.length)
    .slice(0, 4);

  const featuredResult = recentResults[0] ?? null;
  const nextMatch = ongoingMatches[0] ?? upcomingMatches[0] ?? null;
  const featuredTopic = topics[0] ?? null;
  const featuredRecruitment = recruitmentPosts[0] ?? null;

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[7fr_3fr] xl:items-start">
        <div className="space-y-6 xl:order-1">
          <article className="brand-shell relative overflow-hidden p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-80">
              <div className="absolute left-10 top-10 h-px w-32 bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
              <div className="absolute right-12 top-12 h-28 w-28 rounded-full border border-white/10 bg-cyan-300/10 blur-2xl" />
              <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
            </div>

            <div className="relative">
              <div className="brand-chip border-emerald-300/25 bg-emerald-300/10 text-emerald-100">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                {nextMatch ? (nextMatch.status === "ONGOING" ? "正在进行的比赛" : "今晚焦点对局") : featuredResult ? "最新比赛结果" : "Herald Cup"}
              </div>

              <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    {nextMatch?.title ?? featuredResult?.title ?? "今晚赛场、社区热讯与荣誉榜"}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
                    {nextMatch
                      ? "今晚焦点对局、开赛时间和关联话题都已经整理好，先从这场开始进入 Herald Cup 的比赛现场。"
                      : featuredResult
                        ? "最新战果、赛后内容和社区讨论已经汇总完毕，想补看刚结束的关键对局，可以先从这里开始。"
                          : "Herald Cup 把今晚赛程、赛后战报、热门话题、招募信息和荣誉榜整理在同一站内，让你一进来就能找到最值得追的内容。"}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-slate-950/60 px-5 py-4 text-right">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {nextMatch ? (nextMatch.status === "ONGOING" ? "当前状态" : "开赛倒计时") : featuredResult ? "完赛比分" : "状态"}
                  </div>
                  {nextMatch ? (
                    <div className="mt-3 text-3xl font-semibold text-white">
                      {nextMatch.status === "ONGOING" ? "比赛进行中" : formatCountdown(nextMatch.scheduledAt)}
                    </div>
                  ) : featuredResult ? (
                    <div className="mt-3 text-4xl font-semibold text-white">
                      {featuredResult.scoreHome ?? "-"}
                      <span className="mx-3 text-slate-500">:</span>
                      {featuredResult.scoreAway ?? "-"}
                    </div>
                  ) : (
                    <div className="mt-3 text-3xl font-semibold text-white">敬请期待</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2">
                  {nextMatch
                    ? formatParticipantLabel(nextMatch)
                    : featuredResult
                      ? formatParticipantLabel(featuredResult)
                      : "对阵待定"}
                </span>
                {(nextMatch?.topicSlug || featuredResult?.topicSlug) ? (
                  <Link
                    href={nextMatch?.topicSlug ? `/community/topics/${nextMatch.topicSlug}` : `/community/topics/${featuredResult?.topicSlug}`}
                    className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1.5 text-xs text-rose-100 transition hover:border-rose-200/40 hover:text-white"
                  >
                    #{nextMatch?.topicTitle ?? featuredResult?.topicTitle}
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 text-sm text-slate-300">
                {nextMatch
                  ? `${matchStatusLabels[nextMatch.status] ?? nextMatch.status} · ${formatDateLabel(nextMatch.scheduledAt)}`
                  : featuredResult
                    ? `已完赛 · ${formatDateLabel(featuredResult.scheduledAt)}`
                    : "时间待定"}
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                {nextMatch?.summary ?? featuredResult?.summary ?? "关注这场对局的时间、比分和赛后延展，比赛一结束，相关战报与讨论也会同步跟上。"}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={nextMatch ? `/matches/${nextMatch.slug}` : featuredResult ? `/matches/${featuredResult.slug}` : "/matches"}
                  className="rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                >
                  {nextMatch ? "进入比赛详情" : featuredResult ? "查看比赛详情" : "查看全部比赛"}
                </Link>
                <Link href="/matches" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
                  今晚完整赛程
                </Link>
                <Link href="/my" className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-300/40 hover:text-white">
                  我的主页
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {recentResults.slice(0, 3).map((match, index) => (
                  <Link key={match.slug} href={`/matches/${match.slug}`} className="brand-card p-4 transition hover:border-cyan-300/30 hover:bg-white/8">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{index === 0 ? "刚结束" : "最近结果"}</div>
                    <div className="mt-3 text-lg font-semibold text-white">{match.title}</div>
                    <div className="mt-2 text-sm text-slate-300">{formatParticipantLabel(match)}</div>
                    <div className="mt-1 text-sm text-slate-400">比分 {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</div>
                    <div className="mt-2 text-sm text-slate-500">{formatDateLabel(match.scheduledAt)}</div>
                  </Link>
                ))}
                {!recentResults.length ? (
                  <div className="brand-card border-dashed p-4 text-sm leading-7 text-slate-400 md:col-span-3">
                    最近一轮比赛结果还未出炉，先关注今晚赛程，完赛后再回来查看最新比分。
                  </div>
                ) : null}
              </div>
            </div>

          </article>

          <article className="brand-shell p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker">今晚赛程</div>
                <h2 className="section-heading">今晚焦点对局</h2>
              </div>
              <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
                全部比赛
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {upcomingMatches.length ? upcomingMatches.map((match, index) => (
                <article key={match.slug} className={`brand-card p-5 transition hover:border-cyan-300/25 hover:bg-white/8 ${index === 0 ? "border-cyan-300/30 bg-cyan-300/5" : ""}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                        <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-slate-300">{index === 0 ? "焦点战" : "即将开打"}</span>
                        <span className="text-cyan-200">{matchStatusLabels[match.status] ?? match.status}</span>
                        <span>{formatDateLabel(match.scheduledAt)}</span>
                      </div>

                      <h3 className="mt-3 text-2xl font-semibold text-white">
                        <Link href={`/matches/${match.slug}`} className="transition hover:text-cyan-100">
                          {match.title}
                        </Link>
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                        <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">
                          {formatParticipantLabel(match)}
                        </span>
                        {match.topicSlug ? (
                          <Link href={`/community/topics/${match.topicSlug}`} className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1.5 text-xs text-rose-100 transition hover:border-rose-200/40 hover:text-white">
                            #{match.topicTitle}
                          </Link>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-slate-400">{match.summary ?? "对阵和开赛时间已经确定，想看今晚该先追哪场，这里就是最省时间的入口。"}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-right text-sm font-semibold text-slate-200">
                      <div>{match.format ?? "TBD"}</div>
                      <div className="mt-1 text-xs text-slate-500">{match.status === "ONGOING" ? "比赛进行中" : formatCountdown(match.scheduledAt)}</div>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="brand-card border-dashed p-6 text-sm leading-7 text-slate-400">
                  今晚赛程正在确认中，先逛逛战队、选手和社区热区。
                </div>
              )}
            </div>
          </article>

          <article className="brand-shell p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker">焦点选手</div>
                <h2 className="section-heading">本周值得留意的选手</h2>
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
                    所属战队：
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
                <div className="section-kicker">专属看板</div>
                <h2 className="section-heading">认领后，从你的主场开始</h2>
              </div>
              <Link href="/my" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
                查看我的主页
              </Link>
            </div>

            <div className="mt-6">
              <HomeIdentitySpotlight players={players} teams={teams} matches={matches} />
            </div>
          </article>
        </div>

        <aside className="order-2 space-y-4 xl:sticky xl:top-28">
          <article className="brand-shell p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="section-kicker text-amber-200">荣誉榜</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">当前排位</h2>
              </div>
              <Link href="/teams" className="text-sm font-semibold text-amber-100 transition hover:text-white">
                查看全部
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {topTeams.slice(0, 3).map((team, index) => (
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
              {!topTeams.length ? <div className="text-sm leading-7 text-slate-400">战队榜稍后更新，先去战队页看看各队当前阵容和近期表现。</div> : null}
            </div>
          </article>

          <div className="grid gap-4 xl:grid-cols-1">
            <Link href={featuredTopic ? `/community/topics/${featuredTopic.slug}` : "/community/topics"} className="brand-shell block p-5 transition hover:border-rose-300/30 hover:bg-white/8">
              <div className="section-kicker text-rose-200">热门话题</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{featuredTopic ? `#${featuredTopic.title}` : "聊聊今晚最值得追的主线"}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{featuredTopic?.description ?? "从比赛、战报到组队信息，围绕同一话题一起追更，更容易找到同好。"}</p>
              {featuredTopic ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{featuredTopic.matchCount} 场比赛</span>
                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{featuredTopic.contentCount} 条内容</span>
                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5">{featuredTopic.recruitmentCount} 条招募</span>
                </div>
              ) : null}
            </Link>

            <Link href={featuredRecruitment ? `/community/recruitments/${featuredRecruitment.slug}` : "/community/recruitments"} className="brand-shell block p-5 transition hover:border-sky-300/30 hover:bg-white/8">
              <div className="section-kicker text-sky-200">招募组队</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{featuredRecruitment?.title ?? "找队友，约训练，补最后一个位置"}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{featuredRecruitment?.excerpt ?? "想找队、补位或临时组一车，现在就能从这里接上社区节奏，尽快找到合适的队友。"}</p>
              {featuredRecruitment?.topicTitle ? <div className="mt-3 text-xs uppercase tracking-[0.18em] text-sky-100">所属话题 #{featuredRecruitment.topicTitle}</div> : null}
            </Link>
          </div>
        </aside>
      </section>

    </Shell>
  );
}
