import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getMatches } from "@/lib/queries";

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <Shell>
      <SectionCard title="比赛池" eyebrow="Matches">
        <div className="space-y-4">
          {matches.map((match) => (
            <article key={match.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.26em] text-accent-rose">{match.status}</div>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    <Link href={`/matches/${match.slug}`} className="transition hover:text-accent-gold">
                      {match.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {match.homeTeamName} vs {match.awayTeamName}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{match.slug}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-ink px-4 py-2 text-sm font-semibold text-slate-200">
                  {match.format ?? "TBD"}
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-300">
                比分：{match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}
              </div>
              <div className="mt-2 text-sm leading-7 text-slate-400">{match.summary ?? "暂无比赛摘要"}</div>
            </article>
          ))}
        </div>
      </SectionCard>
    </Shell>
  );
}
