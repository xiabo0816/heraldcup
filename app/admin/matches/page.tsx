import { Shell } from "@/components/shell";
import { AdminMatchForm } from "@/components/admin-match-form";
import { AdminMatchRow } from "@/components/admin-match-row";
import { getAdminMatchesData } from "@/lib/admin-queries";

export default async function AdminMatchesPage() {
  const data = await getAdminMatchesData();

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminMatchForm seasons={data.seasons} teams={data.teams} />

        <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">比赛管理</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              这里维护赛程、状态、比分、对阵双方和直播入口。比赛 slug 会被选手高光比赛 ID 直接引用。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {data.matches.map((match) => (
              <AdminMatchRow key={match.id} match={match} seasons={data.seasons} teams={data.teams} />
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
