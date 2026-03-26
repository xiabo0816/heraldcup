"use client";

import Link from "next/link";
import { IdentityFieldError, IdentityPendingNotice, IdentityPendingSkeleton } from "@/components/identity-feedback";
import { useClaimPlayerDialog, type ClaimDialogPlayer } from "@/hooks/use-claim-player-dialog";
import type { IdentitySnapshot } from "@/lib/identity";

export function ClaimPlayerDialog({
  identity,
  players,
  playerId,
  triggerLabel,
  triggerClassName,
  title,
  description
}: {
  identity: IdentitySnapshot;
  players: ClaimDialogPlayer[];
  playerId?: string;
  triggerLabel: string;
  triggerClassName: string;
  title?: string;
  description?: string;
}) {
  const {
    setSelectedPlayerId,
    note,
    setNote,
    isDialogOpen,
    error,
    fieldErrors,
    isPending,
    availablePlayers,
    activeSelectedPlayerId,
    selectedPlayer,
    canSubmitClaim,
    openDialog,
    closeDialog,
    submitClaim
  } = useClaimPlayerDialog({ identity, players, playerId });
  const resolvedTitle = title ?? (selectedPlayer ? `提交 ${selectedPlayer.displayName} 的认领申请` : "提交认领申请");
  const resolvedDescription = description ?? "申请通过前，站内账号、Steam 身份和选手实体会保持分离；审核通过后才会成为正式认证选手。";

  return (
    <>
      <button type="button" onClick={openDialog} className={triggerClassName}>
        {triggerLabel}
      </button>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitClaim();
            }}
            aria-busy={isPending}
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
                onClick={closeDialog}
                disabled={isPending}
                className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white disabled:opacity-60"
              >
                关闭
              </button>
            </div>

            {canSubmitClaim ? (
              <>
                {playerId ? null : (
                  <label className="mt-6 grid gap-2 text-sm text-slate-300">
                    <span>选手</span>
                    <select
                      value={activeSelectedPlayerId}
                      onChange={(event) => setSelectedPlayerId(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none"
                    >
                      {availablePlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.displayName}{player.subtitle ? ` · ${player.subtitle}` : ""}
                        </option>
                      ))}
                    </select>
                    <IdentityFieldError message={fieldErrors.playerId} />
                  </label>
                )}

                <label className="mt-6 grid gap-2 text-sm text-slate-300">
                  <span>补充说明</span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={4}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none"
                    placeholder="可以补充常用昵称、社区比赛经历或其他便于管理员核验的信息。"
                  />
                  <IdentityFieldError message={fieldErrors.note} />
                </label>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
                  当前账号已经完成 Steam 绑定。申请提交后，你的站内账号会进入待审核状态，只有管理员通过后才会正式拿到这位选手的身份。
                </div>

                {isPending ? (
                  <div className="mt-4 space-y-3">
                    <IdentityPendingNotice label="正在提交认领申请并等待服务端确认，请稍候。" />
                    <IdentityPendingSkeleton />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-300">
                {!identity.viewer ? "当前还没有登录，先去“我的”页注册或登录，再回来提交认领申请。" : null}
                {identity.viewer && !identity.binding ? "当前账号还没有绑定 Steam 身份，先去“我的”页完成 Steam 绑定。" : null}
                {identity.certifiedPlayer ? `当前账号已经认证为 ${identity.certifiedPlayer.displayName}，无需重复提交申请。` : null}
                {!identity.certifiedPlayer && identity.activeClaim ? `当前已经提交了 ${identity.activeClaim.playerDisplayName} 的认领申请，请先等待后台审核。` : null}

                <div className="mt-4">
                  <Link href="/my" className="inline-flex rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950">
                    前往身份中心
                  </Link>
                </div>
              </div>
            )}

            {error ? (
              <div className="mt-4 rounded-[22px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white disabled:opacity-60"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isPending || !canSubmitClaim}
                className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
              >
                {isPending ? "提交中..." : "提交申请"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}