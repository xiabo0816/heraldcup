import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getContentPages } from "@/lib/queries";

const pageTypeLabels: Record<string, string> = {
  poster: "海报",
  champion: "冠军",
  news: "快报",
  recap: "战报",
  custom: "自定义"
};

const allFilterKey = "all";

export default async function ContentListPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ type }, pages] = await Promise.all([searchParams, getContentPages()]);
  const activeType = type && type in pageTypeLabels ? type : allFilterKey;
  const filteredPages = activeType === allFilterKey ? pages : pages.filter((page) => page.pageType === activeType);

  return (
    <Shell>
      <SectionCard title="内容库" eyebrow="Content Hub">
        <div className="mb-6 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.26em] text-accent-gold">Browse</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">统一浏览海报、战报、快报</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              内容页现在作为前台独立资源展示，既能按类型浏览，也能继续回到对应比赛和队伍详情。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {Object.entries(pageTypeLabels).map(([key, label]) => {
              const count = pages.filter((page) => page.pageType === key).length;
              return (
                <div key={key} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/content"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeType === allFilterKey
                ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-accent-gold/40 hover:text-white"
            }`}
          >
            全部
          </Link>
          {Object.entries(pageTypeLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/content?type=${key}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeType === key
                  ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-accent-cyan/40 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {filteredPages.length ? filteredPages.map((page) => (
            <article key={page.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em]">
                    <span className="text-accent-gold">{pageTypeLabels[page.pageType] ?? page.pageType}</span>
                    {page.featured ? <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-1 text-accent-cyan">推荐</span> : null}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    <Link href={`/content/${page.slug}`} className="transition hover:text-accent-gold">
                      {page.title}
                    </Link>
                  </h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>{page.publishedAt ? new Date(page.publishedAt).toLocaleDateString("zh-CN") : "未发布"}</div>
                  <div className="mt-2 uppercase tracking-[0.18em]">{page.slug}</div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">{page.excerpt ?? "暂无摘要"}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-ink px-3 py-1.5">
                  {page.tournamentName ?? "未绑定赛事"}{page.seasonTitle ? ` / ${page.seasonTitle}` : ""}
                </span>
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
          )) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 xl:col-span-2">
              当前筛选条件下还没有内容页。你可以去管理后台新增海报、战报或快报，再回到这里统一浏览。
            </div>
          )}
        </div>
      </SectionCard>
    </Shell>
  );
}