"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocalPlayerBinding, subscribeToLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";
import { playerPath, teamPath } from "@/lib/routes";

type SpotlightPlayer = {
  id: string;
  displayName: string;
  slug: string;
  primaryRole: string | null;
  teamName: string;
  teamId: string | null;
  teamSlug: string | null;
  championshipCount: number;
};

type SpotlightTeam = {
  id: string;
  name: string;
  slug: string;
  honorScore: number;
  championshipCount: number;
};

type SpotlightMatch = {
  slug: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  homeTeamName: string;
  homeTeamId: string | null;
  homeTeamSlug: string | null;
  awayTeamName: string;
  awayTeamId: string | null;
  awayTeamSlug: string | null;
};

function formatScheduledAt(value: Date | string | null) {
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

function sortMatchesByUpcoming(matches: SpotlightMatch[]) {
  return [...matches].sort((left, right) => {
    const leftValue = left.scheduledAt ? new Date(left.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    const rightValue = right.scheduledAt ? new Date(right.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
    return leftValue - rightValue;
  });
}

export function HomeIdentitySpotlight({
  players,
  teams,
  matches
}: {
  players: SpotlightPlayer[];
  teams: SpotlightTeam[];
  matches: SpotlightMatch[];
}) {
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
    return subscribeToLocalPlayerBinding(setBinding);
  }, []);

  const currentPlayer = binding ? players.find((player) => player.id === binding.playerId || player.slug === binding.playerSlug) ?? null : null;
  const currentTeam = currentPlayer?.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
  const myMatches = currentPlayer?.teamId
    ? sortMatchesByUpcoming(matches.filter((match) => match.homeTeamId === currentPlayer.teamId || match.awayTeamId === currentPlayer.teamId)).slice(0, 2)
    : [];
  const nextMyMatch = myMatches.find((match) => match.status !== "FINISHED" && match.status !== "CANCELLED") ?? myMatches[0] ?? null;

  if (!currentPlayer) {
    return (
      <article className="brand-shell border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,16,29,0.94),rgba(8,40,48,0.82))] p-6">
        <div className="section-kicker">专属看板</div>
        <h2 className="mt-3 text-2xl font-semibold text-white">认领之后，今晚该追的比赛会主动来到你面前</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          认领之后，比赛、战队和个人档案会集中到同一个入口；如果你再补上 SteamID，就能继续生成自己的公开战绩报告。
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">我的下一场</div>
            <div className="mt-2 text-sm font-semibold text-white">赛程优先送达</div>
          </div>
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">我的战队</div>
            <div className="mt-2 text-sm font-semibold text-white">一键回到队伍主页</div>
          </div>
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">我的荣誉</div>
            <div className="mt-2 text-sm font-semibold text-white">个人记录持续累积</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/my" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            去认领自己
          </Link>
          <Link href="/players" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:text-white">
            先找我的选手页
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="brand-shell border-amber-300/20 bg-[linear-gradient(180deg,rgba(8,16,29,0.96),rgba(62,35,8,0.82))] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-amber-200">专属看板</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">{currentPlayer.displayName}，今晚和你有关的比赛都在这里</h2>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          已认领
        </div>
      </div>

      {nextMyMatch ? (
        <Link href={`/matches/${nextMyMatch.slug}`} className="mt-5 block rounded-[24px] border border-white/10 bg-slate-950/55 p-4 transition hover:border-amber-300/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">我的下一场</div>
              <div className="mt-2 text-lg font-semibold text-white">{nextMyMatch.title}</div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-100">
              {nextMyMatch.status}
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-300">{nextMyMatch.homeTeamName} vs {nextMyMatch.awayTeamName}</div>
          <div className="mt-1 text-sm text-slate-400">{formatScheduledAt(nextMyMatch.scheduledAt)}</div>
        </Link>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="brand-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的身份</div>
          <div className="mt-2 text-lg font-semibold text-white">{currentPlayer.primaryRole ?? "社区选手"}</div>
          <div className="mt-2 text-sm text-slate-300">冠军 {currentPlayer.championshipCount} 次</div>
          <div className="mt-1 text-sm text-slate-400">{binding?.steamId ? `SteamID ${binding.steamId}` : "已认领，尚未补充 SteamID"}</div>
        </div>
        <div className="brand-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的战队</div>
          {currentPlayer.teamId ? (
            <Link href={teamPath(currentPlayer.teamId)} className="mt-2 block text-lg font-semibold text-white transition hover:text-amber-200">
              {currentPlayer.teamName}
            </Link>
          ) : (
            <div className="mt-2 text-lg font-semibold text-white">{currentPlayer.teamName}</div>
          )}
          <div className="mt-2 text-sm text-slate-300">社区积分 {currentTeam?.honorScore ?? 0}</div>
          <div className="mt-1 text-sm text-slate-400">冠军 {currentTeam?.championshipCount ?? 0} 次</div>
        </div>
        <div className="brand-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">近期安排</div>
          <div className="mt-2 text-lg font-semibold text-white">{myMatches.length ? `${myMatches.length} 场相关比赛` : "近期赛程待更新"}</div>
          <div className="mt-2 text-sm text-slate-300">从这里进入比赛、战队和社区讨论，整条观看路线会更顺。</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的比赛</div>
        {myMatches.length ? (
          <div className="mt-3 space-y-3">
            {myMatches.map((match) => (
              <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-300/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{match.title}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200">{match.status}</div>
                </div>
                <div className="mt-2 text-sm text-slate-300">{match.homeTeamName} vs {match.awayTeamName}</div>
                <div className="mt-1 text-sm text-slate-400">{formatScheduledAt(match.scheduledAt)}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3 text-sm leading-7 text-slate-400">你的认领信息已经就位，近期还没有排到新的比赛。</div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/my" className="rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
          打开我的主页
        </Link>
        <Link href={playerPath(currentPlayer.id)} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300/50 hover:text-white">
          查看选手档案
        </Link>
      </div>
    </article>
  );
}