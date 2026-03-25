"use client";

import Link from "next/link";
import { useState } from "react";
import { teamPath } from "@/lib/routes";
import { getTournamentTheme } from "@/lib/tournament-theme";

type MatchHubItem = {
  id: string;
  slug: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  format: string | null;
  summary: string | null;
  homeTeamName: string;
  homeTeamId: string | null;
  awayTeamName: string;
  awayTeamId: string | null;
  participantTeamNames: string[];
  participantTeamIds?: string[];
  seasonTitle: string | null;
  tournamentName: string | null;
  tournamentKind: string | null;
  topicTitle: string | null;
  topicSlug: string | null;
  scoreHome: number | null;
  scoreAway: number | null;
  championTeamName: string | null;
  championTeamId: string | null;
  contentCount: number;
};

type MatchHubProps = {
  matches: MatchHubItem[];
};

type FilterKey = "ALL" | "PIONEER" | "LEGEND" | "GUANJUE";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "全部完赛" },
  { key: "PIONEER", label: "先锋杯" },
  { key: "LEGEND", label: "传奇杯" },
  { key: "GUANJUE", label: "冠绝杯" }
];

const matchStatusLabels: Record<string, string> = {
  DRAFT: "筹备中",
  SCHEDULED: "即将开打",
  LIVE: "正在进行",
  ONGOING: "正在进行",
  FINISHED: "已完赛",
  ARCHIVED: "已归档",
  CANCELLED: "已取消"
};

const matchStatusPriority: Record<string, number> = {
  LIVE: 0,
  ONGOING: 0,
  SCHEDULED: 1,
  DRAFT: 2,
  FINISHED: 3,
  ARCHIVED: 3,
  CANCELLED: 4
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

function getTimestamp(value: Date | string | null) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function resolveFilterKey(match: MatchHubItem): FilterKey {
  const theme = getTournamentTheme(match.tournamentKind, match.tournamentName ?? match.title);
  return theme.kind === "PIONEER" || theme.kind === "LEGEND" || theme.kind === "GUANJUE" ? theme.kind : "ALL";
}

function resolveTeamLinks(match: MatchHubItem) {
  const names = match.participantTeamNames.length ? match.participantTeamNames : [match.homeTeamName, match.awayTeamName];

  return names.map((teamName, index) => {
    const teamId = match.participantTeamIds?.[index]
      ?? (teamName === match.homeTeamName ? match.homeTeamId : teamName === match.awayTeamName ? match.awayTeamId : null);
    return { teamName, teamId };
  });
}

function formatParticipantLabel(match: MatchHubItem) {
  const names = match.participantTeamNames.length ? match.participantTeamNames : [match.homeTeamName, match.awayTeamName];
  return names.filter(Boolean).join(names.length > 2 ? " / " : " vs ");
}

function getScoreCenterLabel(status: string) {
  if (status === "FINISHED" || status === "ARCHIVED") {
    return "FT";
  }

  if (status === "LIVE" || status === "ONGOING") {
    return "LIVE";
  }

  if (status === "SCHEDULED") {
    return "VS";
  }

  if (status === "CANCELLED") {
    return "取消";
  }

  return "待定";
}

function getSummaryFallback(match: MatchHubItem) {
  if (match.status === "FINISHED" || match.status === "ARCHIVED") {
    return "比赛已经完结，比分和冠军信息已归档，可以继续打开比赛页、战报或社区内容追完整条赛后线索。";
  }

  if (match.status === "LIVE" || match.status === "ONGOING") {
    return "系列赛正在进行中，打开比赛页可以继续追比分、分局与阶段信息。";
  }

  if (match.status === "SCHEDULED") {
    return "系列赛已经排上赛程，当前可先确认对阵、所属赛季与相关话题，等开打后会继续更新比分与内容。";
  }

  if (match.status === "CANCELLED") {
    return "本场比赛当前已取消，保留条目用于追踪赛事安排与后续调整。";
  }

  return "系列赛仍在筹备中，当前先保留赛事位，后续会继续补充时间、对阵和内容线索。";
}

function getFinishedCardClasses(filterKey: FilterKey) {
  switch (filterKey) {
    case "PIONEER":
      return {
        shell: "border-emerald-400/40 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(6,78,59,0.22))] shadow-[0_24px_80px_-40px_rgba(16,185,129,0.55)]",
        tag: "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
        accent: "text-sky-300",
        button: "border-emerald-400/40 bg-emerald-400/5 text-emerald-100 hover:border-emerald-300/60 hover:bg-emerald-400/10"
      };
    case "LEGEND":
      return {
        shell: "border-violet-400/40 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(88,28,135,0.2))] shadow-[0_24px_80px_-40px_rgba(139,92,246,0.55)]",
        tag: "border-violet-400/60 bg-violet-400/10 text-violet-200",
        accent: "text-amber-300",
        button: "border-violet-400/40 bg-violet-400/5 text-violet-100 hover:border-violet-300/60 hover:bg-violet-400/10"
      };
    case "GUANJUE":
      return {
        shell: "border-rose-400/40 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(127,29,29,0.2))] shadow-[0_24px_80px_-40px_rgba(244,63,94,0.55)]",
        tag: "border-rose-400/60 bg-rose-400/10 text-rose-200",
        accent: "text-amber-300",
        button: "border-rose-400/40 bg-rose-400/5 text-rose-100 hover:border-rose-300/60 hover:bg-rose-400/10"
      };
    default:
      return {
        shell: "border-slate-700 bg-slate-900/50 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.8)]",
        tag: "border-slate-700 bg-slate-900/60 text-slate-300",
        accent: "text-slate-300",
        button: "border-slate-700 bg-slate-900/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900/60"
      };
  }
}

export function MatchesHub({ matches }: MatchHubProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const sortedMatches = [...matches].sort((left, right) => {
    const leftPriority = matchStatusPriority[left.status] ?? 99;
    const rightPriority = matchStatusPriority[right.status] ?? 99;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    const leftTime = getTimestamp(left.scheduledAt);
    const rightTime = getTimestamp(right.scheduledAt);

    if (leftPriority <= 2) {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });
  const visibleMatches = activeFilter === "ALL"
    ? sortedMatches
    : sortedMatches.filter((match) => resolveFilterKey(match) === activeFilter);

  return (
    <>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={filter.key === activeFilter
                  ? "rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  : "rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          <Link href="/content" className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white">
            去看战报与专题
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {visibleMatches.length ? visibleMatches.map((match) => {
            const filterKey = resolveFilterKey(match);
            const styles = getFinishedCardClasses(filterKey);

            return (
              <article key={match.id} className={`rounded-[30px] border p-5 md:p-6 ${styles.shell}`}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                      <span className={`rounded-full border px-3 py-1 ${styles.tag}`}>
                        {match.seasonTitle ?? match.tournamentName ?? "社区赛事"}
                      </span>
                      <span>{formatDateLabel(match.scheduledAt)}</span>
                      <span className="text-slate-600">/</span>
                      <span>{matchStatusLabels[match.status] ?? match.status}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
                      <Link href={`/matches/${match.slug}`} className="transition hover:text-white/80">
                        {match.title}
                      </Link>
                    </h3>

                    <div className="mt-3 text-sm text-slate-300">{formatParticipantLabel(match)}</div>

                    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                      <div className="rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4 md:col-span-2">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">参赛队伍</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {resolveTeamLinks(match).map((team) => team.teamId ? (
                            <Link key={`${match.slug}-${team.teamName}`} href={teamPath(team.teamId)} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/25 hover:text-white">
                              {team.teamName}
                            </Link>
                          ) : (
                            <span key={`${match.slug}-${team.teamName}`} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-sm text-slate-200">
                              {team.teamName}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/55 px-5 py-4">
                        <span className="text-3xl font-semibold text-white">{match.scoreHome ?? "-"}</span>
                        <span className="text-sm uppercase tracking-[0.3em] text-slate-500">{getScoreCenterLabel(match.status)}</span>
                        <span className="text-3xl font-semibold text-white">{match.scoreAway ?? "-"}</span>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-8 text-slate-300">
                      {match.summary ?? getSummaryFallback(match)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-sm">
                      {match.championTeamName ? (
                        match.championTeamId ? (
                          <Link href={teamPath(match.championTeamId)} className={`rounded-full border px-3 py-1.5 font-semibold transition ${styles.button}`}>
                            冠军 · {match.championTeamName}
                          </Link>
                        ) : (
                          <span className={`rounded-full border px-3 py-1.5 font-semibold ${styles.button}`}>
                            冠军 · {match.championTeamName}
                          </span>
                        )
                      ) : null}

                      {match.topicSlug ? (
                        <Link href={`/community/topics/${match.topicSlug}`} className={`rounded-full border px-3 py-1.5 transition ${styles.button}`}>
                          #{match.topicTitle}
                        </Link>
                      ) : null}

                      <span className="rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-slate-300">
                        {match.contentCount} 条相关内容
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 lg:w-[220px]">
                    <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">赛事主题</div>
                      <div className={`mt-3 text-lg font-semibold ${styles.accent}`}>
                        {filterKey === "ALL" ? "社区赛事" : FILTERS.find((filter) => filter.key === filterKey)?.label}
                      </div>
                      <div className="mt-2 text-sm text-slate-400">{match.format ?? "赛事记录"}</div>
                    </div>

                    <Link href={`/matches/${match.slug}`} className={`rounded-full border px-4 py-2.5 text-center text-sm font-semibold transition ${styles.button}`}>
                      查看比赛页
                    </Link>
                    <Link href="/content" className="rounded-full border border-slate-700 bg-slate-900/40 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
                      查看内容流
                    </Link>
                  </div>
                </div>
              </article>
            );
          }) : (
            <div className="rounded-[30px] border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm leading-7 text-slate-400">
              当前筛选下还没有可展示的比赛。
            </div>
          )}
        </div>
      </section>
    </>
  );
}