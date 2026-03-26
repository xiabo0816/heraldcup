"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClaimPlayerDialog } from "@/components/claim-player-dialog";
import type { IdentitySnapshot } from "@/lib/identity";
import { formatDateLabel, formatMatchLabel, sortMatchesByPriority } from "@/lib/my-page-utils";
import { playerPath, teamPath } from "@/lib/routes";

type SpotlightPlayer = {
  id: string;
  displayName: string;
  slug: string;
  primaryRole: string | null;
  highlightMatchIds: string[];
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

type HomeOpenDotaProfile = {
  source: "live" | "cached";
  summary: {
    personaName: string | null;
    rankTier: number | null;
    leaderboardRank: number | null;
    mmrEstimate: number | null;
    recentWinCount: number;
    recentLossCount: number;
    recentAverageKda: number | null;
  };
};

function formatRank(rankTier: number | null, leaderboardRank: number | null) {
  if (!rankTier) {
    return "段位未知";
  }

  const tier = Math.floor(rankTier / 10);
  const star = rankTier % 10;
  const labels = ["", "先锋", "卫士", "中军", "统帅", "传奇", "万古", "超凡", "冠绝"];
  const rankLabel = labels[tier] ?? `段位 ${rankTier}`;

  if (tier >= 8 && leaderboardRank) {
    return `${rankLabel} 第 ${leaderboardRank}`;
  }

  return star > 0 ? `${rankLabel} ${star}` : rankLabel;
}

function getPersonalAreaCopy(identity: IdentitySnapshot) {
  if (!identity.viewer) {
    return {
      title: "登录后，首页会直接变成你的个人区",
      description: "认领、绑定和最近比赛会先在这里聚合，完整资料再放进个人页。",
      primaryLabel: "登录 / 注册",
      secondaryLabel: "先看选手列表"
    };
  }

  if (identity.activeClaim) {
    return {
      title: `认领申请已提交：${identity.activeClaim.playerDisplayName}`,
      description: "审核进度先放在首页个人区，完整记录和历史申请仍然留在个人页。",
      primaryLabel: "打开个人页",
      secondaryLabel: "浏览社区比赛"
    };
  }

  if (identity.binding) {
    return {
      title: "Steam 已绑定，下一步就是认领自己",
      description: "认领完成后，首页会直接展示你的最近比赛、战队和社区相关赛程。",
      primaryLabel: "打开个人页",
      secondaryLabel: "提交认领"
    };
  }

  return {
    title: "个人页已经准备好，差一个 Steam 绑定",
    description: "补上 Steam 后就能继续走认领流程，首页个人区也会开始替你汇总比赛信息。",
    primaryLabel: "打开个人页",
    secondaryLabel: "去绑定 Steam"
  };
}

export function HomeIdentitySpotlight({
  identity,
  players,
  teams,
  matches
}: {
  identity: IdentitySnapshot;
  players: SpotlightPlayer[];
  teams: SpotlightTeam[];
  matches: SpotlightMatch[];
}) {
  const [opendotaProfile, setOpendotaProfile] = useState<HomeOpenDotaProfile | null>(null);
  const currentPlayer = identity.certifiedPlayer
    ? players.find((player) => player.id === identity.certifiedPlayer?.id) ?? null
    : null;
  const currentTeam = currentPlayer?.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
  const claimPlayers = players.map((player) => ({
    id: player.id,
    displayName: player.displayName,
    subtitle: player.teamName
  }));

  const highlightedMatchIds = new Set(currentPlayer?.highlightMatchIds ?? []);
  const myMatches = currentPlayer
    ? sortMatchesByPriority(matches.filter((match) => {
        const relatedToCurrentTeam = currentPlayer.teamId ? match.participantTeamIds.includes(currentPlayer.teamId) : false;
        return relatedToCurrentTeam || highlightedMatchIds.has(match.slug);
      })).slice(0, 3)
    : [];
  const nextMyMatch = myMatches.find((match) => match.status !== "FINISHED" && match.status !== "CANCELLED") ?? myMatches[0] ?? null;
  const personalAreaCopy = getPersonalAreaCopy(identity);

  useEffect(() => {
    const steamId = identity.binding?.steamId ?? null;

    if (!steamId) {
      setOpendotaProfile(null);
      return;
    }

    const controller = new AbortController();

    async function loadOpenDotaProfile() {
      try {
        const response = await fetch(`/api/my/opendota?steamId=${encodeURIComponent(String(steamId))}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          setOpendotaProfile(null);
          return;
        }

        const payload = await response.json() as HomeOpenDotaProfile;
        setOpendotaProfile(payload);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setOpendotaProfile(null);
      }
    }

    void loadOpenDotaProfile();

    return () => controller.abort();
  }, [identity.binding?.steamId]);

  if (!currentPlayer) {
    return (
      <article className="brand-shell border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,16,29,0.94),rgba(8,40,48,0.82))] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="section-kicker">首页个人区</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{personalAreaCopy.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{personalAreaCopy.description}</p>
          </div>

          <Link href="/my" className="text-sm font-semibold text-cyan-100 transition hover:text-white">
            进入完整个人页
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">当前状态</div>
            <div className="mt-2 text-sm font-semibold text-white">
              {identity.viewer ? (identity.activeClaim ? "认领审核中" : identity.binding ? "可直接认领" : "等待绑定 Steam") : "游客模式"}
            </div>
          </div>
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">首页会展示</div>
            <div className="mt-2 text-sm font-semibold text-white">最近比赛与社区相关赛程</div>
          </div>
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">完整信息</div>
            <div className="mt-2 text-sm font-semibold text-white">保留在个人页统一查看</div>
          </div>
        </div>

        {identity.activeClaim ? (
          <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
            当前申请：{identity.activeClaim.playerDisplayName}，提交 SteamID {identity.activeClaim.submittedSteamId}。审核通过后，这里会直接切成你的比赛看板。
          </div>
        ) : null}

        {opendotaProfile ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="brand-card p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">OpenDota 昵称</div>
              <div className="mt-2 text-sm font-semibold text-white">{opendotaProfile.summary.personaName ?? "未返回昵称"}</div>
            </div>
            <div className="brand-card p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">天梯与段位</div>
              <div className="mt-2 text-sm font-semibold text-white">{opendotaProfile.summary.mmrEstimate ?? "--"} MMR</div>
              <div className="mt-1 text-xs text-slate-400">{formatRank(opendotaProfile.summary.rankTier, opendotaProfile.summary.leaderboardRank)}</div>
            </div>
            <div className="brand-card p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">近期战绩</div>
              <div className="mt-2 text-sm font-semibold text-white">{opendotaProfile.summary.recentWinCount}-{opendotaProfile.summary.recentLossCount}</div>
              <div className="mt-1 text-xs text-slate-400">平均 KDA {opendotaProfile.summary.recentAverageKda?.toFixed(2) ?? "--"}</div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/my" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            {personalAreaCopy.primaryLabel}
          </Link>
          {identity.viewer && identity.binding && !identity.activeClaim ? (
            <ClaimPlayerDialog
              identity={identity}
              players={claimPlayers}
              triggerLabel={personalAreaCopy.secondaryLabel}
              triggerClassName="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:text-white"
              title="选择选手并提交认领申请"
              description="认领通过后，首页个人区会开始优先展示你的最近比赛和社区赛程。"
            />
          ) : (
            <Link href="/players" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:text-white">
              {personalAreaCopy.secondaryLabel}
            </Link>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="brand-shell border-amber-300/20 bg-[linear-gradient(180deg,rgba(8,16,29,0.96),rgba(62,35,8,0.82))] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.24em] text-amber-200">首页个人区</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">{currentPlayer.displayName}，你的最近比赛已经压到首页</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            这里先看你最近的比赛和社区相关赛程，账号、认领记录、战绩补充这些完整信息继续放在个人页。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/my" className="text-sm font-semibold text-emerald-100 transition hover:text-white">
            完整个人页
          </Link>
          <Link href={playerPath(currentPlayer.id)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/50 hover:text-white">
            选手档案
          </Link>
        </div>
      </div>

      {opendotaProfile ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">OpenDota 昵称</div>
            <div className="mt-2 text-sm font-semibold text-white">{opendotaProfile.summary.personaName ?? "未返回昵称"}</div>
            <div className="mt-1 text-xs text-slate-400">{opendotaProfile.source === "live" ? "实时拉取" : "最近缓存"}</div>
          </div>
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">天梯与段位</div>
            <div className="mt-2 text-sm font-semibold text-white">{opendotaProfile.summary.mmrEstimate ?? "--"} MMR</div>
            <div className="mt-1 text-xs text-slate-400">{formatRank(opendotaProfile.summary.rankTier, opendotaProfile.summary.leaderboardRank)}</div>
          </div>
          <div className="brand-card p-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">近期战绩</div>
            <div className="mt-2 text-sm font-semibold text-white">{opendotaProfile.summary.recentWinCount}-{opendotaProfile.summary.recentLossCount}</div>
            <div className="mt-1 text-xs text-slate-400">平均 KDA {opendotaProfile.summary.recentAverageKda?.toFixed(2) ?? "--"}</div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="brand-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的身份</div>
          <div className="mt-2 text-lg font-semibold text-white">{currentPlayer.primaryRole ?? "社区选手"}</div>
          <div className="mt-2 text-sm text-slate-300">冠军 {currentPlayer.championshipCount} 次</div>
          <div className="mt-1 text-sm text-slate-400">{identity.binding?.steamId ? `SteamID ${identity.binding.steamId}` : "已认证，尚未补充 SteamID"}</div>
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
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">社区相关比赛</div>
          <div className="mt-2 text-lg font-semibold text-white">{myMatches.length ? `${myMatches.length} 场已收进首页` : "近期赛程待更新"}</div>
          <div className="mt-2 text-sm text-slate-300">包括本队赛程和你被标记的社区重点比赛。</div>
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
          <div className="mt-2 text-sm text-slate-300">{formatMatchLabel(nextMyMatch)}</div>
          <div className="mt-1 text-sm text-slate-400">{formatDateLabel(nextMyMatch.scheduledAt)}</div>
        </Link>
      ) : null}

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">我的比赛摘要</div>
            <div className="mt-2 text-lg font-semibold text-white">首页先展示最近三场</div>
          </div>
          <Link href="/my" className="text-sm font-semibold text-amber-100 transition hover:text-white">
            去个人页看完整信息
          </Link>
        </div>
        {myMatches.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {myMatches.map((match) => (
              <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-300/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{match.title}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-200">{match.status}</div>
                </div>
                <div className="mt-2 text-sm text-slate-300">{formatMatchLabel(match)}</div>
                <div className="mt-1 text-sm text-slate-400">{formatDateLabel(match.scheduledAt)}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3 text-sm leading-7 text-slate-400">你的认领信息已经就位，近期还没有排到新的比赛。</div>
        )}
      </div>
    </article>
  );
}