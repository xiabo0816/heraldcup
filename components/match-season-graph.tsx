import Link from "next/link";
import { TeamMark } from "@/components/team-mark";
import type { MatchSeasonGraph, MatchSeasonGraphSeries } from "@/lib/queries";
import { teamPath } from "@/lib/routes";
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

function formatSeriesScore(series: MatchSeasonGraphSeries) {
  const [left, right] = series.participants;
  if (!left || !right) {
    return "待定";
  }

  return `${left.score ?? "-"} : ${right.score ?? "-"}`;
}

function getSeriesSourceHints(series: MatchSeasonGraphSeries) {
  const hints: string[] = [];

  if (series.stageSlug === "gauntlet" && series.roundNumber === 1) {
    hints.push("胜者挑战擂主");
  }

  if (series.stageSlug === "gauntlet" && series.roundNumber === 2) {
    hints.push("A = 擂主");
    hints.push("B = 预选胜者");
  }

  if (series.stageSlug === "semifinal" && series.sequenceNumber === 1) {
    hints.push("胜者进入总决赛席位 A");
  }

  if (series.stageSlug === "semifinal" && series.sequenceNumber === 2) {
    hints.push("胜者进入总决赛席位 B");
  }

  if (series.stageSlug === "final" && series.roundNumber === 2) {
    hints.push("A = 半决赛 1 胜者");
    hints.push("B = 半决赛 2 胜者");
  }

  return hints;
}

function getSeriesResultLabel(series: MatchSeasonGraphSeries) {
  if (series.winnerTeamName) {
    return `胜者 ${series.winnerTeamName}`;
  }

  if (series.status === "LIVE") {
    return "比赛进行中";
  }

  if (series.status === "SCHEDULED") {
    return "胜者待定";
  }

  return formatStatusLabel(series.status);
}

function getLayoutHint(layout: MatchSeasonGraph["layout"]) {
  switch (layout) {
    case "DIRECT_BO3":
      return "A/B 两个槽位直接打总决赛，通常对应 1 号与 2 号种子。";
    case "GAUNTLET":
      return "A 是擂主席位，B/C 先争夺挑战权；总决赛 B 位自动继承预选胜者。";
    case "FINAL_FOUR":
      return "四强默认按 1 对 4、2 对 3 生成半决赛；总决赛 A/B 位分别继承半决赛 1/2 胜者。";
    case "ROUND_ROBIN":
      return "循环赛按两两对阵展示，种子位只负责开局排布，不直接决定晋级线。";
    default:
      return "当前赛程按阶段顺序排列，可结合晋级规则与胜者标识理解整条路线。";
  }
}

function TeamBadge({
  name,
  teamName,
  teamId,
  teamSlug,
  logoUrl,
  slogan,
  seedNumber,
  note,
  active
}: {
  name?: string;
  teamName?: string;
  teamId: string | null;
  teamSlug?: string | null;
  logoUrl?: string | null;
  slogan?: string | null;
  seedNumber?: number | null;
  note?: string | null;
  active?: boolean;
}) {
  const label = name ?? teamName ?? "待定";
  const className = active
    ? "border-white/30 bg-white/14 text-white"
    : "border-white/10 bg-slate-950/50 text-slate-200";

  const content = (
    <>
      <TeamMark name={label} logoUrl={logoUrl ?? null} size="sm" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {seedNumber ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">#{seedNumber}</span> : null}
          {note ? <span className="rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] text-slate-300">{note}</span> : null}
        </div>
        <div className="truncate text-sm font-semibold">{label}</div>
        <div className="truncate text-xs text-slate-400">{slogan ?? teamSlug ?? "社区战队"}</div>
      </div>
    </>
  );

  if (!teamId) {
    return <div className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${className}`}>{content}</div>;
  }

  return (
    <Link href={teamPath(teamId)} className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition hover:border-white/35 hover:text-white ${className}`}>
      {content}
    </Link>
  );
}

function SeriesCard({
  series,
  active
}: {
  series: MatchSeasonGraphSeries;
  active?: boolean;
}) {
  const sourceHints = getSeriesSourceHints(series);

  return (
    <article className={active
      ? "rounded-[24px] border border-amber-300/45 bg-amber-300/10 p-4 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]"
      : "rounded-[24px] border border-white/10 bg-slate-950/45 p-4"
    }>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{series.stageName ?? "系列赛"}</div>
          <Link href={`/matches/${series.slug}`} className="mt-2 block text-lg font-semibold text-white transition hover:text-white/80">
            {series.title}
          </Link>
        </div>
        <div className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
          {series.format ?? `BO${series.bestOf}`}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-4 text-center">
          <div className="text-sm font-semibold text-white">{series.participants[0]?.teamName ?? "待定"}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{series.participants[0]?.score ?? "-"}</div>
        </div>
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{formatStatusLabel(series.status)}</div>
          <div className="mt-2 text-sm font-semibold text-slate-100">{formatSeriesScore(series)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-4 text-center">
          <div className="text-sm font-semibold text-white">{series.participants[1]?.teamName ?? "待定"}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{series.participants[1]?.score ?? "-"}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span>{formatDateLabel(series.scheduledAt)}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200">{getSeriesResultLabel(series)}</span>
        {series.contentCount ? <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{series.contentCount} 条内容</span> : null}
        {sourceHints.map((hint) => (
          <span key={`${series.id}-${hint}`} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-cyan-100">{hint}</span>
        ))}
      </div>

      {series.games.length ? (
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-1">
          {series.games.map((game) => (
            <div key={`${series.id}-game-${game.gameNumber}`} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">第 {game.gameNumber} 局</span>
                <span className="text-xs text-slate-400">{formatStatusLabel(game.status)}</span>
              </div>
              <div className="mt-2 font-semibold text-white">{game.winnerTeamName ?? "胜者待定"}</div>
              <div className="mt-1 text-xs leading-6 text-slate-400">{game.summary ?? "分局详情待补充"}</div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function DirectBo3Graph({ graph, activeMatchSlug }: { graph: MatchSeasonGraph; activeMatchSlug?: string }) {
  const finalSeries = graph.stages[0]?.matches[0] ?? null;
  const [left, right] = graph.participants;

  if (!finalSeries || !left || !right) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center">
      <TeamBadge {...left} active={finalSeries.winnerTeamId === left.teamId} />
      <SeriesCard series={finalSeries} active={finalSeries.slug === activeMatchSlug} />
      <TeamBadge {...right} active={finalSeries.winnerTeamId === right.teamId} />
    </div>
  );
}

function GauntletGraph({ graph, activeMatchSlug }: { graph: MatchSeasonGraph; activeMatchSlug?: string }) {
  const seriesList = graph.stages.flatMap((stage) => stage.matches);
  const qualifier = seriesList.find((series) => series.roundNumber === 1) ?? seriesList[0] ?? null;
  const finalSeries = seriesList.find((series) => series.roundNumber === 2) ?? seriesList[1] ?? null;
  const defender = graph.participants[0] ?? null;

  if (!qualifier || !defender) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_auto_1fr] lg:items-center">
        <SeriesCard series={qualifier} active={qualifier.slug === activeMatchSlug} />
        <div className="hidden justify-center lg:flex">
          <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">胜者上擂</div>
        </div>
        <TeamBadge {...defender} active={Boolean(finalSeries?.winnerTeamId && finalSeries.winnerTeamId === defender.teamId)} />
      </div>
      {finalSeries ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <TeamBadge {...(finalSeries.participants[0]?.teamId === defender.teamId ? finalSeries.participants[1] : finalSeries.participants[0])} />
          <SeriesCard series={finalSeries} active={finalSeries.slug === activeMatchSlug} />
          <TeamBadge {...(finalSeries.participants[0]?.teamId === defender.teamId ? finalSeries.participants[0] : finalSeries.participants[1])} active={Boolean(finalSeries.winnerTeamId)} />
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-400">
          预选赛结束后会自动补出擂主战，当前先锁定挑战者对阵与守擂席位。
        </div>
      )}
    </div>
  );
}

function FinalPlaceholder({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 p-5 text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{title}</div>
      <div className="mt-3 text-lg font-semibold text-white">待定</div>
      <div className="mt-2 text-sm leading-7 text-slate-400">{detail}</div>
    </div>
  );
}

function FinalFourGraph({ graph, activeMatchSlug }: { graph: MatchSeasonGraph; activeMatchSlug?: string }) {
  const semifinalStage = graph.stages.find((stage) => stage.slug === "semifinal") ?? null;
  const finalStage = graph.stages.find((stage) => stage.slug === "final") ?? null;
  const semifinals = semifinalStage?.matches ?? [];
  const finalSeries = finalStage?.matches[0] ?? null;
  const semifinalOne = semifinals.find((series) => (series.sequenceNumber ?? 0) === 1) ?? semifinals[0] ?? null;
  const semifinalTwo = semifinals.find((series) => (series.sequenceNumber ?? 0) === 2) ?? semifinals[1] ?? null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {semifinalOne ? <SeriesCard series={semifinalOne} active={semifinalOne.slug === activeMatchSlug} /> : <FinalPlaceholder title="半决赛 1" detail="等待录入首组四强对阵。" />}
        {semifinalTwo ? <SeriesCard series={semifinalTwo} active={semifinalTwo.slug === activeMatchSlug} /> : <FinalPlaceholder title="半决赛 2" detail="等待录入第二组四强对阵。" />}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">总决赛席位 A</div>
          <div className="mt-2 text-xs text-slate-400">半决赛 1 胜者</div>
          <div className="mt-2 text-lg font-semibold text-white">{finalSeries?.participants[0]?.teamName ?? semifinalOne?.winnerTeamName ?? "半决赛 1 胜者"}</div>
        </div>
        {finalSeries ? (
          <SeriesCard series={finalSeries} active={finalSeries.slug === activeMatchSlug} />
        ) : (
          <FinalPlaceholder title="总决赛" detail="两场半决赛胜者确定后，会自动补出总决赛系列赛。" />
        )}
        <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">总决赛席位 B</div>
          <div className="mt-2 text-xs text-slate-400">半决赛 2 胜者</div>
          <div className="mt-2 text-lg font-semibold text-white">{finalSeries?.participants[1]?.teamName ?? semifinalTwo?.winnerTeamName ?? "半决赛 2 胜者"}</div>
        </div>
      </div>
    </div>
  );
}

function RoundRobinGraph({ graph, activeMatchSlug }: { graph: MatchSeasonGraph; activeMatchSlug?: string }) {
  const teams = graph.participants;
  const teamCount = teams.length;
  const matrix = new Map(graph.stages.flatMap((stage) => stage.matches).map((series) => {
    const key = [...series.participantTeamIds].sort().join(":");
    return [key, series] as const;
  }));

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40">
      <div className="grid" style={{ gridTemplateColumns: `220px repeat(${teamCount}, minmax(0, 1fr))` }}>
        <div className="border-b border-r border-white/10 bg-black/20 px-4 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">循环对阵</div>
        {teams.map((team) => (
          <div key={`${graph.id}-column-${team.teamId}`} className="border-b border-r border-white/10 bg-black/20 px-4 py-4 text-center text-sm font-semibold text-white last:border-r-0">
            {team.teamName}
          </div>
        ))}
        {teams.map((rowTeam) => (
          <>
            <div key={`${graph.id}-row-${rowTeam.teamId}`} className="border-b border-r border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white">
              <div>{rowTeam.teamName}</div>
              <div className="mt-1 text-xs text-slate-400">{rowTeam.wins} 胜 {rowTeam.losses} 负</div>
            </div>
            {teams.map((columnTeam) => {
              const key = [rowTeam.teamId, columnTeam.teamId].sort().join(":");
              const series = matrix.get(key) ?? null;
              const isSelf = rowTeam.teamId === columnTeam.teamId;
              const isWinner = series?.winnerTeamId === rowTeam.teamId;

              return (
                <div key={`${graph.id}-${rowTeam.teamId}-${columnTeam.teamId}`} className={isSelf
                  ? "border-b border-r border-white/10 bg-white/[0.03] last:border-r-0"
                  : "border-b border-r border-white/10 p-3 last:border-r-0"
                }>
                  {isSelf ? null : series ? (
                    <Link href={`/matches/${series.slug}`} className={series.slug === activeMatchSlug
                      ? "block rounded-2xl border border-amber-300/45 bg-amber-300/10 px-3 py-3"
                      : "block rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-3 transition hover:border-white/25"
                    }>
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">BO3</div>
                      <div className="mt-2 text-sm font-semibold text-white">{series.participantTeamNames[0]} vs {series.participantTeamNames[1]}</div>
                      <div className="mt-2 text-sm text-slate-300">{formatSeriesScore(series)}</div>
                      <div className="mt-2 text-xs text-slate-400">{isWinner ? "本行战队胜出" : series.winnerTeamName ? `胜者 ${series.winnerTeamName}` : formatStatusLabel(series.status)}</div>
                    </Link>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">待排</div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

function GenericGraph({ graph, activeMatchSlug }: { graph: MatchSeasonGraph; activeMatchSlug?: string }) {
  return (
    <div className="space-y-5">
      {graph.stages.map((stage) => (
        <section key={stage.id}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-lg font-semibold text-white">{stage.name}</div>
            {stage.advanceRule ? <div className="text-sm text-slate-400">{stage.advanceRule}</div> : null}
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {stage.matches.map((series) => (
              <SeriesCard key={series.id} series={series} active={series.slug === activeMatchSlug} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function MatchSeasonGraphView({
  graph,
  activeMatchSlug
}: {
  graph: MatchSeasonGraph;
  activeMatchSlug?: string;
}) {
  const theme = getTournamentTheme(graph.tournamentKind, graph.tournamentName ?? graph.title);

  return (
    <section className={`rounded-[32px] border p-6 shadow-glow backdrop-blur md:p-8 ${theme.panelBorder} ${theme.panelBackground}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className={`text-xs uppercase tracking-[0.26em] ${theme.accentText}`}>{graph.tournamentName ?? "赛事图"}</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">{graph.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-300">{graph.summary ?? "赛程已经按赛季、阶段与系列赛结构整理，可以直接看完整图。"}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
          <span className={`rounded-full border px-3 py-1.5 ${theme.badgeClass}`}>{graph.statusLabel ?? "赛程已整理"}</span>
          <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1.5">{graph.participants.length} 支队伍</span>
          <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1.5">{graph.layout === "DIRECT_BO3" ? "直连 BO3" : graph.layout === "GAUNTLET" ? "擂台赛" : graph.layout === "FINAL_FOUR" ? "半决赛 / 决赛" : graph.layout === "ROUND_ROBIN" ? "两两 BO3" : "赛程图"}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {graph.participants.map((participant) => (
          <TeamBadge key={`${graph.id}-participant-${participant.teamId}`} {...participant} active={participant.finalRank === 1} />
        ))}
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-slate-300">
        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">种子位说明</div>
        <div className="mt-2">{getLayoutHint(graph.layout)}</div>
      </div>

      <div className="mt-8">
        {graph.layout === "DIRECT_BO3" ? <DirectBo3Graph graph={graph} activeMatchSlug={activeMatchSlug} /> : null}
        {graph.layout === "GAUNTLET" ? <GauntletGraph graph={graph} activeMatchSlug={activeMatchSlug} /> : null}
        {graph.layout === "FINAL_FOUR" ? <FinalFourGraph graph={graph} activeMatchSlug={activeMatchSlug} /> : null}
        {graph.layout === "ROUND_ROBIN" ? <RoundRobinGraph graph={graph} activeMatchSlug={activeMatchSlug} /> : null}
        {graph.layout === "GENERIC" ? <GenericGraph graph={graph} activeMatchSlug={activeMatchSlug} /> : null}
      </div>
    </section>
  );
}
