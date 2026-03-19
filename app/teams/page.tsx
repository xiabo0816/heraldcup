import Link from "next/link";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/team-mark";
import { getTeams } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";

export default async function TeamsPage() {
  const teams = await getTeams();
  const leaderboard = [...teams].sort((left, right) => right.honorScore - left.honorScore || right.championshipCount - left.championshipCount);
  const topTeams = leaderboard.slice(0, 3);

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="relative grid gap-6 xl:grid-cols-[1fr_1fr] xl:items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-200">Team Board</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">先看谁排在前面，再看阵容和来路。</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">战队页现在先给榜单，再给每支队伍的阵容、战绩和简介。你不用先点详情页，扫一眼就知道谁在社区里更有份量。</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">战队总数</div>
                <div className="mt-3 text-3xl font-semibold text-white">{teams.length}</div>
                <p className="mt-2 text-sm text-slate-400">支固定队已经进入社区档案。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">榜首积分</div>
                <div className="mt-3 text-3xl font-semibold text-white">{leaderboard[0]?.honorScore ?? 0}</div>
                <p className="mt-2 text-sm text-slate-400">当前社区最高积分。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">冠军线</div>
                <div className="mt-3 text-lg font-semibold text-white">{leaderboard[0]?.name ?? "待更新"}</div>
                <p className="mt-2 text-sm text-slate-400">目前最像门面的队伍。</p>
              </article>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {topTeams.map((team, index) => (
              <article key={team.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <TeamMark name={team.name} logoUrl={team.logoUrl} size="sm" />
                  <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-amber-100">#{index + 1}</div>
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.24em] text-amber-300">荣誉席</div>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  <Link href={teamPath(team.id)} className="transition hover:text-accent-gold">{team.name}</Link>
                </h2>
                <p className="mt-2 text-sm text-slate-400">社区积分 {team.honorScore} · {team.championshipCount} 冠</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="text-xs uppercase tracking-[0.28em] text-amber-300">积分榜</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">谁是社区门面</h2>

          <div className="mt-6 space-y-3">
            {leaderboard.slice(0, 6).map((team, index) => (
              <article key={team.id} className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-sm font-semibold text-amber-100">{index + 1}</div>
                <TeamMark name={team.name} logoUrl={team.logoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <Link href={teamPath(team.id)} className="text-lg font-semibold text-white transition hover:text-amber-200">{team.name}</Link>
                  <p className="mt-1 text-sm text-slate-400">{team.summary ?? team.slogan ?? "这支队伍的介绍正在完善中。"}</p>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <div>积分 {team.honorScore}</div>
                  <div className="mt-1 text-slate-500">{team.championshipCount} 冠</div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">阵容墙</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">每支队伍先看阵容和战绩</h2>

          <div className="mt-6 space-y-4">
            {teams.map((team) => (
              <article key={team.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <div className="grid gap-0 lg:grid-cols-[0.38fr_0.62fr]">
                  <div className="border-b border-white/10 bg-gradient-to-br from-slate-900 to-amber-950/20 p-6 lg:border-b-0 lg:border-r">
                    <div className="flex items-start gap-4">
                      <TeamMark name={team.name} logoUrl={team.logoUrl} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs uppercase tracking-[0.24em] text-accent-gold">战队资料</div>
                        <h3 className="mt-2 text-2xl font-semibold text-white">
                          <Link href={teamPath(team.id)} className="transition hover:text-accent-gold">{team.name}</Link>
                        </h3>
                      </div>
                      <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">{team.championshipCount} 冠</div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">积分 {team.honorScore}</div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">战绩 {team.wins}-{team.losses}-{team.draws}</div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-400">{team.summary ?? team.slogan ?? "这支队伍的介绍正在补充中，先看看当前阵容。"}</p>
                    <div className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">成员数 {team.memberCount}</div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">当前阵容</div>
                      <Link href={teamPath(team.id)} className="text-sm font-semibold text-slate-400 transition hover:text-white">进入战队页</Link>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-200">
                      {team.members.map((member) => (
                        <Link key={member.id} href={playerPath(member.id)} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-cyan/40 hover:text-white">
                          {member.displayName}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </Shell>
  );
}
