import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchSeasonGraphView } from "@/components/match-season-graph";
import { PlayerAvatar } from "@/components/player-avatar";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/team-mark";
import { getMatchDetailBySlug } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";
import { getTournamentTheme } from "@/lib/tournament-theme";

const pageTypeLabels: Record<string, string> = {
  poster: "开赛海报",
  champion: "冠军海报",
  news: "快报",
  recap: "战报",
  custom: "内容页"
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

function formatStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "筹备中";
    case "SCHEDULED":
      return "待开赛";
    case "LIVE":
      return "进行中";
    case "FINISHED":
      return "已完赛";
    case "ARCHIVED":
      return "已归档";
    default:
      return status;
  }
}

function formatParticipantLabel(names: string[]) {
  if (names.length <= 2) {
    return names.join(" vs ");
  }

  return names.join(" / ");
}

function getMatchSourceHints(match: {
  stageAdvanceRule: string | null;
  stageType: string | null;
  roundNumber: number | null;
  sequenceNumber: number | null;
}) {
  const hints: string[] = [];

  if (match.stageType === "BRACKET" && match.roundNumber === 1 && match.sequenceNumber === 1) {
    hints.push("胜者进入总决赛席位 A");
  }

  if (match.stageType === "BRACKET" && match.roundNumber === 1 && match.sequenceNumber === 2) {
    hints.push("胜者进入总决赛席位 B");
  }

  if (match.roundNumber === 2) {
    hints.push("本场为晋级线终点对决");
  }

  if (match.stageAdvanceRule) {
    hints.push(match.stageAdvanceRule);
  }

  return [...new Set(hints)];
}

function getSeriesStats(input: {
  bestOf: number;
  games: Array<{ status: string }>;
  participants: Array<{ score: number | null; isWinner: boolean }>;
}) {
  const targetWins = Math.max(1, Math.ceil(input.bestOf / 2));
  const finishedGames = input.games.filter((game) => game.status === "FINISHED").length;
  const leadingParticipant = [...input.participants]
    .sort((left, right) => (right.score ?? -1) - (left.score ?? -1))[0] ?? null;

  return {
    targetWins,
    finishedGames,
    remainingGames: Math.max(input.bestOf - finishedGames, 0),
    leadingWins: leadingParticipant?.score ?? 0,
    hasWinner: input.participants.some((participant) => participant.isWinner)
  };
}

function TeamRosterCard({
  participant,
  highlight
}: {
  participant: {
    teamId: string | null;
    teamName: string;
    slogan: string | null;
    logoUrl: string | null;
    summary: string | null;
    coach: string | null;
    captain: string | null;
    seedNumber: number | null;
    note: string | null;
    score: number | null;
    rank: number | null;
    isWinner: boolean;
    isAdvanced: boolean;
    isEliminated: boolean;
    members: Array<{
      id: string;
      displayName: string;
      slug: string;
      primaryRole: string | null;
      avatarUrl: string | null;
    }>;
  };
  highlight?: boolean;
}) {
  const shellClass = highlight
    ? "border-amber-300/35 bg-amber-300/10"
    : "border-white/10 bg-slate-950/45";

  return (
    <article className={`rounded-[28px] border p-5 ${shellClass}`}>
      <div className="flex items-start gap-4">
        <TeamMark name={participant.teamName} logoUrl={participant.logoUrl} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {participant.seedNumber ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300">#{participant.seedNumber}</span> : null}
                {participant.note ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-slate-300">{participant.note}</span> : null}
                {participant.isWinner ? <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[11px] text-emerald-100">系列赛胜者</span> : null}
                {participant.isAdvanced ? <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[11px] text-cyan-100">已晋级</span> : null}
                {participant.isEliminated ? <span className="rounded-full border border-rose-300/30 bg-rose-300/10 px-2 py-1 text-[11px] text-rose-100">已淘汰</span> : null}
              </div>
              <div className="text-xl font-semibold text-white">{participant.teamName}</div>
              <div className="mt-1 text-sm text-slate-400">{participant.slogan ?? "社区战队"}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-white">{participant.score ?? "-"}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                {participant.rank ? `排名 ${participant.rank}` : participant.isWinner ? "胜者" : "系列赛进行中"}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{participant.summary ?? "队伍简介暂未补充，先从当前系列赛与阵容信息认识他们。"}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">教练：{participant.coach ?? "未设置"}</div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">队长：{participant.captain ?? "未设置"}</div>
          </div>
          {participant.teamId ? (
            <Link href={teamPath(participant.teamId)} className="mt-4 inline-flex text-sm text-slate-300 transition hover:text-white">
              进入队伍主页
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {participant.members.length ? participant.members.map((member) => (
          <Link key={member.id} href={playerPath(member.id)} className="rounded-2xl border border-white/10 bg-black/20 p-3 transition hover:border-white/20">
            <div className="flex items-center gap-3">
              <PlayerAvatar src={member.avatarUrl} alt={member.displayName} size="sm" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{member.displayName}</div>
                <div className="text-xs text-slate-400">{member.primaryRole ?? "未分配位置"}</div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-slate-400">成员名单暂未公开。</div>
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
  const participants = match.participants ?? [];
  const sourceHints = getMatchSourceHints(match);
  const seriesStats = getSeriesStats({
    bestOf: match.bestOf,
    games: match.games,
    participants
  });

  return (
    <Shell>
      <section className={`relative overflow-hidden rounded-[36px] border p-8 shadow-glow ${theme.pageBackground} ${theme.panelBorder}`}>
        <div className={`pointer-events-none absolute -inset-[24%] opacity-90 ${theme.spotlightGlow}`} />
        <div className="relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-4xl">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] backdrop-blur ${theme.badgeClass}`}>
                <span>{match.seasonTitle ?? match.tournamentName ?? "赛事系列"}</span>
                {match.stageName ? <span className="text-slate-300/70">/ {match.stageName}</span> : null}
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{match.title}</h1>
              <p className="mt-4 text-sm leading-8 text-slate-300 md:text-base">
                {formatParticipantLabel(participants.map((participant) => participant.teamName))} · {formatStatusLabel(match.status)} · {formatDateLabel(match.scheduledAt ?? null)}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">{match.summary ?? "这场系列赛已经按赛程图结构整理好，可以继续看阶段、分局和所属赛季全图。"}</p>
              {sourceHints.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {sourceHints.map((hint) => (
                    <span key={`${match.id}-${hint}`} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100">
                      {hint}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 md:min-w-[240px]">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">系列赛状态</div>
                <div className="mt-3 text-2xl font-semibold text-white">{formatStatusLabel(match.status)}</div>
                <div className="mt-2 text-sm text-slate-400">{match.format ?? `BO${match.bestOf}`}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">冠军 / 当前领先</div>
                <div className="mt-3 text-2xl font-semibold text-white">{match.championTeamName ?? "待定"}</div>
                <div className="mt-2 text-sm text-slate-400">总比分 {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">系列赛进度</div>
                <div className="mt-3 text-2xl font-semibold text-white">{seriesStats.finishedGames} / {match.bestOf}</div>
                <div className="mt-2 text-sm text-slate-400">先拿 {seriesStats.targetWins} 分赢下系列赛，剩余 {seriesStats.remainingGames} 局窗口。</div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">阶段</div>
              <div className="mt-3 text-lg font-semibold text-white">{match.stageName ?? "未分阶段"}</div>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">分局数</div>
              <div className="mt-3 text-3xl font-semibold text-white">{match.games.length}</div>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">内容页</div>
              <div className="mt-3 text-3xl font-semibold text-white">{match.contentPages.length}</div>
            </article>
            <article className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">焦点选手</div>
              <div className="mt-3 text-3xl font-semibold text-white">{match.featuredPlayers.length}</div>
            </article>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className={`rounded-[32px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>当前系列赛</div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/50 px-5 py-6 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {participants[0]?.seedNumber ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-slate-300">#{participants[0].seedNumber}</span> : null}
                {participants[0]?.note ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-slate-300">{participants[0].note}</span> : null}
                {participants[0]?.isWinner ? <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[11px] text-emerald-100">胜出</span> : null}
              </div>
              <div className="mt-3 text-xl font-semibold text-white">{participants[0]?.teamName ?? "待定"}</div>
              <div className="mt-2 text-5xl font-semibold text-white">{participants[0]?.score ?? "-"}</div>
            </div>
            <div className="grid gap-3 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_0%,#fff7ed,#f59e0b)] text-sm font-extrabold tracking-[0.22em] text-slate-950">
                BO{match.bestOf}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">系列赛状态</div>
                <div className="mt-1 font-semibold text-white">{match.championTeamName ?? (seriesStats.hasWinner ? "已决出胜者" : "胜者待定")}</div>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/50 px-5 py-6 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {participants[1]?.seedNumber ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-slate-300">#{participants[1].seedNumber}</span> : null}
                {participants[1]?.note ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-slate-300">{participants[1].note}</span> : null}
                {participants[1]?.isWinner ? <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[11px] text-emerald-100">胜出</span> : null}
              </div>
              <div className="mt-3 text-xl font-semibold text-white">{participants[1]?.teamName ?? "待定"}</div>
              <div className="mt-2 text-5xl font-semibold text-white">{participants[1]?.score ?? "-"}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">已完成分局</div>
              <div className="mt-2 text-3xl font-semibold text-white">{seriesStats.finishedGames}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">夺胜门槛</div>
              <div className="mt-2 text-3xl font-semibold text-white">{seriesStats.targetWins}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">剩余窗口</div>
              <div className="mt-2 text-3xl font-semibold text-white">{seriesStats.remainingGames}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {match.games.length ? match.games.map((game) => (
              <article key={`${match.id}-game-${game.gameNumber}`} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">第 {game.gameNumber} 局</div>
                  <div className="text-xs text-slate-400">{formatStatusLabel(game.status)}</div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-lg font-semibold text-white">{game.winnerTeamName ?? "胜者待定"}</div>
                  {game.winnerTeamName ? <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-100">本局拿下</span> : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-400">{game.summary ?? "分局说明待补充"}</p>
              </article>
            )) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 p-5 text-sm text-slate-400">还没有分局数据。</div>
            )}
          </div>
        </article>

        <article className={`rounded-[32px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>继续浏览</div>
          <div className="mt-4 space-y-3">
            {match.topic ? (
              <Link href={`/community/topics/${match.topic.slug}`} className="block rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-4 transition hover:border-cyan-300/35">
                <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">所属话题</div>
                <div className="mt-2 text-xl font-semibold text-white">#{match.topic.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{match.topic.description ?? "回到话题页继续看同一条主线下的内容和讨论。"}</p>
              </Link>
            ) : null}
            {championPage ? (
              <Link href={`/content/${championPage.slug}`} className="block rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-4 transition hover:border-amber-300/35">
                <div className="text-xs uppercase tracking-[0.18em] text-amber-100">冠军页</div>
                <div className="mt-2 text-xl font-semibold text-white">{championPage.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{championPage.excerpt ?? "比赛结束后的庆祝内容会收在这里。"}</p>
              </Link>
            ) : null}
            <Link href="/matches" className="block rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">返回赛程</div>
              <div className="mt-2 text-xl font-semibold text-white">查看整季赛程图</div>
              <p className="mt-2 text-sm leading-7 text-slate-400">从当前系列赛退回赛季全图，继续看后续对阵与阶段结构。</p>
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        {participants.map((participant) => (
          <TeamRosterCard key={`${match.id}-${participant.teamId ?? participant.teamName}`} participant={participant} highlight={participant.isWinner} />
        ))}
      </section>

      {match.seasonGraph ? (
        <section className="mt-6">
          <MatchSeasonGraphView graph={match.seasonGraph} activeMatchSlug={match.slug} />
        </section>
      ) : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className={`rounded-[32px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>海报与战报</div>
          <div className="mt-4 space-y-3">
            {relatedPages.length ? relatedPages.map((page) => (
              <Link key={page.slug} href={`/content/${page.slug}`} className="block rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{pageTypeLabels[page.pageType ?? "custom"] ?? page.pageType ?? "内容页"}</div>
                <div className="mt-2 text-lg font-semibold text-white">{page.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-400">{page.excerpt ?? "点开补完整个系列赛的内容链路。"}</p>
              </Link>
            )) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">当前还没有关联内容页。</div>
            )}
          </div>
        </article>

        <article className={`rounded-[32px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}>
          <div className={`text-xs uppercase tracking-[0.24em] ${theme.accentText}`}>焦点选手与高光</div>
          <div className="mt-4 space-y-3">
            {match.featuredPlayers.map((player) => (
              <Link key={player.id} href={playerPath(player.id)} className="block rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{player.primaryRole ?? "未分配位置"}</div>
                <div className="mt-2 text-lg font-semibold text-white">{player.displayName}</div>
              </Link>
            ))}
            {match.highlights.map((highlight) => (
              <article key={highlight.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-lg font-semibold text-white">{highlight.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-400">{highlight.description ?? "高光说明待补充"}</p>
              </article>
            ))}
            {!match.featuredPlayers.length && !match.highlights.length ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">当前还没有公开焦点选手或高光记录。</div>
            ) : null}
          </div>
        </article>
      </section>
    </Shell>
  );
}