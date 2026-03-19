"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroChip, type HeroChipData } from "@/components/hero-chip";
import { TeamMark } from "@/components/team-mark";
import { readLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";
import { playerPath, teamPath } from "@/lib/routes";

type DashboardPlayer = {
  id: string;
  displayName: string;
  slug: string;
  steamId?: string | null;
  primaryRole: string | null;
  championshipCount: number;
  teamName: string;
  teamId: string | null;
  teamSlug: string | null;
  heroCards: HeroChipData[];
};

type DashboardTeam = {
  id: string;
  name: string;
  slug: string;
  slogan: string | null;
  logoUrl: string | null;
  championshipCount: number;
  honorScore: number;
  wins: number;
  losses: number;
  draws: number;
};

type DashboardMatch = {
  id: string;
  slug: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  scoreHome: number | null;
  scoreAway: number | null;
  homeTeamName: string;
  homeTeamId: string | null;
  homeTeamSlug: string | null;
  awayTeamName: string;
  awayTeamId: string | null;
  awayTeamSlug: string | null;
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

export function MyDashboard({
  players,
  teams,
  matches
}: {
  players: DashboardPlayer[];
  teams: DashboardTeam[];
  matches: DashboardMatch[];
}) {
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
  }, []);

  const currentPlayer = binding ? players.find((player) => player.id === binding.playerId || player.slug === binding.playerSlug) ?? null : null;
  const currentTeam = currentPlayer?.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
  const relatedMatches = currentPlayer?.teamId
    ? matches.filter((match) => match.homeTeamId === currentPlayer.teamId || match.awayTeamId === currentPlayer.teamId).slice(0, 4)
    : [];

  if (!currentPlayer) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">我的主页</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">先认领你的社区主页</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          认领后，你的战队、近期比赛和个人荣誉都会优先出现在这里。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">我的直达</div>
            <p className="mt-2 text-sm leading-7 text-slate-300">回到站内，先看到和你有关的比赛与队伍。</p>
          </article>
          <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">认领收益</div>
            <p className="mt-2 text-sm leading-7 text-slate-300">战队、赛程和荣誉会自动聚到同一页。</p>
          </article>
          <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">专属主页</div>
            <p className="mt-2 text-sm leading-7 text-slate-300">认领完成后，这里就是你的个人看板。</p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="#binding-panel" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            去完成绑定
          </Link>
          <Link href="/players" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:text-white">
            浏览选手名册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">我的主页</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">{currentPlayer.displayName} 的社区主页</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            这里先放你的固定队、最近比赛和个人荣誉，回来一眼就能看到和自己有关的内容。
          </p>
        </div>
        <Link href={playerPath(currentPlayer.id)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent-cyan/40 hover:text-white">
          选手档案
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的身份</div>
          <div className="mt-2 text-xl font-semibold text-white">{currentPlayer.primaryRole ?? "社区选手"}</div>
          <div className="mt-2 text-sm text-slate-300">已绑定 SteamID：{binding?.steamId ?? currentPlayer.steamId ?? "已认领"}</div>
          <div className="mt-2 text-sm text-slate-300">个人荣誉：{currentPlayer.championshipCount} 冠</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentPlayer.heroCards.length ? currentPlayer.heroCards.slice(0, 5).map((hero) => (
              <HeroChip key={`${currentPlayer.slug}-${hero.label}`} hero={hero} compact />
            )) : <span className="text-sm text-slate-500">暂未维护英雄池</span>}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的战队</div>
          {currentTeam ? (
            <div className="mt-3 flex items-start gap-4">
              <TeamMark name={currentTeam.name} logoUrl={currentTeam.logoUrl} size="md" />
              <div className="min-w-0 flex-1">
                <Link href={teamPath(currentTeam.id)} className="text-xl font-semibold text-white transition hover:text-accent-gold">
                  {currentTeam.name}
                </Link>
                <p className="mt-2 text-sm leading-7 text-slate-400">{currentTeam.slogan ?? "每一场并肩作战，都会慢慢变成这支队伍的荣誉。"}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">社区积分 {currentTeam.honorScore}</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">战绩 {currentTeam.wins}-{currentTeam.losses}-{currentTeam.draws}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-sm leading-7 text-slate-400">你还没有固定队信息，后续录入后会第一时间展示在这里。</div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的比赛</div>
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
            {relatedMatches.map((match) => (
              <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-[24px] border border-white/10 bg-slate-950/60 p-4 transition hover:border-accent-gold/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{match.title}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-accent-gold">{match.status}</div>
                </div>
                <div className="mt-2 text-sm text-slate-300">{match.homeTeamName} vs {match.awayTeamName}</div>
                <div className="mt-1 text-sm text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
                {(match.scoreHome !== null || match.scoreAway !== null) ? (
                  <div className="mt-2 text-sm text-slate-300">比分 {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</div>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm leading-7 text-slate-400">你的相关比赛还在整理中，录入后会优先展示在这里。</div>
        )}
      </div>
    </div>
  );
}