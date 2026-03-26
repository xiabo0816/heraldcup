"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bell, CalendarDays, CircleUserRound, Home, Shield, Sparkles, Sword, Users } from "lucide-react";
import { HeaderSearch } from "@/components/header-search";
import type { IdentitySnapshot } from "@/lib/identity";
import type { SiteSearchItem } from "@/lib/queries";

const links = [
  { href: "/", label: "首页", icon: Home },
  { href: "/matches", label: "比赛", icon: CalendarDays },
  { href: "/players", label: "选手", icon: Sword },
  { href: "/teams", label: "战队", icon: Shield },
  { href: "/community", label: "社区", icon: Users },
  { href: "/heroes", label: "英雄", icon: Sparkles }
];

const EMPTY_LINES: string[] = [];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const DEFAULT_HOME_HINT = "点 Logo 回首页，赛程、战队和英雄都放在最前面。";

type HeaderTopHero = {
  heroId: number;
  heroName: string;
  games: number;
};

type HeaderTopHeroResponse = {
  topHeroes?: HeaderTopHero[];
};

type HeroVoiceLinesResponse = {
  headerLines?: string[];
  message?: string;
};

export function SiteHeader({
  searchItems,
  identity
}: {
  searchItems: SiteSearchItem[];
  identity: IdentitySnapshot;
}) {
  const pathname = usePathname();
  const [topHero, setTopHero] = useState<HeaderTopHero | null>(null);
  const [heroLines, setHeroLines] = useState<string[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  useEffect(() => {
    const steamId = identity.binding?.steamId ?? null;

    if (!steamId) {
      setTopHero(null);
      return;
    }

    const controller = new AbortController();

    async function loadTopHero() {
      try {
        const response = await fetch(`/api/my/opendota?steamId=${encodeURIComponent(String(steamId))}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          setTopHero(null);
          return;
        }

        const payload = await response.json() as HeaderTopHeroResponse;
        setTopHero(payload.topHeroes?.[0] ?? null);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setTopHero(null);
      }
    }

    void loadTopHero();

    return () => controller.abort();
  }, [identity.binding?.steamId]);

  useEffect(() => {
    if (pathname !== "/" || !topHero?.heroId) {
      setHeroLines([]);
      return;
    }

    const controller = new AbortController();
    const heroId = String(topHero.heroId);
    const heroName = topHero.heroName;
    const heroGames = String(topHero.games);

    async function loadHeroLines() {
      try {
        const response = await fetch(`/api/heroes/voice-lines?heroId=${encodeURIComponent(heroId)}&heroName=${encodeURIComponent(heroName)}&games=${encodeURIComponent(heroGames)}`, {
          cache: "no-store",
          signal: controller.signal
        });

        const payload = await response.json() as HeroVoiceLinesResponse;
        setHeroLines(payload.headerLines ?? []);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setHeroLines([]);
      }
    }

    void loadHeroLines();

    return () => controller.abort();
  }, [pathname, topHero?.games, topHero?.heroId, topHero?.heroName]);

  const heroHeaderLines = pathname === "/" ? heroLines : EMPTY_LINES;

  useEffect(() => {
    setActiveLineIndex(0);

    if (heroHeaderLines.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveLineIndex((current) => (current + 1) % heroHeaderLines.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [heroHeaderLines]);

  const headerHint = heroHeaderLines[activeLineIndex] ?? DEFAULT_HOME_HINT;
  const identityLabel = identity.certifiedPlayer
    ? `${identity.certifiedPlayer.displayName} 的个人页`
    : identity.viewer
      ? "身份中心"
      : "登录 / 注册";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 md:justify-self-start">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(16,185,129,0.88))] text-base font-bold text-slate-950 shadow-glow">
            今
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-white/80" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-[0.18em] text-slate-100">今晚就来</div>
            <div className="mt-1 min-h-[1rem] text-xs text-slate-400" aria-live="polite">
              <span key={`${topHero?.heroId ?? "default"}-${activeLineIndex}`} className="header-quote-animate">
                {headerHint}
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-2 text-sm text-slate-300 lg:flex lg:justify-self-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 transition",
                isActivePath(pathname, link.href)
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 lg:justify-self-end">
          <Link
            href="/community/announcements"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:border-cyan-300/35 hover:text-white xl:inline-flex"
          >
            <Bell className="h-3.5 w-3.5" />
            公告
          </Link>
          <HeaderSearch items={searchItems} />
          <Link
            href="/my"
            aria-label={identityLabel}
            title={identityLabel}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            <CircleUserRound className="h-4 w-4" />
            <span className="hidden text-sm font-semibold sm:inline">{identity.certifiedPlayer ? "我的" : identity.viewer ? "身份" : "登录"}</span>
          </Link>
          <Link href="/admin" className="hidden rounded-xl border border-white/10 px-3 py-2.5 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white xl:inline-flex">
            后台
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-4 pb-4 text-sm text-slate-300 sm:px-6 lg:hidden lg:px-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "inline-flex whitespace-nowrap rounded-xl border border-white/10 px-4 py-2.5 transition",
              isActivePath(pathname, link.href)
                ? "bg-white/[0.08] text-white"
                : "text-slate-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
