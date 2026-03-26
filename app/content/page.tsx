import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Shell } from "@/components/shell";
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

function formatPublishedLabel(value: Date | string | null) {
  if (!value) {
    return "未发布";
  }

  return new Date(value).toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric"
  });
}

function ContentItem({
  page,
  pageTypeLabels
}: {
  page: Awaited<ReturnType<typeof getContentPages>>[number];
  pageTypeLabels: Record<string, string>;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]">
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
          <div>{formatPublishedLabel(page.publishedAt)}</div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-400">{page.excerpt ?? "点开这条内容，继续看完整故事、赛况和相关人物。"}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
        <span className="rounded-full border border-white/10 bg-ink px-3 py-1.5">
          {page.tournamentName ?? "社区内容"}{page.seasonTitle ? ` / ${page.seasonTitle}` : ""}
        </span>
        {page.topicSlug ? (
          <Link href={`/community/topics/${page.topicSlug}`} className="rounded-full border border-rose-400/20 bg-rose-400/5 px-3 py-1.5 transition hover:border-rose-300/40 hover:text-white">
            #{page.topicTitle}
          </Link>
        ) : null}
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
  );
}

export default async function ContentListPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ type }, pages] = await Promise.all([searchParams, getContentPages()]);
  const activeType = type && type in pageTypeLabels ? type : allFilterKey;
  const filteredPages = activeType === allFilterKey ? pages : pages.filter((page) => page.pageType === activeType);
  const officialPages = filteredPages.filter((page) => page.pageType === "news" || page.pageType === "custom");
  const recapPages = filteredPages.filter((page) => page.pageType === "recap" || page.pageType === "champion");
  const archivePages = filteredPages.filter((page) => page.pageType === "poster");
  const featuredPage = filteredPages[0] ?? pages[0] ?? null;
  const topicBreakdown = Array.from(
    pages
      .filter((page) => page.topicSlug && page.topicTitle)
      .reduce((map, page) => {
        const key = page.topicSlug ?? "";
        const current = map.get(key) ?? { slug: page.topicSlug ?? "", title: page.topicTitle ?? "", count: 0 };
        current.count += 1;
        map.set(key, current);
        return map;
      }, new Map<string, { slug: string; title: string; count: number }>())
      .values()
  )
    .sort((left, right) => right.count - left.count)
    .slice(0, 4);

  return (
    <Shell>
      <PageHero
        eyebrow="Content Flow"
        badge="战报、快报、海报与冠军页"
        title="内容不只做归档，也要继续带人回到比赛和社区。"
        description="内容页现在按官方资讯、赛事战报和归档海报分层，同时把话题、比赛和战队关系直接挂在卡片上。看内容时不会断开和比赛、社区主线的连接。"
        actions={[
          { href: "/matches", label: "先看比赛", variant: "solid" },
          { href: "/community", label: "社区主线", variant: "outline" }
        ]}
        stats={[
          { label: "全部内容", value: pages.length, description: "当前站内已整理好的内容总量。" },
          { label: "官方资讯", value: officialPages.length, description: "公告、快报和自定义更新会优先汇在这一层。" },
          { label: "赛事回流", value: recapPages.length, description: "赛后复盘、冠军内容和战报组成回流主干。" }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(245,197,81,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_22%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={featuredPage ? [
          <Link key={featuredPage.slug} href={`/content/${featuredPage.slug}`} className="block rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5 transition hover:border-cyan-300/35">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">当前头条</div>
            <div className="mt-3 text-xl font-semibold text-white">{featuredPage.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{featuredPage.excerpt ?? "点进这条头条，继续看完整正文与相关延展。"}</p>
            {featuredPage.topicSlug ? <div className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan-100">所属话题 #{featuredPage.topicTitle}</div> : null}
          </Link>,
          <div key="topic-breakdown" className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">内容主线</div>
            <div className="mt-4 space-y-3">
              {topicBreakdown.length ? topicBreakdown.map((topic) => (
                <Link key={topic.slug} href={`/community/topics/${topic.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 transition hover:border-rose-300/30 hover:text-white">
                  <span className="text-sm font-semibold text-white">#{topic.title}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{topic.count} 条</span>
                </Link>
              )) : <div className="text-sm text-slate-400">内容与话题的连接还在补充中。</div>}
            </div>
          </div>
        ] : null}
      />

      <section className="mt-6 brand-shell p-6">
        <div className="mb-6 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.26em] text-accent-gold">浏览</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">先分清官方资讯、赛事战报和归档海报</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              官方更新、赛后内容和历史海报已经分层整理。无论你想追最新动态还是回看经典内容，都能更快找到对应区域。
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

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100">官方资讯</div>
            <div className="mt-2 text-lg font-semibold text-white">{officialPages.length} 条更新</div>
            <p className="mt-2 text-sm leading-7 text-cyan-50/80">今晚的重要更新、快报和官方消息都会先集中在这里。</p>
          </article>
          <article className="rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-amber-100">赛事战报</div>
            <div className="mt-2 text-lg font-semibold text-white">{recapPages.length} 条回流</div>
            <p className="mt-2 text-sm leading-7 text-amber-50/80">比赛结束后，比分、冠军和复盘内容会继续沉淀在这里。</p>
          </article>
          <article className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 p-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-rose-100">归档海报</div>
            <div className="mt-2 text-lg font-semibold text-white">{archivePages.length} 张资产</div>
            <p className="mt-2 text-sm leading-7 text-rose-50/80">赛前海报和纪念图统一归到归档层，不再和所有内容混排。</p>
          </article>
        </div>

        <section>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">官方资讯</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">先看公告、快报和社区更新</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {officialPages.length ? officialPages.map((page) => (
              <ContentItem key={page.id} page={page} pageTypeLabels={pageTypeLabels} />
            )) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 xl:col-span-2">
                当前筛选下还没有新的官方资讯，稍后回来看看最新更新。
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-amber-300">赛事战报</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">最近的结果、冠军与战报都在这里汇总</h3>
            </div>
            <Link href="/matches" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
              去看比赛
            </Link>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {recapPages.length ? recapPages.map((page) => (
              <ContentItem key={page.id} page={page} pageTypeLabels={pageTypeLabels} />
            )) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 xl:col-span-2">
                当前筛选下还没有新的赛事战报，比赛结束后再回来看看。
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-rose-300">归档海报</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">赛前海报和纪念图统一沉到归档层</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {archivePages.length ? archivePages.map((page) => (
              <ContentItem key={page.id} page={page} pageTypeLabels={pageTypeLabels} />
            )) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400 xl:col-span-2">
                当前筛选下还没有新的归档海报，晚些时候再回来看看。
              </div>
            )}
          </div>
        </section>

      </section>
    </Shell>
  );
}