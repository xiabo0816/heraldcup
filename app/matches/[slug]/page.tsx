import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { PlayerAvatar } from "@/components/player-avatar";
import { TeamMark } from "@/components/team-mark";
import { getMatchDetailBySlug } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";
import { getTournamentTheme } from "@/lib/tournament-theme";

const pageTypeLabels: Record<string, string> = {
  poster: "开赛海报",
  champion: "恭喜海报",
  news: "快报",
  recap: "战报",
  custom: "内容页"
};

function formatStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "筹备中";
    case "SCHEDULED":
      return "即将开赛";
    case "ONGOING":
    case "LIVE":
      return "正在进行";
    case "FINISHED":
      return "已完赛";
    case "ARCHIVED":
      return "已归档";
    default:
      return status;
  }
}

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

function resolveFinishedState(match: {
  status: string;
  championTeamName?: string | null;
  seasonTitle?: string | null;
  tournamentName?: string | null;
  title: string;
  scheduledAt?: Date | string | null;
}) {
  if (match.status === "FINISHED" || match.status === "ARCHIVED") {
    return true;
  }

  if (match.championTeamName) {
    return true;
  }

  const legacyLabel = `${match.seasonTitle ?? ""} ${match.tournamentName ?? ""} ${match.title}`;

  if ((legacyLabel.includes("先锋杯") || legacyLabel.includes("冠绝杯") || legacyLabel.includes("传奇杯")) && !legacyLabel.includes("第十一届")) {
    return true;
  }

  if (match.scheduledAt && new Date(match.scheduledAt).getTime() < Date.now() && !legacyLabel.includes("第十一届")) {
    return true;
  }

  return false;
}

function TeamPanel({
  title,
  teamId,
  logoUrl,
  slogan,
  summary,
  coach,
  captain,
  members,
  cardClass,
  badgeClass
}: {
  title: string | null;
  teamId: string | null;
  logoUrl?: string | null;
  slogan?: string | null;
  summary?: string | null;
  coach?: string | null;
  captain?: string | null;
  members: Array<{
    id: string;
    displayName: string;
    slug: string;
    primaryRole: string | null;
    avatarUrl: string | null;
  }>;
  cardClass: string;
  badgeClass: string;
}) {
  return (
    <article className={`rounded-2xl border p-5 backdrop-blur ${cardClass}`}>
      <div className="flex items-start gap-4">
        <TeamMark name={title ?? "待定队伍"} logoUrl={logoUrl} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="text-lg font-extrabold tracking-[0.22em] uppercase text-slate-100">{title ?? "待定"}</div>
            <div className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${badgeClass}`}>
              {slogan ?? "待命"}
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">{summary ?? "这支队伍暂时还没有维护简介。"}</p>
          <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">教练：{coach ?? "未设置"}</div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">队长：{captain ?? "未设置"}</div>
          </div>
          {teamId ? <Link href={teamPath(teamId)} className="mt-4 inline-flex text-sm text-slate-300 transition hover:text-white">进入队伍主页</Link> : null}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">基本队员信息</div>
        {members.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {members.slice(0, 6).map((member) => (
              <Link key={member.id} href={playerPath(member.id)} className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 transition hover:border-white/20">
                <div className="flex items-center gap-3">
                  <PlayerAvatar src={member.avatarUrl} alt={member.displayName} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{member.displayName}</div>
                    <div className="text-xs text-slate-400">{member.primaryRole ?? "未分配位置"}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/35 p-4 text-sm text-slate-400">这支队伍的成员名单正在补充中。</div>
        )}
      </div>
    </article>
  );
}

export default async function MatchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = await getMatchDetailBySlug(slug);

  if (!match) {
    notFound();
  }

  const theme = getTournamentTheme(match.tournamentKind, match.tournamentName ?? match.title);
  const championPage = match.contentPages.find((page) => page.pageType === "champion") ?? null;
  const relatedPages = match.contentPages.filter((page) => page.pageType !== "champion");
  const isFinished = resolveFinishedState(match);
  const headline = isFinished ? "恭喜夺冠" : match.status === "LIVE" ? "正在进行" : "开赛预告";
  const currentStatusLabel = formatStatusLabel(match.status);
  const heroSubtitle = isFinished
    ? `${match.championTeamName ?? "冠军待定"}${(match.scoreHome !== null || match.scoreAway !== null) ? ` · 最终比分 ${match.scoreHome ?? "-"} : ${match.scoreAway ?? "-"}` : ""}`
    : `${match.homeTeamName ?? "待定"} vs ${match.awayTeamName ?? "待定"} · ${formatDateLabel(match.scheduledAt)}`;

  return (
    <Shell>
      <section className={`relative overflow-hidden rounded-[36px] border p-8 shadow-glow ${theme.pageBackground} ${theme.panelBorder}`}>
        <div className={`pointer-events-none absolute -inset-[30%] opacity-90 ${theme.spotlightGlow}`} />

        <div className="relative z-10">
          <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] backdrop-blur ${theme.badgeClass}`}>
                <span className="text-base leading-none">{isFinished ? "🏆" : "⚔️"}</span>
                <span>{match.seasonTitle ?? match.tournamentName ?? theme.label}</span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold uppercase leading-tight tracking-[0.18em] md:text-4xl">
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${theme.titleGradient}`}>{headline}</span>
                <br />
                {isFinished ? "Congratulations Champions" : match.status === "LIVE" ? "Match In Progress" : "Match Day is Coming"}
              </h1>

              <p className="mt-3 text-sm text-slate-300/90 md:text-base">{heroSubtitle}</p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] ${theme.primaryButton}`}>
                {isFinished ? "赛事结束" : currentStatusLabel}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-300/80">{match.format ?? "赛制待定"}</div>
            </div>
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">状态</div>
              <div className="mt-3 text-lg font-semibold text-white">{isFinished ? "赛事结束" : currentStatusLabel}</div>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">内容页</div>
              <div className="mt-3 text-3xl font-semibold text-white">{match.contentPages.length}</div>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">焦点选手</div>
              <div className="mt-3 text-3xl font-semibold text-white">{match.featuredPlayers.length}</div>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">高光节点</div>
              <div className="mt-3 text-3xl font-semibold text-white">{match.highlights.length}</div>
            </article>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 backdrop-blur">
              <div className={`grid h-10 w-10 place-items-center rounded-full border ${theme.infoIcon}`}>
                <span className="text-lg">📅</span>
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{isFinished ? "比赛时间" : "开赛时间"}</div>
                <div className="mt-1 text-sm text-slate-100">{formatDateLabel(match.scheduledAt)}</div>
                <div className="mt-1 text-xs text-slate-300">{match.seasonTitle ?? match.tournamentName ?? theme.label}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 backdrop-blur">
              <div className={`grid h-10 w-10 place-items-center rounded-full border ${theme.infoIcon}`}>
                <span className="text-lg">🏁</span>
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{isFinished ? "完赛比分" : "赛制信息"}</div>
                <div className="mt-1 text-sm text-slate-100">{match.format ?? "未设置"}</div>
                <div className="mt-1 text-xs text-slate-300">比分：{match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 backdrop-blur">
              <div className={`grid h-10 w-10 place-items-center rounded-full border ${theme.infoIcon}`}>
                <span className="text-lg">🎧</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{isFinished ? "冠军结果" : "直播 / 解说"}</div>
                <div className="mt-1 break-all text-sm text-slate-100">{isFinished ? (match.championTeamName ?? "冠军待定") : (match.streamUrl ?? "暂未设置")}</div>
                {championPage ? <div className="mt-1 text-xs text-slate-300">已关联冠军海报</div> : <div className="mt-1 text-xs text-slate-300">冠军海报正在筹备中</div>}
              </div>
            </div>
          </div>

          <div className={`my-7 h-px w-full bg-gradient-to-r from-transparent ${theme.divider} to-transparent opacity-80`} />

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className={`rounded-2xl border p-6 backdrop-blur ${theme.primaryCard}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{isFinished ? "完赛结果" : "赛事详情"}</div>
                  <div className="mt-1 text-sm text-slate-100">{match.title}</div>
                </div>
                  <div className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${theme.badgeClass}`}>
                  {isFinished ? "已结束" : currentStatusLabel}
                </div>
              </div>

              {isFinished ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-5 text-center">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-amber-200">冠军战队</div>
                    <div className={`mt-2 text-3xl font-extrabold uppercase tracking-[0.18em] ${theme.trophyText}`}>{match.championTeamName ?? "冠军待定"}</div>
                    <div className="mt-2 text-sm text-slate-300">{(match.scoreHome !== null || match.scoreAway !== null) ? `最终比分 ${match.scoreHome ?? "-"} : ${match.scoreAway ?? "-"}` : "最终比分待补充"}</div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-5 text-center">
                      <div className="text-lg font-extrabold tracking-[0.14em] uppercase text-slate-100">{match.homeTeamName ?? "待定"}</div>
                      <div className="mt-2 text-2xl font-bold text-white">{match.scoreHome ?? "-"}</div>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_0%,#fff7ed,#f59e0b)] text-slate-950 font-extrabold tracking-[0.18em] ring-4 ring-slate-950/60 shadow-lg shadow-amber-500/30">
                      终
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-5 text-center">
                      <div className="text-lg font-extrabold tracking-[0.14em] uppercase text-slate-100">{match.awayTeamName ?? "待定"}</div>
                      <div className="mt-2 text-2xl font-bold text-white">{match.scoreAway ?? "-"}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-5 text-center">
                    <div className="text-lg font-extrabold tracking-[0.14em] uppercase text-slate-100">{match.homeTeamName ?? "待定"}</div>
                    <div className="mt-2 text-xs text-slate-400">{match.homeTeamSlogan ?? "尚未设置队伍口号"}</div>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_0%,#fff7ed,#f59e0b)] text-slate-950 font-extrabold tracking-[0.18em] ring-4 ring-slate-950/60 shadow-lg shadow-amber-500/30">
                    VS
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-5 text-center">
                    <div className="text-lg font-extrabold tracking-[0.14em] uppercase text-slate-100">{match.awayTeamName ?? "待定"}</div>
                    <div className="mt-2 text-xs text-slate-400">{match.awayTeamSlogan ?? "尚未设置队伍口号"}</div>
                  </div>
                </div>
              )}

              <p className="mt-5 text-sm leading-7 text-slate-300">{match.summary ?? "这场比赛暂时还没有补充摘要。"}</p>
            </article>

            <article className={`rounded-2xl border p-6 backdrop-blur ${theme.secondaryCard}`}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{isFinished ? "恭喜组件" : "相关入口"}</div>
              <div className="mt-3 space-y-3 text-sm text-slate-200">
                {isFinished && match.championTeamName ? (
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-amber-200">恭喜</div>
                    <div className={`mt-2 text-xl font-bold ${theme.trophyText}`}>{match.championTeamName} 夺冠</div>
                    <div className="mt-2 text-sm text-slate-300">这场比赛已经结束，现在主入口应该是赛果与恭喜海报。</div>
                  </div>
                ) : null}
                {match.homeTeamId ? (
                  <Link href={teamPath(match.homeTeamId)} className="block rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 transition hover:border-white/20">
                    查看主队：{match.homeTeamName}
                  </Link>
                ) : null}
                {match.awayTeamId ? (
                  <Link href={teamPath(match.awayTeamId)} className="block rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 transition hover:border-white/20">
                    查看客队：{match.awayTeamName}
                  </Link>
                ) : null}
                {championPage ? (
                  <Link href={`/content/${championPage.slug}`} className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.secondaryButton}`}>
                    {isFinished ? "进入恭喜海报" : "查看恭喜海报"}
                  </Link>
                ) : null}
              </div>

              {match.championTeamName ? (
                <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-amber-200">冠军</div>
                  <div className={`mt-2 text-lg font-bold ${theme.trophyText}`}>{match.championTeamName}</div>
                </div>
              ) : null}
            </article>
          </div>

          <div className={`my-7 h-px w-full bg-gradient-to-r from-transparent ${theme.divider} to-transparent opacity-80`} />

          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold uppercase tracking-[0.18em] text-slate-100">参赛队伍</h2>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300/80">{theme.label}</div>
            </div>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <TeamPanel
                title={match.homeTeamName}
                teamId={match.homeTeamId}
                logoUrl={match.homeTeamLogoUrl}
                slogan={match.homeTeamSlogan}
                summary={match.homeTeamSummary}
                coach={match.homeTeamCoach}
                captain={match.homeTeamCaptain}
                members={match.homeTeamMembers}
                cardClass={theme.primaryCard}
                badgeClass={theme.badgeClass}
              />

              <TeamPanel
                title={match.awayTeamName}
                teamId={match.awayTeamId}
                logoUrl={match.awayTeamLogoUrl}
                slogan={match.awayTeamSlogan}
                summary={match.awayTeamSummary}
                coach={match.awayTeamCoach}
                captain={match.awayTeamCaptain}
                members={match.awayTeamMembers}
                cardClass={theme.secondaryCard}
                badgeClass={theme.badgeClass}
              />
            </div>
          </section>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className={`rounded-[28px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>焦点选手</div>
          <div className="mt-4 space-y-3">
            {match.featuredPlayers.length ? (
              match.featuredPlayers.map((player) => (
                <Link key={player.id} href={playerPath(player.id)} className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{player.primaryRole ?? "未分配位置"}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{player.displayName}</div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">这场比赛暂时还没有关联选手。</div>
            )}
          </div>
        </article>

        <article className={`rounded-[28px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>海报与战报</div>
          <div className="mt-4 space-y-3">
            {relatedPages.length ? (
              relatedPages.map((page) => (
                <Link key={page.slug} href={`/content/${page.slug}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{pageTypeLabels[page.pageType] ?? page.pageType}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{page.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{page.excerpt ?? "这篇内容的导语正在整理中，点进去看完整内容。"}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">这场比赛暂时还没有关联海报或战报。</div>
            )}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className={`rounded-[28px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>比赛高光</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">这场比赛最值得记住的瞬间</h2>
          <div className="mt-6 space-y-4">
            {match.highlights.length ? match.highlights.map((highlight, index) => (
              <article key={highlight.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">高光 {index + 1}</div>
                  {highlight.playerName ? <div className="text-sm font-semibold text-slate-200">{highlight.playerName}</div> : null}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">{highlight.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{highlight.description ?? "高光解说正在补充中，精彩瞬间先收在这里。"}</p>
              </article>
            )) : <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">这场比赛还没有录入高光节点。</div>}
          </div>
        </article>

        <article className={`rounded-[28px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>继续浏览</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">顺着比赛继续往下走</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {match.homeTeamId ? (
              <Link href={teamPath(match.homeTeamId)} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">主队</div>
                <div className="mt-2 text-xl font-semibold text-white">{match.homeTeamName}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">去看阵容、战绩和这支队伍的长期记录。</p>
              </Link>
            ) : null}
            {match.awayTeamId ? (
              <Link href={teamPath(match.awayTeamId)} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">客队</div>
                <div className="mt-2 text-xl font-semibold text-white">{match.awayTeamName}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">去看另一边的阵容、故事和队伍主页。</p>
              </Link>
            ) : null}
            {relatedPages[0] ? (
              <Link href={`/content/${relatedPages[0].slug}`} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">内容页</div>
                <div className="mt-2 text-xl font-semibold text-white">{relatedPages[0].title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">继续看海报、快报或战报，把这场比赛补完整。</p>
              </Link>
            ) : null}
            {championPage ? (
              <Link href={`/content/${championPage.slug}`} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">冠军页</div>
                <div className="mt-2 text-xl font-semibold text-white">{championPage.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">比赛结束后，这里就是最该回看的庆祝页。</p>
              </Link>
            ) : null}
          </div>
        </article>
      </section>
    </Shell>
  );
}
