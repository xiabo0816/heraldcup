"use client";

import Link from "next/link";
import { ClaimPlayerDialog } from "@/components/claim-player-dialog";
import { IdentityFeedbackMessage, IdentityFieldError, IdentityPendingNotice, IdentityPendingSkeleton } from "@/components/identity-feedback";
import { MyActiveClaimPanel } from "@/components/my-active-claim-panel";
import { useIdentityWorkspaceState } from "@/hooks/use-identity-workspace-state";
import type { IdentitySnapshot } from "@/lib/identity";
import type { MyPagePlayer } from "@/lib/my-page-types";

export function MyIdentityWorkspace({
  identity,
  players
}: {
  identity: IdentitySnapshot;
  players: MyPagePlayer[];
}) {
  const { steamId, setSteamId, fieldErrors, message, tone, setMessage, bindingPending, bindSteam, cancelClaim } = useIdentityWorkspaceState(identity);

  if (!identity.viewer) {
    return null;
  }

  return (
    <div id="binding-panel" className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">Steam 身份</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">先绑定 Steam，再申请认领</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">Steam 身份只证明这个账号对应哪个外部玩家，不会直接授予任何选手权限。</p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm text-slate-300">
            <span>SteamID</span>
            <input value={steamId} onChange={(event) => setSteamId(event.target.value)} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="7656119xxxxxxxxxx" />
            <IdentityFieldError message={fieldErrors.steamId} />
          </label>
          <button type="button" onClick={bindSteam} disabled={bindingPending} className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
            {bindingPending ? "同步中..." : identity.binding ? "刷新 Steam 数据" : "绑定 Steam 身份"}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {bindingPending ? (
            <>
              <IdentityPendingNotice label={identity.binding ? "正在刷新当前账号的 Steam 资料，请稍候。" : "正在校验 SteamID 并绑定身份，请稍候。"} />
              <IdentityPendingSkeleton />
            </>
          ) : null}
          {tone === "error" ? <IdentityFeedbackMessage message={message} tone={tone} /> : null}
        </div>
      </section>

      {identity.binding && !identity.certifiedPlayer && !identity.activeClaim ? (
        <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="text-xs uppercase tracking-[0.28em] text-amber-300">认领申请</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">Steam 身份已经就绪，现在可以提交认领申请</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">申请通过前，这里仍然只是账号中心。真正的选手主页、战队管理和互评能力只会在审核通过后开放。</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ClaimPlayerDialog
              identity={identity}
              players={players.map((player) => ({ id: player.id, displayName: player.displayName, subtitle: player.teamName }))}
              triggerLabel="选择选手并提交申请"
              triggerClassName="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              title="选择目标选手并提交认领申请"
              description="提交之后，后台会根据 Steam 身份和补充说明审核这条申请。"
            />
            <Link href="/players" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              先去选手页看清楚再申请
            </Link>
            <Link href="/my/claims" className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white">
              查看历史申请
            </Link>
          </div>
        </section>
      ) : null}

      <MyActiveClaimPanel identity={identity} onCancel={cancelClaim} onMessage={setMessage} />
    </div>
  );
}