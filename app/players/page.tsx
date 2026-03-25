import Link from "next/link";
import { HeroChip } from "@/components/hero-chip";
import { PlayerAvatar } from "@/components/player-avatar";
import { Shell } from "@/components/shell";
import { groupPlayersByPool } from "@/lib/player-pool";
import { getPlayers } from "@/lib/queries";
import { playerPath, teamPath } from "@/lib/routes";

export default async function PlayersPage() {
  const players = await getPlayers();
  const champions = players.filter((player) => player.championshipCount > 0).sort((left, right) => right.championshipCount - left.championshipCount).slice(0, 6);
  const roleLeaders = [...players].sort((left, right) => right.heroCards.length - left.heroCards.length || right.championshipCount - left.championshipCount).slice(0, 4);
  const groupedPlayers = groupPlayersByPool(
    [...players].sort(
      (left, right) =>
        (right.ladderScore ?? 0) - (left.ladderScore ?? 0) || left.displayName.localeCompare(right.displayName, "zh-CN")
    )
  );

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr] xl:items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Player Wall</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">先记住人，再去翻比赛和队伍。</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">选手页现在先给冠军常客和英雄池更厚的人，再把整面选手墙拉开。你能更快看到谁在社区里留下了痕迹。</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">选手总数</div>
                <div className="mt-3 text-3xl font-semibold text-white">{players.length}</div>
                <p className="mt-2 text-sm text-slate-400">位选手已经进入社区名册。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">冠绝池人数</div>
                <div className="mt-3 text-3xl font-semibold text-white">{groupedPlayers.find((group) => group.key === "GUANJUE")?.players.length ?? 0}</div>
                <p className="mt-2 text-sm text-slate-400">位选手当前在 6000+ 或暂未填写天梯分。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">分池规则</div>
                <div className="mt-3 text-lg font-semibold text-white">先锋 / 传奇 / 冠绝</div>
                <p className="mt-2 text-sm text-slate-400">0-2999 / 3000-5999 / 6000+，未填分数默认冠绝。</p>
              </article>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {roleLeaders.map((player) => (
              <article key={player.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <PlayerAvatar src={player.avatarUrl} alt={player.displayName} size="md" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-amber-300">焦点选手</div>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      <Link href={playerPath(player.id)} className="transition hover:text-accent-cyan">{player.displayName}</Link>
                    </h2>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">{player.primaryRole ?? "社区常驻"} · {player.ladderScore ? `${player.ladderScore} 分` : `${player.championshipCount} 冠`}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-cyan-100">
                  {player.playStyles?.slice(0, 2).map((style) => (
                    <span key={`${player.id}-${style}`} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
                      {style}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {player.heroCards.slice(0, 3).map((hero) => (
                    <HeroChip key={`${player.slug}-${hero.label}`} hero={hero} compact />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-amber-300">冠军常客</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">先看最常被记住的几个人</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {champions.length ? champions.map((player) => (
            <article key={player.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <PlayerAvatar src={player.avatarUrl} alt={player.displayName} size="md" />
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-amber-300">冠军常客</div>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    <Link href={playerPath(player.id)} className="transition hover:text-accent-cyan">{player.displayName}</Link>
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">夺冠 {player.championshipCount} 次</p>
              <div className="mt-3 text-sm text-slate-500">{player.gameYears ? `游戏 ${player.gameYears} 年` : "游戏年数待补充"}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {player.heroCards.slice(0, 3).map((hero) => (
                  <HeroChip key={`${player.slug}-${hero.label}`} hero={hero} compact />
                ))}
              </div>
            </article>
          )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400">冠军数据还没积起来。</div>}
        </div>
      </section>

      <section className="mt-6 space-y-6">
        {groupedPlayers.map((group) => (
          <div key={group.key} className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">{group.label}</div>
                <h2 className="mt-2 text-3xl font-semibold text-white">{group.description} 分段选手池</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">当前这组会自动承接对应分段的选手；如果暂时没有天梯分，也会先归到冠绝池，后续补分后再自动回到对应分段。</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{group.players.length} 位选手</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.players.length ? group.players.map((player) => (
                <article key={player.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <PlayerAvatar src={player.avatarUrl} alt={player.displayName} size="md" />
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-accent-cyan">{player.primaryRole ?? "常驻选手"}</div>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                          <Link href={playerPath(player.id)} className="transition hover:text-accent-cyan">
                            {player.displayName}
                          </Link>
                        </h3>
                      </div>
                    </div>
                    <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                      {player.ladderScore ? `${player.ladderScore} 分` : `${player.championshipCount} 冠`}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    所属战队：
                    {player.teamId ? <Link href={teamPath(player.teamId)} className="transition hover:text-accent-cyan">{player.teamName}</Link> : player.teamName}
                  </p>

                  <div className="mt-2 text-sm text-slate-500">历史队伍 {player.formerTeams.length} 支</div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-amber-100">
                    {player.preferredRoles?.length ? player.preferredRoles.slice(0, 3).map((role) => (
                      <span key={`${player.id}-${role}`} className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1">
                        {role}
                      </span>
                    )) : <span className="text-slate-500">擅长位置待补充</span>}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {player.heroCards.length ? player.heroCards.slice(0, 5).map((hero) => (
                      <HeroChip key={`${player.slug}-${hero.label}`} hero={hero} compact />
                    )) : <span className="text-sm text-slate-500">英雄池资料暂未公开</span>}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    {player.formerTeams.length ? player.formerTeams.slice(0, 4).map((team) => (
                      <Link key={`${player.id}-${team.id}`} href={teamPath(team.id)} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-gold/40 hover:text-white">
                        {team.name}
                      </Link>
                    )) : <span className="text-slate-500">还没有历史队伍记录</span>}
                  </div>
                </article>
              )) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400">当前还没有选手进入这个分段池。</div>
              )}
            </div>
          </div>
        ))}
      </section>
    </Shell>
  );
}
