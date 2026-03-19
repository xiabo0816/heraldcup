import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getContentPages } from "@/lib/queries";
import { teamPath } from "@/lib/routes";

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
      <SectionCard title="内容库" eyebrow="内容">
        <div className="mb-6 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.26em] text-accent-gold">浏览</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">统一浏览海报、战报、快报</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              不管是赛前海报、赛后战报还是临时快报，都能从这里集中翻，也能顺着内容跳回比赛和战队。
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
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">{page.excerpt ?? "这篇内容的导语正在整理中，点进去看完整内容。"}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-ink px-3 py-1.5">
                  {page.tournamentName ?? "未绑定赛事"}{page.seasonTitle ? ` / ${page.seasonTitle}` : ""}
                </span>
                {page.matchSlug ? (
                  <Link href={`/matches/${page.matchSlug}`} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-cyan/40 hover:text-white">
                    {page.matchTitle ?? "关联比赛"}
                  </Link>
                ) : null}
                {page.homeTeamId ? (
                  <Link href={teamPath(page.homeTeamId)} className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 transition hover:border-cyan-300/40 hover:text-white">
                    {page.homeTeamName}
                  </Link>
                ) : null}
                {page.awayTeamId ? (
                  <Link href={teamPath(page.awayTeamId)} className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 transition hover:border-amber-300/40 hover:text-white">
                    {page.awayTeamName}
                  </Link>
                ) : null}
              </div>
            </article>
          )) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 xl:col-span-2">
              这个分类暂时还没有上新，稍后再来看看。
            </div>
          )}
        </div>
      </SectionCard>
    </Shell>
  );
}