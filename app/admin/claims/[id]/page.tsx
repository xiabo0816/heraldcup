import Link from "next/link";
import { notFound } from "next/navigation";
import { reviewClaimRequestAction } from "@/app/admin/claims/actions";
import { Shell } from "@/components/shell";
import { getAdminClaimRequestDetailData } from "@/lib/admin-queries";

const statusLabel: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
  CANCELLED: "已关闭"
};

export default async function AdminClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = await getAdminClaimRequestDetailData(id);

  if (!claim) {
    notFound();
  }

  return (
    <Shell>
      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
              <h1 className="mt-2 text-3xl font-semibold text-white">{claim.player.displayName} 的认领详情</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">这里保留单条申请的账号、Steam 绑定、目标选手和审核信息，适合做最终判断和留痕。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/claims" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
                返回审核列表
              </Link>
              <Link href={`/players/${claim.player.id}`} className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                打开选手页
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <article className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">申请概览</div>
              <div className="mt-3 text-2xl font-semibold text-white">{statusLabel[claim.status] ?? claim.status}</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div>申请人：{claim.applicant.name}</div>
                  <div>邮箱：{claim.applicant.email ?? "未填写"}</div>
                  <div>账号角色：{claim.applicant.role}</div>
                  <div>注册时间：{new Date(claim.applicant.createdAt).toLocaleString("zh-CN")}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div>目标选手：{claim.player.displayName}</div>
                  <div>当前战队：{claim.player.teamName}</div>
                  <div>提交时间：{new Date(claim.submittedAt).toLocaleString("zh-CN")}</div>
                  <div>处理时间：{claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString("zh-CN") : "尚未处理"}</div>
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Steam 绑定与核验</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div>提交 SteamID：{claim.submittedSteamId}</div>
                  <div>绑定 SteamID：{claim.binding.steamId}</div>
                  <div>OpenDota ID：{claim.binding.openDotaId ?? "未解析"}</div>
                  <div>绑定状态：{claim.binding.status}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  <div>最近同步：{claim.binding.lastBoundAt ? new Date(claim.binding.lastBoundAt).toLocaleString("zh-CN") : "尚未同步"}</div>
                  <div>目标选手已有 SteamID：{claim.player.steamId ?? "尚未写入"}</div>
                  <div className="mt-2 whitespace-pre-wrap">错误记录：{claim.binding.lastError ?? "无"}</div>
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">申请材料</div>
              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
                {claim.note ?? "申请人没有填写补充说明。"}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">审核操作</div>
              <form action={reviewClaimRequestAction} className="mt-4 grid gap-3">
                <input type="hidden" name="claimRequestId" value={claim.id} />
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>审核备注</span>
                  <textarea name="reviewNote" rows={5} defaultValue={claim.reviewNote ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="填写核验依据、拒绝原因或备注说明。" />
                </label>

                <div className="flex flex-wrap gap-3">
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
                      更新备注
                    </button>
                  )}
                </div>
              </form>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">审核留痕</div>
              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                <div>当前备注：{claim.reviewNote ?? "暂无审核备注。"}</div>
                <div className="mt-2">审核人：{claim.reviewer?.name ?? "未记录"}</div>
                <div className="mt-1">审核邮箱：{claim.reviewer?.email ?? "未记录"}</div>
                <div className="mt-1">处理时间：{claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString("zh-CN") : "尚未处理"}</div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Shell>
  );
}