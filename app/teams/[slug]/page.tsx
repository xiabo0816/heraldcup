import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getTeamDetailBySlug } from "@/lib/queries";

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = await getTeamDetailBySlug(slug);

  if (!team) {
    notFound();
  }

  return (
    <Shell>
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title={team.name} eyebrow={team.seasonTitle ?? "未绑定赛季"}>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>赛事：{team.tournamentName ?? "未绑定赛事"}</p>
            <p>口号：{team.slogan ?? "尚未设置队伍口号"}</p>
            <p>教练：{team.coach ?? "未设置"}</p>
            <p>队长：{team.captain ?? "未设置"}</p>
            <p>{team.summary ?? "暂无队伍简介"}</p>
          </div>
        </SectionCard>

        <SectionCard title="现役成员" eyebrow="Roster">
          <div className="space-y-3">
            {team.members.length ? (
              team.members.map((member) => (
                <Link key={member.slug} href={`/players/${member.slug}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-accent-cyan/40">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent-cyan">{member.primaryRole ?? "未分配位置"}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{member.displayName}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
                    {member.heroPool.slice(0, 4).map((hero) => (
                      <span key={hero} className="rounded-full border border-white/10 bg-ink px-3 py-1.5">
                        {hero}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">暂无现役成员。</div>
            )}
          </div>
        </SectionCard>
      </section>

      <section className="mt-6">
        <SectionCard title="相关比赛" eyebrow="Matches">
          <div className="grid gap-4 md:grid-cols-2">
            {team.matches.length ? (
              team.matches.map((match) => (
                <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-accent-gold/40">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">{match.status}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{match.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">对手：{match.opponentName}</p>
                  <p className="mt-2 text-sm text-slate-300">比分：{match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{match.summary ?? "暂无比赛摘要"}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">暂无关联比赛。</div>
            )}
          </div>
        </SectionCard>
      </section>
    </Shell>
  );
}
