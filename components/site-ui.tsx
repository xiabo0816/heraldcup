import Link from "next/link";
import type { ReactNode } from "react";
import {
  claimExistingPlayerAction,
  createClaimAction,
  createTeamAction,
  disbandTeamAction,
  joinTeamAction,
  leaveTeamAction,
  sendInvitationAction,
  unbindCurrentPlayerAction
} from "@/lib/actions";
import { type Scope, scopeMeta } from "@/lib/queries";
import type { Viewer } from "@/lib/session";
import { cn } from "@/lib/site-utils";

export function SectionCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("surface-card rounded-2xl p-5", className)}>{children}</section>;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm text-secondary">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatGrid({ items }: { items: { label: string; value: string; hint?: string }[] }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div className="surface-panel rounded-xl px-4 py-4" key={item.label}>
          <div className="text-xs uppercase tracking-[0.16em] text-soft">{item.label}</div>
          <div className="mt-2 text-2xl font-semibold">{item.value}</div>
          {item.hint ? <div className="mt-1 text-sm text-secondary">{item.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function ScopeTabs({
  basePath,
  currentScope,
  className
}: {
  basePath: string;
  currentScope: Scope;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {(["all", "pioneer", "legend", "crown"] as Scope[]).map((scope) => {
        const isCurrent = currentScope === scope;
        return (
          <Link
            className={cn(
              "rounded-xl px-4 py-2 text-sm transition",
              isCurrent ? "scope-tab-active" : "scope-tab"
            )}
            href={scope === "all" ? basePath : `${basePath}?scope=${scope}`}
            key={scope}
          >
            {scopeMeta[scope].label}
          </Link>
        );
      })}
    </div>
  );
}

export function ScopeBanner({ scope }: { scope: Scope }) {
  if (scope === "all") {
    return null;
  }

  return (
    <SectionCard className="scope-panel scope-banner mt-4 rounded-2xl p-6">
      <div className="eyebrow">{scopeMeta[scope].label}</div>
      <h1 className="mt-2 text-3xl font-semibold">{scopeMeta[scope].label}当前赛道</h1>
      <p className="mt-3 max-w-3xl text-sm text-secondary">{scopeMeta[scope].bannerBody}</p>
    </SectionCard>
  );
}

export function InfoList({
  items
}: {
  items: { title: string; meta: string; sub?: string; href?: string }[];
}) {
  return (
    <div className="mt-4 grid gap-3">
      {items.map((item) => {
        const content = (
          <div className="surface-panel rounded-xl px-4 py-4 transition hover:border-[color:var(--md-sys-color-scope-primary)]">
            <div className="font-semibold">{item.title}</div>
            <div className="mt-1 text-sm text-secondary">{item.meta}</div>
            {item.sub ? <div className="mt-2 text-sm text-soft">{item.sub}</div> : null}
          </div>
        );

        return item.href ? (
          <Link href={item.href} key={`${item.title}-${item.href}`}>
            {content}
          </Link>
        ) : (
          <div key={item.title}>{content}</div>
        );
      })}
    </div>
  );
}

export function ChannelShell({
  scope,
  children
}: {
  scope: Scope;
  children: ReactNode;
}) {
  return <div className={cn("channel-stage space-y-4", `scope-${scope}`)}>{children}</div>;
}

function matchStatusText(status: string) {
  switch (status) {
    case "DRAFT":
      return "草稿";
    case "SCHEDULED":
      return "已排期";
    case "LIVE":
      return "进行中";
    case "FINISHED":
      return "已结束";
    case "ARCHIVED":
      return "已归档";
    default:
      return status;
  }
}

function ScopeSummaryCard({ scope }: { scope: Scope }) {
  return (
    <SectionCard className="scope-panel rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前赛道</div>
      <div className="mt-2 text-xl font-semibold">{scopeMeta[scope].label}</div>
      <div className="mt-2 text-sm text-secondary">{scopeMeta[scope].description}</div>
    </SectionCard>
  );
}

function AccountSummaryCard({ viewer, currentPath }: { viewer: Viewer | null; currentPath?: string }) {
  const path = currentPath ?? "/";

  return (
    <SectionCard className="scope-card-shell rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">账号卡</div>
      {viewer ? (
        <>
          <div className="mt-2 text-xl font-semibold">{viewer.user.name}</div>
          <div className="mt-1 text-sm text-secondary">
            当前身份：{viewer.roleState} · {viewer.user.email ?? "未设置邮箱"}
          </div>
          <div className="mt-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] px-3 py-3 text-sm">
            {viewer.player ? `已绑定选手：${viewer.player.displayName}` : "尚未完成选手认领"}
          </div>
          {viewer.currentTeam ? (
            <div className="mt-3 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-scope-primary-container)] px-3 py-3 text-sm">
              当前战队：{viewer.currentTeam.name}
              {viewer.captainTeam?.id === viewer.currentTeam.id ? " · 队长身份" : " · 队员身份"}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="mt-2 text-xl font-semibold">先登录后继续</div>
          <div className="mt-1 text-sm text-secondary">登录后可以认领选手身份、创建战队，并处理收到的邀请。</div>
          <Link className="theme-highlight-button mt-4 inline-block rounded-xl px-4 py-3 text-sm" href={`/login?redirectTo=${encodeURIComponent(path)}`}>
            去登录
          </Link>
        </>
      )}
    </SectionCard>
  );
}

function PendingClaimBody() {
  return (
    <div className="theme-highlight-shell mt-3 rounded-xl px-4 py-4 text-sm">
      <div className="font-semibold">审核中</div>
      <div className="mt-2 text-secondary">你的认领申请已经写入数据库，下一步请到认领历史查看进度。</div>
      <Link className="theme-link mt-3 inline-block" href="/my/claims">
        去认领历史查看进度
      </Link>
    </div>
  );
}

function BecomePlayerCard({ viewer, currentPath, title, description }: { viewer: Viewer | null; currentPath?: string; title?: string; description: string }) {
  const path = currentPath ?? "/";

  return (
    <SectionCard className="scope-card-shell rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">{title ?? "成为选手"}</div>
      {!viewer ? (
        <>
          <div className="mt-2 text-lg font-semibold">登录后继续申请</div>
          <div className="mt-2 text-sm text-secondary">{description}</div>
          <Link className="theme-highlight-button mt-4 inline-block rounded-xl px-4 py-3 text-sm" href={`/login?redirectTo=${encodeURIComponent(path)}`}>
            去登录并继续
          </Link>
        </>
      ) : viewer.pendingClaim ? (
        <PendingClaimBody />
      ) : viewer.player ? (
        <div className="mt-3 text-sm text-secondary">你已经完成选手绑定，无需重复提交成为选手申请。</div>
      ) : (
        <form action={createClaimAction} className="mt-3 grid gap-3">
          <input name="redirectTo" type="hidden" value={path} />
          <label className="text-sm text-secondary">
            选手名
            <input className="input-shell mt-2 rounded-xl px-3 py-2" defaultValue={viewer.user.name} name="displayName" required />
          </label>
          <label className="text-sm text-secondary">
            SteamID
            <input className="input-shell mt-2 rounded-xl px-3 py-2" name="steamId" placeholder="7656..." required />
          </label>
          <label className="text-sm text-secondary">
            申请说明
            <textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="note" placeholder="补充你的比赛经历、战绩来源或说明。" />
          </label>
          <button className="theme-highlight-button rounded-xl px-4 py-3 text-sm" type="submit">
            提交成为选手申请
          </button>
        </form>
      )}
    </SectionCard>
  );
}

function ClaimExistingPlayerCard({
  viewer,
  currentPath,
  playerId,
  playerName,
  defaultSteamId
}: {
  viewer: Viewer | null;
  currentPath?: string;
  playerId: string;
  playerName: string;
  defaultSteamId?: string | null;
}) {
  const path = currentPath ?? "/";

  if (!viewer) {
    return <BecomePlayerCard currentPath={path} description="登录后才能在当前人物上下文发起认领。" viewer={viewer} />;
  }

  if (viewer.pendingClaim) {
    return (
      <SectionCard className="rounded-xl p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-soft">认领该选手</div>
        <PendingClaimBody />
      </SectionCard>
    );
  }

  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">认领该选手</div>
      <div className="mt-2 text-lg font-semibold">{playerName} 目前尚未被绑定</div>
      <div className="mt-2 text-sm text-secondary">你当前还没有绑定任何选手，可以直接从这里提交认领申请。</div>
      <form action={claimExistingPlayerAction} className="mt-4 grid gap-3">
        <input name="playerId" type="hidden" value={playerId} />
        <input name="redirectTo" type="hidden" value={path} />
        <label className="text-sm text-secondary">
          SteamID
          <input className="input-shell mt-2 rounded-xl px-3 py-2" defaultValue={viewer.binding?.steamId ?? defaultSteamId ?? ""} name="steamId" placeholder="7656..." required />
        </label>
        <label className="text-sm text-secondary">
          认领说明
          <textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="note" placeholder="说明你和该选手的对应关系，或补充近期比赛信息。" />
        </label>
        <button className="theme-highlight-button rounded-xl px-4 py-3 text-sm" type="submit">
          提交认领该选手
        </button>
      </form>
    </SectionCard>
  );
}

function UnbindCurrentPlayerCard({ currentPath, playerId, playerName }: { currentPath?: string; playerId: string; playerName: string }) {
  const path = currentPath ?? "/my";

  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前人物关系</div>
      <div className="mt-2 text-lg font-semibold">你当前绑定的就是 {playerName}</div>
      <div className="mt-2 text-sm text-secondary">如果这是错误绑定，可以从这里解除当前人物关系；解除后账号会回到未绑定选手状态。</div>
      <form action={unbindCurrentPlayerAction} className="mt-4">
        <input name="playerId" type="hidden" value={playerId} />
        <input name="redirectTo" type="hidden" value={path} />
        <button className="scope-tab rounded-xl px-4 py-3 text-sm" type="submit">
          这不是我
        </button>
      </form>
    </SectionCard>
  );
}

function BoundOtherPlayerCard({ playerName }: { playerName: string }) {
  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前人物关系</div>
      <div className="mt-2 text-lg font-semibold">你已绑定其他选手</div>
      <div className="mt-2 text-sm text-secondary">你的账号当前已经绑定到 {playerName}，因此不能继续认领当前人物。</div>
    </SectionCard>
  );
}

function ClaimedByOtherUserCard({ owner }: { owner: { name: string; email: string | null } }) {
  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前人物关系</div>
      <div className="mt-2 text-lg font-semibold">该选手已绑定其他用户</div>
      <div className="mt-2 text-sm text-secondary">当前人物已经有明确账号归属，右栏只保留该用户的基础信息。</div>
      <div className="mt-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] px-4 py-4 text-sm">
        <div className="font-semibold">{owner.name}</div>
        <div className="mt-1 text-secondary">{owner.email ?? "未公开邮箱"}</div>
      </div>
    </SectionCard>
  );
}

function JoinTeamCard({ currentPath, teamId, teamName }: { currentPath?: string; teamId: string; teamName: string }) {
  const path = currentPath ?? "/my";

  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前战队关系</div>
      <div className="mt-2 text-lg font-semibold">申请加入 {teamName}</div>
      <div className="mt-2 text-sm text-secondary">你当前还没有绑定战队，可以直接从当前战队页加入这支队伍。</div>
      <form action={joinTeamAction} className="mt-4">
        <input name="teamId" type="hidden" value={teamId} />
        <input name="redirectTo" type="hidden" value={path} />
        <button className="theme-highlight-button rounded-xl px-4 py-3 text-sm" type="submit">
          申请加入该战队
        </button>
      </form>
    </SectionCard>
  );
}

function LeaveTeamCard({ currentPath, teamId, teamName, isCaptain }: { currentPath?: string; teamId: string; teamName: string; isCaptain: boolean }) {
  const path = currentPath ?? "/my";

  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前战队关系</div>
      <div className="mt-2 text-lg font-semibold">你当前就在 {teamName}</div>
      <div className="mt-2 text-sm text-secondary">
        {isCaptain ? "你同时是这支战队的队长，退出后当前战队会暂时失去队长身份。" : "如果你要离开当前战队，可以从这里直接退出。"}
      </div>
      <form action={leaveTeamAction} className="mt-4">
        <input name="teamId" type="hidden" value={teamId} />
        <input name="redirectTo" type="hidden" value={path} />
        <button className="scope-tab rounded-xl px-4 py-3 text-sm" type="submit">
          退出该战队
        </button>
      </form>
    </SectionCard>
  );
}

function BoundOtherTeamCard({ teamName, teamSlug }: { teamName: string; teamSlug: string }) {
  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前战队关系</div>
      <div className="mt-2 text-lg font-semibold">你已绑定其他战队</div>
      <div className="mt-2 text-sm text-secondary">你的账号当前已经在 {teamName}，因此不能继续加入当前战队。</div>
      <Link className="mt-4 inline-block text-[color:var(--md-sys-color-primary)]" href={`/teams/${teamSlug}`}>
        查看我当前的战队
      </Link>
    </SectionCard>
  );
}

function MatchPerformanceCard({
  viewer,
  matchTitle,
  games,
  highlights
}: {
  viewer: Viewer;
  matchTitle: string;
  games: { id: string; gameNumber: number; status: string }[];
  highlights: { title: string; description?: string | null; playerId: string | null }[];
}) {
  const personalHighlights = highlights.filter((item) => item.playerId === viewer.player?.id);

  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">我的比赛表现</div>
      <div className="mt-2 text-lg font-semibold">你当前参与了 {matchTitle}</div>
      <div className="mt-2 text-sm text-secondary">当前按小局列出你的比赛上下文；如该局尚未录入个人数据，会明确标记为空状态。</div>
      <div className="mt-4 space-y-3">
        {games.length ? (
          games.map((game) => (
            <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] px-4 py-4 text-sm" key={game.id}>
              <div className="font-semibold">第 {game.gameNumber} 局 · {matchStatusText(game.status)}</div>
              <div className="mt-2 text-secondary">所属战队：{viewer.currentTeam?.name ?? "当前战队待识别"}</div>
              <div className="mt-2 text-soft">{personalHighlights.length ? "本场已录入你的个人焦点片段，见下方摘要。" : "暂未录入个人表现。"}</div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] px-4 py-4 text-sm text-secondary">当前还没有录入按小局拆分的比赛数据。</div>
        )}
      </div>
      {personalHighlights.length ? (
        <div className="mt-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-tertiary-container)] px-4 py-4">
          <div className="text-sm font-semibold">已录入的个人焦点片段</div>
          <div className="mt-3 space-y-2 text-sm text-secondary">
            {personalHighlights.map((item, index) => (
              <div key={`${item.title}-${index}`}>
                <div className="font-medium text-[color:var(--md-sys-color-on-surface)]">{item.title}</div>
                {item.description ? <div className="mt-1 text-soft">{item.description}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}

function NotParticipatedCard({ viewer }: { viewer: Viewer }) {
  return (
    <SectionCard className="rounded-xl p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-soft">当前比赛关系</div>
      <div className="mt-2 text-lg font-semibold">你未参加当前比赛</div>
      <div className="mt-2 text-sm text-secondary">当前账号已绑定选手，但你的当前战队不在这场比赛涉及到的队伍中，因此右栏只显示关系说明。</div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link className="text-[color:var(--md-sys-color-primary)]" href={`/players/${viewer.player?.slug ?? ""}`}>
          查看我的选手页
        </Link>
        {viewer.currentTeam ? (
          <Link className="text-[color:var(--md-sys-color-primary)]" href={`/teams/${viewer.currentTeam.slug}`}>
            查看我的战队页
          </Link>
        ) : null}
      </div>
    </SectionCard>
  );
}

export function RoleRail({
  viewer,
  scope,
  kind,
  currentPath,
  targetName,
  targetPlayerId,
  targetTeamId
}: {
  viewer: Viewer | null;
  scope: Scope;
  kind: "matches" | "players" | "teams" | "detail";
  currentPath?: string;
  targetName?: string;
  targetPlayerId?: string;
  targetTeamId?: string;
}) {
  const path = currentPath ?? "/login";

  return (
    <div className="space-y-4">
      <ScopeSummaryCard scope={scope} />
      <AccountSummaryCard currentPath={path} viewer={viewer} />

      {viewer && !viewer.player ? (
        <BecomePlayerCard currentPath={path} description="完成认领后才能继续建队、入队和邀请处理。" viewer={viewer} />
      ) : null}

      {viewer?.player ? (
        <SectionCard className="scope-card-shell rounded-xl p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-soft">选手信息</div>
          <div className="mt-2 text-lg font-semibold">{viewer.player.displayName}</div>
          <div className="mt-2 text-sm text-secondary">
            {viewer.currentTeam ? `当前所属战队：${viewer.currentTeam.name}。` : "当前还没有加入战队。"} 可进入我的主页查看近期比赛和邀请收件箱。
          </div>
        </SectionCard>
      ) : null}

      {viewer?.player && !viewer.currentTeam ? (
        <SectionCard className="scope-card-shell rounded-xl p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-soft">创建战队</div>
          <form action={createTeamAction} className="mt-3 grid gap-3">
            <input name="redirectTo" type="hidden" value="/my/team" />
            <label className="text-sm text-secondary">
              队伍名
              <input className="input-shell mt-2 rounded-xl px-3 py-2" name="name" required />
            </label>
            <label className="text-sm text-secondary">
              口号
              <input className="input-shell mt-2 rounded-xl px-3 py-2" name="slogan" />
            </label>
            <label className="text-sm text-secondary">
              队伍摘要
              <textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="summary" />
            </label>
            <button className="theme-highlight-button rounded-xl px-4 py-3 text-sm" type="submit">
              创建队伍
            </button>
          </form>
        </SectionCard>
      ) : null}

      {viewer?.captainTeam ? (
        <>
          <SectionCard className="scope-card-shell rounded-xl p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-soft">队伍操作</div>
            <div className="mt-2 text-lg font-semibold">{viewer.captainTeam.name}</div>
            <div className="mt-2 text-sm text-secondary">
              {kind === "players"
                ? `可以对 ${targetName ?? "当前选手"} 发起入队邀请。`
                : kind === "teams"
                  ? `可以对 ${targetName ?? "当前战队"} 发起训练赛邀请。`
                  : "频道页仅保留跨频道动作，不直接承载无关危险操作。"}
            </div>
            <div className="mt-4 space-y-3">
              {(kind === "players" || kind === "detail") && targetPlayerId && targetPlayerId !== viewer.player?.id ? (
                <form action={sendInvitationAction} className="grid gap-3 rounded-xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-lowest)] p-4">
                  <input name="redirectTo" type="hidden" value="/my/invitations" />
                  <input name="type" type="hidden" value="TEAM_MEMBER" />
                  <input name="targetPlayerId" type="hidden" value={targetPlayerId} />
                  <label className="text-sm text-secondary">
                    邀请说明
                    <textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="message" placeholder="告诉对方你们的训练时间、缺少的位置和希望一起完成的目标。" />
                  </label>
                  <button className="scope-tab-active rounded-xl px-4 py-3 text-sm" type="submit">
                    发送入队邀请
                  </button>
                </form>
              ) : null}
              {(kind === "teams" || kind === "detail") && targetTeamId && targetTeamId !== viewer.captainTeam.id ? (
                <form action={sendInvitationAction} className="grid gap-3 rounded-xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-lowest)] p-4">
                  <input name="redirectTo" type="hidden" value="/my/invitations" />
                  <input name="type" type="hidden" value="SCRIM" />
                  <input name="targetTeamId" type="hidden" value={targetTeamId} />
                  <label className="text-sm text-secondary">
                    对局安排
                    <textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="message" placeholder="写明想约的时间、局数和这次训练赛的重点。" />
                  </label>
                  <button className="scope-tab-active rounded-xl px-4 py-3 text-sm" type="submit">
                    发送训练赛邀请
                  </button>
                </form>
              ) : null}
            </div>
          </SectionCard>
          <SectionCard className="danger-shell rounded-xl p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--md-sys-color-on-error-container)]">重要提醒</div>
            <form action={disbandTeamAction} className="mt-3 grid gap-3 rounded-xl border border-[color-mix(in srgb, var(--md-sys-color-error) 50%, transparent)] bg-[var(--md-sys-color-error-container)] p-4">
              <input name="teamId" type="hidden" value={viewer.captainTeam.id} />
              <div className="text-sm text-[var(--md-sys-color-on-error-container)]">解散后，当前队伍会从公开列表中下线，现有成员关系也会一并结束。</div>
              <button className="rounded-xl border border-[color-mix(in srgb, var(--md-sys-color-error) 60%, transparent)] bg-[color-mix(in srgb, var(--md-sys-color-error) 18%, transparent)] px-4 py-3 text-sm text-[var(--md-sys-color-on-error-container)]" type="submit">
                确认解散队伍
              </button>
            </form>
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}

export function MatchDetailRail({
  viewer,
  scope,
  currentPath,
  matchTitle,
  involvedTeamIds,
  games,
  highlights
}: {
  viewer: Viewer | null;
  scope: Scope;
  currentPath?: string;
  matchTitle: string;
  involvedTeamIds: string[];
  games: { id: string; gameNumber: number; status: string }[];
  highlights: { title: string; description?: string | null; playerId: string | null }[];
}) {
  const involved = !!viewer?.currentTeam && involvedTeamIds.includes(viewer.currentTeam.id);

  return (
    <div className="space-y-4">
      <ScopeSummaryCard scope={scope} />
      <AccountSummaryCard currentPath={currentPath} viewer={viewer} />
      {!viewer?.player ? (
        <BecomePlayerCard currentPath={currentPath} description="完成认领后，这里才会根据当前比赛展示你的个人表现。" viewer={viewer} />
      ) : involved ? (
        <MatchPerformanceCard games={games} highlights={highlights} matchTitle={matchTitle} viewer={viewer} />
      ) : (
        <NotParticipatedCard viewer={viewer} />
      )}
    </div>
  );
}

export function PlayerDetailRail({
  viewer,
  scope,
  currentPath,
  player
}: {
  viewer: Viewer | null;
  scope: Scope;
  currentPath?: string;
  player: {
    id: string;
    title: string;
    steamId?: string | null;
    claimedBy: { id: string; name: string; email: string | null } | null;
  };
}) {
  const isCurrentPlayer = viewer?.player?.id === player.id;
  const isOtherBoundPlayer = !!viewer?.player && viewer.player.id !== player.id;

  return (
    <div className="space-y-4">
      <ScopeSummaryCard scope={scope} />
      <AccountSummaryCard currentPath={currentPath} viewer={viewer} />
      {isCurrentPlayer ? (
        <UnbindCurrentPlayerCard currentPath={currentPath} playerId={player.id} playerName={player.title} />
      ) : isOtherBoundPlayer ? (
        <BoundOtherPlayerCard playerName={viewer.player!.displayName} />
      ) : player.claimedBy ? (
        <ClaimedByOtherUserCard owner={{ email: player.claimedBy.email, name: player.claimedBy.name }} />
      ) : (
        <ClaimExistingPlayerCard currentPath={currentPath} defaultSteamId={player.steamId} playerId={player.id} playerName={player.title} viewer={viewer} />
      )}
    </div>
  );
}

export function TeamDetailRail({
  viewer,
  scope,
  currentPath,
  team
}: {
  viewer: Viewer | null;
  scope: Scope;
  currentPath?: string;
  team: {
    id: string;
    title: string;
  };
}) {
  const isCurrentTeam = viewer?.currentTeam?.id === team.id;

  return (
    <div className="space-y-4">
      <ScopeSummaryCard scope={scope} />
      <AccountSummaryCard currentPath={currentPath} viewer={viewer} />
      {!viewer?.player ? (
        <BecomePlayerCard currentPath={currentPath} description="完成认领后，才能在战队页处理加入或退出关系。" viewer={viewer} />
      ) : isCurrentTeam ? (
        <LeaveTeamCard currentPath={currentPath} isCaptain={viewer.captainTeam?.id === team.id} teamId={team.id} teamName={team.title} />
      ) : viewer.currentTeam ? (
        <BoundOtherTeamCard teamName={viewer.currentTeam.name} teamSlug={viewer.currentTeam.slug} />
      ) : (
        <JoinTeamCard currentPath={currentPath} teamId={team.id} teamName={team.title} />
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-secondary">
      {items.map((item, index) => (
        <div className="flex items-center gap-2" key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 ? <span className="text-soft">/</span> : null}
        </div>
      ))}
    </div>
  );
}

export function SimpleTable({
  columns,
  rows
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="table-grid mt-4">
      <div className="table-row rounded-xl px-4 py-3 text-xs uppercase tracking-[0.16em] text-soft md:grid-cols-[repeat(var(--col-count),minmax(0,1fr))]" style={{ ["--col-count" as string]: columns.length }}>
        {columns.map((column) => (
          <div key={column}>{column}</div>
        ))}
      </div>
      {rows.map((row, index) => (
        <div className="table-row rounded-xl px-4 py-4 md:grid-cols-[repeat(var(--col-count),minmax(0,1fr))]" key={index} style={{ ["--col-count" as string]: columns.length }}>
          {row.map((cell, cellIndex) => (
            <div className={cellIndex === 0 ? "font-semibold" : "text-sm text-secondary"} key={cellIndex}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}