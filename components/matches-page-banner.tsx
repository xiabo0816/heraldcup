import Link from "next/link";
import { getTournamentTheme } from "@/lib/tournament-theme";
import type { MatchSeasonGraph } from "@/lib/queries";

function getSeasonMatchCount(graph: MatchSeasonGraph) {
  return graph.stages.reduce((total, stage) => total + stage.matches.length, 0);
}

export function MatchesPageBanner({ seasonGraphs }: { seasonGraphs: MatchSeasonGraph[] }) {
  const featuredSeason = seasonGraphs.find((season) => season.featured) ?? seasonGraphs[0] ?? null;
  const activeKinds = Array.from(new Set(seasonGraphs.map((graph) => getTournamentTheme(graph.tournamentKind, graph.tournamentName ?? graph.title).label)));
  const featuredTheme = getTournamentTheme(featuredSeason?.tournamentKind, featuredSeason?.tournamentName ?? featuredSeason?.title);
  const recentGraphs = seasonGraphs.slice(0, 3);

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.14),transparent_22%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] p-8 shadow-glow md:p-10">
      <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em] ${featuredTheme.badgeClass}`}>
              比赛中心
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">从先锋到冠绝，赛季图谱都在这里展开</span>
          </div>

          <div className={`mt-8 text-sm font-semibold uppercase tracking-[0.3em] ${featuredTheme.accentText}`}>
            {featuredSeason?.tournamentName ?? "社区赛事体系"}
          </div>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
            比赛中心
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-9 text-slate-300 md:text-lg">
            {featuredSeason?.summary ?? "这里不是普通列表页。当前主推赛季、历史图谱、赛事类型与最近重点对局都会在这里集中展开，让用户先建立赛事世界观，再进入具体赛季和比赛详情。"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={featuredSeason ? `/matches/${featuredSeason.stages[0]?.matches[0]?.slug ?? ""}` : "/matches"} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
              {featuredSeason?.stages[0]?.matches[0]?.slug ? "查看焦点比赛" : "浏览赛季图谱"}
            </Link>
            <Link href="/content" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white">
              查看赛后内容
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 text-sm text-slate-200">
            {activeKinds.map((kind) => (
              <span key={kind} className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2">
                {kind}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <article className="rounded-[30px] border border-white/12 bg-black/20 p-6 backdrop-blur-sm">
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/48">当前主推赛季</div>
            <div className="mt-4 text-3xl font-semibold text-white">{featuredSeason?.title ?? "待设置"}</div>
            <p className="mt-3 text-sm leading-8 text-white/70">
              {featuredSeason?.statusLabel ?? "状态待设置"} · {featuredSeason?.participants.length ?? 0} 支队伍 · {featuredSeason ? getSeasonMatchCount(featuredSeason) : 0} 场比赛
            </p>
          </article>

          <article className="rounded-[30px] border border-white/12 bg-black/20 p-6 backdrop-blur-sm md:col-span-2 xl:col-span-1">
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/48">最近赛季</div>
            <div className="mt-4 space-y-3">
              {recentGraphs.length ? recentGraphs.map((graph) => {
                const theme = getTournamentTheme(graph.tournamentKind, graph.tournamentName ?? graph.title);

                return (
                  <Link key={graph.id} href={graph.stages[0]?.matches[0]?.slug ? `/matches/${graph.stages[0].matches[0].slug}` : "/matches"} className="block rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-white/25 hover:bg-white/[0.06]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white">{graph.title}</div>
                      <div className={`text-xs uppercase tracking-[0.2em] ${theme.accentText}`}>{theme.label}</div>
                    </div>
                    <div className="mt-2 text-sm text-white/65">{graph.statusLabel ?? "状态待设置"} · {graph.participants.length} 支队伍</div>
                  </Link>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/65">
                  赛季图谱正在补充，稍后会在这里显示当前可浏览的赛事。
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}