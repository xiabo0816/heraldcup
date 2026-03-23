"use client";

import { useActionState } from "react";
import {
  addCaptainTeamMemberAction,
  createCaptainTeamAction,
  initialMyActionState,
  removeCaptainTeamMemberAction
} from "@/app/my/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";
import { groupPlayersByPool } from "@/lib/player-pool";
import { teamPath } from "@/lib/routes";
import Link from "next/link";

type TeamManagerPlayer = {
  id: string;
  displayName: string;
  ladderScore?: number | null;
  teamId: string | null;
  teamName: string;
};

type TeamManagerTeam = {
  id: string;
  name: string;
  slug: string;
  slogan: string | null;
  summary: string | null;
  captain: string | null;
  captainPlayerId: string | null;
  members: Array<{
    id: string;
    displayName: string;
    slug: string;
  }>;
};

export function PlayerTeamManager({
  currentPlayer,
  players,
  teams
}: {
  currentPlayer: TeamManagerPlayer;
  players: TeamManagerPlayer[];
  teams: TeamManagerTeam[];
}) {
  const [state, formAction] = useActionState(createCaptainTeamAction, initialMyActionState);
  const captainTeam = teams.find((team) => team.captainPlayerId === currentPlayer.id) ?? null;
  const currentTeam = currentPlayer.teamId ? teams.find((team) => team.id === currentPlayer.teamId) ?? null : null;
  const availablePlayers = players.filter((player) => player.id !== currentPlayer.id && !player.teamId);
  const groupedAvailablePlayers = groupPlayersByPool(
    [...availablePlayers].sort(
      (left, right) =>
        (right.ladderScore ?? 0) - (left.ladderScore ?? 0) || left.displayName.localeCompare(right.displayName, "zh-CN")
    )
  );

  if (captainTeam) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-200">队长控制台</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">{captainTeam.name} 的阵容管理</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">你当前以队长身份管理这支队伍，可以从选手池补人，也可以把成员从现役名单中移出。</p>
          </div>
          <Link href={teamPath(captainTeam.id)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:text-white">
            队伍详情页
          </Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">当前阵容</div>
            <div className="mt-4 space-y-3">
              {captainTeam.members.map((member) => (
                <div key={member.id} className="rounded-[20px] border border-white/10 bg-slate-950/50 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{member.displayName}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{member.id === currentPlayer.id ? "队长本人" : "现役成员"}</div>
                    </div>
                    {member.id !== currentPlayer.id ? (
                      <form action={removeCaptainTeamMemberAction}>
                        <input type="hidden" name="captainPlayerId" value={currentPlayer.id} />
                        <input type="hidden" name="teamId" value={captainTeam.id} />
                        <input type="hidden" name="playerId" value={member.id} />
                        <AdminFormSubmit idleLabel="移出队伍" pendingLabel="处理中..." variant="danger" />
                      </form>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">从选手池补人</div>
            <p className="mt-3 text-sm leading-7 text-slate-400">这里默认只展示当前还没有现役战队归属的选手，且会按先锋池、传奇池、冠绝池分组，避免你把别队成员直接拉走。</p>

            {availablePlayers.length ? (
              <form action={addCaptainTeamMemberAction} className="mt-5 grid gap-4">
                <input type="hidden" name="captainPlayerId" value={currentPlayer.id} />
                <input type="hidden" name="teamId" value={captainTeam.id} />
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>可选选手</span>
                  <select name="playerId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
                    {groupedAvailablePlayers.map((group) => (
                      <optgroup key={group.key} label={`${group.label} (${group.description})`}>
                        {group.players.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.displayName}{player.ladderScore ? ` · ${player.ladderScore}` : ""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  {groupedAvailablePlayers.map((group) => (
                    <div key={group.key} className="rounded-[18px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">
                      <div className="font-semibold text-white">{group.label}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{group.description}</div>
                      <div className="mt-2">当前可选 {group.players.length} 人</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <AdminFormSubmit idleLabel="加入队伍" pendingLabel="加入中..." />
                </div>
              </form>
            ) : (
              <div className="mt-5 rounded-[20px] border border-dashed border-white/10 bg-slate-950/35 p-5 text-sm leading-7 text-slate-400">当前选手池里没有可直接加入的新成员。</div>
            )}
          </article>
        </div>
      </section>
    );
  }

  if (currentTeam) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">队伍状态</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">你当前已经在 {currentTeam.name}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">目前只有队长可以创建并维护阵容名单。你已经属于现役战队，所以不能再新建一支队伍。</p>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="text-xs uppercase tracking-[0.28em] text-amber-300">创建队伍</div>
      <h2 className="mt-2 text-3xl font-semibold text-white">如果你想当队长，可以直接从这里建队</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400">建队成功后，你会自动成为队长并加入现役名单，随后就能从当前选手池挑队员。</p>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="captainPlayerId" value={currentPlayer.id} />
        <label className="grid gap-2 text-sm text-slate-300">
          <span>队伍名称</span>
          <input name="name" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="例如：夜航船" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          <span>slug</span>
          <input name="slug" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="night-ship" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>队伍口号</span>
          <input name="slogan" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="今晚这车必须发。" />
        </label>
        <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
          <span>队伍介绍</span>
          <textarea name="summary" rows={4} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none" placeholder="说明一下队伍风格、活跃时间和目标。" />
        </label>
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>
        <div className="md:col-span-2 flex justify-end">
          <AdminFormSubmit idleLabel="创建并成为队长" pendingLabel="创建中..." />
        </div>
      </form>
    </section>
  );
}