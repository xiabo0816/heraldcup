import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getMatchDetailBySlug } from "@/lib/queries";

export default async function MatchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = await getMatchDetailBySlug(slug);

  if (!match) {
    notFound();
  }

  return (
    <Shell>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title={match.title} eyebrow={match.status}>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>比赛 slug：{match.slug}</p>
            <p>赛事：{match.tournamentName ?? "未绑定赛事"}{match.seasonTitle ? ` / ${match.seasonTitle}` : ""}</p>
            <p>赛制：{match.format ?? "未设置"}</p>
            <p>比分：{match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</p>
            <p>开赛时间：{match.scheduledAt ? new Date(match.scheduledAt).toLocaleString("zh-CN") : "未设置"}</p>
            <p>直播链接：{match.streamUrl ? <a href={match.streamUrl} target="_blank" rel="noreferrer" className="text-accent-cyan underline-offset-4 hover:underline">{match.streamUrl}</a> : "未设置"}</p>
            <p>{match.summary ?? "暂无比赛摘要"}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Home Team</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {match.homeTeamSlug ? (
                  <Link href={`/teams/${match.homeTeamSlug}`} className="transition hover:text-cyan-200">
                    {match.homeTeamName ?? "待定"}
                  </Link>
                ) : (
                  match.homeTeamName ?? "待定"
                )}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{match.homeTeamSlogan ?? "尚未设置队伍口号"}</p>
            </article>
            <article className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-amber-300">Away Team</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {match.awayTeamSlug ? (
                  <Link href={`/teams/${match.awayTeamSlug}`} className="transition hover:text-amber-200">
                    {match.awayTeamName ?? "待定"}
                  </Link>
                ) : (
                  match.awayTeamName ?? "待定"
                )}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{match.awayTeamSlogan ?? "尚未设置队伍口号"}</p>
            </article>
          </div>
        </SectionCard>

        <SectionCard title="相关选手" eyebrow="Players">
          <div className="space-y-3">
            {match.featuredPlayers.length ? (
              match.featuredPlayers.map((player) => (
                <Link key={player.slug} href={`/players/${player.slug}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-accent-cyan/40">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent-cyan">{player.primaryRole ?? "未分配位置"}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{player.displayName}</div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">暂无与该比赛绑定高光关系的选手。</div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="相关内容" eyebrow="Content">
          <div className="space-y-3">
            {match.contentPages.length ? (
              match.contentPages.map((page) => (
                <Link key={page.slug} href={`/content/${page.slug}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-accent-gold/40">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">{page.pageType}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{page.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{page.excerpt ?? "暂无摘要"}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">暂无关联内容页。</div>
            )}
          </div>
        </SectionCard>
      </section>
    </Shell>
  );
}
