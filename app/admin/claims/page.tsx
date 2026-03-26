import Link from "next/link";
import { reviewClaimRequestAction } from "@/app/admin/claims/actions";
import { Shell } from "@/components/shell";
import { getAdminClaimRequestsData } from "@/lib/admin-queries";

const statusLabel: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
  CANCELLED: "已关闭"
};

export default async function AdminClaimsPage() {
  const claimRequests = await getAdminClaimRequestsData();

  return (
    <Shell>
      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
              <h1 className="mt-2 text-3xl font-semibold text-white">选手认领审核</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">这里把账号、Steam 身份和目标选手拆开呈现。审核通过后，User.playerId 才会正式落到选手实体上。</p>
            </div>
            <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
              返回后台首页
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {claimRequests.length ? claimRequests.map((claim) => (
            <article key={claim.id} className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{statusLabel[claim.status] ?? claim.status}</div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    <Link href={`/admin/claims/${claim.id}`} className="transition hover:text-cyan-100">
                      {claim.player.displayName} · {claim.applicant.name}
                    </Link>
                  </h2>
                  <div className="mt-2 text-sm text-slate-300">目标选手当前战队：{claim.player.teamName}</div>
                  <div className="mt-1 text-sm text-slate-400">申请时间：{new Date(claim.submittedAt).toLocaleString("zh-CN")}</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  SteamID {claim.submittedSteamId}
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">账号信息</div>
                  <div className="mt-2">昵称：{claim.applicant.name}</div>
                  <div className="mt-1">邮箱：{claim.applicant.email ?? "未填写"}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Steam 绑定</div>
                  <div className="mt-2">状态：{claim.binding.status}</div>
                  <div className="mt-1">最近同步：{claim.binding.lastBoundAt ? new Date(claim.binding.lastBoundAt).toLocaleString("zh-CN") : "尚未同步"}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">申请说明</div>
                  <div className="mt-2 whitespace-pre-wrap">{claim.note ?? "申请人没有补充备注。"}</div>
                </div>
              </div>

              <form action={reviewClaimRequestAction} className="mt-5 grid gap-3 rounded-[20px] border border-white/10 bg-slate-950/45 p-4">
                <input type="hidden" name="claimRequestId" value={claim.id} />
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>审核备注</span>
                  <textarea name="reviewNote" rows={3} defaultValue={claim.reviewNote ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="例如：已核对 Steam 数据与社区记录。" />
                </label>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/admin/claims/${claim.id}`} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100">
                    查看详情
                  </Link>
                  {claim.status === "PENDING" ? (
                    <>
                      <button name="decision" value="APPROVE" className="rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950">
                        批准认领
                      </button>
                      <button name="decision" value="REJECT" className="rounded-full border border-rose-400/30 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100">
                        拒绝申请
                      </button>
                      <button name="decision" value="CANCEL" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100">
                        关闭申请
                      </button>
                    </>
                  ) : (
                    <button name="decision" value="SAVE" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100">
                      更新审核备注
                    </button>
                  )}
                </div>

                <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
                  <div>当前备注：{claim.reviewNote ?? "暂无审核备注。"}</div>
                  <div className="mt-2 text-slate-400">审核人：{claim.reviewerName ?? "未记录"}</div>
                  <div className="mt-1 text-slate-400">处理时间：{claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString("zh-CN") : "尚未处理"}</div>
                </div>
              </form>
            </article>
          )) : (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-panel/80 p-6 text-sm leading-7 text-slate-400">当前还没有待处理的认领申请。</div>
          )}
        </div>
      </section>
    </Shell>
  );
}