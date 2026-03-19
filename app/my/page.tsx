import { MyDashboard } from "@/components/my-dashboard";
import { Shell } from "@/components/shell";
import { PlayerBindingPanel } from "@/components/player-binding-panel";
import { getMatches, getPlayers, getTeams } from "@/lib/queries";

export default async function MyPage({ searchParams }: { searchParams: Promise<{ claim?: string }> }) {
  const { claim } = await searchParams;
  const [players, teams, matches] = await Promise.all([getPlayers(), getTeams(), getMatches()]);
  const initialSelectedPlayerId = players.some((player) => player.id === claim) ? claim : undefined;
  const boundReadyCount = players.filter((player) => player.steamId).length;

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.95))] p-8 shadow-glow md:p-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr] xl:items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-200">My Portal</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">把首页变成你的入口页。</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-base">认领后，你会直接看到自己的战队、比赛和英雄池。没认领也没关系，这里就是把个人入口和绑定流程放在同一页里。</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">可认领选手</div>
                <div className="mt-3 text-3xl font-semibold text-white">{players.length}</div>
                <p className="mt-2 text-sm text-slate-400">位选手可作为默认身份。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">已填 SteamID</div>
                <div className="mt-3 text-3xl font-semibold text-white">{boundReadyCount}</div>
                <p className="mt-2 text-sm text-slate-400">位选手已经具备更完整的数据入口。</p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">最近比赛</div>
                <div className="mt-3 text-3xl font-semibold text-white">{matches.length}</div>
                <p className="mt-2 text-sm text-slate-400">场比赛可以回流到个人主页。</p>
              </article>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-emerald-200">这页现在做什么</div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <p>先看你的个人面板，确认当前默认身份、所属战队和近期比赛。</p>
              <p>如果还没认领，就直接在右侧绑定；如果已经认领，就把这里当作进入整个社区的个人入口。</p>
              <p>认领只用于个性化展示，你的公开战绩和资料会持续同步完善。</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <MyDashboard players={players} teams={teams} matches={matches} />
        <PlayerBindingPanel
          initialSelectedPlayerId={initialSelectedPlayerId}
          players={players.map((player) => ({
            id: player.id,
            displayName: player.displayName,
            slug: player.slug,
            teamName: player.teamName,
            teamId: player.teamId,
            teamSlug: player.teamSlug,
            steamId: player.steamId ?? null
          }))}
        />
      </div>
    </Shell>
  );
}
