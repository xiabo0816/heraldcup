"use client";

import { useActionState } from "react";
import { generateMatchTemplateAction } from "@/app/admin/matches/actions";
import { initialMatchFormState } from "@/app/admin/matches/form-state";

const templateOptions = [
  {
    value: "DIRECT_BO3",
    label: "两队 BO3",
    description: "A vs B 直接进入总决赛。"
  },
  {
    value: "GAUNTLET",
    label: "三队擂台",
    description: "A 为擂主，B/C 先打预选，胜者再挑战擂主。"
  },
  {
    value: "FINAL_FOUR",
    label: "四队半决赛",
    description: "A vs D、B vs C，两场半决赛胜者进入总决赛。"
  }
] as const;

export function AdminMatchTemplateForm({
  seasons,
  teams
}: {
  seasons: Array<{ id: string; title: string }>;
  teams: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(generateMatchTemplateAction, initialMatchFormState);

  return (
    <form action={formAction} className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-accent-gold">Schedule Template</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">模板化生成赛程</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        这里直接生成完整赛程骨架。两队会直接建 BO3 总决赛，三队会生成擂台预选并在预选结束后自动补出擂主战，四队会生成两场半决赛并在胜者确定后自动补总决赛。
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span>所属赛季</span>
          <select name="seasonId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            <option value="">选择赛季</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>模板类型</span>
          <select name="template" defaultValue="DIRECT_BO3" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
            {templateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>默认赛制</span>
          <input name="bestOf" type="number" min="1" defaultValue="3" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>默认开赛时间</span>
          <input type="datetime-local" name="scheduledAt" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" />
        </label>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold text-white">模板槽位</div>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          A/B 为两队 BO3；三队擂台时 A 是擂主、B/C 是预选对阵；四队模板时按 A vs D、B vs C 生成半决赛。
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-xs leading-6 text-emerald-50">
            <div className="text-sm font-semibold text-white">两队 BO3</div>
            <div className="mt-1">A = 1 号种子，B = 2 号种子，直接进入总决赛。</div>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-xs leading-6 text-cyan-50">
            <div className="text-sm font-semibold text-white">三队擂台</div>
            <div className="mt-1">A = 擂主，B/C = 预选对阵。预选胜者自动进入擂主战。</div>
          </div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-6 text-amber-50">
            <div className="text-sm font-semibold text-white">四队半决赛</div>
            <div className="mt-1">A = 1 号种子，B = 2 号种子，C = 3 号种子，D = 4 号种子。</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            { label: "槽位 A", name: "teamAId" },
            { label: "槽位 B", name: "teamBId" },
            { label: "槽位 C", name: "teamCId" },
            { label: "槽位 D", name: "teamDId" }
          ].map((field) => (
            <label key={field.name} className="grid gap-2 text-sm text-slate-300">
              <span>{field.label}</span>
              <select name={field.name} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                <option value="">留空</option>
                {teams.map((team) => (
                  <option key={`${field.name}-${team.id}`} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        <input type="checkbox" name="replaceExisting" defaultChecked className="h-4 w-4 rounded border-white/10 bg-ink text-accent-gold" />
        <span>生成前清空该赛季原有赛程与阶段</span>
      </label>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>

      <div className="mt-5 grid gap-3 text-xs leading-6 text-slate-400 md:grid-cols-3">
        {templateOptions.map((option) => (
          <div key={option.value} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-sm font-semibold text-white">{option.label}</div>
            <div className="mt-2">{option.description}</div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={pending} className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60">
        {pending ? "生成中..." : "生成赛程模板"}
      </button>
    </form>
  );
}