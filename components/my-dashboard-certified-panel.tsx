"use client";

import Link from "next/link";
import { HeroChip } from "@/components/hero-chip";
import { TeamMark } from "@/components/team-mark";
import { formatDateLabel, formatMatchLabel } from "@/lib/my-page-utils";
import type { IdentitySnapshot } from "@/lib/identity";
import type { MyPageMatch, MyPagePlayer, MyPageTeam } from "@/lib/my-page-types";
import { playerPath, teamPath } from "@/lib/routes";

export function MyDashboardCertifiedPanel({
  identity,
  currentPlayer,
  currentTeam,
  relatedMatches
}: {
  identity: IdentitySnapshot;
  currentPlayer: MyPagePlayer;
  currentTeam: MyPageTeam | null;
  relatedMatches: MyPageMatch[];
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">个人控制台</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">{currentPlayer.displayName} 的专属主页</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            现在这页已经不再承担说明功能，而是优先承接你的身份信息、战队概况和最近赛程。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={playerPath(currentPlayer.id)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent-cyan/40 hover:text-white">
            选手档案
          </Link>
          <Link href="#binding-panel" className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-300/35 hover:text-white">
            管理身份
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的身份</div>
          <div className="mt-3 text-2xl font-semibold text-white">{currentPlayer.primaryRole ?? "社区选手"}</div>
          <div className="mt-2 text-sm text-slate-300">SteamID：{identity.binding?.steamId ?? currentPlayer.steamId ?? "尚未绑定"}</div>
          <div className="mt-2 text-sm text-slate-300">个人荣誉：{currentPlayer.championshipCount} 冠</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentPlayer.heroCards.length ? currentPlayer.heroCards.slice(0, 6).map((hero) => (
              <HeroChip key={`${currentPlayer.slug}-${hero.label}`} hero={hero} compact />
            )) : <span className="text-sm text-slate-500">暂未维护英雄池</span>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">身份完整度</div>
            <div className="mt-3 text-3xl font-semibold text-white">{identity.binding?.steamId ?? currentPlayer.steamId ? "100%" : "70%"}</div>
            <p className="mt-2 text-sm leading-7 text-slate-400">{identity.binding?.steamId ?? currentPlayer.steamId ? "报告入口已经可以直接使用。" : "补上 SteamID 后可直接生成报告。"}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">关联比赛</div>
            <div className="mt-3 text-3xl font-semibold text-white">{relatedMatches.slice(0, 4).length}</div>
            <p className="mt-2 text-sm leading-7 text-slate-400">选手库已收录的社区比赛会聚合在下方。</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">当前阵营</div>
            <div className="mt-3 text-xl font-semibold text-white">{currentTeam?.name ?? "自由选手"}</div>
            <p className="mt-2 text-sm leading-7 text-slate-400">{currentTeam ? "战队入口和积分信息已经接到个人主页。" : "暂未关联固定战队。"}</p>
          </article>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的战队</div>
        {currentTeam ? (
          <div className="mt-3 flex items-start gap-4">
            <TeamMark name={currentTeam.name} logoUrl={currentTeam.logoUrl} size="md" />
            <div className="min-w-0 flex-1">
              <Link href={teamPath(currentTeam.id)} className="text-xl font-semibold text-white transition hover:text-accent-gold">
                {currentTeam.name}
              </Link>
              <p className="mt-2 text-sm leading-7 text-slate-400">{currentTeam.slogan ?? "每一场并肩作战，都会慢慢变成这支队伍的荣誉。"}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">社区积分 {currentTeam.honorScore}</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">冠军 {currentTeam.championshipCount}</div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">战绩 {currentTeam.wins}-{currentTeam.losses}-{currentTeam.draws}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-sm leading-7 text-slate-400">你目前还没有固定队资料，等队伍信息补齐后就会显示在这里。</div>
        )}
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的社区比赛</div>
            <h3 className="mt-2 text-xl font-semibold text-white">近期和即将开始的对局</h3>
          </div>
          {currentPlayer.teamId ? (
            <Link href={teamPath(currentPlayer.teamId)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent-gold/40 hover:text-white">
              我的战队主页
            </Link>
          ) : null}
        </div>
        {relatedMatches.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {relatedMatches.slice(0, 4).map((match) => (
              <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-[24px] border border-white/10 bg-slate-950/60 p-4 transition hover:border-accent-gold/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{match.title}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-accent-gold">{match.status}</div>
                </div>
                <div className="mt-2 text-sm text-slate-300">{formatMatchLabel(match)}</div>
                <div className="mt-1 text-sm text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
                {match.scoreHome !== null || match.scoreAway !== null ? (
                  <div className="mt-2 text-sm text-slate-300">比分 {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</div>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm leading-7 text-slate-400">你目前还没有关联比赛，等新赛程排上后会优先出现在这里。</div>
        )}
      </div>
    </div>
  );
}