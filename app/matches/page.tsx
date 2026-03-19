import Link from "next/link";
import { Shell } from "@/components/shell";
import { getMatches } from "@/lib/queries";
import { teamPath } from "@/lib/routes";
import { getTournamentTheme } from "@/lib/tournament-theme";

const matchStatusLabels: Record<string, string> = {
  SCHEDULED: "即将开打",
  ONGOING: "正在进行",
  FINISHED: "已完赛",
  CANCELLED: "已取消"
};

function formatDateLabel(value: Date | string | null) {
  if (!value) {
    return "时间待定";
  }

  return new Date(value).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function MatchesPage() {
  const matches = await getMatches();
  const upcomingMatches = [...matches].reverse().filter((match) => match.status !== "FINISHED");
  const finishedMatches = matches.filter((match) => match.status === "FINISHED");
  const liveMatch = upcomingMatches.find((match) => match.status === "ONGOING") ?? upcomingMatches[0] ?? matches[0] ?? null;

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_22%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute left-10 top-8 h-px w-32 bg-gradient-to-r from-rose-300/0 via-rose-300/60 to-rose-300/0" />
          <div className="absolute bottom-10 right-8 h-36 w-36 rounded-full bg-rose-400/10 blur-3xl" />
        </div>
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-rose-200">Match Center</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">先看今晚和本周，再慢慢翻历届。</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">赛事页现在不再只是历史清单，而是把正在进行、即将开打、最近完赛和历届记录分开给你。顺着比赛可以继续跳战队、内容页和冠军归档。</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">待开打</div>
                <div className="mt-3 text-3xl font-semibold text-white">{upcomingMatches.length}</div>
                <p className="mt-2 text-sm text-slate-400">场比赛已经排在前面，今晚先从这里锁定焦点对局。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">已完赛</div>
                <div className="mt-3 text-3xl font-semibold text-white">{finishedMatches.length}</div>
                <p className="mt-2 text-sm text-slate-400">场结果已经沉到社区档案里。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">主入口</div>
                <div className="mt-3 text-lg font-semibold text-white">比赛页优先</div>
                <p className="mt-2 text-sm text-slate-400">从这里跳队伍、战报、冠军页，路径最短。</p>
              </article>
            </div>
          </div>

          <article className="rounded-[32px] border border-rose-400/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(136,19,55,0.22))] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-rose-200">当前焦点</div>
                <h2 className="mt-3 text-3xl font-semibold text-white">{liveMatch?.title ?? "等待下一场比赛"}</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-rose-100">
                {liveMatch ? (matchStatusLabels[liveMatch.status] ?? liveMatch.status) : "暂无数据"}
              </div>
            </div>

            {liveMatch ? (
              <>
                <div className="mt-4 text-sm leading-7 text-slate-300">{formatDateLabel(liveMatch.scheduledAt)} · {liveMatch.seasonTitle ?? liveMatch.tournamentName ?? "社区赛事"}</div>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-lg text-white">
                  <span>{liveMatch.homeTeamName}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">VS</span>
                  <span>{liveMatch.awayTeamName}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">{liveMatch.summary ?? "这场对局的比分、战报和冠军内容，都会从这里持续补齐。"}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/matches/${liveMatch.slug}`} className="rounded-full border border-rose-300/40 px-5 py-2.5 text-sm font-semibold text-rose-100 transition hover:border-rose-200/60">
                    进入比赛页
                  </Link>
                  <Link href="/content" className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white">
                    看对应内容
                  </Link>
                </div>
              </>
            ) : null}
          </article>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">今晚与本周</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">先排待开打比赛</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-300">{upcomingMatches.length} 场</div>
          </div>

          <div className="mt-6 space-y-4">
            {upcomingMatches.length ? upcomingMatches.map((match, index) => {
              const theme = getTournamentTheme(match.tournamentKind, match.tournamentName ?? match.title);

              return (
                <article
                  key={match.id}
                  className={`relative rounded-[28px] border p-5 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em]">
                        <span className={`rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 ${theme.accentText}`}>{index === 0 ? "今晚主推" : "本周安排"}</span>
                        <span className="text-slate-400">{matchStatusLabels[match.status] ?? match.status}</span>
                        <span className="text-slate-500">{formatDateLabel(match.scheduledAt)}</span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold text-white">
                        <Link href={`/matches/${match.slug}`} className="transition hover:text-white/80">
                          {match.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{match.summary ?? "赛前看点正在整理中，先锁定对阵和开赛时间。"}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                        {(match.participantTeamNames.length ? match.participantTeamNames : [match.homeTeamName, match.awayTeamName]).map((teamName) => {
                          const teamId = teamName === match.homeTeamName ? match.homeTeamId : teamName === match.awayTeamName ? match.awayTeamId : null;
                          return teamId ? (
                            <Link key={`${match.slug}-${teamName}`} href={teamPath(teamId)} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 transition hover:border-cyan-300/30 hover:text-white">
                              {teamName}
                            </Link>
                          ) : (
                            <span key={`${match.slug}-${teamName}`} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5">
                              {teamName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-200">{match.format ?? "赛事记录"}</div>
                  </div>
                </article>
              );
            }) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400">赛程更新后，这里会第一时间挂出下一场焦点对局。</div>
            )}
          </div>
        </article>

        <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-amber-300">最近完赛</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">结果与冠军线索</h2>
            </div>
            <Link href="/content" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-amber-300/40 hover:text-white">
              去看战报
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {finishedMatches.length ? finishedMatches.slice(0, 5).map((match) => (
              <article key={match.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{match.seasonTitle ?? match.tournamentName ?? "社区赛事"}</div>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      <Link href={`/matches/${match.slug}`} className="transition hover:text-amber-200">{match.title}</Link>
                    </h3>
                    <div className="mt-3 text-sm text-slate-300">{match.homeTeamName} {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"} {match.awayTeamName}</div>
                    {match.championTeamName ? <div className="mt-3 text-sm text-amber-200">冠军：{match.championTeamId ? <Link href={teamPath(match.championTeamId)} className="transition hover:text-amber-100">{match.championTeamName}</Link> : match.championTeamName}</div> : null}
                  </div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">已完赛</div>
                </div>
              </article>
            )) : <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400">当前还没有完赛记录。</div>}
          </div>
        </article>
      </section>

      <section className="mt-6 space-y-5">
        {matches.map((match) => {
          const theme = getTournamentTheme(match.tournamentKind, match.tournamentName ?? match.title);

          return (
          <article
            key={match.id}
            className={`relative rounded-[28px] border p-6 shadow-glow backdrop-blur ${theme.panelBorder} ${theme.panelBackground}`}
          >
            <div className={`absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent ${theme.divider} to-transparent md:block`} />
            <div className="grid gap-5 md:grid-cols-[140px_1fr] md:pl-8">
              <div>
                <div className={`text-xs uppercase tracking-[0.22em] ${theme.accentText}`}>{match.tournamentName ?? theme.label}</div>
                <div className="mt-2 text-sm font-semibold text-slate-200">{formatDateLabel(match.scheduledAt)}</div>
                <div className="mt-3 rounded-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-slate-300 inline-flex">{match.format ?? "赛事记录"}</div>
                {match.seasonTitle ? <div className="mt-3 text-xs text-slate-500">{match.seasonTitle}</div> : null}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`text-xs uppercase tracking-[0.22em] ${theme.accentText}`}>{matchStatusLabels[match.status] ?? match.status}</div>
                  {match.championTeamName ? (
                    <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                      冠军：{match.championTeamId ? <Link href={teamPath(match.championTeamId)} className="transition hover:text-amber-100">{match.championTeamName}</Link> : match.championTeamName}
                    </div>
                  ) : null}
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  <Link href={`/matches/${match.slug}`} className="transition hover:text-white/80">
                    {match.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{match.summary ?? "这场比赛的战况摘要正在整理中。"}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                  {(match.participantTeamNames.length ? match.participantTeamNames : [match.homeTeamName, match.awayTeamName]).map((teamName) => {
                    const teamId = teamName === match.homeTeamName ? match.homeTeamId : teamName === match.awayTeamName ? match.awayTeamId : null;
                    return teamId ? (
                      <Link key={`${match.slug}-${teamName}`} href={teamPath(teamId)} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 transition hover:border-accent-cyan/40 hover:text-white">
                        {teamName}
                      </Link>
                    ) : (
                      <span key={`${match.slug}-${teamName}`} className="rounded-full border border-white/10 bg-ink px-3 py-1.5">
                        {teamName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        )})}
      </section>
    </Shell>
  );
}
