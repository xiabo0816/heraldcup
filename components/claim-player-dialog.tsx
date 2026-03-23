"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  readLocalPlayerBinding,
  subscribeToLocalPlayerBinding,
  writeLocalPlayerBinding,
  type LocalPlayerBinding
} from "@/lib/local-binding";

type ClaimDialogPlayer = {
  id: string;
  displayName: string;
  subtitle?: string;
};

type BindingResponse = {
  message?: string;
  summary?: {
    personaName?: string | null;
  };
  binding?: LocalPlayerBinding;
};

export function ClaimPlayerDialog({
  players,
  playerId,
  triggerLabel,
  triggerClassName,
  title,
  description
}: {
  players: ClaimDialogPlayer[];
  playerId?: string;
  triggerLabel: string;
  triggerClassName: string;
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(playerId ?? players[0]?.id ?? "");
  const [steamId, setSteamId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
    return subscribeToLocalPlayerBinding(setBinding);
  }, []);

  const availablePlayers = useMemo(
    () => (playerId ? players.filter((player) => player.id === playerId) : players),
    [playerId, players]
  );
  const activeSelectedPlayerId = playerId ?? selectedPlayerId;
  const selectedPlayer = availablePlayers.find((player) => player.id === activeSelectedPlayerId) ?? availablePlayers[0] ?? null;
  const resolvedTitle = title ?? (selectedPlayer ? `输入 SteamID，绑定到 ${selectedPlayer.displayName}` : "认领身份");
  const resolvedDescription = description ?? "认领完成后会直接进入你的个人页，并自动拉起这位选手的社区比赛和 OpenDota 最近比赛信息。";

  function syncSteamId(nextPlayerId: string) {
    setSteamId(nextPlayerId === binding?.playerId ? (binding.steamId ?? "") : "");
  }

  function handleOpenDialog() {
    const nextPlayerId = playerId ?? binding?.playerId ?? availablePlayers[0]?.id ?? "";
    setSelectedPlayerId(nextPlayerId);
    syncSteamId(nextPlayerId);
    setError(null);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    if (isPending) {
      return;
    }

    setIsDialogOpen(false);
    setError(null);
  }

  function handleClaim() {
    const trimmedSteamId = steamId.trim();

    if (!activeSelectedPlayerId) {
      setError("请先选择要认领的选手。");
      return;
    }

    if (!trimmedSteamId) {
      setError("请先输入要认领的 SteamID。");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/bindings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            playerId: activeSelectedPlayerId,
            steamId: trimmedSteamId
          })
        });

        const result = (await response.json()) as BindingResponse;

        if (!response.ok || !result.binding) {
          setError(result.message ?? "认领失败，请稍后重试。");
          return;
        }

        writeLocalPlayerBinding(result.binding);
        setBinding(result.binding);
        setIsDialogOpen(false);
        router.push("/my");
        router.refresh();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "认领失败，请稍后重试。");
      }
    });
  }

  return (
    <>
      <button type="button" onClick={handleOpenDialog} className={triggerClassName}>
        {triggerLabel}
      </button>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleClaim();
            }}
            className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(3,7,18,0.98),rgba(12,18,31,0.96))] p-6 shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">认领身份</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">{resolvedTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{resolvedDescription}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseDialog}
                disabled={isPending}
                className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white disabled:opacity-60"
              >
                关闭
              </button>
            </div>

            {playerId ? null : (
              <label className="mt-6 grid gap-2 text-sm text-slate-300">
                <span>选手</span>
                <select
                  value={activeSelectedPlayerId}
                  onChange={(event) => {
                    setSelectedPlayerId(event.target.value);
                    syncSteamId(event.target.value);
                  }}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none"
                >
                  {availablePlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.displayName}{player.subtitle ? ` · ${player.subtitle}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="mt-6 grid gap-2 text-sm text-slate-300">
              <span>SteamID</span>
              <input
                value={steamId}
                onChange={(event) => setSteamId(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none"
                placeholder="7656119xxxxxxxxxx"
              />
            </label>

            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
              如果这个 SteamID 已经属于站内已有选手，系统会自动匹配到正确身份；否则会为你补建选手档案并同步战绩摘要。
            </div>

            {error ? (
              <div className="mt-4 rounded-[22px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDialog}
                disabled={isPending}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white disabled:opacity-60"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
              >
                {isPending ? "认领中..." : "确认认领"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}