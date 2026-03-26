import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type PageHeroAction = {
  href: string;
  label: string;
  variant?: "solid" | "outline";
};

type PageHeroStat = {
  label: string;
  value: string | number;
  description: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  badge,
  actions,
  stats,
  aside,
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  actions?: PageHeroAction[];
  stats?: PageHeroStat[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("page-hero bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,197,81,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]", className)}>
      <div className="hero-grid">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">{eyebrow}</div>
            {badge ? <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">{badge}</span> : null}
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">{description}</p>

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
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <article key={stat.label} className="stat-tile">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{stat.label}</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
                  <p className="mt-2 text-sm text-slate-400">{stat.description}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {aside ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">{aside}</div> : null}
      </div>
    </section>
  );
}