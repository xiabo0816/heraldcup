"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CalendarDays, Shield, Sparkles, Sword } from "lucide-react";
import { ClaimPlayerDialog } from "@/components/claim-player-dialog";
import { HeaderSearch } from "@/components/header-search";
import { readLocalPlayerBinding, subscribeToLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";
import type { SiteSearchItem } from "@/lib/queries";

const links = [
  { href: "/matches", label: "赛程", icon: CalendarDays },
  { href: "/teams", label: "战队", icon: Shield },
  { href: "/players", label: "选手", icon: Sword },
  { href: "/heroes", label: "英雄", icon: Sparkles }
];

function isActivePath(pathname: string, href: string) {
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

export function SiteHeader({ searchItems }: { searchItems: SiteSearchItem[] }) {
  const pathname = usePathname();
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);
  const [topHero, setTopHero] = useState<HeaderTopHero | null>(null);
  const [heroLines, setHeroLines] = useState<string[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const claimPlayers = searchItems
    .filter((item) => item.type === "player")
    .map((item) => ({
      id: item.id.replace(/^player:/, ""),
      displayName: item.title,
      subtitle: item.subtitle
    }));

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
    return subscribeToLocalPlayerBinding(setBinding);
  }, []);

  useEffect(() => {
    if (!binding?.steamId) {
      setTopHero(null);
      return;
    }

    const controller = new AbortController();

    async function loadTopHero() {
      try {
        const response = await fetch(`/api/my/opendota?steamId=${encodeURIComponent(binding.steamId ?? "")}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          setTopHero(null);
          return;
        }

        const payload = await response.json() as HeaderTopHeroResponse;
        setTopHero(payload.topHeroes?.[0] ?? null);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setTopHero(null);
      }
    }

    void loadTopHero();

    return () => controller.abort();
  }, [binding?.steamId]);

  useEffect(() => {
    if (pathname !== "/" || !topHero?.heroId) {
      setHeroLines([]);
      return;
    }

    const controller = new AbortController();

    async function loadHeroLines() {
      try {
        const response = await fetch(`/api/heroes/voice-lines?heroId=${encodeURIComponent(String(topHero.heroId))}&heroName=${encodeURIComponent(topHero.heroName)}&games=${encodeURIComponent(String(topHero.games))}`, {
          cache: "no-store",
          signal: controller.signal
        });

        const payload = await response.json() as HeroVoiceLinesResponse;
        setHeroLines(payload.headerLines ?? []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setHeroLines([]);
      }
    }

    void loadHeroLines();

    return () => controller.abort();
  }, [pathname, topHero?.heroId]);

  const heroHeaderLines = pathname === "/" ? heroLines : [];

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

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.95),rgba(16,185,129,0.88))] text-base font-bold text-slate-950 shadow-glow">
            今
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-white/80" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-[0.14em] text-slate-100">今晚就来社区</div>
            <div className="mt-1 min-h-[1rem] text-xs text-slate-400" aria-live="polite">
              <span key={`${topHero?.heroId ?? "default"}-${activeLineIndex}`} className="header-quote-animate">
                {headerHint}
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 text-sm text-slate-300 md:flex">
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

        <div className="flex items-center gap-3">
          <HeaderSearch items={searchItems} />
          {binding ? (
            <Link
              href="/my"
              className="hidden rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/60 sm:inline-flex"
            >
              {`${binding.playerDisplayName ?? "我的"} · 已认领`}
            </Link>
          ) : (
            <div className="hidden sm:block">
              <ClaimPlayerDialog
                players={claimPlayers}
                triggerLabel="认领"
                triggerClassName="rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                title="选择选手并认领身份"
                description="顶部入口直接完成认领就够了。选好选手、填入 SteamID，绑定后会立即进入你的个人页。"
              />
            </div>
          )}
          <Link href="/admin" className="hidden rounded-xl border border-white/10 px-3 py-2.5 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white xl:inline-flex">
            后台
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-4 text-sm text-slate-300 md:hidden">
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
        {binding ? (
          <Link
            href="/my"
            className="whitespace-nowrap rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 font-semibold text-emerald-100 transition hover:border-emerald-300/60"
          >
            已认领
          </Link>
        ) : (
          <ClaimPlayerDialog
            players={claimPlayers}
            triggerLabel="认领"
            triggerClassName="whitespace-nowrap rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-4 py-2.5 font-semibold text-slate-950 transition hover:opacity-90"
            title="选择选手并认领身份"
            description="顶部入口直接完成认领就够了。选好选手、填入 SteamID，绑定后会立即进入你的个人页。"
          />
        )}
      </div>
    </header>
  );
}
