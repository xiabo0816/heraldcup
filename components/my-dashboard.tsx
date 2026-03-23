"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroChip, type HeroChipData } from "@/components/hero-chip";
import { TeamMark } from "@/components/team-mark";
import { readLocalPlayerBinding, subscribeToLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";
import { playerPath, teamPath } from "@/lib/routes";

type DashboardPlayer = {
  id: string;
  displayName: string;
  slug: string;
  steamId?: string | null;
  primaryRole: string | null;
  highlightMatchIds: string[];
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

function sortMatchesByPriority(matches: DashboardMatch[]) {
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
    return subscribeToLocalPlayerBinding(setBinding);
  }, []);

  const currentPlayer = binding ? players.find((player) => player.id === binding.playerId || player.slug === binding.playerSlug) ?? null : null;
  const currentTeam = currentPlayer?.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
  const currentPlayerHighlightMatchIds = new Set(currentPlayer?.highlightMatchIds ?? []);
  const relatedMatches = currentPlayer
    ? sortMatchesByPriority(matches.filter((match) => {
        const relatedToCurrentTeam = currentPlayer.teamId
          ? match.homeTeamId === currentPlayer.teamId || match.awayTeamId === currentPlayer.teamId
          : false;

        return relatedToCurrentTeam || currentPlayerHighlightMatchIds.has(match.slug);
      })).slice(0, 4)
    : [];
  const previewPlayer = players.find((player) => player.teamId) ?? players[0] ?? null;
  const previewTeam = previewPlayer?.teamId ? teams.find((team) => team.id === previewPlayer.teamId) ?? null : null;
  const previewMatches = previewPlayer?.teamId
    ? sortMatchesByPriority(matches.filter((match) => match.homeTeamId === previewPlayer.teamId || match.awayTeamId === previewPlayer.teamId)).slice(0, 2)
    : [];

  if (!currentPlayer) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">未认领状态</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">这块区域会在认领后切成你的个人控制台</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              现在这里只展示认领后的预览结构。完成认领之后，你的身份、所属战队和最近比赛会直接替换掉这组说明卡。
            </p>
          </div>
          <Link href="/players" className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/40 hover:text-white">
            去选手页认领
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">认领后会固定展示</div>
            {previewPlayer ? (
              <>
                <div className="mt-3 text-2xl font-semibold text-white">{previewPlayer.displayName}</div>
                <div className="mt-2 text-sm text-slate-300">{previewPlayer.primaryRole ?? "社区选手"}</div>
                <div className="mt-2 text-sm text-slate-400">{previewTeam ? `${previewTeam.name} 会和你的身份一起出现在这里。` : "你的身份会成为这页默认展示的主角。"}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {previewPlayer.heroCards.length ? previewPlayer.heroCards.slice(0, 5).map((hero) => (
                    <HeroChip key={`${previewPlayer.id}-${hero.label}`} hero={hero} compact />
                  )) : <span className="text-sm text-slate-500">英雄池信息会展示在这里</span>}
                </div>
              </>
            ) : (
              <div className="mt-3 text-sm leading-7 text-slate-400">当前还没有可用于预览的选手资料。</div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">认领后会解锁</div>
            <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-300">
              <div className="rounded-[20px] border border-white/10 bg-slate-950/50 px-4 py-3">你的战队入口会固定在主页里，不再需要从列表重新找。</div>
              <div className="rounded-[20px] border border-white/10 bg-slate-950/50 px-4 py-3">认领成功后，这位选手的社区比赛会自动聚合到这一页。</div>
              <div className="rounded-[20px] border border-white/10 bg-slate-950/50 px-4 py-3">个人荣誉和英雄池会被整理成更像“档案页”的展示方式。</div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-dashed border-white/10 bg-slate-950/35 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">赛程预览</div>
              <h3 className="mt-2 text-xl font-semibold text-white">认领后，这里会优先出现与你有关的比赛</h3>
            </div>
            <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              浏览全部比赛
            </Link>
          </div>

          {previewMatches.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {previewMatches.map((match) => (
                <div key={match.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{match.title}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-cyan-200">{match.status}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">{match.homeTeamName} vs {match.awayTeamName}</div>
                  <div className="mt-1 text-sm text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm leading-7 text-slate-400">认领完成后，与你关联的赛程会在这里聚合显示。</div>
          )}
        </div>
      </div>
    );
  }

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
          <div className="mt-2 text-sm text-slate-300">SteamID：{binding?.steamId ?? currentPlayer.steamId ?? "尚未绑定"}</div>
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
            <div className="mt-3 text-3xl font-semibold text-white">{binding?.steamId ?? currentPlayer.steamId ? "100%" : "70%"}</div>
            <p className="mt-2 text-sm leading-7 text-slate-400">{binding?.steamId ?? currentPlayer.steamId ? "报告入口已经可以直接使用。" : "补上 SteamID 后可直接生成报告。"}</p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">关联比赛</div>
            <div className="mt-3 text-3xl font-semibold text-white">{relatedMatches.length}</div>
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
          <div className="mt-4 text-sm leading-7 text-slate-400">你目前还没有关联比赛，等新赛程排上后会优先出现在这里。</div>
        )}
      </div>
    </div>
  );
}