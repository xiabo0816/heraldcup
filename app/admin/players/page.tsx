import { Shell } from "@/components/shell";
import { AdminPlayerForm } from "@/components/admin-player-form";
import { AdminPlayerRow } from "@/components/admin-player-row";
import { getAdminPlayersData } from "@/lib/admin-queries";

export default async function AdminPlayersPage() {
  const players = await getAdminPlayersData();

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminPlayerForm />

        <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">选手管理</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              在这里维护选手基础信息、SteamID、擅长英雄和代表比赛。代表比赛建议直接填写比赛 slug。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {players.map((player) => (
              <AdminPlayerRow key={player.id} player={player} />
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
