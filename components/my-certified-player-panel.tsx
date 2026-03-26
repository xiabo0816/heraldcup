"use client";

import Link from "next/link";
import { HeroChip } from "@/components/hero-chip";
import { PlayerReviewManager } from "@/components/player-review-manager";
import { PlayerTeamManager } from "@/components/player-team-manager";
import { TeamMark } from "@/components/team-mark";
import { formatDateLabel, formatMatchLabel } from "@/lib/my-page-utils";
import type { MyPageMatch, MyPagePlayer, MyPageReview, MyPageTeam, MyPageVisibleReview } from "@/lib/my-page-types";
import { playerPath, teamPath } from "@/lib/routes";

export function MyCertifiedPlayerPanel({
  currentPlayer,
  currentTeam,
  players,
  teams,
  reviews,
  relatedMatches,
  visibleCurrentPlayerReviews,
  effectiveSteamId,
  openDotaPersonaName
}: {
  currentPlayer: MyPagePlayer;
  currentTeam: MyPageTeam | null;
  players: MyPagePlayer[];
  teams: MyPageTeam[];
  reviews: MyPageReview[];
  relatedMatches: MyPageMatch[];
  visibleCurrentPlayerReviews: MyPageVisibleReview[];
  effectiveSteamId: string | null;
  openDotaPersonaName: string | null;
}) {
  return (
    <>
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-300/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,197,81,0.16),transparent_24%),linear-gradient(135deg,rgba(5,10,20,0.98),rgba(12,23,37,0.94))] p-8 shadow-glow md:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_62%)] lg:block" />
        <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-emerald-200">Certified Player</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">{currentPlayer.displayName}，你现在拿到的是正式选手视角。</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">这里的战队、赛程、互评和 OpenDota 都已经围绕正式认证身份聚合，不再是临时认领态。</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-100">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">身份 {currentPlayer.primaryRole ?? "社区选手"}</span>
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-emerald-100">{currentTeam ? `效力 ${currentTeam.name}` : "已认证选手"}</span>
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-amber-100">{effectiveSteamId ? "Steam 身份已就绪" : "Steam 身份待补充"}</span>
              {effectiveSteamId ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">SteamID {effectiveSteamId}</span> : null}
              {openDotaPersonaName ? <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sky-100">OpenDota 昵称 {openDotaPersonaName}</span> : null}
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
              {currentTeam ? <Link href={teamPath(currentTeam.id)} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">查看我的战队</Link> : null}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <TeamMark name={currentTeam?.name ?? currentPlayer.displayName} logoUrl={currentTeam?.logoUrl} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-[0.24em] text-amber-200">当前身份快照</div>
                <div className="mt-2 text-2xl font-semibold text-white">{currentPlayer.displayName}</div>
                <div className="mt-2 text-sm text-slate-300">{currentTeam?.name ?? "暂未关联固定战队"}</div>
                <div className="mt-1 text-sm text-slate-400">{currentTeam?.slogan ?? "这套身份已经通过后台审核，权限来源不再依赖浏览器本地缓存。"}</div>
                {effectiveSteamId ? <div className="mt-3 text-sm text-slate-300">SteamID：{effectiveSteamId}</div> : null}
                {openDotaPersonaName ? <div className="mt-1 text-sm text-slate-400">OpenDota 昵称：{openDotaPersonaName}</div> : null}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">个人荣誉</div>
                <div className="mt-3 text-3xl font-semibold text-white">{currentPlayer.championshipCount}</div>
                <p className="mt-2 text-sm text-slate-400">冠军次数已经同步到选手主页。</p>
              </article>
              <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">相关赛程</div>
                <div className="mt-3 text-3xl font-semibold text-white">{relatedMatches.length}</div>
                <p className="mt-2 text-sm text-slate-400">当前战队与代表比赛会优先聚合在这里。</p>
              </article>
              <article className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">认证状态</div>
                <div className="mt-3 text-lg font-semibold text-white">已通过</div>
                <p className="mt-2 text-sm text-slate-400">账号、Steam 和选手归属已经收敛为一套正式身份。</p>
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
                      <div className="mt-1 normal-case tracking-normal text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

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

      <PlayerTeamManager currentPlayer={currentPlayer} players={players} teams={teams} />
      <PlayerReviewManager currentPlayer={currentPlayer} players={players} reviews={reviews} />
    </>
  );
}