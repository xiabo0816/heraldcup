import { deleteMatchAction, updateMatchAction } from "@/app/admin/matches/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

const matchStatuses = ["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"] as const;

function formatStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "筹备中";
    case "SCHEDULED":
      return "待开赛";
    case "LIVE":
      return "进行中";
    case "FINISHED":
      return "已完赛";
    case "ARCHIVED":
      return "已归档";
    default:
      return status;
  }
}

function getSourceHints(match: {
  stageSlug: string;
  roundNumber: number | null;
  sequenceNumber: number | null;
  stageAdvanceRule: string | null;
}) {
  const hints: string[] = [];

  if (match.stageSlug === "gauntlet" && match.roundNumber === 1) {
    hints.push("本场胜者自动进入擂主战");
  }

  if (match.stageSlug === "gauntlet" && match.roundNumber === 2) {
    hints.push("A 槽位 = 擂主");
    hints.push("B 槽位 = 预选胜者");
  }

  if (match.stageSlug === "semifinal" && match.sequenceNumber === 1) {
    hints.push("本场胜者进入总决赛席位 A");
  }

  if (match.stageSlug === "semifinal" && match.sequenceNumber === 2) {
    hints.push("本场胜者进入总决赛席位 B");
  }

  if (match.stageSlug === "final" && match.roundNumber === 2) {
    hints.push("A 槽位 = 半决赛 1 胜者");
    hints.push("B 槽位 = 半决赛 2 胜者");
  }

  if (match.stageAdvanceRule) {
    hints.push(match.stageAdvanceRule);
  }

  return [...new Set(hints)];
}

function buildSlotLabel(slot: string, seedNumber: number | null) {
  return seedNumber ? `槽位 ${slot} 队伍 · ${seedNumber} 号种子` : `槽位 ${slot} 队伍`;
}

export function AdminMatchRow({
  match,
  seasons,
  teams,
  topics,
  stages
}: {
  match: {
    id: string;
    title: string;
    slug: string;
    externalMatchId: string | null;
    scheduledAt: string;
    format: string | null;
    status: string;
    streamUrl: string | null;
    summary: string | null;
    topicId: string;
    topicTitle: string;
    seasonId: string;
    seasonTitle: string;
    stageId: string;
    stageName: string;
    stageSlug: string;
    stageAdvanceRule: string | null;
    roundNumber: number | null;
    sequenceNumber: number | null;
    winnerTeamId: string;
    winnerTeamName: string | null;
    participantLabel: string;
    teamAId: string;
    teamAName: string;
    seedA: number | null;
    scoreA: number | null;
    rankA: number | null;
    teamBId: string;
    teamBName: string;
    seedB: number | null;
    scoreB: number | null;
    rankB: number | null;
    teamCId: string;
    teamCName: string;
    seedC: number | null;
    scoreC: number | null;
    rankC: number | null;
    teamDId: string;
    teamDName: string;
    seedD: number | null;
    scoreD: number | null;
    rankD: number | null;
    games: Array<{
      gameNumber: number;
      externalGameId: string;
      status: string;
      winnerTeamId: string;
      winnerTeamName: string | null;
      summary: string;
    }>;
  };
  seasons: Array<{ id: string; title: string }>;
  teams: Array<{ id: string; name: string }>;
  topics: Array<{ id: string; title: string }>;
  stages: Array<{ id: string; seasonId: string; seasonTitle: string; name: string }>;
}) {
  const sourceHints = getSourceHints(match);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-accent-rose">{match.seasonTitle}</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{match.title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">{match.participantLabel}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{match.stageName} / 第 {match.roundNumber ?? "-"} 轮 / 顺序 {match.sequenceNumber ?? "-"}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-600">{match.topicTitle}</p>
        </div>
        <form action={deleteMatchAction}>
          <input type="hidden" name="id" value={match.id} />
          <AdminFormSubmit idleLabel="删除比赛" pendingLabel="删除中..." variant="danger" />
        </form>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200">{formatStatusLabel(match.status)}</span>
        {match.winnerTeamName ? <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-emerald-100">胜者 {match.winnerTeamName}</span> : null}
        {sourceHints.map((hint) => (
          <span key={`${match.id}-${hint}`} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-100">
            {hint}
          </span>
        ))}
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
          <span>所属阶段</span>
          <select name="stageId" defaultValue={match.stageId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">暂不设置阶段</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.seasonTitle} / {stage.name}
              </option>
            ))}
          </select>
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
          <span>冠军队伍</span>
          <select name="winnerTeamId" defaultValue={match.winnerTeamId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">待定</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>轮次</span>
          <input name="roundNumber" type="number" min="1" defaultValue={match.roundNumber ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>阶段内顺序</span>
          <input name="sequenceNumber" type="number" min="1" defaultValue={match.sequenceNumber ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">参赛队伍</div>
          <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_0.7fr_0.7fr]">
            {[
              { slot: "A", team: "teamAId", value: match.teamAId, seed: match.seedA, score: "scoreA", scoreValue: match.scoreA, rank: "rankA", rankValue: match.rankA },
              { slot: "B", team: "teamBId", value: match.teamBId, seed: match.seedB, score: "scoreB", scoreValue: match.scoreB, rank: "rankB", rankValue: match.rankB },
              { slot: "C", team: "teamCId", value: match.teamCId, seed: match.seedC, score: "scoreC", scoreValue: match.scoreC, rank: "rankC", rankValue: match.rankC },
              { slot: "D", team: "teamDId", value: match.teamDId, seed: match.seedD, score: "scoreD", scoreValue: match.scoreD, rank: "rankD", rankValue: match.rankD }
            ].map((field) => (
              <>
                <label key={`${match.id}-${field.slot}-team`} className="grid gap-2 text-sm text-slate-300">
                  <span>{buildSlotLabel(field.slot, field.seed)}</span>
                  <select name={field.team} defaultValue={field.value} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    <option value="">留空</option>
                    {teams.map((team) => (
                      <option key={`${match.id}-${field.slot}-${team.id}`} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label key={`${match.id}-${field.slot}-score`} className="grid gap-2 text-sm text-slate-300">
                  <span>槽位 {field.slot} 分数</span>
                  <input name={field.score} type="number" min="0" defaultValue={field.scoreValue ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
                </label>
                <label key={`${match.id}-${field.slot}-rank`} className="grid gap-2 text-sm text-slate-300">
                  <span>槽位 {field.slot} 名次</span>
                  <input name={field.rank} type="number" min="1" defaultValue={field.rankValue ?? ""} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
                </label>
              </>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">分局与 Dota2 对局绑定</div>
          <div className="mt-4 grid gap-3">
            {match.games.map((game) => (
              <div key={`${match.id}-game-${game.gameNumber}`} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[0.45fr_1fr_0.8fr_1fr]">
                <div className="flex items-center text-sm font-semibold text-white">第 {game.gameNumber} 局</div>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Dota2 比赛 ID</span>
                  <input name={`gameExternalMatchId${game.gameNumber}`} defaultValue={game.externalGameId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>局状态</span>
                  <select name={`gameStatus${game.gameNumber}`} defaultValue={game.status} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    {matchStatuses.map((status) => (
                      <option key={`${match.id}-game-status-${game.gameNumber}-${status}`} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>本局胜者</span>
                  <select name={`gameWinnerTeamId${game.gameNumber}`} defaultValue={game.winnerTeamId} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    <option value="">待定</option>
                    {teams.map((team) => (
                      <option key={`${match.id}-game-winner-${game.gameNumber}-${team.id}`} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-slate-300 md:col-span-4">
                  <span>分局说明</span>
                  <input name={`gameSummary${game.gameNumber}`} defaultValue={game.summary} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
                </label>
              </div>
            ))}
          </div>
        </div>
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
