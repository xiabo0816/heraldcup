import { Shell } from "@/components/shell";
import { PlayerBindingPanel } from "@/components/player-binding-panel";
import { SectionCard } from "@/components/section-card";
import { getPlayers } from "@/lib/queries";

export default async function MyPage() {
  const players = await getPlayers();

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <PlayerBindingPanel
          players={players.map((player) => ({
            id: player.id,
            displayName: player.displayName,
            slug: player.slug,
            steamId: null
          }))}
        />
        <SectionCard title="我的队伍比赛" eyebrow="Player View">
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p>绑定完成后，这里会优先展示当前选手所属队伍的近期比赛、已结束战绩和高光比赛。</p>
            <p>这一页是 localStorage 默认身份展示层，不承担后台权限判断。</p>
          </div>
        </SectionCard>
      </div>
    </Shell>
  );
}
