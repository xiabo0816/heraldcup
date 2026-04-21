import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  disbandTeamAction,
  logoutAction,
  respondInvitationAction,
  reviewClaimAction
} from "@/lib/actions";
import {
  type Scope,
  getAdminClaimDetailData,
  getAdminClaimsData,
  getAdminDashboardData,
  getClaimsData,
  getHomePageData,
  getInvitationsData,
  getMatchDetailData,
  getMatchesPageData,
  getMyPageData,
  getPlayerDetailData,
  getPlayersPageData,
  getSeasonDetailData,
  getTeamDetailData,
  getTeamsPageData,
  scopeMeta
} from "@/lib/queries";
import type { Viewer } from "@/lib/session";
import { guideFaq, guideSteps, ruleSections } from "@/lib/site-data";
import { AuthTabsPanel } from "@/components/interactive";
import {
  Breadcrumbs,
  ChannelShell,
  InfoList,
  MatchDetailRail,
  PlayerDetailRail,
  RoleRail,
  ScopeBanner,
  ScopeTabs,
  SectionCard,
  SectionTitle,
  SimpleTable,
  StatGrid,
  TeamDetailRail
} from "@/components/site-ui";

type HomeData = Awaited<ReturnType<typeof getHomePageData>>;
type MatchesData = Awaited<ReturnType<typeof getMatchesPageData>>;
type PlayersData = Awaited<ReturnType<typeof getPlayersPageData>>;
type TeamsData = Awaited<ReturnType<typeof getTeamsPageData>>;
type MatchDetailData = NonNullable<Awaited<ReturnType<typeof getMatchDetailData>>>;
type SeasonDetailData = NonNullable<Awaited<ReturnType<typeof getSeasonDetailData>>>;
type PlayerDetailData = NonNullable<Awaited<ReturnType<typeof getPlayerDetailData>>>;
type TeamDetailData = NonNullable<Awaited<ReturnType<typeof getTeamDetailData>>>;
type MyPageData = NonNullable<Awaited<ReturnType<typeof getMyPageData>>>;
type ClaimsData = Awaited<ReturnType<typeof getClaimsData>>;
type InvitationsData = Awaited<ReturnType<typeof getInvitationsData>>;
type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboardData>>;
type AdminClaimsData = Awaited<ReturnType<typeof getAdminClaimsData>>;
type AdminClaimDetailData = NonNullable<Awaited<ReturnType<typeof getAdminClaimDetailData>>>;

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "待定";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "待定";
  }

  return date.toLocaleString("zh-CN", {
    hour12: false,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function matchStatusLabel(status: string) {
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

function claimStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "审核中";
    case "APPROVED":
      return "已通过";
    case "REJECTED":
      return "未通过";
    case "CANCELLED":
      return "已取消";
    default:
      return status;
  }
}

function invitationStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "待处理";
    case "ACCEPTED":
      return "已接受";
    case "DECLINED":
      return "已拒绝";
    case "CANCELLED":
      return "已取消";
    default:
      return status;
  }
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "暂无";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "暂无";
  }
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <SectionCard className="rounded-2xl p-6">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-secondary">{description}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </SectionCard>
  );
}

export function HomePageView({ viewer, data }: { viewer: Viewer | null; data: HomeData }) {
  return (
    <div className="space-y-6">
      <section className="home-stage grid gap-4 lg:grid-cols-[3fr_6fr_3fr]">
        <SectionCard className="home-rail-shell rounded-xl p-4">
          <SectionTitle eyebrow="首页导览" title="先看这四条主线" description="比赛、人物、战队和身份入口固定在同一屏里，方便你直接回到主线内容。" />
          <InfoList items={data.leftRail} />
        </SectionCard>

        <SectionCard className="hero-shell rounded-[28px] p-6">
          <div className="eyebrow">Herald Cup</div>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold leading-tight">{data.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-base text-secondary">{data.hero.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/matches">
              进入比赛中心
            </Link>
            <Link className="scope-tab rounded-xl px-4 py-3 text-sm" href="/players">
              查看人物档案
            </Link>
            <Link className="scope-tab rounded-xl px-4 py-3 text-sm" href="/teams">
              查看战队名册
            </Link>
          </div>
          <StatGrid items={data.hero.stats} />

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <SectionCard className="home-module-shell rounded-xl p-4">
              <SectionTitle eyebrow="比赛中心" title="当前赛季与焦点对阵" />
              <InfoList items={data.modules.matches} />
            </SectionCard>
            <SectionCard className="home-module-shell rounded-xl p-4">
              <SectionTitle eyebrow="人物档案" title="认证选手与代表比赛" />
              <InfoList items={data.modules.players} />
            </SectionCard>
            <SectionCard className="home-module-shell rounded-xl p-4">
              <SectionTitle eyebrow="战队名册" title="活跃阵容与当前归属" />
              <InfoList items={data.modules.teams} />
            </SectionCard>
            <SectionCard className="home-module-shell rounded-xl p-4">
              <SectionTitle eyebrow="身份链路" title="从登录到上场的下一步" />
              <InfoList items={data.modules.identity} />
            </SectionCard>
          </div>
        </SectionCard>

        <SectionCard className="home-rail-shell rounded-xl p-4">
          <SectionTitle
            eyebrow="身份进度"
            title={viewer ? `${viewer.user.name} 的身份进度` : "登录后继续你的身份进度"}
            description={viewer ? "你的账号、认领、队伍与邀请状态会在这里先做一次摘要。" : "登录后可以继续认领、建队和邀请处理，身份链路会固定收口到这里。"}
          />
          <div className="mt-4 space-y-3">
            <div className="theme-neutral-shell rounded-xl px-4 py-4 text-sm">
              {viewer
                ? `当前身份：${viewer.roleState} · ${viewer.user.email ?? "未设置邮箱"}`
                : "你现在可以先浏览比赛、人物和战队，准备好后再登录继续。"}
            </div>
            {viewer ? (
              <>
                <div className="theme-info-shell rounded-xl px-4 py-4 text-sm">
                  认领进度：{viewer.pendingClaim ? "有一条审核中的选手认领" : viewer.player ? "已完成选手认领" : "尚未提交认领"}
                </div>
                <div className="theme-success-shell rounded-xl px-4 py-4 text-sm">
                  队伍与邀请：{viewer.currentTeam ? `当前队伍为 ${viewer.currentTeam.name}。` : "当前还没有队伍。"} 共有 {data.rightRail.invitations} 条需要你留意的邀请。
                </div>
                <Link className="theme-highlight-button inline-block rounded-xl px-4 py-3 text-sm" href="/my">
                  进入我的主页
                </Link>
              </>
            ) : (
              <Link className="theme-highlight-button inline-block rounded-xl px-4 py-3 text-sm" href="/login">
                去登录或注册
              </Link>
            )}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

export function MatchesPageView({ viewer, scope, data }: { viewer: Viewer | null; scope: Scope; data: MatchesData }) {
  return (
    <ChannelShell scope={scope}>
      <ScopeTabs basePath="/matches" currentScope={scope} />
      <ScopeBanner scope={scope} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="scope-card-shell rounded-xl p-5">
            <SectionTitle eyebrow="比赛中心" title={scope === "all" ? "全站比赛目录" : `${scopeMeta[scope].label}赛程`} description="按赛季收拢当前已入库的真实比赛。每个赛季下面保留最近的关键场次。" />
            <StatGrid items={data.stats} />
          </SectionCard>

          {data.seasons.length ? (
            data.seasons.map((season) => (
              <SectionCard className="scope-card-shell rounded-xl p-5" key={season.id}>
                <SectionTitle
                  action={
                    <Link className="text-sm text-[color:var(--md-sys-color-primary)]" href={`/matches/seasons/${season.slug}`}>
                      查看赛季详情
                    </Link>
                  }
                  eyebrow={scopeMeta[season.scope].label}
                  title={season.title}
                  description={`${season.phase} · ${season.summary}`}
                />
                <InfoList
                  items={season.matches.map((match) => ({
                    title: match.title,
                    meta: `${match.stage} · ${matchStatusLabel(match.status)}`,
                    sub: `${match.time} · ${match.teams.join(" vs ")} · ${match.summary}`,
                    href: `/matches/${match.slug}`
                  }))}
                />
              </SectionCard>
            ))
          ) : (
            <EmptyState title="当前还没有可显示的比赛" description="等赛季和对阵信息入库后，这里会自动显示真实赛程。" />
          )}
        </div>
        <RoleRail currentPath={`/matches${scope === "all" ? "" : `?scope=${scope}`}`} kind="matches" scope={scope} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function PlayersPageView({ viewer, scope, data }: { viewer: Viewer | null; scope: Scope; data: PlayersData }) {
  return (
    <ChannelShell scope={scope}>
      <ScopeTabs basePath="/players" currentScope={scope} />
      <ScopeBanner scope={scope} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="scope-card-shell rounded-xl p-5">
            <SectionTitle eyebrow="选手目录" title={scope === "all" ? "全站选手池" : `${scopeMeta[scope].label}选手池`} description="只展示当前数据库中的真实选手，支持从人物卡继续进入详情。" />
          </SectionCard>
          {data.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.map((player) => (
                <SectionCard className="scope-card-shell rounded-xl p-5" key={player.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-semibold">{player.title}</div>
                      <div className="mt-1 text-sm text-secondary">{player.primaryRole} · {player.teamName}</div>
                    </div>
                    <Link className="text-sm text-[color:var(--md-sys-color-primary)]" href={`/players/${player.slug}`}>
                      查看详情
                    </Link>
                  </div>
                  <div className="mt-3 text-sm text-secondary">{player.bio}</div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-soft">
                    {player.scopes.map((item) => (
                      <span className="scope-badge rounded-full px-2 py-1" key={item}>{scopeMeta[item].label}</span>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-secondary">英雄池：{player.heroes.length ? player.heroes.join(" / ") : "暂未填写"}</div>
                  <div className="mt-2 text-sm text-secondary">数据状态：{player.opendota}</div>
                </SectionCard>
              ))}
            </div>
          ) : (
            <EmptyState title="当前没有符合条件的选手" description="等选手资料补齐后，这里会按赛道自动筛出真实选手列表。" />
          )}
        </div>
        <RoleRail currentPath={`/players${scope === "all" ? "" : `?scope=${scope}`}`} kind="players" scope={scope} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function TeamsPageView({ viewer, scope, data }: { viewer: Viewer | null; scope: Scope; data: TeamsData }) {
  return (
    <ChannelShell scope={scope}>
      <ScopeTabs basePath="/teams" currentScope={scope} />
      <ScopeBanner scope={scope} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="scope-card-shell rounded-xl p-5">
            <SectionTitle eyebrow="战队目录" title={scope === "all" ? "全站战队池" : `${scopeMeta[scope].label}战队池`} description="展示真实战队、当前成绩和成员规模。" />
          </SectionCard>
          {data.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.map((team) => (
                <SectionCard className="scope-card-shell rounded-xl p-5" key={team.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-semibold">{team.title}</div>
                      <div className="mt-1 text-sm text-secondary">{team.record} · {scopeMeta[team.scope].label}</div>
                    </div>
                    <Link className="text-sm text-[color:var(--md-sys-color-primary)]" href={`/teams/${team.slug}`}>
                      查看详情
                    </Link>
                  </div>
                  <div className="mt-3 text-sm text-secondary">{team.summary}</div>
                  <div className="mt-4 text-sm text-secondary">队长：{team.captain}</div>
                  <div className="mt-2 text-sm text-secondary">现有成员：{team.members} 人</div>
                </SectionCard>
              ))}
            </div>
          ) : (
            <EmptyState title="当前没有符合条件的战队" description="等战队数据补齐后，这里会自动显示真实阵容。" />
          )}
        </div>
        <RoleRail currentPath={`/teams${scope === "all" ? "" : `?scope=${scope}`}`} kind="teams" scope={scope} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function MatchDetailPageView({ viewer, data }: { viewer: Viewer | null; data: MatchDetailData | null }) {
  if (!data) {
    notFound();
  }

  return (
    <ChannelShell scope={data.scope}>
      <Breadcrumbs items={[{ label: "比赛", href: "/matches" }, data.season ? { label: data.season.title, href: `/matches/seasons/${data.season.slug}` } : { label: "未归属赛季" }, { label: data.title }]} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="rounded-xl p-6">
            <SectionTitle eyebrow={scopeMeta[data.scope].label} title={data.title} description={`${data.stage} · ${matchStatusLabel(data.status)} · ${formatDate(data.scheduledAt)}`} />
            <div className="mt-4 text-sm text-secondary">{data.summary}</div>
            <StatGrid items={[{ label: "赛制", value: data.bestOf ? `BO${data.bestOf}` : "未设置" }, { label: "参赛方", value: String(data.participants.length) }, { label: "小局数", value: String(data.games.length) }, { label: "精彩片段", value: String(data.highlights.length) }]} />
          </SectionCard>

          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="对阵结果" title="双方比分" />
            <SimpleTable columns={["战队", "比分", "结果", "席位"]} rows={data.participants.map((item) => [item.teamName, String(item.score ?? 0), item.result, String(item.slot)])} />
          </SectionCard>

          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="小局记录" title="比赛过程" />
            {data.games.length ? (
              <SimpleTable columns={["局数", "状态", "胜者", "参赛方"]} rows={data.games.map((game) => [String(game.gameNumber), matchStatusLabel(game.status), game.participants.find((item) => item.result === "WIN")?.teamName ?? "待定", game.participants.map((item) => item.teamName).join(" vs ")])} />
            ) : (
              <div className="mt-4 text-sm text-secondary">当前还没有录入小局数据。</div>
            )}
          </SectionCard>

          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="焦点片段" title="人物与镜头" />
            {data.highlights.length ? (
              <InfoList items={data.highlights.map((item) => ({ title: item.title, meta: item.playerName, sub: item.description ?? undefined }))} />
            ) : (
              <div className="mt-4 text-sm text-secondary">当前还没有录入这场比赛的焦点片段。</div>
            )}
          </SectionCard>
        </div>
        <MatchDetailRail
          currentPath={`/matches/${data.slug}`}
          games={data.games.map((game) => ({ id: game.id, gameNumber: game.gameNumber, status: game.status }))}
          highlights={data.highlights}
          involvedTeamIds={data.participants.map((participant) => participant.teamId)}
          matchTitle={data.title}
          scope={data.scope}
          viewer={viewer}
        />
      </div>
    </ChannelShell>
  );
}

export function SeasonDetailPageView({ viewer, data }: { viewer: Viewer | null; data: SeasonDetailData | null }) {
  if (!data) {
    notFound();
  }

  return (
    <ChannelShell scope={data.scope}>
      <Breadcrumbs items={[{ label: "比赛", href: "/matches" }, { label: data.title }]} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="rounded-xl p-6">
            <SectionTitle eyebrow={scopeMeta[data.scope].label} title={data.title} description={`${data.statusLabel} · ${data.summary}`} action={<Link className="text-sm text-[color:var(--md-sys-color-primary)]" href={`/matches/seasons/${data.slug}/final`}>查看结算页</Link>} />
            <StatGrid items={[{ label: "参赛战队", value: String(data.teams.length) }, { label: "比赛阶段", value: String(data.stages.length) }, { label: "是否推荐", value: data.featured ? "是" : "否" }, { label: "当前状态", value: data.statusLabel }]} />
          </SectionCard>

          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="参赛队伍" title="赛季名单" />
            <SimpleTable columns={["战队", "名次", "胜", "负"]} rows={data.teams.map((item) => [item.teamName, item.rank ? String(item.rank) : "未结算", String(item.wins ?? 0), String(item.losses ?? 0)])} />
          </SectionCard>

          {data.stages.map((stage) => (
            <SectionCard className="rounded-xl p-5" key={stage.name}>
              <SectionTitle eyebrow="阶段" title={stage.name} description={stage.bestOf ? `默认 BO${stage.bestOf}` : undefined} />
              <InfoList items={stage.matches.map((match) => ({ title: match.title, meta: match.teams.join(" vs "), sub: matchStatusLabel(match.status), href: `/matches/${match.slug}` }))} />
            </SectionCard>
          ))}
        </div>
        <RoleRail currentPath={`/matches/seasons/${data.slug}`} kind="detail" scope={data.scope} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function SeasonFinalPageView({ viewer, data }: { viewer: Viewer | null; data: SeasonDetailData | null }) {
  if (!data) {
    notFound();
  }

  const sortedTeams = [...data.teams].sort((left, right) => (left.rank ?? 999) - (right.rank ?? 999));

  return (
    <ChannelShell scope={data.scope}>
      <Breadcrumbs items={[{ label: "比赛", href: "/matches" }, { label: data.title, href: `/matches/seasons/${data.slug}` }, { label: "赛季结算" }]} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="rounded-xl p-6">
            <SectionTitle eyebrow="赛季结算" title={`${data.title} 赛季结算`} description="这里聚合冠军归属、参赛名次与最终阶段回放入口。" />
            <StatGrid items={[{ label: "冠军", value: sortedTeams[0]?.teamName ?? "待公布" }, { label: "亚军", value: sortedTeams[1]?.teamName ?? "待公布" }, { label: "总队伍", value: String(data.teams.length) }, { label: "总阶段", value: String(data.stages.length) }]} />
          </SectionCard>
          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="最终排名" title="完赛名次" />
            <SimpleTable columns={["名次", "战队", "胜", "负"]} rows={sortedTeams.map((item, index) => [String(item.rank ?? index + 1), item.teamName, String(item.wins ?? 0), String(item.losses ?? 0)])} />
          </SectionCard>
        </div>
        <RoleRail currentPath={`/matches/seasons/${data.slug}/final`} kind="detail" scope={data.scope} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function PlayerDetailPageView({ viewer, data }: { viewer: Viewer | null; data: PlayerDetailData | null }) {
  if (!data) {
    notFound();
  }

  const primaryScope = data.scopes[0] ?? "all";

  return (
    <ChannelShell scope={primaryScope}>
      <Breadcrumbs items={[{ label: "选手", href: "/players" }, { label: data.title }]} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="rounded-xl p-6">
            <SectionTitle eyebrow="选手档案" title={data.title} description={`${data.primaryRole} · ${data.team?.name ?? "自由选手"}`} />
            <div className="mt-4 text-sm text-secondary">{data.bio}</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-soft">
              {data.scopes.map((item) => <span className="scope-badge rounded-full px-2 py-1" key={item}>{scopeMeta[item].label}</span>)}
            </div>
            <StatGrid items={[{ label: "常用位置", value: data.primaryRole }, { label: "英雄池", value: data.heroPool.length ? String(data.heroPool.length) : "0" }, { label: "精彩片段", value: String(data.highlights.length) }, { label: "队伍", value: data.team?.name ?? "自由" }]} />
          </SectionCard>
          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="个人资料" title="基础信息" />
            <SimpleTable columns={["字段", "内容"]} rows={[["SteamID", data.steamId ?? "未绑定"], ["当前队伍", data.team ? data.team.name : "自由选手"], ["英雄池", data.heroPool.length ? data.heroPool.join(" / ") : "暂未填写"], ["数据摘要", data.reportSummary ? displayValue(data.reportSummary) : "暂无 OpenDota 报告摘要"]]} />
          </SectionCard>
          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="近期镜头" title="比赛高光" />
            {data.highlights.length ? <InfoList items={data.highlights.map((item) => ({ title: item.title, meta: item.matchTitle, href: `/matches/${item.matchSlug}` }))} /> : <div className="mt-4 text-sm text-secondary">当前还没有录入高光片段。</div>}
          </SectionCard>
        </div>
        <PlayerDetailRail currentPath={`/players/${data.slug}`} player={{ claimedBy: data.claimedBy, id: data.id, steamId: data.steamId, title: data.title }} scope={primaryScope} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function TeamDetailPageView({ viewer, data }: { viewer: Viewer | null; data: TeamDetailData | null }) {
  if (!data) {
    notFound();
  }

  return (
    <ChannelShell scope={data.scope}>
      <Breadcrumbs items={[{ label: "战队", href: "/teams" }, { label: data.title }]} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard className="rounded-xl p-6">
            <SectionTitle eyebrow={scopeMeta[data.scope].label} title={data.title} description={`${data.record} · 队长 ${data.captain ?? "待公布"}`} />
            <div className="mt-4 text-sm text-secondary">{data.summary}</div>
            <StatGrid items={[{ label: "当前成员", value: String(data.members.length) }, { label: "近期比赛", value: String(data.matches.length) }, { label: "所属赛道", value: scopeMeta[data.scope].label }, { label: "当前队长", value: data.captain ?? "待公布" }]} />
          </SectionCard>
          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="成员名单" title="当前阵容" />
            <SimpleTable columns={["选手", "分工", "详情"]} rows={data.members.map((member) => [member.name, member.role, <Link className="text-[color:var(--md-sys-color-primary)]" href={`/players/${member.slug}`} key={member.id}>查看选手</Link>])} />
          </SectionCard>
          <SectionCard className="rounded-xl p-5">
            <SectionTitle eyebrow="近期比赛" title="战队赛程" />
            {data.matches.length ? <InfoList items={data.matches.map((match) => ({ title: match.title, meta: `${scopeMeta[match.scope].label} · ${matchStatusLabel(match.status)}`, href: `/matches/${match.slug}` }))} /> : <div className="mt-4 text-sm text-secondary">当前还没有记录到这支战队的比赛。</div>}
          </SectionCard>
        </div>
        <TeamDetailRail currentPath={`/teams/${data.slug}`} scope={data.scope} team={{ id: data.id, title: data.title }} viewer={viewer} />
      </div>
    </ChannelShell>
  );
}

export function LoginPageView({ viewer, redirectTo }: { viewer: Viewer | null; redirectTo?: string }) {
  if (viewer) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard className="rounded-xl p-6">
          <SectionTitle eyebrow="当前已登录" title={viewer.user.name} description={`身份：${viewer.roleState} · ${viewer.user.email ?? "未设置邮箱"}`} />
          <div className="mt-4 text-sm text-secondary">你已经登录，可以直接进入个人页继续处理认领、队伍和邀请。</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/my">
              进入个人页
            </Link>
            <form action={logoutAction}>
              <button className="scope-tab rounded-xl px-4 py-3 text-sm" type="submit">退出登录</button>
            </form>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="login-stage -mx-4 -mt-4 px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-5">
          <h1 className="text-3xl font-semibold leading-tight">登录先锋杯社区</h1>
          <p className="max-w-lg text-base text-secondary">完成登录或注册后，即可进入个人页管理选手认领、战队和邀请。</p>
          <div className="grid gap-2.5">
            {[
              ["认领选手身份", "绑定你的游戏角色，开始参与社区比赛。"],
              ["创建或加入战队", "和朋友组队，管理阵容与训练赛。"],
              ["安全回跳", "登录后自动回到你原本要去的页面。"]
            ].map(([title, desc]) => (
              <div className="flex items-start gap-3 rounded-xl px-3 py-2.5" key={title}>
                <span className="mt-0.5 text-[color:var(--md-sys-color-scope-primary)]">•</span>
                <div>
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-sm text-soft">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link className="text-sm text-secondary underline underline-offset-4 hover:text-[color:var(--md-sys-color-on-surface)]" href="/guide">新手指引</Link>
            <Link className="text-sm text-secondary underline underline-offset-4 hover:text-[color:var(--md-sys-color-on-surface)]" href="/">回到首页</Link>
          </div>
        </div>
        <div className="surface-card rounded-2xl p-6">
          <AuthTabsPanel redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}

export function MyPageView({ viewer, data }: { viewer: Viewer | null; data: MyPageData | null }) {
  if (!viewer || !data) {
    return <EmptyState action={<Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/login">去登录</Link>} description="登录后才能查看你的认领、战队与邀请记录。" title="请先登录" />;
  }

  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="个人页" title={`${viewer.user.name} 的控制台`} description={`当前身份：${viewer.roleState}${viewer.player ? ` · ${viewer.player.displayName}` : ""}`} />
        <StatGrid items={[{ label: "认领记录", value: String(data.claims.length) }, { label: "邀请消息", value: String(data.invitations.length) }, { label: "近期比赛", value: String(data.recentMatches.length) }, { label: "当前队伍", value: data.currentTeam?.name ?? "未加入" }]} />
      </SectionCard>
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard className="rounded-xl p-5">
          <SectionTitle eyebrow="认领状态" title="最近认领记录" action={<Link className="text-sm text-[color:var(--md-sys-color-primary)]" href="/my/claims">查看全部</Link>} />
          {data.claims.length ? <InfoList items={data.claims.map((claim) => ({ title: claim.player.displayName, meta: claimStatusLabel(claim.status), sub: `${formatDate(claim.submittedAt)} · ${claim.note ?? "未填写备注"}` }))} /> : <div className="mt-4 text-sm text-secondary">你还没有提交过认领申请。</div>}
        </SectionCard>
        <SectionCard className="rounded-xl p-5">
          <SectionTitle eyebrow="邀请收件箱" title="最近邀请" action={<Link className="text-sm text-[color:var(--md-sys-color-primary)]" href="/my/invitations">查看全部</Link>} />
          {data.invitations.length ? <InfoList items={data.invitations.map((item) => ({ title: item.title, meta: invitationStatusLabel(item.status), sub: item.message ?? "未填写邀请说明" }))} /> : <div className="mt-4 text-sm text-secondary">当前没有待处理的邀请。</div>}
        </SectionCard>
        <SectionCard className="rounded-xl p-5">
          <SectionTitle eyebrow="我的队伍" title={data.currentTeam?.name ?? "尚未加入战队"} action={<Link className="text-sm text-[color:var(--md-sys-color-primary)]" href="/my/team">进入队伍工作台</Link>} />
          <div className="mt-4 text-sm text-secondary">{data.currentTeam ? `${data.currentTeam.members.length} 名当前成员` : "完成选手认领后，就可以创建自己的队伍。"}</div>
        </SectionCard>
        <SectionCard className="rounded-xl p-5">
          <SectionTitle eyebrow="近期相关比赛" title="你的比赛记录" />
          {data.recentMatches.length ? <InfoList items={data.recentMatches.map((match) => ({ title: match.title, meta: formatDate(match.match.scheduledAt), href: `/matches/${match.match.slug}` }))} /> : <div className="mt-4 text-sm text-secondary">当前还没有与你关联的高光比赛。</div>}
        </SectionCard>
      </div>
    </div>
  );
}

export function ClaimsPageView({ viewer, claims }: { viewer: Viewer | null; claims: ClaimsData }) {
  if (!viewer) {
    return <EmptyState action={<Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/login">去登录</Link>} description="登录后才能查看自己的认领历史。" title="请先登录" />;
  }

  return (
    <SectionCard className="rounded-xl p-6">
      <SectionTitle eyebrow="认领历史" title="你的全部认领记录" description="这里展示数据库中所有由你发起的选手认领申请。" />
      {claims.length ? <SimpleTable columns={["选手", "状态", "提交时间", "说明"]} rows={claims.map((claim) => [claim.player.displayName, claimStatusLabel(claim.status), formatDate(claim.submittedAt), claim.note ?? "未填写备注"])} /> : <div className="mt-4 text-sm text-secondary">你还没有提交过认领申请。</div>}
    </SectionCard>
  );
}

export function InvitationsPageView({ viewer, invitations }: { viewer: Viewer | null; invitations: InvitationsData }) {
  if (!viewer) {
    return <EmptyState action={<Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/login">去登录</Link>} description="登录后才能处理收到的邀请。" title="请先登录" />;
  }

  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="邀请收件箱" title="收到的邀请" description="所有需要你处理的入队邀请与训练赛邀请都会出现在这里。" />
      </SectionCard>
      {invitations.length ? (
        invitations.map((item) => (
          <SectionCard className="rounded-xl p-5" key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-secondary">{invitationStatusLabel(item.status)} · {formatDate(item.createdAt)}</div>
              </div>
              <div className="text-sm text-secondary">{item.sourceTeam?.name ?? item.targetPlayer?.displayName ?? item.targetTeam?.name ?? "系统通知"}</div>
            </div>
            <div className="mt-3 text-sm text-secondary">{item.message ?? "邀请方未填写补充说明。"}</div>
            {item.status === "PENDING" ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={respondInvitationAction}>
                  <input name="decision" type="hidden" value="accept" />
                  <input name="invitationId" type="hidden" value={item.id} />
                  <button className="theme-highlight-button rounded-xl px-4 py-3 text-sm" type="submit">接受</button>
                </form>
                <form action={respondInvitationAction}>
                  <input name="decision" type="hidden" value="decline" />
                  <input name="invitationId" type="hidden" value={item.id} />
                  <button className="scope-tab rounded-xl px-4 py-3 text-sm" type="submit">拒绝</button>
                </form>
              </div>
            ) : null}
          </SectionCard>
        ))
      ) : (
        <EmptyState title="当前没有邀请" description="新的入队邀请和训练赛邀请会自动出现在这里。" />
      )}
    </div>
  );
}

export function TeamWorkspacePageView({ viewer, data }: { viewer: Viewer | null; data: MyPageData | null }) {
  if (!viewer || !data) {
    return <EmptyState action={<Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/login">去登录</Link>} description="登录后才能进入你的队伍工作台。" title="请先登录" />;
  }

  if (!data.currentTeam || !viewer.captainTeam) {
    return <EmptyState action={<Link className="theme-highlight-button rounded-xl px-4 py-3 text-sm" href="/my">回到个人页</Link>} description="你还没有拥有队伍。完成认领后，可以从频道右栏直接创建队伍。" title="当前没有可管理的队伍" />;
  }

  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="队伍工作台" title={data.currentTeam.name} description="这里集中查看当前成员，并处理解散等重要操作。" />
        <StatGrid items={[{ label: "当前成员", value: String(data.currentTeam.members.length) }, { label: "当前队长", value: viewer.player?.displayName ?? "未识别" }, { label: "待处理邀请", value: String(data.invitations.filter((item) => item.status === "PENDING").length) }, { label: "队伍状态", value: "运作中" }]} />
      </SectionCard>
      <SectionCard className="rounded-xl p-5">
        <SectionTitle eyebrow="成员列表" title="当前阵容" />
        <SimpleTable columns={["选手", "分工", "加入时间"]} rows={data.currentTeam.members.map((member) => [member.player.displayName, member.inGameRole ?? member.player.primaryRole ?? "待确认", formatDate(member.joinedAt)])} />
      </SectionCard>
      <SectionCard className="danger-shell rounded-xl p-5">
        <SectionTitle eyebrow="危险操作" title="解散队伍" description="解散后当前成员关系会全部失效，请确认后再执行。" />
        <form action={disbandTeamAction} className="mt-4">
          <input name="teamId" type="hidden" value={viewer.captainTeam.id} />
          <button className="theme-danger-button rounded-xl border px-4 py-3 text-sm font-semibold" type="submit">确认解散队伍</button>
        </form>
      </SectionCard>
    </div>
  );
}

export function AdminHomePageView({ data }: { data: AdminDashboardData }) {
  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="后台总览" title="运营数据" description="这里展示待审认领和对象库规模，作为后台第一屏。" />
        <StatGrid items={data.metrics} />
      </SectionCard>
      <SectionCard className="rounded-xl p-5">
        <SectionTitle eyebrow="最近认领" title="待关注申请" action={<Link className="text-sm text-[color:var(--md-sys-color-primary)]" href="/admin/claims">进入审核队列</Link>} />
        {data.recentClaims.length ? <SimpleTable columns={["申请人", "选手", "状态", "提交时间"]} rows={data.recentClaims.map((claim) => [claim.user.name, claim.player.displayName, claimStatusLabel(claim.status), formatDate(claim.submittedAt)])} /> : <div className="mt-4 text-sm text-secondary">当前没有认领申请。</div>}
      </SectionCard>
    </div>
  );
}

export function AdminClaimsPageView({ claims }: { claims: AdminClaimsData }) {
  return (
    <SectionCard className="rounded-xl p-6">
      <SectionTitle eyebrow="认领审核" title="全部认领申请" description="按状态和提交时间排序，优先处理待审申请。" />
      {claims.length ? <SimpleTable columns={["申请人", "选手", "状态", "提交时间", "详情"]} rows={claims.map((claim) => [claim.user.name, claim.player.displayName, claimStatusLabel(claim.status), formatDate(claim.submittedAt), <Link className="text-[color:var(--md-sys-color-primary)]" href={`/admin/claims/${claim.id}`} key={claim.id}>打开</Link>])} /> : <div className="mt-4 text-sm text-secondary">当前没有认领申请。</div>}
    </SectionCard>
  );
}

export function AdminClaimDetailPageView({ claim }: { claim: AdminClaimDetailData | null }) {
  if (!claim) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="认领详情" title={claim.player.displayName} description={`${claim.user.name} 提交 · ${claimStatusLabel(claim.status)}`} />
        <SimpleTable columns={["字段", "内容"]} rows={[["申请人", claim.user.name], ["邮箱", claim.user.email ?? "未填写"], ["SteamID", claim.submittedSteamId], ["提交时间", formatDate(claim.submittedAt)], ["申请说明", claim.note ?? "未填写说明"], ["绑定状态", claim.binding.status], ["审核备注", claim.reviewNote ?? "暂无"], ["审核人", claim.reviewedBy?.name ?? "尚未审核"]]} />
      </SectionCard>
      {claim.status === "PENDING" ? (
        <SectionCard className="rounded-xl p-6">
          <SectionTitle eyebrow="审核操作" title="处理这条申请" description="通过后会把用户与选手正式绑定，拒绝时会写入失败原因。" />
          <div className="mt-4 flex flex-wrap gap-4">
            <form action={reviewClaimAction} className="grid max-w-md flex-1 gap-3">
              <input name="claimId" type="hidden" value={claim.id} />
              <input name="decision" type="hidden" value="approve" />
              <label className="text-sm text-secondary">审核备注<textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="reviewNote" placeholder="可填写通过说明。" /></label>
              <button className="theme-highlight-button rounded-xl px-4 py-3 text-sm" type="submit">通过申请</button>
            </form>
            <form action={reviewClaimAction} className="grid max-w-md flex-1 gap-3">
              <input name="claimId" type="hidden" value={claim.id} />
              <input name="decision" type="hidden" value="reject" />
              <label className="text-sm text-secondary">拒绝原因<textarea className="input-shell mt-2 min-h-24 rounded-xl px-3 py-2" name="reviewNote" placeholder="写明需要补充的证明或拒绝原因。" /></label>
              <button className="theme-danger-button rounded-xl border px-4 py-3 text-sm font-semibold" type="submit">拒绝申请</button>
            </form>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export function AdminEntityPageView({
  eyebrow,
  title,
  description,
  columns,
  rows
}: {
  eyebrow: string;
  title: string;
  description: string;
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <SectionCard className="rounded-xl p-6">
      <SectionTitle eyebrow={eyebrow} title={title} description={description} />
      <SimpleTable columns={columns} rows={rows} />
    </SectionCard>
  );
}

export function RulesPageView() {
  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="规则" title="参赛与社区规则" description="这些规则直接面向参赛、协作、处罚和社区安全。" />
      </SectionCard>
      {ruleSections.map((section) => (
        <SectionCard className="rounded-xl p-5" key={section.title}>
          <SectionTitle eyebrow="规则章节" title={section.title} description={section.body} />
          <InfoList items={[{ title: section.title, meta: section.body }]} />
        </SectionCard>
      ))}
    </div>
  );
}

export function GuidePageView() {
  return (
    <div className="space-y-4">
      <SectionCard className="rounded-xl p-6">
        <SectionTitle eyebrow="新手指引" title="第一次来这里的完整路线" description="从创建账号、认领选手到加入队伍，这里按顺序带你走完。" />
      </SectionCard>
      <SectionCard className="rounded-xl p-5">
        <SectionTitle eyebrow="步骤" title="开始参与前要做什么" />
        <InfoList items={guideSteps.map((step) => ({ title: step.title, meta: step.detail }))} />
      </SectionCard>
      <SectionCard className="rounded-xl p-5">
        <SectionTitle eyebrow="常见问题" title="FAQ" />
        <InfoList items={guideFaq.map((item) => ({ title: item.q, meta: item.a }))} />
      </SectionCard>
    </div>
  );
}