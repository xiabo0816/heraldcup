import { deleteMatchAction, updateMatchAction } from "@/app/admin/matches/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

const matchStatuses = ["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"] as const;

export function AdminMatchRow({
  match,
  seasons,
  teams,
  topics
}: {
  match: {
    id: string;
    title: string;
    slug: string;
    externalMatchId: string | null;
    scheduledAt: string;
    format: string | null;
    status: string;
    scoreHome: number | null;
    scoreAway: number | null;
    streamUrl: string | null;
    summary: string | null;
    topicId: string;
    topicTitle: string;
    seasonId: string;
    seasonTitle: string;
    homeTeamId: string;
    homeTeamName: string;
    awayTeamId: string;
    awayTeamName: string;
  };
  seasons: Array<{ id: string; title: string }>;
  teams: Array<{ id: string; name: string }>;
  topics: Array<{ id: string; title: string }>;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-rose">{match.seasonTitle}</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{match.title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {match.homeTeamName} vs {match.awayTeamName}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{match.topicTitle}</p>
        </div>
        <form action={deleteMatchAction}>
          <input type="hidden" name="id" value={match.id} />
          <AdminFormSubmit idleLabel="删除比赛" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <form action={updateMatchAction} className="mt-5 grid gap-3 md:grid-cols-2">
        <input type="hidden" name="id" value={match.id} />
        <label className="grid gap-2 text-sm text-slate-300">
          <span>比赛标题</span>
          <input name="title" defaultValue={match.title} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" defaultValue={match.slug} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>外部比赛 ID</span>
          <input name="externalMatchId" defaultValue={match.externalMatchId ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>开赛时间</span>
          <input type="datetime-local" name="scheduledAt" defaultValue={match.scheduledAt} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛制</span>
          <input name="format" defaultValue={match.format ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>状态</span>
          <select name="status" defaultValue={match.status} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {matchStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>主队</span>
          <select name="homeTeamId" defaultValue={match.homeTeamId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">待定</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>客队</span>
          <select name="awayTeamId" defaultValue={match.awayTeamId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">待定</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>主队比分</span>
          <input name="scoreHome" type="number" min="0" defaultValue={match.scoreHome ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>客队比分</span>
          <input name="scoreAway" type="number" min="0" defaultValue={match.scoreAway ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>关联话题</span>
          <select name="topicId" defaultValue={match.topicId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不关联话题</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>所属赛季</span>
          <select name="seasonId" defaultValue={match.seasonId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不绑定赛季</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>直播链接</span>
          <input name="streamUrl" defaultValue={match.streamUrl ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>比赛摘要</span>
          <textarea name="summary" defaultValue={match.summary ?? ""} rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <div className="md:col-span-2 flex justify-end">
          <AdminFormSubmit idleLabel="保存修改" pendingLabel="保存中..." />
        </div>
      </form>
    </article>
  );
}
