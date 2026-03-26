"use client";

import Link from "next/link";
import { IdentityFeedbackMessage, IdentityFieldError, IdentityPendingNotice, IdentityPendingSkeleton } from "@/components/identity-feedback";
import { useIdentityAccountForms } from "@/hooks/use-identity-account-forms";
import type { IdentitySnapshot } from "@/lib/identity";
import { getIdentityStageLabel } from "@/lib/identity-meta";

export function IdentityAccountPanel({ identity }: { identity: IdentitySnapshot }) {
  const {
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerErrors,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginErrors,
    registerMessage,
    registerTone,
    loginMessage,
    loginTone,
    isRegisterPending,
    isLoginPending,
    isSignOutPending,
    submitRegister,
    submitLogin,
    submitLogout
  } = useIdentityAccountForms();

  if (identity.viewer) {
    return (
      <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">账号身份</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">身份中心</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">账号、Steam、申请和认证选手权限都围绕当前登录账号展开。</p>

        <div className="mt-6 space-y-4">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-100">当前账号</div>
            <div className="mt-2 text-2xl font-semibold text-white">{identity.viewer.name}</div>
            <div className="mt-2 text-sm text-slate-300">邮箱：{identity.viewer.email ?? "未填写"}</div>
            <div className="mt-2 text-sm text-slate-300">角色：{identity.viewer.role === "ADMIN" ? "管理员" : "普通账号"}</div>
            <div className="mt-2 text-sm text-slate-300">当前阶段：{getIdentityStageLabel(identity.stage)}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={submitLogout} disabled={isSignOutPending} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 disabled:opacity-60">
              {isSignOutPending ? "处理中..." : "退出当前账号"}
            </button>
            <Link href="/my/claims" className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:text-white">
              查看申请历史
            </Link>
            <Link href="/players" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:text-white">
              浏览选手名册
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">登录账号</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">已有账号直接登录</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">登录后会恢复你之前绑定的 Steam、申请进度和认证选手权限。</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitLogin();
          }}
          aria-busy={isLoginPending}
          className="mt-6 grid gap-4"
        >
          <label className="grid gap-2 text-sm text-slate-300">
            <span>邮箱</span>
            <input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="you@example.com" />
            <IdentityFieldError message={loginErrors.email} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            <span>密码</span>
            <input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="至少 8 位" />
            <IdentityFieldError message={loginErrors.password} />
          </label>
          {isLoginPending ? (
            <div className="space-y-3">
              <IdentityPendingNotice label="正在校验账号并创建登录会话，请稍候。" />
              <IdentityPendingSkeleton />
            </div>
          ) : null}
          {loginTone === "error" ? <IdentityFeedbackMessage message={loginMessage} tone={loginTone} /> : null}
          <div className="flex justify-end">
            <button type="submit" disabled={isLoginPending} className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
              {isLoginPending ? "登录中..." : "登录账号"}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-amber-200">注册账号</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">第一次使用先注册</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">注册后会自动登录。账号是身份流程的起点，后续所有绑定和审核都挂在这个账号上。</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitRegister();
          }}
          aria-busy={isRegisterPending}
          className="mt-6 grid gap-4"
        >
          <label className="grid gap-2 text-sm text-slate-300">
            <span>昵称</span>
            <input value={registerName} onChange={(event) => setRegisterName(event.target.value)} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="例如：夜航船" />
            <IdentityFieldError message={registerErrors.name} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            <span>邮箱</span>
            <input value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="you@example.com" />
            <IdentityFieldError message={registerErrors.email} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            <span>密码</span>
            <input type="password" value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="至少 8 位" />
            <IdentityFieldError message={registerErrors.password} />
          </label>
          {isRegisterPending ? (
            <div className="space-y-3">
              <IdentityPendingNotice label="正在创建账号并准备自动登录，请稍候。" />
              <IdentityPendingSkeleton />
            </div>
          ) : null}
          {registerTone === "error" ? <IdentityFeedbackMessage message={registerMessage} tone={registerTone} /> : null}
          <div className="flex justify-end">
            <button type="submit" disabled={isRegisterPending} className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
              {isRegisterPending ? "注册中..." : "注册并登录"}
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}