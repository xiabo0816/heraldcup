"use client";

import { useEffect, useState, useTransition } from "react";
import { PLAYER_BINDING_STORAGE_KEY, readLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";

type PlayerOption = {
  id: string;
  displayName: string;
  slug: string;
  teamName?: string | null;
  teamId?: string | null;
  teamSlug?: string | null;
  steamId?: string | null;
};

export function PlayerBindingPanel({ players, initialSelectedPlayerId }: { players: PlayerOption[]; initialSelectedPlayerId?: string }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialSelectedPlayerId ?? players[0]?.id ?? "");
  const [steamId, setSteamId] = useState("");
  const [storedBinding, setStoredBinding] = useState<LocalPlayerBinding | null>(null);
  const [message, setMessage] = useState("选好选手并填入 SteamID，就能点亮你的专属主页。");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const binding = readLocalPlayerBinding();

    if (binding) {
      setStoredBinding(binding);
      setSteamId(binding.steamId ?? "");
    }

    if (initialSelectedPlayerId) {
      setSelectedPlayerId(initialSelectedPlayerId);
      const selectedPlayer = players.find((player) => player.id === initialSelectedPlayerId);

      if (selectedPlayer) {
        setMessage(`准备认领 ${selectedPlayer.displayName}，填入 SteamID 后即可点亮专属主页。`);
      }
      return;
    }

    if (binding) {
      setSelectedPlayerId(binding.playerId);
    }
  }, [initialSelectedPlayerId, players]);

  const currentPlayer = players.find((player) => player.id === selectedPlayerId);

  async function handleBind() {
    if (!currentPlayer || !steamId.trim()) {
      setMessage("请先选择选手并输入 SteamID。");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/bindings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          playerId: currentPlayer.id,
          steamId: steamId.trim()
        })
      });

      const result = (await response.json()) as { message?: string; summary?: { personaName?: string | null } };

      if (!response.ok) {
        setMessage(result.message ?? "绑定失败，请稍后重试。");
        return;
      }

      const binding: LocalPlayerBinding = {
        playerId: currentPlayer.id,
        playerSlug: currentPlayer.slug,
        playerDisplayName: currentPlayer.displayName,
        teamName: currentPlayer.teamName ?? null,
        teamSlug: currentPlayer.teamSlug ?? null,
        steamId: steamId.trim()
      };
      window.localStorage.setItem(PLAYER_BINDING_STORAGE_KEY, JSON.stringify(binding));
      setStoredBinding(binding);
      setMessage(result.summary?.personaName ? `认领成功，主页已切到你的专属视角。OpenDota 账号：${result.summary.personaName}` : "认领成功，主页已经切到你的专属视角。");
    });
  }

  function handleUnbind() {
    window.localStorage.removeItem(PLAYER_BINDING_STORAGE_KEY);
    setStoredBinding(null);
    setSteamId("");
    setMessage("已清除当前认领信息，你可以重新选择想展示的选手。");
  }

  return (
    <div id="binding-panel" className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">认领主页</div>
      <h2 className="mt-2 text-3xl font-semibold text-white">把你的主页认领回来</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        绑定后，首页和“我的”页会优先展示你的战队、赛程和荣誉，帮你更快回到自己的比赛线。
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">认领后</div>
          <p className="mt-2 text-sm leading-7 text-slate-300">你的战队和比赛会排到最前面。</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">绑定数据</div>
          <p className="mt-2 text-sm leading-7 text-slate-300">会同步补全公开战绩画像。</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">可重置</div>
          <p className="mt-2 text-sm leading-7 text-slate-300">想切换身份，随时都能重新认领。</p>
        </article>
      </div>

      {storedBinding ? (
        <div className="mt-5 rounded-[28px] border border-emerald-400/25 bg-emerald-400/10 p-4">
          <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">当前已认领</div>
          <div className="mt-2 text-lg font-semibold text-white">{storedBinding.playerDisplayName ?? storedBinding.playerSlug}</div>
          <div className="mt-2 text-sm text-slate-300">{storedBinding.teamName ? `当前战队：${storedBinding.teamName}` : "当前尚未识别固定队"}</div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>选手</span>
          <select
            value={selectedPlayerId}
            onChange={(event) => setSelectedPlayerId(event.target.value)}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
          >
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.displayName}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          <span>SteamID</span>
          <input
            value={steamId}
            onChange={(event) => setSteamId(event.target.value)}
            className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
            placeholder="7656119xxxxxxxxxx"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleBind}
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {isPending ? "认领并生成报告中..." : "认领身份并生成报告"}
        </button>
        <button
          type="button"
          onClick={handleUnbind}
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200"
        >
          解绑本地身份
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
        {message}
      </div>

      {storedBinding ? (
        <div className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">
          当前本地身份：{storedBinding.playerSlug} / {storedBinding.steamId ?? "未填写"}
        </div>
      ) : null}
    </div>
  );
}
