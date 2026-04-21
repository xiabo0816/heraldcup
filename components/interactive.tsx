"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { loginAction, registerAction } from "@/lib/actions";
import { cn } from "@/lib/site-utils";

type ActionButtonProps = {
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  successMessage: string;
  variant?: "default" | "danger";
  helperHref?: string;
  helperLabel?: string;
};

export function ActionButton({
  label,
  title,
  description,
  confirmLabel,
  successMessage,
  variant = "default",
  helperHref,
  helperLabel
}: ActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const buttonClass = useMemo(
    () =>
      variant === "danger"
        ? "danger-shell text-[color:var(--md-sys-color-on-error-container)]"
        : "theme-highlight-shell",
    [variant]
  );

  return (
    <div className="space-y-3">
      <button
        className={cn(
          "w-full rounded-xl border px-4 py-3 text-left text-sm transition hover:-translate-y-0.5",
          buttonClass
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="font-semibold">{label}</div>
        <div className="mt-1 text-xs text-secondary">{description}</div>
      </button>
      {submitted ? (
        <div className="theme-success-shell rounded-xl px-4 py-3 text-sm text-[color:var(--md-sys-color-on-surface)]">
          {successMessage}
        </div>
      ) : null}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="modal-surface w-full max-w-md rounded-2xl border p-6 shadow-2xl">
            <div className="eyebrow">动作确认</div>
            <h3 className="mt-2 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-secondary">{description}</p>
            <label className="mt-4 block text-sm text-secondary">
              补充说明
              <textarea
                className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2"
                defaultValue=""
                placeholder="补充说明这次操作的背景、安排或你希望对方了解的信息。"
              />
            </label>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-semibold",
                  variant === "danger"
                    ? "theme-danger-button"
                    : "theme-highlight-button"
                )}
                onClick={() => {
                  setSubmitted(true);
                  setOpen(false);
                }}
                type="button"
              >
                {confirmLabel}
              </button>
              <button
                className="theme-outline-button rounded-xl border px-4 py-2 text-sm"
                onClick={() => setOpen(false)}
                type="button"
              >
                取消
              </button>
              {helperHref && helperLabel ? (
                <Link className="theme-link ml-auto text-sm" href={helperHref}>
                  {helperLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SearchDialog({
  items,
  currentQuery
}: {
  items: { title: string; href: string; group: string; meta: string }[];
  currentQuery?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(currentQuery ?? "");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items.slice(0, 8);
    }

    return items.filter((item) => {
      const source = `${item.title} ${item.group} ${item.meta}`.toLowerCase();
      return source.includes(normalized);
    });
  }, [items, query]);

  return (
    <>
      <button
        className="theme-outline-button rounded-xl border px-3 py-2 text-sm transition"
        onClick={() => setOpen(true)}
        type="button"
      >
        搜索
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 px-4 py-12" onClick={() => setOpen(false)}>
          <div
            className="modal-surface mx-auto max-w-4xl rounded-2xl border p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="eyebrow">站内搜索</div>
                <div className="mt-1 text-sm text-secondary">
                  分组显示比赛、赛季、选手、战队和操作入口。
                </div>
              </div>
              <button
                className="theme-outline-button rounded-xl border px-3 py-2 text-sm"
                onClick={() => setOpen(false)}
                type="button"
              >
                关闭
              </button>
            </div>
            <input
              autoFocus
              className="input-shell mt-4 rounded-xl px-4 py-3"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索比赛、赛季、选手、战队、规则或我的入口"
              value={query}
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {filtered.length ? (
                filtered.map((item) => (
                  <Link
                    className="surface-panel rounded-xl px-4 py-3 transition hover:border-[color:var(--md-sys-color-primary)]"
                    href={item.href}
                    key={`${item.group}-${item.href}`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="theme-link text-xs">{item.group}</div>
                    <div className="mt-1 font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-secondary">{item.meta}</div>
                  </Link>
                ))
              ) : (
                <div className="surface-panel rounded-xl px-4 py-6 text-sm text-secondary md:col-span-2">
                  没有匹配结果。可以回到比赛、选手或规则页继续查找。
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function AuthTabsPanel({ redirectTo }: { redirectTo?: string }) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="space-y-5">
      <div className="flex gap-4 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <button
          className={cn(
            "pb-2 text-sm font-semibold transition",
            activeTab === "login" ? "border-b-2 border-[color:var(--md-sys-color-scope-primary)] text-[color:var(--md-sys-color-on-surface)]" : "text-secondary"
          )}
          onClick={() => setActiveTab("login")}
          type="button"
        >
          登录
        </button>
        <button
          className={cn(
            "pb-2 text-sm font-semibold transition",
            activeTab === "register" ? "border-b-2 border-[color:var(--md-sys-color-scope-primary)] text-[color:var(--md-sys-color-on-surface)]" : "text-secondary"
          )}
          onClick={() => setActiveTab("register")}
          type="button"
        >
          注册
        </button>
      </div>

      {activeTab === "login" ? (
        <form action={loginAction} className="grid gap-4">
          <input name="redirectTo" type="hidden" value={redirectTo ?? "/my"} />
          <label className="text-sm text-secondary">
            邮箱
            <input className="input-shell mt-1.5 rounded-lg px-3 py-2" name="email" required type="email" />
          </label>
          <label className="text-sm text-secondary">
            密码
            <input className="input-shell mt-1.5 rounded-lg px-3 py-2" name="password" required type="password" />
          </label>
          <label className="flex items-center gap-2 text-sm text-secondary">
            <input className="h-4 w-4 accent-[color:var(--md-sys-color-scope-primary)]" name="remember" type="checkbox" value="1" />
            <span>记住我，7 天内免登录</span>
          </label>
          <button className="theme-highlight-button mt-1 rounded-lg px-4 py-2.5 text-sm" type="submit">
            登录
          </button>
        </form>
      ) : (
        <form action={registerAction} className="grid gap-4">
          <input name="redirectTo" type="hidden" value={redirectTo ?? "/my"} />
          <label className="text-sm text-secondary">
            昵称
            <input className="input-shell mt-1.5 rounded-lg px-3 py-2" name="name" required />
          </label>
          <label className="text-sm text-secondary">
            邮箱
            <input className="input-shell mt-1.5 rounded-lg px-3 py-2" name="email" required type="email" />
          </label>
          <label className="text-sm text-secondary">
            密码
            <input className="input-shell mt-1.5 rounded-lg px-3 py-2" name="password" required type="password" />
          </label>
          <button className="theme-highlight-button mt-1 rounded-lg px-4 py-2.5 text-sm" type="submit">
            创建账号
          </button>
        </form>
      )}
    </div>
  );
}