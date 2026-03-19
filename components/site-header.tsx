"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { HeaderSearch } from "@/components/header-search";
import { readLocalPlayerBinding, type LocalPlayerBinding } from "@/lib/local-binding";
import type { SiteSearchItem } from "@/lib/queries";

const links = [
  { href: "/", label: "首页" },
  { href: "/matches", label: "赛事" },
  { href: "/teams", label: "战队" },
  { href: "/players", label: "选手" },
  { href: "/my", label: "我的" }
];

const heroVoiceLines = [
  { hero: "Axe", quote: "Axe attacks!" },
  { hero: "Pudge", quote: "Fresh meat!" },
  { hero: "Invoker", quote: "Knowledge is power." },
  { hero: "Juggernaut", quote: "Honor guides me." },
  { hero: "Shadow Fiend", quote: "Nevermore..." },
  { hero: "Storm Spirit", quote: "Storm's a-brewin'." }
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ searchItems }: { searchItems: SiteSearchItem[] }) {
  const pathname = usePathname();
  const [binding, setBinding] = useState<LocalPlayerBinding | null>(null);
  const [voiceIndex, setVoiceIndex] = useState(0);

  useEffect(() => {
    setBinding(readLocalPlayerBinding());
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVoiceIndex((current) => (current + 1) % heroVoiceLines.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  const activeVoiceLine = heroVoiceLines[voiceIndex];

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
            <div className="mt-1 flex min-h-5 w-[19rem] max-w-full items-center gap-2 overflow-hidden text-xs text-slate-400 md:w-[22rem]">
              <span className="shrink-0 text-cyan-200/90">{activeVoiceLine.hero}</span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />
              <span key={`${activeVoiceLine.hero}-${activeVoiceLine.quote}`} className="min-w-0 animate-[header-quote-enter_420ms_ease] truncate text-slate-300">
                {activeVoiceLine.quote}
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 text-sm text-slate-300 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-xl border border-white/10 px-4 py-2.5 transition",
                isActivePath(pathname, link.href)
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderSearch items={searchItems} />
          <Link
            href="/my"
            className={clsx(
              "hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition md:inline-flex",
              binding
                ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/60"
                : "bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 hover:opacity-90"
            )}
          >
            {binding ? `${binding.playerDisplayName ?? "我的"} · 我的主页` : "认领我的主页"}
          </Link>
          <Link href="/admin" className="hidden rounded-xl border border-white/10 px-3 py-2.5 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white lg:inline-flex">
            后台
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-4 text-sm text-slate-300 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "whitespace-nowrap rounded-xl border border-white/10 px-4 py-2.5 transition",
              isActivePath(pathname, link.href)
                ? "bg-white/[0.08] text-white"
                : "text-slate-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/my"
          className={clsx(
            "whitespace-nowrap rounded-xl px-4 py-2.5 font-semibold transition",
            binding
              ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/60"
              : "bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 hover:opacity-90"
          )}
        >
          {binding ? "我的主页" : "认领自己"}
        </Link>
      </div>
    </header>
  );
}
