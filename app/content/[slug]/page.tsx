import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { getContentPageBySlug } from "@/lib/queries";
import { teamPath } from "@/lib/routes";
import { getTournamentTheme } from "@/lib/tournament-theme";

const pageTypeLabels: Record<string, string> = {
  poster: "开赛海报",
  champion: "恭喜海报",
  news: "快报",
  recap: "战报",
  custom: "内容页"
};

function formatDateLabel(value: Date | string | null) {
  if (!value) {
    return "时间待定";
  }

  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const theme = getTournamentTheme(page.tournamentKind, page.tournamentName ?? page.title);
  const headline = page.pageType === "champion" ? "恭喜夺冠" : pageTypeLabels[page.pageType] ?? "赛事内容";

  return (
    <Shell>
      <section className={`relative overflow-hidden rounded-[36px] border p-8 shadow-glow ${theme.pageBackground} ${theme.panelBorder}`}>
        <div className={`pointer-events-none absolute -inset-[30%] opacity-90 ${theme.spotlightGlow}`} />

        <div className="relative z-10">
          <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] backdrop-blur ${theme.badgeClass}`}>
                <span className="text-base leading-none">🏆</span>
                <span>{page.seasonTitle ?? page.tournamentName ?? theme.label}</span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold uppercase leading-tight tracking-[0.12em] md:text-4xl">
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${theme.titleGradient}`}>{headline}</span>
                <br />
                {page.title}
              </h1>

              <p className="mt-3 text-sm text-slate-300/90 md:text-base">{page.excerpt ?? "这是一篇与比赛主线相关的内容，继续往下看就能补完整个故事。"}</p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] ${theme.primaryButton}`}>
                {pageTypeLabels[page.pageType] ?? page.pageType}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-300/80">{page.publishedAt ? new Date(page.publishedAt).toLocaleDateString("zh-CN") : "未发布"}</div>
            </div>
          </header>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 backdrop-blur">
              <div className={`grid h-10 w-10 place-items-center rounded-full border ${theme.infoIcon}`}>
                <span className="text-lg">📅</span>
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">发布时间</div>
                <div className="mt-1 text-sm text-slate-100">{page.publishedAt ? new Date(page.publishedAt).toLocaleString("zh-CN") : "未设置"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 backdrop-blur">
              <div className={`grid h-10 w-10 place-items-center rounded-full border ${theme.infoIcon}`}>
                <span className="text-lg">🏁</span>
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">比赛信息</div>
                <div className="mt-1 text-sm text-slate-100">{page.format ?? "未设置赛制"}</div>
                <div className="mt-1 text-xs text-slate-300">{formatDateLabel(page.scheduledAt)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 backdrop-blur">
              <div className={`grid h-10 w-10 place-items-center rounded-full border ${theme.infoIcon}`}>
                <span className="text-lg">🏆</span>
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">冠军 / 对阵</div>
                <div className={`mt-1 text-sm font-semibold ${page.championTeamName ? theme.trophyText : "text-slate-100"}`}>{page.championTeamName ?? `${page.homeTeamName ?? "待定"} vs ${page.awayTeamName ?? "待定"}`}</div>
                {(page.scoreHome !== null || page.scoreAway !== null) ? <div className="mt-1 text-xs text-slate-300">比分：{page.scoreHome ?? "-"} : {page.scoreAway ?? "-"}</div> : null}
              </div>
            </div>
          </div>

          {page.matchSlug ? (
            <>
              <div className={`my-7 h-px w-full bg-gradient-to-r from-transparent ${theme.divider} to-transparent opacity-80`} />

              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <article className={`rounded-2xl border p-6 backdrop-blur ${theme.primaryCard}`}>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">关联对阵</div>
                  <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-5 text-center">
                      {page.homeTeamId ? (
                        <Link href={teamPath(page.homeTeamId)} className="text-lg font-extrabold uppercase tracking-[0.14em] text-slate-100 transition hover:text-white/80">
                          {page.homeTeamName ?? "待定"}
                        </Link>
                      ) : (
                        <div className="text-lg font-extrabold uppercase tracking-[0.14em] text-slate-100">{page.homeTeamName ?? "待定"}</div>
                      )}
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_0%,#fff7ed,#f59e0b)] text-slate-950 font-extrabold tracking-[0.18em] ring-4 ring-slate-950/60 shadow-lg shadow-amber-500/30">
                      VS
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-5 text-center">
                      {page.awayTeamId ? (
                        <Link href={teamPath(page.awayTeamId)} className="text-lg font-extrabold uppercase tracking-[0.14em] text-slate-100 transition hover:text-white/80">
                          {page.awayTeamName ?? "待定"}
                        </Link>
                      ) : (
                        <div className="text-lg font-extrabold uppercase tracking-[0.14em] text-slate-100">{page.awayTeamName ?? "待定"}</div>
                      )}
                    </div>
                  </div>
                </article>

                <article className={`rounded-2xl border p-6 backdrop-blur ${theme.secondaryCard}`}>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">继续浏览</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link href={`/matches/${page.matchSlug}`} className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.secondaryButton}`}>
                      查看赛事详情
                    </Link>
                    {page.championTeamId ? (
                      <Link href={teamPath(page.championTeamId)} className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-300/50">
                        冠军队伍主页
                      </Link>
                    ) : null}
                    <Link href="/community" className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:text-white">
                      回到社区页
                    </Link>
                  </div>
                </article>
              </div>
            </>
          ) : null}

          <div className={`my-7 h-px w-full bg-gradient-to-r from-transparent ${theme.divider} to-transparent opacity-80`} />

          <article className={`rounded-2xl border p-6 whitespace-pre-wrap backdrop-blur ${theme.primaryCard}`}>
            {page.bodyText}
          </article>

          {page.topic ? (
            <section className="mt-6 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <Link href={`/community/topics/${page.topic.slug}`} className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5 transition hover:border-cyan-300/40">
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-100">所属话题</div>
                <div className="mt-2 text-xl font-semibold text-white">#{page.topic.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{page.topic.description ?? "回到这个话题页，还能继续追比赛、内容和招募动态。"}</p>
              </Link>

              <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">同话题延展</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {page.relatedRecruitments.slice(0, 2).map((post) => (
                    <Link key={post.id} href={`/community/recruitments/${post.slug}`} className="rounded-[20px] border border-white/10 bg-slate-950/35 p-4 transition hover:border-white/20">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{post.teamName}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{post.title}</div>
                    </Link>
                  ))}
                  {page.relatedTopicPages.slice(0, 2).map((item) => (
                    <Link key={item.id} href={`/content/${item.slug}`} className="rounded-[20px] border border-white/10 bg-slate-950/35 p-4 transition hover:border-white/20">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{pageTypeLabels[item.pageType ?? "custom"] ?? item.pageType ?? "内容页"}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{item.title}</div>
                    </Link>
                  ))}
                  {page.relatedTopicMatches.slice(0, 2).map((match) => (
                    <Link key={match.id} href={`/matches/${match.slug}`} className="rounded-[20px] border border-white/10 bg-slate-950/35 p-4 transition hover:border-white/20">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{match.status}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{match.title}</div>
                    </Link>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href="/community" className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">社区</div>
              <div className="mt-2 text-xl font-semibold text-white">回到社区页</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">回到社区继续看公告、话题和招募，别让浏览停在这一页。</p>
            </Link>
            {page.matchSlug ? (
              <Link href={`/matches/${page.matchSlug}`} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">对应比赛</div>
                <div className="mt-2 text-xl font-semibold text-white">回到比赛详情</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">回到比分、队伍和相关高光，把这条线补完整。</p>
              </Link>
            ) : null}
            <Link href="/content" className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">资讯流</div>
                <div className="mt-2 text-xl font-semibold text-white">查看更多内容</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">官方资讯、赛事战报和归档海报已经分层整理好了。</p>
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
