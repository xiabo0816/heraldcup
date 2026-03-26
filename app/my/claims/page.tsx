import Link from "next/link";
import { Shell } from "@/components/shell";
import { getCurrentIdentitySnapshot, getViewerClaimHistory } from "@/lib/identity";

const statusLabel: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
  CANCELLED: "已关闭"
};

export default async function MyClaimsPage() {
  const identity = await getCurrentIdentitySnapshot();

  if (!identity.viewer) {
    return (
      <Shell>
        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">申请历史</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">先登录，再查看你的申请记录</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">申请记录现在和正式账号绑定，不再跟浏览器本地状态走。登录后才能看到自己的历史。</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/my" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950">
                前往身份中心登录
              </Link>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  const claims = await getViewerClaimHistory(identity.viewer.id);

  return (
    <Shell>
      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">申请历史</div>
              <h1 className="mt-2 text-3xl font-semibold text-white">{identity.viewer.name} 的认领记录</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">这里会保存你提交过的所有认领申请，包括通过、拒绝和主动关闭的记录。当前待审核申请仍然可以回到身份中心进行取消。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/my" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
                返回身份中心
              </Link>
              <Link href="/players" className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                浏览选手
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {claims.length ? claims.map((claim) => (
            <article key={claim.id} className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{statusLabel[claim.status] ?? claim.status}</div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{claim.player.displayName}</h2>
                  <div className="mt-2 text-sm text-slate-300">目标战队：{claim.player.teamMemberships[0]?.team.name ?? "自由选手"}</div>
                  <div className="mt-1 text-sm text-slate-400">提交时间：{new Date(claim.submittedAt).toLocaleString("zh-CN")}</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  SteamID {claim.submittedSteamId}
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">申请说明</div>
                  <div className="mt-2 whitespace-pre-wrap">{claim.note ?? "提交时未填写补充说明。"}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">审核备注</div>
                  <div className="mt-2 whitespace-pre-wrap">{claim.reviewNote ?? "暂无审核备注。"}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">处理信息</div>
                  <div className="mt-2">审核人：{claim.reviewedBy?.name ?? "未处理"}</div>
                  <div className="mt-1">处理时间：{claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString("zh-CN") : "尚未处理"}</div>
                  <div className="mt-1">绑定状态：{claim.binding.status}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/players/${claim.playerId}`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
                  查看目标选手
                </Link>
                {claim.status === "PENDING" ? (
                  <Link href="/my" className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">
                    返回身份中心处理当前申请
                  </Link>
                ) : null}
              </div>
            </article>
          )) : (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-panel/80 p-6 text-sm leading-7 text-slate-400">当前账号还没有提交过认领申请。</div>
          )}
        </div>
      </section>
    </Shell>
  );
}