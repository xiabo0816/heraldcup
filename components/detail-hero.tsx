import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type DetailHeroAction = {
  href: string;
  label: string;
  variant?: "solid" | "outline";
};

type DetailHeroStat = {
  label: string;
  value: string | number;
  description?: string;
};

export function DetailHero({
  eyebrow,
  title,
  description,
  badge,
  chips,
  actions,
  stats,
  aside,
  className
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  badge?: ReactNode;
  chips?: ReactNode;
  actions?: DetailHeroAction[];
  stats?: DetailHeroStat[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("page-hero bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]", className)}>
      <div className="hero-grid">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">{eyebrow}</div>
            {badge ? <div>{badge}</div> : null}
          </div>

          <div className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</div>
          <div className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">{description}</div>

          {chips ? <div className="mt-6 flex flex-wrap gap-2">{chips}</div> : null}

          {actions?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className={action.variant === "outline"
                    ? "rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white"
                    : "rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}

          {stats?.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <article key={stat.label} className="stat-tile">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{stat.label}</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
                  {stat.description ? <p className="mt-2 text-sm text-slate-400">{stat.description}</p> : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {aside ? <div className="grid gap-4">{aside}</div> : null}
      </div>
    </section>
  );
}