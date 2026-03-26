import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailHero } from "@/components/detail-hero";
import { HeroChip } from "@/components/hero-chip";
import { PlayerAvatar } from "@/components/player-avatar";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/team-mark";
import { getTeamDetailById } from "@/lib/queries";
import { playerPath } from "@/lib/routes";

const matchStatusLabels: Record<string, string> = {
  SCHEDULED: "即将开打",
  ONGOING: "正在进行",
  FINISHED: "已完赛",
  CANCELLED: "已取消"
};

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeamDetailById(id);

  if (!team) {
    notFound();
  }

  const featuredMembers = team.members.slice(0, 3);
  const recentMatches = team.matches.slice(0, 4);

  return (
    <Shell>
      <DetailHero
        eyebrow="Team Detail"
        badge={<span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-amber-100">战队档案</span>}
        title={(
          <div className="flex items-start gap-4">
            <TeamMark name={team.name} logoUrl={team.logoUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <div>{team.name}</div>
              <div className="mt-3 text-lg font-medium text-amber-100 md:text-xl">{team.slogan ?? "口号待补充"}</div>
            </div>
          </div>
        )}
        description={team.summary ?? "先从阵容、战绩和关键比赛认识这支队伍，再顺着他们的赛季轨迹继续看下去。"}
        chips={(
          <>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">赛事：{team.tournamentName ?? "社区赛事"}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">最近参赛赛季：{team.seasonTitle ?? "暂未关联赛季"}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">教练：{team.coach ?? "未设置"}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">队长：{team.captain ?? "未设置"}</span>
          </>
        )}
        actions={[
          { href: "/teams", label: "返回战队榜", variant: "solid" },
          { href: "/matches", label: "查看比赛", variant: "outline" }
        ]}
        stats={[
          { label: "社区积分", value: team.honorScore },
          { label: "冠军次数", value: team.championshipCount },
          { label: "当前战绩", value: `${team.wins}-${team.losses}-${team.draws}` },
          { label: "阵容人数", value: team.members.length }
        ]}
        className="bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))]"
        aside={(
          <article className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-amber-200">队伍画像</div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <p>这支队伍当前以 {team.members.length} 人阵容展开，最近沉淀在 {team.seasonTitle ?? "社区赛事"} 这一条线上。</p>
              <p>如果你是第一次看他们，先看核心阵容，再翻最近战绩，会比直接读完整比赛记录更快建立印象。</p>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">浏览建议</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">先看核心阵容，再翻最近战绩，很快就能感受到这支队伍当前的状态和气质。</p>
            </div>
          </article>
        )}
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">核心阵容</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">先看这支队伍的门面</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {featuredMembers.length ? featuredMembers.map((member) => (
              <Link key={member.id} href={playerPath(member.id)} className="block rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/25">
                <div className="flex items-start gap-4">
                  <PlayerAvatar src={member.avatarUrl} alt={member.displayName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">{member.primaryRole ?? "未分配位置"}</div>
                    <div className="mt-2 text-xl font-semibold text-white">{member.displayName}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.heroCards.length ? member.heroCards.slice(0, 4).map((hero) => (
                        <HeroChip key={`${member.slug}-${hero.label}`} hero={hero} compact />
                      )) : <span className="text-sm text-slate-500">暂未公开英雄池</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">这支队伍目前还没有公开现役成员名单。</div>}
          </div>
        </article>

        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-amber-300">全员名单</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">阵容墙</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {team.members.length ? team.members.map((member) => (
              <Link key={member.id} href={playerPath(member.id)} className="block rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:border-amber-300/25">
                <div className="flex items-start gap-4">
                  <PlayerAvatar src={member.avatarUrl} alt={member.displayName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{member.primaryRole ?? "未分配位置"}</div>
                    <div className="mt-2 text-xl font-semibold text-white">{member.displayName}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.heroCards.length ? member.heroCards.slice(0, 4).map((hero) => (
                    <HeroChip key={`${member.slug}-${hero.label}`} hero={hero} compact />
                  )) : <span className="text-sm text-slate-500">暂未公开英雄池</span>}
                </div>
              </Link>
            )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">这支队伍的完整阵容还没有全部公开。</div>}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">相关比赛</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">最近几场能说明这支队伍</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {recentMatches.length ? recentMatches.map((match) => (
            <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:border-accent-gold/40">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">{match.seasonTitle ?? "社区赛事"}</div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{matchStatusLabels[match.status] ?? match.status}</div>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{match.title}</h3>
              <p className="mt-3 text-sm text-slate-400">对手：{match.opponentName}</p>
              <p className="mt-2 text-sm text-slate-300">比分：{match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{match.summary ?? "比分和对手已经明确，想补看这支队伍的代表比赛，可以先从这里开始。"}</p>
            </Link>
          )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">这支队伍暂时还没有收录相关比赛。</div>}
        </div>
      </section>
    </Shell>
  );
}
