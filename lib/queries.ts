import { type Prisma, TournamentKind } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Viewer } from "@/lib/session";

type AdminPlayerEntity = Prisma.PlayerGetPayload<{
  include: {
    teamMemberships: {
      where: { isCurrent: true };
      include: { team: true };
      take: 1;
    };
  };
}>;
type AdminMatchEntity = Prisma.MatchGetPayload<{
  include: {
    season: true;
  };
}>;
type AdminSeasonEntity = Prisma.TournamentSeasonGetPayload<{
  include: { tournament: true };
}>;
type AdminPlayersResult = AdminPlayerEntity[];
type AdminTeamsResult = Prisma.TeamGetPayload<Record<string, never>>[];
type AdminMatchesResult = AdminMatchEntity[];
type AdminSeasonsResult = AdminSeasonEntity[];
type AdminTournamentsResult = Prisma.TournamentGetPayload<Record<string, never>>[];

export type Scope = "all" | "pioneer" | "legend" | "crown";

export const scopeMeta: Record<Scope, { label: string; description: string; bannerBody?: string }> = {
  all: {
    label: "全部",
    description: "回到全站对象视图，查看跨杯赛聚合结果。"
  },
  pioneer: {
    label: "先锋杯",
    description: "面向新晋队伍与入门赛道，强调成长与试炼。",
    bannerBody: "聚焦新晋选手、入门队伍和可参与赛程，动作以成为选手与建队为主。"
  },
  legend: {
    label: "传奇杯",
    description: "强调成熟赛程、秩序感和稳定队伍表现。",
    bannerBody: "聚焦成熟阵容、阶段推进与焦点对阵，角色卡优先解释资格和当前位置。"
  },
  crown: {
    label: "冠绝杯",
    description: "面向高资格与荣誉叙事，关注冠军之路。",
    bannerBody: "聚焦荣誉、结算和代表人物，不在频道页提前摊开多层故事结构。"
  }
};

export function resolveScope(scope?: string): Scope {
  return scope === "pioneer" || scope === "legend" || scope === "crown" ? scope : "all";
}

function buildHomeIdentityItems(viewer: Viewer | null, invitationCount: number) {
  if (!viewer) {
    return [
      {
        title: "登录账号",
        meta: "保留个人入口、认领记录和邀请通知。",
        sub: "先登录后继续你的身份进度。",
        href: "/login"
      },
      {
        title: "认领选手",
        meta: "提交 Steam 与身份说明，通过后进入正式人物链路。",
        sub: "审核进度会持续显示在个人页。",
        href: "/guide"
      },
      {
        title: "建立队伍",
        meta: "完成认领后创建战队，开始处理阵容与邀请。",
        sub: "队长动作统一收口到个人页。",
        href: "/guide"
      }
    ];
  }

  if (!viewer.player) {
    return [
      {
        title: "我的主页",
        meta: "账号已创建，可以继续查看认领和邀请摘要。",
        sub: "从这里继续处理身份入口。",
        href: "/my"
      },
      {
        title: "认领选手",
        meta: viewer.pendingClaim ? "你的认领申请正在审核中。" : "现在可以提交认领申请，完成正式身份绑定。",
        sub: viewer.pendingClaim ? "前往认领历史查看处理进度。" : "准备 Steam 信息与身份说明。",
        href: viewer.pendingClaim ? "/my/claims" : "/my"
      },
      {
        title: "建立队伍",
        meta: "完成选手认领后即可创建战队并进入队长链路。",
        sub: "当前尚未解锁建队能力。",
        href: "/guide"
      }
    ];
  }

  if (!viewer.currentTeam) {
    return [
      {
        title: "我的主页",
        meta: "你已经完成选手认领，可以回到个人页查看比赛与邀请。",
        sub: `当前待处理邀请 ${invitationCount} 条。`,
        href: "/my"
      },
      {
        title: "创建战队",
        meta: "已解锁队长链路，可以建立自己的战队。",
        sub: "建队后可继续管理阵容与训练赛。",
        href: "/my/team"
      },
      {
        title: "处理邀请",
        meta: "你的入队或训练赛邀请会持续汇总在个人页。",
        sub: invitationCount ? "进入个人页处理当前邀请。" : "当前没有待处理邀请。",
        href: "/my"
      }
    ];
  }

  if (!viewer.captainTeam) {
    return [
      {
        title: "我的主页",
        meta: "你已经完成选手认领，可以继续查看人物、比赛和邀请摘要。",
        sub: `当前所属战队：${viewer.currentTeam.name}`,
        href: "/my"
      },
      {
        title: "当前战队",
        meta: `${viewer.currentTeam.name} 已经是你的当前归属战队。`,
        sub: invitationCount ? `当前有 ${invitationCount} 条与你相关的邀请。` : "当前没有待处理邀请。",
        href: `/teams/${viewer.currentTeam.slug}`
      },
      {
        title: "队伍关系",
        meta: "你当前是队员身份，队伍管理和训练赛动作由队长链路处理。",
        sub: "需要时可回到人物页或战队页继续查看上下文。",
        href: "/my"
      }
    ];
  }

  return [
    {
      title: "我的主页",
      meta: "从个人页继续查看战绩、身份状态和队伍动作。",
      sub: `当前身份：${viewer.roleState}`,
      href: "/my"
    },
    {
      title: "队伍管理",
      meta: `${viewer.captainTeam.name} 已进入队长链路，可以继续维护阵容与说明。`,
      sub: invitationCount ? `当前有 ${invitationCount} 条邀请待处理。` : "当前没有待处理邀请。",
      href: "/my/team"
    },
    {
      title: "邀请处理",
      meta: "训练赛与入队邀请统一在身份链路里继续。",
      sub: "需要时可直接回到个人页处理。",
      href: "/my"
    }
  ];
}

function scopeToKind(scope: Scope) {
  switch (scope) {
    case "pioneer":
      return TournamentKind.PIONEER;
    case "legend":
      return TournamentKind.LEGEND;
    case "crown":
      return TournamentKind.GUANJUE;
    default:
      return null;
  }
}

function kindToScope(kind: TournamentKind | null | undefined): Scope {
  switch (kind) {
    case TournamentKind.PIONEER:
      return "pioneer";
    case TournamentKind.LEGEND:
      return "legend";
    case TournamentKind.GUANJUE:
      return "crown";
    default:
      return "all";
  }
}

async function safeQuery<T>(fn: () => Promise<T>, fallback: T) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getHeaderSearchIndex() {
  noStore();

  return safeQuery(async () => {
    const [matches, seasons, players, teams] = await Promise.all([
      prisma.match.findMany({
        take: 6,
        orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
        include: {
          season: {
            include: {
              tournament: true
            }
          }
        }
      }),
      prisma.tournamentSeason.findMany({
        take: 6,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        include: {
          tournament: true
        }
      }),
      prisma.player.findMany({
        take: 6,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      }),
      prisma.team.findMany({
        take: 6,
        orderBy: [{ championshipCount: "desc" }, { createdAt: "desc" }],
        include: {
          seasonEntries: {
            include: {
              season: {
                include: {
                  tournament: true
                }
              }
            },
            take: 1
          }
        }
      })
    ]);

    return [
      ...matches.map((match) => ({
        title: match.title,
        href: `/matches/${match.slug}`,
        group: "比赛",
        meta: `${match.season?.title ?? "未归属赛季"} · ${scopeMeta[kindToScope(match.season?.tournament.kind)].label}`
      })),
      ...seasons.map((season) => ({
        title: season.title,
        href: `/matches/seasons/${season.slug}`,
        group: "赛季",
        meta: `${season.statusLabel ?? "进行中"} · ${scopeMeta[kindToScope(season.tournament.kind)].label}`
      })),
      ...players.map((player) => ({
        title: player.displayName,
        href: `/players/${player.slug}`,
        group: "选手",
        meta: `${player.primaryRole ?? "暂未填写位置"} · ${player.teamMemberships[0]?.team.name ?? "自由选手"}`
      })),
      ...teams.map((team) => ({
        title: team.name,
        href: `/teams/${team.slug}`,
        group: "战队",
        meta: `${team.summary ?? "战队主页"} · ${team.seasonEntries[0] ? scopeMeta[kindToScope(team.seasonEntries[0].season.tournament.kind)].label : "未入池"}`
      })),
      { title: "规则", href: "/rules", group: "阅读", meta: "处罚、边界与社区安全" },
      { title: "新手指引", href: "/guide", group: "阅读", meta: "账号、认领与参赛流程" },
      { title: "我的主页", href: "/my", group: "操作", meta: "身份状态、队伍与邀请" }
    ];
  }, [] as { title: string; href: string; group: string; meta: string }[]);
}

export async function getHomePageData(viewer: Viewer | null) {
  noStore();

  return safeQuery(async () => {
    const [featuredSeasons, featuredPlayers, latestMatches, teams] = await Promise.all([
      prisma.tournamentSeason.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        include: { tournament: true },
        take: 3
      }),
      prisma.player.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          },
          reports: {
            orderBy: { generatedAt: "desc" },
            take: 1
          }
        },
        take: 4
      }),
      prisma.match.findMany({
        orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
        include: {
          season: { include: { tournament: true } },
          participants: {
            include: { team: true },
            orderBy: { slotNumber: "asc" }
          }
        },
        take: 4
      }),
      prisma.team.findMany({
        orderBy: [{ championshipCount: "desc" }, { createdAt: "desc" }],
        include: {
          seasonEntries: {
            include: { season: { include: { tournament: true } } },
            take: 1
          }
        },
        take: 4
      })
    ]);

    const invitationCount = (viewer?.invitationStats.pendingScrim ?? 0) + (viewer?.invitationStats.pendingTeam ?? 0);

    return {
      hero: {
        title: "Herald Cup 把比赛、人物、战队和身份放回同一条主线",
        body: "先看当前赛季与焦点对阵，再进入人物档案和战队名册；登录后继续完成认领、建队与邀请处理。",
        stats: [
          { label: "推荐赛季", value: String(featuredSeasons.length || 0), hint: "首页重点赛季" },
          { label: "焦点对阵", value: String(latestMatches.length || 0), hint: "当前已入库比赛" },
          { label: "人物入口", value: String(featuredPlayers.length || 0), hint: "认证与焦点人物" },
          { label: "战队入口", value: String(teams.length || 0), hint: "当前活跃战队" }
        ]
      },
      leftRail: [
        { title: "比赛中心", meta: "查看当前赛季、焦点对阵和已录入结果。", sub: `${latestMatches.length} 场焦点对阵`, href: "/matches" },
        { title: "人物档案", meta: "从认证选手、位置标签和代表比赛进入人物页。", sub: `${featuredPlayers.length} 位已入库人物`, href: "/players" },
        { title: "战队名册", meta: "按阵容、杯赛归属和近期战绩浏览战队。", sub: `${teams.length} 支活跃战队`, href: "/teams" },
        { title: "身份链路", meta: "登录后继续完成认领、建队、入队和邀请处理。", sub: viewer ? "进入我的主页继续" : "从游客到正式身份", href: viewer ? "/my" : "/login" }
      ],
      rightRail: {
        title: viewer ? viewer.roleState : "visitor",
        opendota: viewer?.player ? "已接入最近报告摘要" : null,
        pendingClaim: viewer?.pendingClaim?.id ?? null,
        invitations: invitationCount
      },
      modules: {
        matches: latestMatches.map((match) => ({
          title: match.title,
          meta: `${match.season?.title ?? "未归属赛季"} · ${match.participants.map((item) => item.team.name).join(" vs ")}`,
          sub: match.summary ?? "查看状态、比分与阶段详情。",
          href: `/matches/${match.slug}`
        })),
        players: featuredPlayers.map((player) => ({
          title: player.displayName,
          meta: `${player.primaryRole ?? "暂未填写位置"} · ${player.teamMemberships[0]?.team.name ?? "自由选手"}`,
          sub: player.bio ?? "查看人物简介、代表比赛和数据摘要。",
          href: `/players/${player.slug}`
        })),
        teams: teams.map((team) => ({
          title: team.name,
          meta: `${team.seasonEntries[0] ? scopeMeta[kindToScope(team.seasonEntries[0].season.tournament.kind)].label : "未入池"} · ${team.championshipCount ? `${team.championshipCount} 次冠军` : "查看当前阵容与战绩"}`,
          sub: team.summary ?? "查看队长、成员和近期成绩。",
          href: `/teams/${team.slug}`
        })),
        identity: buildHomeIdentityItems(viewer, invitationCount)
      }
    };
  }, {
    hero: { title: "内容正在整理中", body: "比赛、选手和战队信息会在准备完成后显示在这里。", stats: [] },
    leftRail: [],
    rightRail: { title: "visitor", opendota: null, pendingClaim: null, invitations: 0 },
    modules: { matches: [], players: [], teams: [], identity: [] }
  });
}

export async function getMatchesPageData(scope: Scope) {
  noStore();

  return safeQuery(async () => {
    const kind = scopeToKind(scope);
    const seasons = await prisma.tournamentSeason.findMany({
      where: kind ? { tournament: { kind } } : undefined,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        tournament: true,
        matches: {
          include: {
            participants: {
              include: { team: true },
              orderBy: { slotNumber: "asc" }
            },
            stage: true
          },
          orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
          take: 6
        }
      }
    });

    const matchCount = seasons.reduce((count, season) => count + season.matches.length, 0);
    const activeSeason = seasons[0] ?? null;

    return {
      scope,
      stats: [
        { label: "赛季数", value: String(seasons.length), hint: scopeMeta[scope].label },
        { label: "赛程条目", value: String(matchCount), hint: "当前范围真实记录" },
        { label: "主赛季", value: activeSeason?.statusLabel ?? "整理中", hint: activeSeason?.title ?? "赛季信息将在更新后显示" },
        { label: "赛制", value: "Battle Cup", hint: "详情页承接对阵图" }
      ],
      seasons: seasons.map((season) => ({
        id: season.id,
        title: season.title,
        slug: season.slug,
        scope: kindToScope(season.tournament.kind),
        phase: season.statusLabel ?? "进行中",
        summary: season.summary ?? season.tournament.description ?? "暂无说明",
        matches: season.matches.map((match) => ({
          slug: match.slug,
          title: match.title,
          stage: match.stage?.name ?? match.format ?? "未分配阶段",
          status: match.status,
          time: match.scheduledAt?.toLocaleString("zh-CN") ?? "待定",
          summary: match.summary ?? "暂无比赛摘要",
          teams: match.participants.map((item) => item.team.name)
        }))
      }))
    };
  }, { scope, stats: [], seasons: [] });
}

export async function getPlayersPageData(scope: Scope) {
  noStore();

  return safeQuery(async () => {
    const players = await prisma.player.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        teamMemberships: {
          where: { isCurrent: true },
          include: {
            team: {
              include: {
                seasonEntries: {
                  include: { season: { include: { tournament: true } } }
                }
              }
            }
          }
        },
        reports: {
          orderBy: { generatedAt: "desc" },
          take: 1
        }
      }
    });

    const filtered = players.filter((player) => {
      if (scope === "all") {
        return true;
      }

      return player.teamMemberships.some((membership) =>
        membership.team.seasonEntries.some((entry) => kindToScope(entry.season.tournament.kind) === scope)
      );
    });

    return filtered.map((player) => {
      const team = player.teamMemberships[0]?.team ?? null;
      const scopes = new Set<Scope>();
      player.teamMemberships.forEach((membership) => {
        membership.team.seasonEntries.forEach((entry) => scopes.add(kindToScope(entry.season.tournament.kind)));
      });

      return {
        id: player.id,
        slug: player.slug,
        title: player.displayName,
        bio: player.bio ?? "暂无人物简介",
        primaryRole: player.primaryRole ?? "暂未填写位置",
        heroes: player.heroPool,
        teamName: team?.name ?? "自由选手",
        scopes: Array.from(scopes).filter((item) => item !== "all"),
        opendota: player.reports[0] ? "已接入最近报告" : "暂无报告"
      };
    });
  }, []);
}

export async function getTeamsPageData(scope: Scope) {
  noStore();

  return safeQuery(async () => {
    const teams = await prisma.team.findMany({
      where: scope === "all" ? undefined : { seasonEntries: { some: { season: { tournament: { kind: scopeToKind(scope)! } } } } },
      orderBy: [{ championshipCount: "desc" }, { createdAt: "desc" }],
      include: {
        members: {
          where: { isCurrent: true },
          include: { player: true }
        },
        seasonEntries: {
          include: {
            season: {
              include: { tournament: true }
            }
          }
        }
      }
    });

    return teams.map((team) => ({
      id: team.id,
      slug: team.slug,
      title: team.name,
      summary: team.summary ?? "暂无战队简介",
      record: `${team.seasonEntries[0]?.wins ?? 0} 胜 ${team.seasonEntries[0]?.losses ?? 0} 负`,
      scope: team.seasonEntries[0] ? kindToScope(team.seasonEntries[0].season.tournament.kind) : "all",
      members: team.members.length,
      captain: team.captain ?? team.members[0]?.player.displayName ?? "战队负责人待公布"
    }));
  }, []);
}

export async function getMatchDetailData(slug: string) {
  noStore();

  return safeQuery(async () => {
    const match = await prisma.match.findUnique({
      where: { slug },
      include: {
        season: { include: { tournament: true } },
        stage: true,
        participants: {
          include: { team: true },
          orderBy: { slotNumber: "asc" }
        },
        games: {
          include: {
            participants: {
              include: { team: true },
              orderBy: { slotNumber: "asc" }
            }
          },
          orderBy: { gameNumber: "asc" }
        },
        highlights: {
          include: { player: true }
        }
      }
    });

    if (!match) {
      return null;
    }

    return {
      id: match.id,
      slug: match.slug,
      title: match.title,
      summary: match.summary ?? "暂无比赛摘要",
      stage: match.stage?.name ?? match.format ?? "未分配阶段",
      status: match.status,
      bestOf: match.bestOf,
      scheduledAt: match.scheduledAt,
      scope: kindToScope(match.season?.tournament.kind),
      season: match.season
        ? {
            title: match.season.title,
            slug: match.season.slug
          }
        : null,
      participants: match.participants.map((item) => ({
        teamId: item.team.id,
        teamName: item.team.name,
        score: item.score,
        result: item.result,
        slot: item.slotNumber
      })),
      games: match.games.map((game) => ({
        id: game.id,
        gameNumber: game.gameNumber,
        status: game.status,
        winnerTeamId: game.winnerTeamId,
        participants: game.participants.map((item) => ({
          teamName: item.team.name,
          score: item.score,
          result: item.result
        }))
      })),
      highlights: match.highlights.map((highlight) => ({
        title: highlight.title,
        description: highlight.description,
        playerId: highlight.player?.id ?? null,
        playerName: highlight.player?.displayName ?? "系统记录"
      }))
    };
  }, null);
}

export async function getSeasonDetailData(slug: string) {
  noStore();

  return safeQuery(async () => {
    const season = await prisma.tournamentSeason.findUnique({
      where: { slug },
      include: {
        tournament: true,
        participants: {
          include: { team: true },
          orderBy: { seedNumber: "asc" }
        },
        stages: {
          include: {
            matches: {
              include: {
                participants: { include: { team: true }, orderBy: { slotNumber: "asc" } }
              },
              orderBy: [{ roundNumber: "asc" }, { sequenceNumber: "asc" }, { createdAt: "asc" }]
            }
          },
          orderBy: { sortOrder: "asc" }
        }
      }
    });

    if (!season) {
      return null;
    }

    return {
      id: season.id,
      slug: season.slug,
      title: season.title,
      summary: season.summary ?? season.tournament.description ?? "暂无赛季摘要",
      statusLabel: season.statusLabel ?? "进行中",
      scope: kindToScope(season.tournament.kind),
      featured: season.featured,
      teams: season.participants.map((item) => ({
        teamName: item.team.name,
        rank: item.finalRank,
        wins: item.wins,
        losses: item.losses
      })),
      stages: season.stages.map((stage) => ({
        name: stage.name,
        bestOf: stage.bestOf,
        matches: stage.matches.map((match) => ({
          title: match.title,
          slug: match.slug,
          teams: match.participants.map((item) => item.team.name),
          status: match.status
        }))
      }))
    };
  }, null);
}

export async function getPlayerDetailData(slug: string) {
  noStore();

  return safeQuery(async () => {
    const player = await prisma.player.findUnique({
      where: { slug },
      include: {
        teamMemberships: {
          where: { isCurrent: true },
          include: {
            team: {
              include: {
                seasonEntries: {
                  include: {
                    season: {
                      include: { tournament: true }
                    }
                  }
                }
              }
            }
          }
        },
        highlights: {
          include: { match: true },
          take: 6
        },
        reports: {
          orderBy: { generatedAt: "desc" },
          take: 1
        },
        users: {
          take: 1,
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!player) {
      return null;
    }

    const team = player.teamMemberships[0]?.team ?? null;
    const scopes = new Set<Scope>();
    team?.seasonEntries.forEach((entry) => scopes.add(kindToScope(entry.season.tournament.kind)));

    return {
      id: player.id,
      slug: player.slug,
      title: player.displayName,
      bio: player.bio ?? "暂无人物简介",
      primaryRole: player.primaryRole ?? "暂未填写位置",
      heroPool: player.heroPool,
      steamId: player.steamId,
      team: team
        ? {
            id: team.id,
            name: team.name,
            slug: team.slug
          }
        : null,
      claimedBy: player.users[0]
        ? {
            id: player.users[0].id,
            name: player.users[0].name,
            email: player.users[0].email
          }
        : null,
      scopes: Array.from(scopes),
      highlights: player.highlights.map((highlight) => ({
        title: highlight.title,
        matchTitle: highlight.match.title,
        matchSlug: highlight.match.slug
      })),
      reportSummary: player.reports[0]?.summary ?? null
    };
  }, null);
}

export async function getTeamDetailData(slug: string) {
  noStore();

  return safeQuery(async () => {
    const team = await prisma.team.findUnique({
      where: { slug },
      include: {
        members: {
          where: { isCurrent: true },
          include: { player: true }
        },
        seasonEntries: {
          include: {
            season: {
              include: { tournament: true }
            }
          }
        },
        matchParticipants: {
          include: {
            match: {
              include: { season: { include: { tournament: true } } }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 6
        }
      }
    });

    if (!team) {
      return null;
    }

    return {
      id: team.id,
      slug: team.slug,
      title: team.name,
      summary: team.summary ?? "暂无战队简介",
      captain: team.captain,
      record: `${team.seasonEntries[0]?.wins ?? 0} 胜 ${team.seasonEntries[0]?.losses ?? 0} 负`,
      scope: team.seasonEntries[0] ? kindToScope(team.seasonEntries[0].season.tournament.kind) : "all",
      members: team.members.map((member) => ({
        id: member.player.id,
        name: member.player.displayName,
        slug: member.player.slug,
        role: member.inGameRole ?? member.player.primaryRole ?? "分工待确认"
      })),
      matches: team.matchParticipants.map((participant) => ({
        title: participant.match.title,
        slug: participant.match.slug,
        status: participant.match.status,
        scope: kindToScope(participant.match.season?.tournament.kind)
      }))
    };
  }, null);
}

export async function getMyPageData(viewer: Viewer | null) {
  noStore();

  if (!viewer) {
    return null;
  }

  return safeQuery(async () => {
    const [claims, invitations, reports, currentTeam, recentMatches] = await Promise.all([
      prisma.claimRequest.findMany({
        where: { userId: viewer.user.id },
        include: { player: true },
        orderBy: { submittedAt: "desc" },
        take: 5
      }),
      prisma.invitation.findMany({
        where: {
          OR: [
            viewer.player ? { targetPlayerId: viewer.player.id } : undefined,
            viewer.captainTeam ? { targetTeamId: viewer.captainTeam.id } : undefined
          ].filter(Boolean) as never
        },
        include: {
          sourceTeam: true,
          targetTeam: true,
          targetPlayer: true
        },
        orderBy: { createdAt: "desc" },
        take: 6
      }),
      viewer.binding
        ? prisma.playerReport.findMany({
            where: { bindingId: viewer.binding.id },
            orderBy: { generatedAt: "desc" },
            take: 1
          })
        : Promise.resolve([]),
      viewer.currentTeam
        ? prisma.team.findUnique({
            where: { id: viewer.currentTeam.id },
            include: {
              members: {
                where: { isCurrent: true },
                include: { player: true }
              }
            }
          })
        : Promise.resolve(null),
      viewer.player
        ? prisma.matchHighlight.findMany({
            where: { playerId: viewer.player.id },
            include: { match: true },
            orderBy: { createdAt: "desc" },
            take: 3
          })
        : Promise.resolve([])
    ]);

    return {
      claims,
      invitations,
      reports,
      currentTeam,
      recentMatches
    };
  }, { claims: [], invitations: [], reports: [], currentTeam: null, recentMatches: [] });
}

export async function getClaimsData(viewer: Viewer | null) {
  noStore();

  if (!viewer) {
    return [];
  }

  return safeQuery(async () => {
    return prisma.claimRequest.findMany({
      where: { userId: viewer.user.id },
      include: { player: true },
      orderBy: { submittedAt: "desc" }
    });
  }, []);
}

export async function getInvitationsData(viewer: Viewer | null) {
  noStore();

  if (!viewer?.player && !viewer?.captainTeam) {
    return [];
  }

  return safeQuery(async () => {
    return prisma.invitation.findMany({
      where: {
        OR: [
          viewer.player ? { targetPlayerId: viewer.player.id } : undefined,
          viewer.captainTeam ? { targetTeamId: viewer.captainTeam.id } : undefined
        ].filter(Boolean) as never
      },
      include: {
        sourceTeam: true,
        targetPlayer: true,
        targetTeam: true
      },
      orderBy: { createdAt: "desc" }
    });
  }, []);
}

export async function getAdminDashboardData() {
  noStore();

  return safeQuery(async () => {
    const [claimCount, matchCount, playerCount, teamCount, recentClaims] = await Promise.all([
      prisma.claimRequest.count({ where: { status: "PENDING" } }),
      prisma.match.count(),
      prisma.player.count(),
      prisma.team.count(),
      prisma.claimRequest.findMany({
        orderBy: { submittedAt: "desc" },
        include: { user: true, player: true },
        take: 5
      })
    ]);

    return {
      metrics: [
        { label: "待审认领", value: String(claimCount) },
        { label: "比赛", value: String(matchCount) },
        { label: "选手", value: String(playerCount) },
        { label: "战队", value: String(teamCount) }
      ],
      recentClaims
    };
  }, { metrics: [], recentClaims: [] });
}

export async function getAdminClaimsData() {
  noStore();

  return safeQuery(async () => {
    return prisma.claimRequest.findMany({
      include: {
        user: true,
        player: true,
        binding: true,
        reviewedBy: true
      },
      orderBy: [{ status: "asc" }, { submittedAt: "desc" }]
    });
  }, []);
}

export async function getAdminClaimDetailData(id: string) {
  noStore();

  return safeQuery(async () => {
    return prisma.claimRequest.findUnique({
      where: { id },
      include: {
        user: true,
        player: true,
        binding: true,
        reviewedBy: true
      }
    });
  }, null);
}

export async function getAdminEntityData(kind: "players"): Promise<AdminPlayersResult>;
export async function getAdminEntityData(kind: "teams"): Promise<AdminTeamsResult>;
export async function getAdminEntityData(kind: "matches"): Promise<AdminMatchesResult>;
export async function getAdminEntityData(kind: "seasons"): Promise<AdminSeasonsResult>;
export async function getAdminEntityData(kind: "tournaments"): Promise<AdminTournamentsResult>;
export async function getAdminEntityData(kind: "players" | "teams" | "matches" | "seasons" | "tournaments") {
  noStore();

  return safeQuery(async () => {
    if (kind === "players") {
      return prisma.player.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          teamMemberships: {
            where: { isCurrent: true },
            include: { team: true },
            take: 1
          }
        }
      });
    }

    if (kind === "teams") {
      return prisma.team.findMany({
        orderBy: { createdAt: "desc" }
      });
    }

    if (kind === "matches") {
      return prisma.match.findMany({
        orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
        include: {
          season: true
        }
      });
    }

    if (kind === "seasons") {
      return prisma.tournamentSeason.findMany({
        orderBy: { createdAt: "desc" },
        include: { tournament: true }
      });
    }

    return prisma.tournament.findMany({
      orderBy: { createdAt: "desc" }
    });
  }, []);
}