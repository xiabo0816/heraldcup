import Link from "next/link";
import { Shell } from "@/components/shell";
import { SectionCard } from "@/components/section-card";
import { getTeams } from "@/lib/queries";

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <Shell>
      <SectionCard title="队伍池" eyebrow="Teams">
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((team) => (
            <article key={team.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.26em] text-accent-gold">Roster</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                <Link href={`/teams/${team.slug}`} className="transition hover:text-accent-gold">
                  {team.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-400">{team.slogan ?? "尚未设置队伍口号"}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200">
                {team.members.map((member) => (
                  <Link key={member.slug} href={`/players/${member.slug}`} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-cyan/40 hover:text-white">
                    {member.displayName}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </Shell>
  );
}
