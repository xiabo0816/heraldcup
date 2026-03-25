"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroChip, type HeroChipData } from "@/components/hero-chip";
import { ClaimPlayerDialog } from "@/components/claim-player-dialog";
import { MyDashboard } from "@/components/my-dashboard";
import { MyOpenDotaPanel } from "@/components/my-opendota-panel";
import { PlayerReviewManager } from "@/components/player-review-manager";
import { PlayerTeamManager } from "@/components/player-team-manager";
import { TeamMark } from "@/components/team-mark";
import { readLocalPlayerBinding, subscribeToLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";
import { playerPath, teamPath } from "@/lib/routes";

type MyPagePlayer = {
  id: string;
  displayName: string;
  slug: string;
  steamId?: string | null;
  ladderScore?: number | null;
  primaryRole: string | null;
  highlightMatchIds: string[];
  championshipCount: number;
  teamName: string;
  teamId: string | null;
  teamSlug: string | null;
  heroCards: HeroChipData[];
};

type MyPageTeam = {
  id: string;
  name: string;
  slug: string;
  slogan: string | null;
  summary: string | null;
  logoUrl: string | null;
  captain: string | null;
  captainPlayerId: string | null;
  championshipCount: number;
  honorScore: number;
  wins: number;
  losses: number;
  draws: number;
  members: Array<{
    id: string;
    displayName: string;
    slug: string;
  }>;
};

type MyPageMatch = {
  id: string;
  slug: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  scoreHome: number | null;
  scoreAway: number | null;
  participantTeamNames: string[];
  participantTeamIds: string[];
  homeTeamName: string;
  homeTeamId: string | null;
  homeTeamSlug: string | null;
  awayTeamName: string;
  awayTeamId: string | null;
  awayTeamSlug: string | null;
};

type MyPageReview = {
  id: string;
  authorPlayerId: string;
  authorPlayerName: string;
  authorPlayerSlug: string;
  targetPlayerId: string;
  targetPlayerName: string;
  targetPlayerSlug: string;
  content: string;
  showOnProfile: boolean;
  createdAt: string;
};

function formatMatchTime(value: Date | string | null) {
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

function sortMatchesByPriority(matches: MyPageMatch[]) {
  const now = Date.now();

  return [...matches].sort((left, right) => {
    const leftTime = left.scheduledAt ? new Date(left.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const rightTime = right.scheduledAt ? new Date(right.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const leftUpcoming = leftTime >= now;
    const rightUpcoming = rightTime >= now;

    if (leftUpcoming !== rightUpcoming) {
      return leftUpcoming ? -1 : 1;
    }

    if (leftUpcoming) {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });
}

function formatMatchLabel(match: MyPageMatch) {
  const names = match.participantTeamNames.length ? match.participantTeamNames : [match.homeTeamName, match.awayTeamName].filter(Boolean);
  return names.length <= 2 ? names.join(" vs ") : names.join(" / ");
}

export function MyPageClient({
  players,
  teams,
  matches,
  reviews
}: {
  players: MyPagePlayer[];
  teams: MyPageTeam[];
  matches: MyPageMatch[];
  reviews: MyPageReview[];
}) {
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);
  const [openDotaPersonaName, setOpenDotaPersonaName] = useState<string | null>(null);

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
    return subscribeToLocalPlayerBinding(setBinding);
  }, []);

  const currentPlayer = binding ? players.find((player) => player.id === binding.playerId || player.slug === binding.playerSlug) ?? null : null;
  const currentTeam = currentPlayer?.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
  const currentPlayerHighlightMatchIds = new Set(currentPlayer?.highlightMatchIds ?? []);
  const relatedMatches = currentPlayer
    ? sortMatchesByPriority(matches.filter((match) => {
        const relatedToCurrentTeam = currentPlayer.teamId
          ? match.participantTeamIds.includes(currentPlayer.teamId)
          : false;

        return relatedToCurrentTeam || currentPlayerHighlightMatchIds.has(match.slug);
      })).slice(0, 6)
    : [];
  const readySteamCount = players.filter((player) => player.steamId).length;
  const anchoredPlayers = players.filter((player) => player.teamId).length;
  const featuredPreviewPlayer = players.find((player) => player.teamId) ?? players[0] ?? null;
  const featuredPreviewTeam = featuredPreviewPlayer?.teamId
    ? teams.find((team) => team.id === featuredPreviewPlayer.teamId) ?? null
    : null;
  const featuredPreviewMatches = featuredPreviewPlayer?.teamId
    ? sortMatchesByPriority(matches.filter((match) => match.participantTeamIds.includes(featuredPreviewPlayer.teamId!))).slice(0, 2)
    : [];
  const visibleCurrentPlayerReviews = currentPlayer ? reviews.filter((review) => review.targetPlayerId === currentPlayer.id && review.showOnProfile) : [];
  const effectiveSteamId = binding?.steamId ?? currentPlayer?.steamId ?? null;

  return (
    <div className="space-y-6">
      {currentPlayer ? (
        <section className="relative overflow-hidden rounded-[36px] border border-emerald-300/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,197,81,0.16),transparent_24%),linear-gradient(135deg,rgba(5,10,20,0.98),rgba(12,23,37,0.94))] p-8 shadow-glow md:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_62%)] lg:block" />
          <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-emerald-200">My Command</div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {currentPlayer.displayName}，你的主页已经切到个人模式。
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
                这里不再是通用入口，而是围绕你的身份、战队和赛程展开的控制台。回站之后，先看到和你最有关的内容。
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-100">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  身份 {currentPlayer.primaryRole ?? "社区选手"}
                </span>
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-emerald-100">
                  {currentTeam ? `效力 ${currentTeam.name}` : "已完成身份认领"}
                </span>
                <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-amber-100">
                  {binding?.steamId ?? currentPlayer.steamId ? "SteamID 已就绪" : "SteamID 尚未填写"}
                </span>
                {effectiveSteamId ? (
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
                    SteamID {effectiveSteamId}
                  </span>
                ) : null}
                {openDotaPersonaName ? (
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">
                    OpenDota 昵称 {openDotaPersonaName}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {currentPlayer.heroCards.length ? currentPlayer.heroCards.slice(0, 6).map((hero) => (
                  <HeroChip key={`${currentPlayer.id}-${hero.label}`} hero={hero} compact className="border-white/15 bg-slate-950/70" />
                )) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">英雄池仍在整理中</span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={playerPath(currentPlayer.id)} className="rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                  进入我的选手页
                </Link>
                {currentTeam ? (
                  <Link href={teamPath(currentTeam.id)} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
                    查看我的战队
                  </Link>
                ) : null}
                <ClaimPlayerDialog
                  players={[{ id: currentPlayer.id, displayName: currentPlayer.displayName, subtitle: currentTeam?.name ?? currentPlayer.primaryRole ?? "社区选手" }]}
                  playerId={currentPlayer.id}
                  triggerLabel="更新 SteamID"
                  triggerClassName="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white"
                  description="如果要补填或更新当前身份的 SteamID，直接在这里重新提交即可。"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <TeamMark name={currentTeam?.name ?? currentPlayer.displayName} logoUrl={currentTeam?.logoUrl} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-[0.24em] text-amber-200">当前身份快照</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{currentPlayer.displayName}</div>
                  <div className="mt-2 text-sm text-slate-300">{currentTeam?.name ?? "暂未关联固定战队"}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {currentTeam?.slogan ?? "你的战队、比赛和荣誉都已经被拉进同一块面板。"}
                  </div>
                  {effectiveSteamId ? (
                    <div className="mt-3 text-sm text-slate-300">SteamID：{effectiveSteamId}</div>
                  ) : null}
                  {openDotaPersonaName ? (
                    <div className="mt-1 text-sm text-slate-400">OpenDota 昵称：{openDotaPersonaName}</div>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">个人荣誉</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{currentPlayer.championshipCount}</div>
                  <p className="mt-2 text-sm text-slate-400">冠次数已同步到主页。</p>
                </article>
                <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">相关赛程</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{relatedMatches.length}</div>
                  <p className="mt-2 text-sm text-slate-400">当前认领选手的社区比赛会优先出现在这里。</p>
                </article>
                <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">身份状态</div>
                  <div className="mt-3 text-lg font-semibold text-white">{binding?.steamId ?? currentPlayer.steamId ? "完整" : "待补充"}</div>
                  <p className="mt-2 text-sm text-slate-400">{binding?.steamId ?? currentPlayer.steamId ? "报告可直接更新。" : "可继续补充 SteamID。"}</p>
                </article>
              </div>

              {relatedMatches.length ? (
                <div className="mt-6 space-y-3">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">当前选手相关社区比赛</div>
                  {relatedMatches.map((match) => (
                    <Link key={match.id} href={`/matches/${match.slug}`} className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3 transition hover:border-emerald-300/35">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{match.title}</div>
                        <div className="mt-1 text-sm text-slate-400">{formatMatchLabel(match)}</div>
                      </div>
                      <div className="text-right text-xs uppercase tracking-[0.18em] text-emerald-200">
                        <div>{match.status}</div>
                        <div className="mt-1 normal-case tracking-normal text-slate-400">{formatMatchTime(match.scheduledAt)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(79,209,197,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,197,81,0.14),transparent_24%),linear-gradient(180deg,rgba(3,7,18,0.98),rgba(12,18,31,0.94))] p-8 shadow-glow md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-cyan-200">My Portal</div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">先认领身份，再让这页真正为你服务。</h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">
                现在的“我的”页还是公共形态。认领之后，它会切换成围绕你本人展开的主页，把你的战队、比赛和荣誉放到前排。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950">
                  顶部“认领”按钮可直接弹窗绑定
                </div>
                <Link href="/players" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
                  浏览选手名册
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">可认领身份</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{players.length}</div>
                  <p className="mt-2 text-sm text-slate-400">名选手可直接作为默认主页。</p>
                </article>
                <article className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">战队归属已知</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{anchoredPlayers}</div>
                  <p className="mt-2 text-sm text-slate-400">名选手认领后能直接挂到战队视角。</p>
                </article>
                <article className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">身份资料较完整</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{readySteamCount}</div>
                  <p className="mt-2 text-sm text-slate-400">名选手已经有更完整的识别信息。</p>
                </article>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.24em] text-amber-200">认领后会变成什么</div>
              {featuredPreviewPlayer ? (
                <div className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/50 p-5">
                  <div className="flex items-start gap-4">
                    <TeamMark name={featuredPreviewTeam?.name ?? featuredPreviewPlayer.displayName} logoUrl={featuredPreviewTeam?.logoUrl} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-semibold text-white">{featuredPreviewPlayer.displayName} 的个人控制台</div>
                      <div className="mt-2 text-sm text-slate-300">{featuredPreviewTeam ? `${featuredPreviewTeam.name} / ${featuredPreviewPlayer.primaryRole ?? "社区选手"}` : featuredPreviewPlayer.primaryRole ?? "社区选手"}</div>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        认领成功后，你会先看到自己的身份摘要、所属战队和最近赛程，而不是一整页通用介绍。
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {featuredPreviewPlayer.heroCards.length ? featuredPreviewPlayer.heroCards.slice(0, 5).map((hero) => (
                      <HeroChip key={`${featuredPreviewPlayer.id}-${hero.label}`} hero={hero} compact />
                    )) : (
                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">英雄池会显示在这里</span>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3">
                <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">1. 固定身份</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">先进入选手详情页点击认领按钮，再在弹窗里输入 SteamID 完成绑定。</p>
                </article>
                <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">2. 拉起战队视角</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">绑定成功后，个人页会自动从选手库里拉起你的社区比赛、战队和荣誉信息。</p>
                </article>
                <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">3. 补全战绩入口</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">认领时填入 SteamID 后，个人页会直接展示 OpenDota 最近比赛和核心数据。</p>
                </article>
              </div>

              {featuredPreviewMatches.length ? (
                <div className="mt-5 rounded-[24px] border border-cyan-300/15 bg-cyan-300/8 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">认领后优先关注</div>
                  <div className="mt-3 space-y-3">
                    {featuredPreviewMatches.map((match) => (
                      <div key={match.id} className="rounded-[18px] border border-white/10 bg-slate-950/50 px-4 py-3">
                        <div className="text-sm font-semibold text-white">{match.title}</div>
                        <div className="mt-1 text-sm text-slate-400">{match.homeTeamName} vs {match.awayTeamName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {currentPlayer ? (
        <MyOpenDotaPanel
          steamId={effectiveSteamId}
          playerName={currentPlayer.displayName}
          onProfileLoaded={(profile) => setOpenDotaPersonaName(profile.personaName)}
        />
      ) : null}

      {currentPlayer ? (
        <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">个人首页展示</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">当前公开在你主页上的评价</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">这些内容会同步出现在你的选手详情页。是否公开，由你在下方的评价管理面板自行切换。</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">公开中 {visibleCurrentPlayerReviews.length} 条</div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {visibleCurrentPlayerReviews.length ? visibleCurrentPlayerReviews.map((review) => (
              <article key={review.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">来自 {review.authorPlayerName}</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{review.content}</p>
              </article>
            )) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400">你还没有公开任何互评内容，下面的管理面板里可以随时切换展示状态。</div>
            )}
          </div>
        </section>
      ) : null}

      {currentPlayer ? <PlayerTeamManager currentPlayer={currentPlayer} players={players} teams={teams} /> : null}

      {currentPlayer ? <PlayerReviewManager currentPlayer={currentPlayer} players={players} reviews={reviews} /> : null}

      <MyDashboard players={players} teams={teams} matches={matches} />
    </div>
  );
}