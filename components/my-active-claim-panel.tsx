"use client";

import Link from "next/link";
import { useTransition } from "react";
import { IdentityPendingNotice } from "@/components/identity-feedback";
import type { IdentityActionFeedback } from "@/lib/identity-client-types";
import type { IdentityFeedbackTone } from "@/lib/identity-client-types";
import type { IdentitySnapshot } from "@/lib/identity";

export function MyActiveClaimPanel({
  identity,
  onCancel,
  onMessage
}: {
  identity: IdentitySnapshot;
  onCancel: (claimRequestId: string) => Promise<IdentityActionFeedback>;
  onMessage: (message: string, tone?: IdentityFeedbackTone) => void;
}) {
  const [isPending, startTransition] = useTransition();

  if (!identity.activeClaim) {
    return null;
  }

  const activeClaim = identity.activeClaim;

  function handleCancel() {
    startTransition(async () => {
      const result = await onCancel(activeClaim.id);
      onMessage(result.message, result.ok ? "success" : "error");
    });
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-amber-200">审核进度</div>
      <h2 className="mt-2 text-3xl font-semibold text-white">正在等待 {activeClaim.playerDisplayName} 的审核结果</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">申请选手</div>
          <div className="mt-3 text-xl font-semibold text-white">{activeClaim.playerDisplayName}</div>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">提交时间</div>
          <div className="mt-3 text-sm font-semibold text-white">{new Date(activeClaim.submittedAt).toLocaleString("zh-CN")}</div>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">绑定 SteamID</div>
          <div className="mt-3 text-sm font-semibold text-white">{activeClaim.submittedSteamId}</div>
        </article>
      </div>

      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
        {activeClaim.note ?? "申请时未填写补充说明。"}
      </div>

      {isPending ? <div className="mt-5"><IdentityPendingNotice label="正在撤回当前认领申请，请稍候。" /></div> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white disabled:opacity-60"
        >
          {isPending ? "取消中..." : "取消当前申请"}
        </button>
        <Link href="/players" className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white">
          返回选手页重新选择
        </Link>
        <Link href="/my/claims" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white">
          查看全部申请记录
        </Link>
      </div>
    </section>
  );
}