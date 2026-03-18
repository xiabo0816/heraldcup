import { Shell } from "@/components/shell";
import { AdminTournamentForm } from "@/components/admin-tournament-form";
import { AdminTournamentRow } from "@/components/admin-tournament-row";
import { getAdminTournamentsData } from "@/lib/admin-queries";

export default async function AdminTournamentsPage() {
  const seasons = await getAdminTournamentsData();

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminTournamentForm />

        <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">赛事管理</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              这里统一维护赛事系列与届次。首页展示会自动使用当前被标记为 featured 的赛季。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {seasons.map((season) => (
              <AdminTournamentRow key={season.id} season={season} />
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
