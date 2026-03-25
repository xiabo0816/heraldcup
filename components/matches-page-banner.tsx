"use client";

import { useEffect, useState } from "react";

type FeaturedTournamentSlide = {
  key: "LEGEND" | "PIONEER";
  eyebrow: string;
  edition: string;
  title: string;
  summary: string;
  status: string;
  teamStatus: string;
  notes: string[];
  shellClass: string;
  badgeClass: string;
  accentClass: string;
  dotClass: string;
};

const FEATURED_TOURNAMENT_SLIDES: FeaturedTournamentSlide[] = [
  {
    key: "LEGEND",
    eyebrow: "Legend Cup",
    edition: "第三届",
    title: "传奇杯第三届",
    summary: "赛程页顶部改为赛事级大轮播，先为传奇杯第三届预留主视觉位。当前参赛阵容尚未公布，先用统一的待定状态承接后续报名与官宣。",
    status: "筹备中",
    teamStatus: "队伍待定",
    notes: ["主视觉已锁定", "对阵位待公布", "可承接后续报名公告"],
    shellClass: "border-violet-400/40 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.18),transparent_24%),linear-gradient(135deg,rgba(30,27,75,0.98),rgba(15,23,42,0.94))]",
    badgeClass: "border-violet-300/45 bg-violet-300/12 text-violet-100",
    accentClass: "text-amber-300",
    dotClass: "bg-violet-200"
  },
  {
    key: "PIONEER",
    eyebrow: "Pioneer Cup",
    edition: "第十二届",
    title: "先锋杯第十二届",
    summary: "第二张轮播用于先锋杯第十二届，延续赛程页的大赛事入口。当前同样不展示具体队伍，以统一的待定态维持页面信息一致性。",
    status: "筹备中",
    teamStatus: "队伍待定",
    notes: ["赛事入口优先展示", "队伍名单待官宣", "后续可直接替换为正式对阵"],
    shellClass: "border-emerald-400/40 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_26%),linear-gradient(135deg,rgba(6,78,59,0.98),rgba(15,23,42,0.94))]",
    badgeClass: "border-emerald-300/45 bg-emerald-300/12 text-emerald-100",
    accentClass: "text-cyan-200",
    dotClass: "bg-emerald-200"
  }
];

export function MatchesPageBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (FEATURED_TOURNAMENT_SLIDES.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % FEATURED_TOURNAMENT_SLIDES.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeSlide < FEATURED_TOURNAMENT_SLIDES.length) {
      return;
    }

    setActiveSlide(0);
  }, [activeSlide]);

  const currentSlide = FEATURED_TOURNAMENT_SLIDES[activeSlide] ?? FEATURED_TOURNAMENT_SLIDES[0];

  return (
    <section className="relative">
      <div className="relative">
        <article className={`relative min-h-[520px] overflow-hidden rounded-[36px] border p-8 shadow-glow transition md:min-h-[620px] md:p-10 ${currentSlide.shellClass}`}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
            <div className="absolute inset-y-0 right-[16%] w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative grid h-full gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em] ${currentSlide.badgeClass}`}>
                    Tournament Carousel
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/55">
                    赛程页顶部主视觉
                  </span>
                </div>

                <div className={`mt-8 text-sm font-semibold uppercase tracking-[0.32em] ${currentSlide.accentClass}`}>
                  {currentSlide.eyebrow} / {currentSlide.edition}
                </div>
                <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                  {currentSlide.title}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-9 text-white/78 md:text-lg">
                  {currentSlide.summary}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/72">
                <span className="rounded-full border border-white/15 bg-black/15 px-5 py-2.5">{currentSlide.status}</span>
                <span className="rounded-full border border-white/15 bg-black/15 px-5 py-2.5">{currentSlide.teamStatus}</span>
                <span className="rounded-full border border-white/15 bg-black/15 px-5 py-2.5">赛程待发布</span>
              </div>
            </div>

            <div className="grid gap-5 self-stretch md:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[30px] border border-white/12 bg-black/20 p-6 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/48">当前状态</div>
                <div className="mt-4 text-4xl font-semibold text-white">{currentSlide.teamStatus}</div>
                <p className="mt-4 text-sm leading-8 text-white/68">
                  赛事已预留展示位，后续确认参赛名单后可直接切换到正式对阵内容。
                </p>
              </div>

              <div className="rounded-[30px] border border-white/12 bg-black/20 p-6 backdrop-blur-sm md:col-span-2 xl:col-span-1">
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/48">赛事备注</div>
                <div className="mt-4 space-y-3">
                  {currentSlide.notes.map((note) => (
                    <div key={note} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white/80">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-5 flex justify-end">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-2 backdrop-blur-sm">
            {FEATURED_TOURNAMENT_SLIDES.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                aria-label={`切换到${slide.title}`}
                onClick={() => setActiveSlide(index)}
                className={index === activeSlide ? `h-2.5 w-8 rounded-full ${slide.dotClass}` : "h-2.5 w-2.5 rounded-full bg-white/30 transition hover:bg-white/50"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}