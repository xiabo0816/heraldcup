"use client";

import { useEffect, useState, useTransition } from "react";
import { PLAYER_BINDING_STORAGE_KEY, type LocalPlayerBinding } from "@/lib/local-binding";

type PlayerOption = {
  id: string;
  displayName: string;
  slug: string;
  steamId?: string | null;
};

export function PlayerBindingPanel({ players }: { players: PlayerOption[] }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id ?? "");
  const [steamId, setSteamId] = useState("");
  const [storedBinding, setStoredBinding] = useState<LocalPlayerBinding | null>(null);
  const [message, setMessage] = useState("选择选手并绑定 SteamID 后，会由服务端生成 OpenDota 报告。");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const raw = window.localStorage.getItem(PLAYER_BINDING_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const binding = JSON.parse(raw) as LocalPlayerBinding;
      setStoredBinding(binding);
      setSelectedPlayerId(binding.playerId);
      setSteamId(binding.steamId ?? "");
    } catch {
      window.localStorage.removeItem(PLAYER_BINDING_STORAGE_KEY);
    }
  }, []);

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
        steamId: steamId.trim()
      };
      window.localStorage.setItem(PLAYER_BINDING_STORAGE_KEY, JSON.stringify(binding));
      setStoredBinding(binding);
      setMessage(result.summary?.personaName ? `绑定成功，OpenDota 账号：${result.summary.personaName}` : "绑定成功，OpenDota 报告已刷新。");
    });
  }

  function handleUnbind() {
    window.localStorage.removeItem(PLAYER_BINDING_STORAGE_KEY);
    setStoredBinding(null);
    setSteamId("");
    setMessage("本地默认选手身份已解绑。后台绑定记录仍需管理员确认。");
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">My Identity</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">本地绑定 SteamID</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        localStorage 只负责默认展示当前选手身份，正式权限和 OpenDota 数据缓存由服务端控制。
      </p>

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
          className="rounded-full bg-accent-cyan px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60"
        >
          {isPending ? "生成报告中..." : "绑定并生成报告"}
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
