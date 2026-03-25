import { Shell } from "@/components/shell";
import { AdminMatchForm } from "@/components/admin-match-form";
import { AdminMatchRow } from "@/components/admin-match-row";
import { AdminMatchTemplateForm } from "@/components/admin-match-template-form";
import { getAdminMatchesData } from "@/lib/admin-queries";

export default async function AdminMatchesPage() {
  const data = await getAdminMatchesData();

  return (
    <Shell>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <AdminMatchTemplateForm seasons={data.seasons} teams={data.teams} />
          <AdminMatchForm seasons={data.seasons} teams={data.teams} topics={data.topics} stages={data.stages} />
        </div>

        <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">比赛管理</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              在这里维护赛事阶段、系列赛、分局结果和 Dota2 对局绑定。四队模板会自动按半决赛 / 决赛组织，三队模板会自动按擂台赛补后续系列赛。
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {data.matches.map((match) => (
              <AdminMatchRow key={match.id} match={match} seasons={data.seasons} teams={data.teams} topics={data.topics} stages={data.stages} />
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
