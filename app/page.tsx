import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getContentPages, getHomeDashboard } from "@/lib/queries";

const pageTypeLabels: Record<string, string> = {
  poster: "海报",
  champion: "冠军",
  news: "快报",
  recap: "战报",
  custom: "自定义"
};

export default async function HomePage() {
  const [dashboard, contentPages] = await Promise.all([getHomeDashboard(), getContentPages()]);
  const latestContent = contentPages.slice(0, 3);

  return (
    <Shell>
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <SectionCard title={dashboard.featuredSeason.title} eyebrow={dashboard.featuredSeason.statusLabel} className="overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-lg text-slate-200">{dashboard.featuredSeason.subtitle}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{dashboard.featuredSeason.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/players" className="rounded-full bg-accent-cyan px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90">
                  进入选手池
                </Link>
                <Link href="/content" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-accent-cyan/50 hover:text-white">
                  浏览内容库
                </Link>
                <Link href="/admin" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-accent-gold/50 hover:text-white">
                  打开管理后台
                </Link>
              </div>
            </div>
            <div className="grid gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
              {dashboard.metrics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.26em] text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="架构原则" eyebrow="Build Strategy">
          <ul className="space-y-3 text-sm leading-7 text-slate-300">
            {dashboard.priorities.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title={dashboard.featuredMatch.title} eyebrow={dashboard.featuredMatch.format}>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <div className="text-xs uppercase tracking-[0.26em] text-cyan-300">Home Team</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{dashboard.featuredMatch.homeTeamName}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{dashboard.featuredMatch.homeTeamSlogan ?? "尚未设置队伍口号"}</p>
            </article>
            <article className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5">
              <div className="text-xs uppercase tracking-[0.26em] text-amber-300">Away Team</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{dashboard.featuredMatch.awayTeamName}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{dashboard.featuredMatch.awayTeamSlogan ?? "尚未设置队伍口号"}</p>
            </article>
          </div>
        </SectionCard>

        {dashboard.adminSections.map((section) => (
          <SectionCard key={section.title} title={section.title} eyebrow="Admin Module">
            <p className="text-sm leading-7 text-slate-400">{section.description}</p>
          </SectionCard>
        ))}
      </section>

      <section className="mt-6">
        <SectionCard title="最新内容" eyebrow="Latest Content">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm leading-7 text-slate-400">把海报、快报、战报前置到首页，方便从赛事首页直接进入内容浏览。</p>
            <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent-gold/40 hover:text-white">
              查看全部内容
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {latestContent.length ? (
              latestContent.map((page) => (
                <article key={page.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">{pageTypeLabels[page.pageType] ?? page.pageType}</div>
                    {page.featured ? <div className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-1 text-xs font-semibold text-accent-cyan">推荐</div> : null}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    <Link href={`/content/${page.slug}`} className="transition hover:text-accent-gold">
                      {page.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{page.excerpt ?? "暂无摘要"}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    {page.matchSlug ? (
                      <Link href={`/matches/${page.matchSlug}`} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-cyan/40 hover:text-white">
                        {page.matchTitle ?? "关联比赛"}
                      </Link>
                    ) : null}
                    {page.homeTeamSlug ? (
                      <Link href={`/teams/${page.homeTeamSlug}`} className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 transition hover:border-cyan-300/40 hover:text-white">
                        {page.homeTeamName}
                      </Link>
                    ) : null}
                    {page.awayTeamSlug ? (
                      <Link href={`/teams/${page.awayTeamSlug}`} className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 transition hover:border-amber-300/40 hover:text-white">
                        {page.awayTeamName}
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 lg:col-span-3">
                当前还没有可展示的内容页，可以先在管理后台新增海报、战报或快报。
              </div>
            )}
          </div>
        </SectionCard>
      </section>
    </Shell>
  );
}
