import Link from "next/link";
import type { IdentitySnapshot } from "@/lib/identity";

const claimStatusLabel: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
  CANCELLED: "已关闭"
};

export function MyRecentClaimsPanel({ identity }: { identity: IdentitySnapshot }) {
  if (!identity.viewer) {
    return null;
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">申请记录</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">最近的身份申请</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">当前页只预览最近几条，完整历史和审核备注请进入申请记录页查看。</p>
        </div>
        <Link href="/my/claims" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
          打开申请记录
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {identity.recentClaims.length ? identity.recentClaims.map((claim) => (
          <article key={claim.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{claimStatusLabel[claim.status] ?? claim.status}</div>
            <div className="mt-3 text-xl font-semibold text-white">{claim.playerDisplayName}</div>
            <div className="mt-2 text-sm text-slate-300">提交时间：{new Date(claim.submittedAt).toLocaleString("zh-CN")}</div>
            <div className="mt-2 text-sm leading-7 text-slate-400 whitespace-pre-wrap">{claim.reviewNote ?? claim.note ?? "暂无补充说明。"}</div>
          </article>
        )) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 lg:col-span-2 xl:col-span-3">当前账号还没有提交过认领申请。</div>
        )}
      </div>
    </section>
  );
}