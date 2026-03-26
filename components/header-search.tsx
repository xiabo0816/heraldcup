"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Bell, CalendarDays, FileText, Hash, Search, Shield, Swords, User, Users, X } from "lucide-react";
import type { SiteSearchItem } from "@/lib/queries";

const typeLabels: Record<SiteSearchItem["type"], string> = {
  player: "选手",
  team: "战队",
  match: "比赛",
  content: "内容",
  announcement: "公告",
  topic: "话题",
  recruitment: "招募",
  event: "活动"
};

const typeIcons: Record<SiteSearchItem["type"], typeof User> = {
  player: User,
  team: Shield,
  match: Swords,
  content: FileText,
  announcement: Bell,
  topic: Hash,
  recruitment: Users,
  event: CalendarDays
};

const typeBadgeClassNames: Record<SiteSearchItem["type"], string> = {
  player: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  team: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  match: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  content: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  announcement: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  topic: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  recruitment: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  event: "border-amber-300/20 bg-amber-300/10 text-amber-100"
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function HeaderSearch({ items }: { items: SiteSearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    inputRef.current?.focus();
  }, [open]);

  const results = items.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [item.title, item.subtitle, ...item.keywords].join(" ").toLowerCase();
    return haystack.includes(normalizedQuery);
  }).slice(0, 8);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开站内搜索"
        title="搜索"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
      >
        <Search className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/70 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="mx-auto mt-[8vh] max-w-2xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,16,29,0.98),rgba(15,23,42,0.96))] shadow-glow"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 md:px-5">
              <Search className="h-4 w-4 text-cyan-200" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索选手、战队、比赛、公告、话题、招募"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-3 md:px-5">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>直达入口</span>
                <span className="rounded-full border border-white/10 px-2 py-1">选手</span>
                <span className="rounded-full border border-white/10 px-2 py-1">战队</span>
                <span className="rounded-full border border-white/10 px-2 py-1">比赛</span>
                <span className="rounded-full border border-white/10 px-2 py-1">内容</span>
                <span className="rounded-full border border-white/10 px-2 py-1">公告</span>
                <span className="rounded-full border border-white/10 px-2 py-1">话题</span>
                <span className="rounded-full border border-white/10 px-2 py-1">招募</span>
                <span className="rounded-full border border-white/10 px-2 py-1">活动</span>
              </div>

              <div className="space-y-2 pb-4">
                {results.length ? results.map((item) => {
                  const Icon = typeIcons[item.type];

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 transition hover:border-cyan-300/35 hover:bg-white/[0.08]"
                    >
                      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-semibold text-white">{item.title}</div>
                          <span className={clsx(
                            "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]",
                            typeBadgeClassNames[item.type]
                          )}>
                            {typeLabels[item.type]}
                          </span>
                        </div>
                        <div className="mt-1 truncate text-sm text-slate-400">{item.subtitle}</div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="rounded-[20px] border border-dashed border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-400">
                    没有匹配结果，换个队名、选手名、比赛标题或社区话题试试。
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}