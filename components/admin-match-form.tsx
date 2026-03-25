"use client";

import { useActionState } from "react";
import { createMatchAction } from "@/app/admin/matches/actions";
import { initialMatchFormState } from "@/app/admin/matches/form-state";

const matchStatuses = ["DRAFT", "SCHEDULED", "LIVE", "FINISHED", "ARCHIVED"] as const;

export function AdminMatchForm({
  seasons,
  teams,
  topics,
  stages
}: {
  seasons: Array<{ id: string; title: string }>;
  teams: Array<{ id: string; name: string }>;
  topics: Array<{ id: string; title: string }>;
  stages: Array<{ id: string; seasonId: string; seasonTitle: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(createMatchAction, initialMatchFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Create Match</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">新增比赛</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">比赛 slug 会被选手代表作、内容页和话题内容反复引用，建议一次命名清楚。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>比赛标题</span>
          <input name="title" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="pioneer-cup-s11-final" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>外部比赛 ID</span>
          <input name="externalMatchId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>开赛时间</span>
          <input type="datetime-local" name="scheduledAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>赛制</span>
          <input name="format" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="BO3" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>所属阶段</span>
          <select name="stageId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
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
          <select name="status" defaultValue="SCHEDULED" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {matchStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>冠军队伍</span>
          <select name="winnerTeamId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
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
          <input name="roundNumber" type="number" min="1" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="1" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>阶段内顺序</span>
          <input name="sequenceNumber" type="number" min="1" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="1" />
        </label>
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">参赛队伍</div>
          <p className="mt-2 text-xs leading-6 text-slate-400">按 A/B/C/D 槽位录入，支持 2 到 4 支队伍。分数和名次都按同一行对应队伍填写。</p>
          <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_0.7fr_0.7fr]">
            {[
              { slot: "A", team: "teamAId", score: "scoreA", rank: "rankA" },
              { slot: "B", team: "teamBId", score: "scoreB", rank: "rankB" },
              { slot: "C", team: "teamCId", score: "scoreC", rank: "rankC" },
              { slot: "D", team: "teamDId", score: "scoreD", rank: "rankD" }
            ].map((field) => (
              <>
                <label key={`${field.slot}-team`} className="grid gap-2 text-sm text-slate-300">
                  <span>槽位 {field.slot} 队伍</span>
                  <select name={field.team} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    <option value="">留空</option>
                    {teams.map((team) => (
                      <option key={`${field.slot}-${team.id}`} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label key={`${field.slot}-score`} className="grid gap-2 text-sm text-slate-300">
                  <span>槽位 {field.slot} 分数</span>
                  <input name={field.score} type="number" min="0" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
                </label>
                <label key={`${field.slot}-rank`} className="grid gap-2 text-sm text-slate-300">
                  <span>槽位 {field.slot} 名次</span>
                  <input name={field.rank} type="number" min="1" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
                </label>
              </>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">分局与 Dota2 对局绑定</div>
          <p className="mt-2 text-xs leading-6 text-slate-400">默认展示前 5 局。BO3 只会保存前 3 局，剩余字段会忽略。每局可以单独绑定 Dota2 Match ID、胜者和结果摘要。</p>
          <div className="mt-4 grid gap-3">
            {[1, 2, 3, 4, 5].map((gameNumber) => (
              <div key={`create-game-${gameNumber}`} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[0.45fr_1fr_0.8fr_1fr]">
                <div className="flex items-center text-sm font-semibold text-white">第 {gameNumber} 局</div>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Dota2 比赛 ID</span>
                  <input name={`gameExternalMatchId${gameNumber}`} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="7987654321" />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>局状态</span>
                  <select name={`gameStatus${gameNumber}`} defaultValue="DRAFT" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    {matchStatuses.map((status) => (
                      <option key={`create-game-status-${gameNumber}-${status}`} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>本局胜者</span>
                  <select name={`gameWinnerTeamId${gameNumber}`} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    <option value="">待定</option>
                    {teams.map((team) => (
                      <option key={`create-game-winner-${gameNumber}-${team.id}`} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-slate-300 md:col-span-4">
                  <span>分局说明</span>
                  <input name={`gameSummary${gameNumber}`} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="例如：蓝方 32 分钟控盾后一波结束。" />
                </label>
              </div>
            ))}
          </div>
        </div>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>关联话题</span>
          <select name="topicId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
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
          <select name="seasonId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
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
          <input name="streamUrl" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>比赛摘要</span>
          <textarea name="summary" rows={3} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "创建中..." : "新增比赛"}
      </button>
    </form>
  );
}
