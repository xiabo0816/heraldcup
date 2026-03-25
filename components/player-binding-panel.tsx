"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  clearLocalPlayerBinding,
  readLocalPlayerBinding,
  subscribeToLocalPlayerBinding,
  writeLocalPlayerBinding,
  type LocalPlayerBinding
} from "@/lib/local-binding";
import { groupPlayersByPool, resolvePlayerPoolMeta } from "@/lib/player-pool";

type PlayerOption = {
  id: string;
  displayName: string;
  slug: string;
  teamName?: string | null;
  teamId?: string | null;
  teamSlug?: string | null;
  steamId?: string | null;
  ladderScore?: number | null;
};

type BindingResponse = {
  message?: string;
  summary?: {
    personaName?: string | null;
  };
  binding?: LocalPlayerBinding;
  player?: {
    id: string;
    displayName: string;
    slug: string;
    ladderScore: number | null;
    poolLabel: string;
  };
};

export function PlayerBindingPanel({ players }: { players: PlayerOption[] }) {
  const router = useRouter();
  const [steamId, setSteamId] = useState("");
  const [storedBinding, setStoredBinding] = useState<LocalPlayerBinding | null>(null);
  const [message, setMessage] = useState("从选手详情页点击认领后，系统会要求你输入 SteamID；绑定成功后会直接跳回个人页。");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const binding = readLocalPlayerBinding();

    setStoredBinding(binding);
    setSteamId(binding?.steamId ?? "");

    return subscribeToLocalPlayerBinding((nextBinding) => {
      setStoredBinding(nextBinding);
      setSteamId(nextBinding?.steamId ?? "");
    });
  }, []);

  const currentPlayer = storedBinding
    ? players.find((player) => player.id === storedBinding.playerId || player.slug === storedBinding.playerSlug) ?? null
    : null;
  const groupedPlayers = groupPlayersByPool(
    [...players].sort(
      (left, right) =>
        (right.ladderScore ?? 0) - (left.ladderScore ?? 0) || left.displayName.localeCompare(right.displayName, "zh-CN")
    )
  );
  const currentPool = resolvePlayerPoolMeta(currentPlayer?.ladderScore ?? null);

  function handleBindBySteamId() {
    if (!steamId.trim()) {
      setMessage("请先输入要绑定的 SteamID。");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/bindings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          playerId: storedBinding?.playerId,
          steamId: steamId.trim()
        })
      });

      const result = (await response.json()) as BindingResponse;

      if (!response.ok || !result.binding) {
        setMessage(result.message ?? "绑定失败，请稍后重试。");
        return;
      }

      writeLocalPlayerBinding(result.binding);
      setStoredBinding(result.binding);
      setSteamId(result.binding.steamId ?? steamId.trim());
      setMessage(
        result.summary?.personaName
          ? `${result.message ?? "绑定成功。"} OpenDota 昵称：${result.summary.personaName}`
          : (result.message ?? "绑定成功。")
      );
      router.refresh();
    });
  }

  function handleUnbind() {
    clearLocalPlayerBinding();
    setStoredBinding(null);
    setSteamId("");
    setMessage("已清除本地绑定身份。请回到选手详情页重新点击认领，再在弹窗里输入 SteamID。");
    router.refresh();
  }

  return (
    <div id="binding-panel" className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow">
      {storedBinding ? (
        <>
          <div className="text-xs uppercase tracking-[0.28em] text-emerald-200">身份已绑定</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">当前主页已经锁定到你的 Steam 身份</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            你已经完成认领。现在这里只负责维护当前身份的 SteamID，并继续刷新 OpenDota 战绩与个人页展示。
          </p>

          <div className="mt-6 rounded-[28px] border border-emerald-400/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(255,255,255,0.04))] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">当前主身份</div>
            <div className="mt-2 text-2xl font-semibold text-white">{currentPlayer?.displayName ?? storedBinding.playerDisplayName ?? storedBinding.playerSlug}</div>
            <div className="mt-2 text-sm text-slate-300">{storedBinding.teamName ? `所属战队：${storedBinding.teamName}` : "暂未识别所属战队"}</div>
            <div className="mt-2 text-sm text-slate-300">SteamID：{storedBinding.steamId ?? "未绑定"}</div>
            <div className="mt-2 text-sm text-slate-300">当前选手池：{currentPool.label}{currentPlayer?.ladderScore ? ` / ${currentPlayer.ladderScore} 分` : " / 分段待校准"}</div>
          </div>
        </>
      ) : (
        <>
          <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">认领入口</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">先去选手详情页点击认领，再在弹窗里输入 SteamID</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            默认流程已经改成先认领具体选手。绑定成功后会立即跳回个人页，并自动拉起这位选手的社区比赛和 OpenDota 最近比赛。
          </p>
        </>
      )}

      {storedBinding ? (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">SteamID 管理</div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="grid gap-2 text-sm text-slate-300">
              <span>SteamID</span>
              <input
                value={steamId}
                onChange={(event) => setSteamId(event.target.value)}
                className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
                placeholder="7656119xxxxxxxxxx"
              />
            </label>
            <button
              type="button"
              onClick={handleBindBySteamId}
              disabled={isPending}
              className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {isPending ? "同步中..." : "刷新 SteamID 与战绩"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">会继续绑定到当前认领的选手身份</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">刷新后会重新同步 OpenDota 最近比赛</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">个人页会继续展示该选手的社区比赛</div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">去哪里认领</div>
              <div className="mt-2 text-xl font-semibold text-white">先进入选手详情，再点击“这个是我”</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">认领弹窗会要求你输入 SteamID。绑定完成后，页面会直接跳转回个人页。</p>
            </div>
            <Link href="/players" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
              去选手页认领
            </Link>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {storedBinding ? (
          <button
            type="button"
            onClick={handleUnbind}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200"
          >
            解绑本地身份
          </button>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
        {message}
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">当前选手池</div>
            <div className="mt-2 text-xl font-semibold text-white">所有选手按分段自动分池</div>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-slate-300">分段规则：0-2999 先锋 / 3000-5999 传奇 / 6000+ 冠绝，未填分数默认冠绝</div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {groupedPlayers.map((group) => (
            <article key={group.key} className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-white">{group.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{group.description}</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">{group.players.length} 人</div>
              </div>

              <div className="mt-4 space-y-3">
                {group.players.length ? group.players.slice(0, 6).map((player) => (
                  <div key={player.id} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{player.displayName}</div>
                        <div className="mt-1 text-xs text-slate-400">{player.teamName ?? "自由选手"}</div>
                      </div>
                      <div className="text-right text-xs text-slate-300">{player.ladderScore ? `${player.ladderScore} 分` : "待校准"}</div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-[18px] border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">当前还没有选手进入这个分池。</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
