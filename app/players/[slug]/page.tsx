import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getPlayerDetailBySlug } from "@/lib/queries";

export default async function PlayerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayerDetailBySlug(slug);

  if (!player) {
    notFound();
  }

  return (
    <Shell>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title={player.displayName} eyebrow={player.primaryRole ?? "未分配位置"}>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              当前队伍：
              {player.teamSlug ? (
                <Link href={`/teams/${player.teamSlug}`} className="text-accent-cyan underline-offset-4 hover:underline">
                  {player.teamName}
                </Link>
              ) : (
                player.teamName
              )}
            </p>
            <p>SteamID：{player.steamId ?? "未绑定"}</p>
            <p>{player.bio ?? "暂无选手简介"}</p>
            <div className="flex flex-wrap gap-2">
              {player.heroPool.map((hero) => (
                <span key={hero} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-slate-200">
                  {hero}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="高光比赛" eyebrow="Highlights">
          <div className="space-y-3">
            {player.highlightMatches.length ? (
              player.highlightMatches.map((match) => (
                <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-accent-gold/40">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">{match.status ?? "未设置状态"}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{match.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {(match.homeTeamName ?? "待定") + " vs " + (match.awayTeamName ?? "待定")}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{match.summary ?? "暂无比赛摘要"}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">暂无高光比赛。</div>
            )}
          </div>
        </SectionCard>
      </section>
    </Shell>
  );
}
