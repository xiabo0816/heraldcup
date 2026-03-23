"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type OpenDotaPanelResponse = {
  source: "live" | "cached";
  syncedAt: string | null;
  summary: {
    personaName: string | null;
    rankTier: number | null;
    leaderboardRank: number | null;
    mmrEstimate: number | null;
    lifetimeWins: number | null;
    lifetimeLosses: number | null;
    recentWinCount: number;
    recentLossCount: number;
    recentAverageKda: number | null;
  };
  topHeroes: Array<{
    heroId: number;
    heroName: string;
    games: number;
    wins: number;
    winRate: number;
    iconUrl: string | null;
  }>;
  recentMatches: Array<{
    matchId: number;
    heroId: number;
    heroName: string;
    iconUrl: string | null;
    kills: number;
    deaths: number;
    assists: number;
    kda: number;
    result: "WIN" | "LOSS";
    startTime: number;
    duration: number | null;
  }>;
};

function formatDateTime(timestamp: number) {
  if (!timestamp) {
    return "时间未知";
  }

  return new Date(timestamp * 1000).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDuration(duration: number | null) {
  if (!duration || duration <= 0) {
    return "时长未知";
  }

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}

function formatWinRate(wins: number | null, losses: number | null) {
  if (wins === null || losses === null) {
    return "--";
  }

  const total = wins + losses;

  if (!total) {
    return "--";
  }

  return `${((wins / total) * 100).toFixed(1)}%`;
}

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

function LoadingState() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-40 rounded-full bg-white/10" />
        <div className="h-10 w-64 rounded-2xl bg-white/10" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-[24px] bg-white/5" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="h-64 rounded-[28px] bg-white/5" />
          <div className="h-64 rounded-[28px] bg-white/5" />
        </div>
      </div>
    </section>
  );
}

export function MyOpenDotaPanel({
  steamId,
  playerName,
  onProfileLoaded
}: {
  steamId?: string | null;
  playerName: string;
  onProfileLoaded?: (profile: { personaName: string | null }) => void;
}) {
  const [data, setData] = useState<OpenDotaPanelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!steamId) {
      setData(null);
      setLoading(false);
      setError(null);
      onProfileLoaded?.({ personaName: null });
      return;
    }

    const activeSteamId = steamId;
    const controller = new AbortController();

    async function loadOpenDota() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/my/opendota?steamId=${encodeURIComponent(activeSteamId)}`, {
          signal: controller.signal,
          cache: "no-store"
        });

        const payload = await response.json() as OpenDotaPanelResponse | { message?: string };

        if (!response.ok) {
          throw new Error("message" in payload && payload.message ? payload.message : "OpenDota 数据加载失败。");
        }

        setData(payload as OpenDotaPanelResponse);
        onProfileLoaded?.({ personaName: (payload as OpenDotaPanelResponse).summary.personaName ?? null });
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "OpenDota 数据加载失败。");
        setData(null);
        onProfileLoaded?.({ personaName: null });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadOpenDota();

    return () => controller.abort();
  }, [onProfileLoaded, steamId]);

  if (!steamId) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-amber-200">OpenDota Match Feed</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">补上 SteamID 后，这里会直接显示你的 Dota 战绩</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              给当前已认领身份补上 SteamID 后，这里会自动拉取 OpenDota 的近期比赛、常用英雄、KDA 和胜率，不用再单独进入报告页。
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-rose-200">OpenDota Match Feed</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">{playerName} 的战绩数据暂时没有拉起来</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">{error}</p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const lifetimeWinRate = formatWinRate(data.summary.lifetimeWins, data.summary.lifetimeLosses);
  const recentTotal = data.summary.recentWinCount + data.summary.recentLossCount;
  const recentWinRate = recentTotal ? `${((data.summary.recentWinCount / recentTotal) * 100).toFixed(1)}%` : "--";

  return (
    <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">OpenDota Match Feed</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">{playerName} 的 Dota 近期战绩</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            个人页已直接接入 OpenDota。常用英雄、最近战绩和核心对局指标会跟着已绑定的 SteamID 一起展示。
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
              SteamID {steamId}
            </span>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
              OpenDota 昵称 {data.summary.personaName ?? "未返回昵称"}
            </span>
          </div>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <div>{data.source === "live" ? "实时拉取" : "使用最近缓存"}</div>
          <div className="mt-1 text-xs text-slate-500">{data.syncedAt ? `同步于 ${new Date(data.syncedAt).toLocaleString("zh-CN")}` : "暂无同步时间"}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">近期战绩</div>
          <div className="mt-3 text-3xl font-semibold text-white">{data.summary.recentWinCount}-{data.summary.recentLossCount}</div>
          <p className="mt-2 text-sm leading-7 text-slate-400">最近 {recentTotal || data.recentMatches.length} 场，胜率 {recentWinRate}</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">近期平均 KDA</div>
          <div className="mt-3 text-3xl font-semibold text-white">{data.summary.recentAverageKda?.toFixed(2) ?? "--"}</div>
          <p className="mt-2 text-sm leading-7 text-slate-400">按最近公开比赛窗口计算。</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">天梯与段位</div>
          <div className="mt-3 text-2xl font-semibold text-white">{data.summary.mmrEstimate ?? "--"}</div>
          <p className="mt-2 text-sm leading-7 text-slate-400">{formatRank(data.summary.rankTier, data.summary.leaderboardRank)}</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">总公开胜率</div>
          <div className="mt-3 text-3xl font-semibold text-white">{lifetimeWinRate}</div>
          <p className="mt-2 text-sm leading-7 text-slate-400">总战绩 {data.summary.lifetimeWins ?? "--"} 胜 / {data.summary.lifetimeLosses ?? "--"} 负</p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">常用英雄</div>
              <h3 className="mt-2 text-xl font-semibold text-white">最近最常拿的角色</h3>
            </div>
            <div className="text-sm text-slate-500">Top {Math.min(data.topHeroes.length, 5)}</div>
          </div>

          <div className="mt-4 space-y-3">
            {data.topHeroes.length ? data.topHeroes.slice(0, 5).map((hero) => (
              <div key={hero.heroId} className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-slate-950/50 px-4 py-3">
                {hero.iconUrl ? (
                  <Image src={hero.iconUrl} alt={hero.heroName} width={44} height={44} className="h-11 w-11 rounded-full border border-white/10 object-cover" unoptimized />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-slate-300">
                    {hero.heroName.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">{hero.heroName}</div>
                  <div className="mt-1 text-sm text-slate-400">{hero.games} 场，{hero.wins} 胜，胜率 {hero.winRate}%</div>
                </div>
              </div>
            )) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-slate-950/35 px-4 py-5 text-sm leading-7 text-slate-400">
                暂时还没有拿到常用英雄数据。
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">近期比赛</div>
              <h3 className="mt-2 text-xl font-semibold text-white">最近对局明细</h3>
            </div>
            <div className="text-sm text-slate-500">{data.recentMatches.length} 场</div>
          </div>

          <div className="mt-4 space-y-3">
            {data.recentMatches.length ? data.recentMatches.map((match) => (
              <div key={match.matchId} className="rounded-[22px] border border-white/10 bg-slate-950/50 px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {match.iconUrl ? (
                      <Image src={match.iconUrl} alt={match.heroName} width={40} height={40} className="h-10 w-10 rounded-full border border-white/10 object-cover" unoptimized />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-slate-300">
                        {match.heroName.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{match.heroName}</div>
                      <div className="mt-1 text-sm text-slate-400">Match #{match.matchId}</div>
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${match.result === "WIN" ? "border border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border border-rose-300/20 bg-rose-300/10 text-rose-100"}`}>
                    {match.result === "WIN" ? "胜利" : "失利"}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">K/D/A {match.kills}/{match.deaths}/{match.assists}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">KDA {match.kda.toFixed(2)}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">{formatDuration(match.duration)}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">{formatDateTime(match.startTime)}</div>
                </div>
              </div>
            )) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-slate-950/35 px-4 py-5 text-sm leading-7 text-slate-400">
                近期公开比赛还没有返回数据。
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}