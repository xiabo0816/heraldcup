"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchDialog } from "@/components/interactive";
import { logoutAction } from "@/lib/actions";
import { objectNav, toolsNav } from "@/lib/site-data";
import type { Viewer } from "@/lib/session";
import { cn, withQuery } from "@/lib/site-utils";

const THEME_STORAGE_KEY = "heraldcup.theme";
type SiteTheme = "radiant" | "dire";

function normalizeTheme(theme: string | null): SiteTheme {
  return theme === "dire" || theme === "night" ? "dire" : "radiant";
}

export function SiteShell({
  children,
  searchItems,
  viewer
}: {
  children: React.ReactNode;
  searchItems: { title: string; href: string; group: string; meta: string }[];
  viewer: Viewer | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scope = searchParams.get("scope") ?? "all";
  const [theme, setTheme] = useState<SiteTheme>("radiant");

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = normalizeTheme(storedTheme);

    root.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme: SiteTheme = theme === "radiant" ? "dire" : "radiant";

    root.dataset.theme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  const buildHref = (href: string, preserveScope = false) =>
    withQuery(href, {
      scope: preserveScope ? scope : undefined
    });

  return (
    <div className="app-shell min-h-screen pb-10">
      <header className="site-header sticky top-0 z-40 backdrop-blur-xl">
        <div className="page-shell flex flex-col gap-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6">
              <Link className="brand-mark text-lg font-semibold tracking-[0.08em]" href={buildHref("/")}>今晚就来社区</Link>
              <nav className="flex flex-wrap items-center gap-2 text-sm">
                {objectNav.map((item) => (
                  <Link
                    className={cn(
                      "rounded-xl px-3 py-2 transition",
                      pathname.startsWith(item.href)
                        ? "bg-[var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]"
                        : "text-secondary hover:text-[color:var(--md-sys-color-on-surface)]"
                    )}
                    href={buildHref(item.href, true)}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="theme-outline-button rounded-xl border px-3 py-2 text-sm transition"
                onClick={toggleTheme}
                type="button"
              >
                {theme === "radiant" ? "切换夜魇主题" : "切换天辉主题"}
              </button>
              <SearchDialog items={searchItems} />
              {toolsNav.filter((item) => item.href !== "/admin" || viewer?.user.role === "ADMIN").map((item) => (
                <Link
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm transition",
                    pathname.startsWith(item.href)
                      ? "bg-[var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]"
                      : "text-secondary hover:text-[color:var(--md-sys-color-on-surface)]"
                  )}
                  href={buildHref(item.href)}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
              {viewer ? (
                <form action={logoutAction}>
                  <button className="theme-outline-button rounded-xl border px-3 py-2 text-sm transition" type="submit">
                    退出
                  </button>
                </form>
              ) : (
                <Link className="theme-outline-button rounded-xl border px-3 py-2 text-sm transition" href="/login">
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="page-shell py-8">{children}</main>
      <footer className="site-footer border-t border-[var(--md-sys-color-outline-variant)]">
        <div className="page-shell pt-10 pb-10">
          <div className="grid gap-8 text-sm md:grid-cols-4">
            <div>
              <div className="eyebrow text-xs uppercase tracking-[0.16em] text-[var(--md-sys-color-on-surface-variant)]">品牌</div>
              <div className="mt-3 text-base font-semibold text-[color:var(--md-sys-color-on-surface)]">今晚就来社区</div>
              <p className="mt-3 text-[var(--md-sys-color-on-surface-variant)]">第一期围绕比赛、选手、战队、我的与后台审核链路组织。</p>
            </div>
            <div>
              <div className="eyebrow text-xs uppercase tracking-[0.16em] text-[var(--md-sys-color-on-surface-variant)]">对象频道</div>
              <div className="mt-3 space-y-2">
                {objectNav.map((item) => (
                  <div key={item.href}>
                    <Link 
                      className="text-secondary transition hover:text-[color:var(--md-sys-color-on-surface)]"
                      href={buildHref(item.href, true)}
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow text-xs uppercase tracking-[0.16em] text-[var(--md-sys-color-on-surface-variant)]">工具与规则</div>
              <div className="mt-3 space-y-2">
                <div>
                  <Link 
                    className="text-secondary transition hover:text-[color:var(--md-sys-color-on-surface)]"
                    href={buildHref("/my")}
                  >
                    我的主页
                  </Link>
                </div>
                <div>
                  <Link 
                    className="text-secondary transition hover:text-[color:var(--md-sys-color-on-surface)]"
                    href={buildHref("/guide")}
                  >
                    新手指引
                  </Link>
                </div>
                <div>
                  <Link 
                    className="text-secondary transition hover:text-[color:var(--md-sys-color-on-surface)]"
                    href={buildHref("/rules")}
                  >
                    规则
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="eyebrow text-xs uppercase tracking-[0.16em] text-[var(--md-sys-color-on-surface-variant)]">版权</div>
              <p className="mt-3 text-[var(--md-sys-color-on-surface-variant)]">Herald Cup · 社区赛事、选手归属与队伍协作入口。</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}