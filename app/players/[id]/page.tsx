import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailHero } from "@/components/detail-hero";
import { HeroChip } from "@/components/hero-chip";
import { PlayerAvatar } from "@/components/player-avatar";
import { PlayerClaimAction } from "@/components/player-claim-action";
import { Shell } from "@/components/shell";
import { getCurrentIdentitySnapshot } from "@/lib/identity";
import { getPlayerDetailById } from "@/lib/queries";
import { teamPath } from "@/lib/routes";

const matchStatusLabels: Record<string, string> = {
  SCHEDULED: "即将开打",
  ONGOING: "正在进行",
  FINISHED: "已完赛"
};

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [player, identity] = await Promise.all([getPlayerDetailById(id), getCurrentIdentitySnapshot()]);

  if (!player) {
    notFound();
  }

  return (
    <Shell>
      <DetailHero
        eyebrow="Player Detail"
        badge={<span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100">选手档案</span>}
        title={(
          <div className="flex items-start gap-4">
            <PlayerAvatar src={player.avatarUrl} alt={player.displayName} size="lg" className="h-20 w-20 rounded-[28px]" />
            <div className="min-w-0 flex-1">
              <div>{player.displayName}</div>
              <div className="mt-3 text-lg font-medium text-cyan-100">{player.primaryRole ?? "社区选手"}</div>
            </div>
          </div>
        )}
        description={player.bio ?? "先从位置、英雄池和代表作认识这位选手，再顺着比赛与队伍了解他的赛场轨迹。"}
        chips={(
          <>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">所属战队：{player.teamId ? <Link href={teamPath(player.teamId)} className="transition hover:text-cyan-100">{player.teamName}</Link> : player.teamName}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">SteamID：{player.steamId ?? "未绑定"}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">擅长位置：{player.preferredRoles.length ? player.preferredRoles.join(" / ") : (player.primaryRole ?? "待补充")}</span>
          </>
        )}
        actions={[
          { href: player.teamId ? teamPath(player.teamId) : "/teams", label: "查看所属战队", variant: "solid" },
          { href: "/players", label: "返回选手墙", variant: "outline" }
        ]}
        stats={[
          { label: "位置", value: player.primaryRole ?? "社区选手" },
          { label: "天梯分", value: player.ladderScore ?? "待补充" },
          { label: "游戏年数", value: player.gameYears ?? "待补充" },
          { label: "冠军次数", value: player.championshipCount },
          { label: "高光比赛", value: player.highlightMatches.length }
        ]}
        aside={(
          <article className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">认领身份</div>
            <div className="mt-4 flex flex-wrap gap-3">
              <PlayerClaimAction identity={identity} playerId={player.id} playerName={player.displayName} />
            </div>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">浏览建议</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">先看英雄池，再翻代表作，最后顺着战队主页继续了解他的比赛经历。</p>
            </div>
          </article>
        )}
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {player.playStyles.length ? player.playStyles.map((style) => (
              <span key={`${player.id}-${style}`} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
                {style}
              </span>
            )) : (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">打法风格仍在整理中</span>
            )}
          </div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">英雄池</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">这位选手靠什么留下印象</h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {player.heroCards.length ? player.heroCards.map((hero) => (
              <HeroChip key={`${player.slug}-${hero.label}`} hero={hero} />
            )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">这位选手暂未公开英雄池资料。</div>}
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">历史队伍</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {player.formerTeams.length ? player.formerTeams.map((team) => (
                <Link key={`${player.id}-${team.id}`} href={teamPath(team.id)} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 text-sm text-slate-200 transition hover:border-accent-gold/40 hover:text-white">
                  {team.name}
                </Link>
              )) : <span className="text-slate-500">暂无历史队伍记录</span>}
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">我的游戏理解</div>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              {player.gameUnderstanding ?? "这位选手暂时还没有公开自己的游戏理解。"}
            </p>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">公开互评</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">其他选手怎么评价他</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-300">公开中 {player.publicReviews.length} 条</span>
            </div>

            <div className="mt-5 space-y-4">
              {player.publicReviews.length ? player.publicReviews.map((review) => (
                <article key={review.id} className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4">
                  <div className="flex items-start gap-4">
                    <PlayerAvatar src={review.authorPlayerAvatarUrl} alt={review.authorPlayerName} size="md" className="h-12 w-12 rounded-2xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                        <span className="font-semibold text-white">{review.authorPlayerName}</span>
                        <span>·</span>
                        <span>{review.authorPrimaryRole ?? "社区选手"}</span>
                        {review.authorTeamId && review.authorTeamSlug ? (
                          <>
                            <span>·</span>
                            <Link href={teamPath(review.authorTeamId)} className="transition hover:text-cyan-100">{review.authorTeamName}</Link>
                          </>
                        ) : review.authorTeamName ? (
                          <>
                            <span>·</span>
                            <span>{review.authorTeamName}</span>
                          </>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{review.content}</p>
                    </div>
                  </div>
                </article>
              )) : <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/35 p-5 text-sm leading-7 text-slate-400">这位选手暂时还没有公开的互评内容。</div>}
            </div>
          </div>
        </article>

        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="text-xs uppercase tracking-[0.28em] text-amber-300">高光比赛</div>
          <h2 className="mt-2 text-3xl font-semibold text-white">这几场最能说明他</h2>

          <div className="mt-6 space-y-4">
            {player.highlightMatches.length ? player.highlightMatches.map((match) => (
              <Link key={match.slug} href={`/matches/${match.slug}`} className="block rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:border-accent-gold/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[0.22em] text-accent-gold">{match.seasonTitle ?? "社区赛事"}</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{match.status ? (matchStatusLabels[match.status] ?? match.status) : "未设置状态"}</div>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">{match.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{(match.homeTeamName ?? "待定") + " vs " + (match.awayTeamName ?? "待定")}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{match.summary ?? "这场比赛值得回看，想认识他的代表作，可以先从这里开始。"}</p>
              </Link>
            )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">这位选手暂时还没有收录代表比赛。</div>}
          </div>
        </article>
      </section>
    </Shell>
  );
}
