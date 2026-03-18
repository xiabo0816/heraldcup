import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getPlayers } from "@/lib/queries";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <Shell>
      <SectionCard title="选手池" eyebrow="Players">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => (
            <article key={player.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.26em] text-accent-cyan">{player.primaryRole ?? "未分配位置"}</div>
              <h3 className="mt-2 text-xl font-semibold text-white">
                <Link href={`/players/${player.slug}`} className="transition hover:text-accent-cyan">
                  {player.displayName}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-slate-400">当前队伍：{player.teamName}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                {player.heroPool.map((hero) => (
                  <span key={hero} className="rounded-full border border-white/10 bg-ink px-3 py-1.5">
                    {hero}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                {player.highlightMatchIds.length ? (
                  player.highlightMatchIds.map((matchSlug) => (
                    <Link key={matchSlug} href={`/matches/${matchSlug}`} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-gold/40 hover:text-white">
                      {matchSlug}
                    </Link>
                  ))
                ) : (
                  <span className="text-slate-400">未设置高光比赛</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </Shell>
  );
}
