export type Scope = "all" | "pioneer" | "legend" | "crown";
export type Role = "visitor" | "user" | "player" | "captain";
export type ClaimState = "open" | "pending";

type ScopeMeta = {
  value: Scope;
  label: string;
  shortLabel: string;
  description: string;
  bannerTitle: string;
  bannerBody: string;
};

type Team = {
  slug: string;
  name: string;
  scope: Exclude<Scope, "all">;
  honor: string;
  status: string;
  record: string;
  headline: string;
  recruiting: boolean;
  captain: string;
  members: string[];
  focus: string[];
};

type Player = {
  slug: string;
  name: string;
  teamSlug: string | null;
  scopes: Exclude<Scope, "all">[];
  positions: string[];
  heroes: string[];
  steamId: string;
  story: string;
  kda: string;
  winRate: string;
  opendota: string;
  focusMatchSlugs: string[];
};

type Match = {
  slug: string;
  name: string;
  seasonSlug: string;
  scope: Exclude<Scope, "all">;
  status: "live" | "scheduled" | "finished";
  stage: string;
  time: string;
  result: string;
  homeTeamSlug: string;
  awayTeamSlug: string;
  summary: string;
  highlightedPlayers: string[];
};

type Season = {
  slug: string;
  name: string;
  scope: Exclude<Scope, "all">;
  seasonCode: string;
  championTeamSlug: string;
  phase: string;
  format: string;
  summary: string;
  teams: string[];
  focusMatchSlugs: string[];
};

type ClaimRecord = {
  id: string;
  playerName: string;
  scope: Scope;
  status: "processing" | "approved" | "rejected";
  submittedAt: string;
  nextStep: string;
  note: string;
};

type InvitationRecord = {
  id: string;
  type: "team" | "scrim";
  title: string;
  from: string;
  status: "pending" | "accepted" | "declined";
  summary: string;
  cta: string;
};

export const scopes: ScopeMeta[] = [
  {
    value: "all",
    label: "全部",
    shortLabel: "全站",
    description: "回到全站对象视图，查看跨杯赛聚合结果。",
    bannerTitle: "全站总览",
    bannerBody: "聚合当前活跃赛季、人物池和战队荣誉，不插入额外 Hero。"
  },
  {
    value: "pioneer",
    label: "先锋杯",
    shortLabel: "先锋",
    description: "面向新晋队伍与入门赛道，强调成长与试炼。",
    bannerTitle: "先锋杯当前赛道",
    bannerBody: "聚焦新晋选手、入门队伍和可参与赛程，动作以成为选手与建队为主。"
  },
  {
    value: "legend",
    label: "传奇杯",
    shortLabel: "传奇",
    description: "强调成熟赛程、秩序感和稳定队伍表现。",
    bannerTitle: "传奇杯当前赛道",
    bannerBody: "聚焦成熟阵容、阶段推进与焦点对阵，角色卡优先解释资格和当前位置。"
  },
  {
    value: "crown",
    label: "冠绝杯",
    shortLabel: "冠绝",
    description: "面向高资格与荣誉叙事，关注冠军之路。",
    bannerTitle: "冠绝杯当前赛道",
    bannerBody: "聚焦荣誉、结算和代表人物，不在频道页提前摊开多层故事结构。"
  }
];

export const objectNav = [
  { href: "/matches", label: "比赛" },
  { href: "/players", label: "选手" },
  { href: "/teams", label: "战队" }
] as const;

export const toolsNav = [
  { href: "/my", label: "我的" },
  { href: "/admin", label: "后台" }
] as const;

export const teams: Team[] = [
  {
    slug: "ember-fleet",
    name: "余烬舰队",
    scope: "pioneer",
    honor: "先锋杯 S4 八强",
    status: "招募中",
    record: "9 胜 4 负",
    headline: "一支偏快节奏、擅长二号位带动边路的先锋杯常驻队伍。",
    recruiting: true,
    captain: "南庭",
    members: ["南庭", "陆岚", "槐序", "纸行", "云焰"],
    focus: ["快开雾", "双辅助游走", "新阵容试炼"]
  },
  {
    slug: "violet-order",
    name: "紫序公会",
    scope: "legend",
    honor: "传奇杯 S3 亚军",
    status: "稳定阵容",
    record: "14 胜 5 负",
    headline: "以三核调度与后期运营见长的传奇杯秩序型战队。",
    recruiting: false,
    captain: "知更",
    members: ["知更", "青垣", "立冬", "泊川", "霁河"],
    focus: ["后期调度", "视野控制", "高地拉扯"]
  },
  {
    slug: "scarlet-crown",
    name: "绯冠议会",
    scope: "crown",
    honor: "冠绝杯 S2 冠军",
    status: "封闭训练",
    record: "18 胜 2 负",
    headline: "以冠军经验和高压执行著称的冠绝杯头部队伍。",
    recruiting: false,
    captain: "沉锋",
    members: ["沉锋", "白衡", "顾栖", "寒川", "时澜"],
    focus: ["冠军之路", "终局拉扯", "纪律执行"]
  }
];

export const players: Player[] = [
  {
    slug: "nanting",
    name: "南庭",
    teamSlug: "ember-fleet",
    scopes: ["pioneer"],
    positions: ["二号位", "指挥"],
    heroes: ["风暴之灵", "痛苦女王", "帕克"],
    steamId: "STEAM_0:先锋_南庭",
    story: "擅长带动节奏与中期转线，是先锋杯最稳定的开团指挥之一。",
    kda: "6.3 / 3.1 / 11.4",
    winRate: "67%",
    opendota: "近 30 天 2140 评分",
    focusMatchSlugs: ["ember-vs-violet-scrim", "pioneer-finals-preview"]
  },
  {
    slug: "zhi-geng",
    name: "知更",
    teamSlug: "violet-order",
    scopes: ["legend"],
    positions: ["五号位", "队长"],
    heroes: ["戴泽", "寒冬飞龙", "暗影萨满"],
    steamId: "STEAM_0:传奇_知更",
    story: "以信息组织和防守拉扯见长，负责传奇杯中后期的稳态调度。",
    kda: "3.4 / 4.2 / 16.8",
    winRate: "72%",
    opendota: "近 30 天 2288 评分",
    focusMatchSlugs: ["legend-upper-final", "ember-vs-violet-scrim"]
  },
  {
    slug: "chen-feng",
    name: "沉锋",
    teamSlug: "scarlet-crown",
    scopes: ["crown"],
    positions: ["一号位"],
    heroes: ["幽鬼", "幻影长矛手", "虚空假面"],
    steamId: "STEAM_0:冠绝_沉锋",
    story: "高压终局的稳定收束者，冠绝杯结算叙事中的核心人物。",
    kda: "8.1 / 2.5 / 9.6",
    winRate: "78%",
    opendota: "近 30 天 2440 评分",
    focusMatchSlugs: ["crown-grand-final"]
  },
  {
    slug: "lu-lan",
    name: "陆岚",
    teamSlug: null,
    scopes: ["pioneer"],
    positions: ["四号位"],
    heroes: ["大地之灵", "米拉娜", "拉比克"],
    steamId: "STEAM_0:自由_陆岚",
    story: "自由选手，长期活跃在先锋杯选手池，适合作为队长邀请对象。",
    kda: "4.7 / 4.9 / 13.2",
    winRate: "61%",
    opendota: "近 30 天 2015 评分",
    focusMatchSlugs: ["pioneer-finals-preview"]
  }
];

export const seasons: Season[] = [
  {
    slug: "pioneer-s4",
    name: "先锋杯 第四赛季",
    scope: "pioneer",
    seasonCode: "S4",
    championTeamSlug: "ember-fleet",
    phase: "八强推进中",
    format: "8 支队伍单败淘汰，BO3 半决赛 / BO5 决赛",
    summary: "本季重点放在新晋队伍磨合与资格上岸，强调节奏与成长。",
    teams: ["ember-fleet"],
    focusMatchSlugs: ["pioneer-finals-preview"]
  },
  {
    slug: "legend-s3",
    name: "传奇杯 第三赛季",
    scope: "legend",
    seasonCode: "S3",
    championTeamSlug: "violet-order",
    phase: "胜者组决赛",
    format: "8 支队伍单败淘汰，决赛 BO5",
    summary: "强调秩序、对阵图和成熟队伍之间的稳定发挥。",
    teams: ["violet-order"],
    focusMatchSlugs: ["legend-upper-final"]
  },
  {
    slug: "crown-s2",
    name: "冠绝杯 第二赛季",
    scope: "crown",
    seasonCode: "S2",
    championTeamSlug: "scarlet-crown",
    phase: "已结算",
    format: "8 支队伍单败淘汰，冠军夜 BO5",
    summary: "冠军叙事与高荣誉回顾是本季重点。",
    teams: ["scarlet-crown"],
    focusMatchSlugs: ["crown-grand-final"]
  }
];

export const matches: Match[] = [
  {
    slug: "pioneer-finals-preview",
    name: "余烬舰队 vs 霜港青年军",
    seasonSlug: "pioneer-s4",
    scope: "pioneer",
    status: "scheduled",
    stage: "先锋杯 S4 半决赛",
    time: "04-21 20:00",
    result: "待开赛",
    homeTeamSlug: "ember-fleet",
    awayTeamSlug: "ember-fleet",
    summary: "先锋杯焦点战，重点看南庭的中期转线与自由位补位。",
    highlightedPlayers: ["nanting", "lu-lan"]
  },
  {
    slug: "legend-upper-final",
    name: "紫序公会 vs 暮色法庭",
    seasonSlug: "legend-s3",
    scope: "legend",
    status: "live",
    stage: "传奇杯 S3 胜者组决赛",
    time: "进行中",
    result: "1 : 1",
    homeTeamSlug: "violet-order",
    awayTeamSlug: "violet-order",
    summary: "正在进行中的 BO3，对阵图已进入半决赛节点。",
    highlightedPlayers: ["zhi-geng"]
  },
  {
    slug: "crown-grand-final",
    name: "绯冠议会 vs 北境誓约",
    seasonSlug: "crown-s2",
    scope: "crown",
    status: "finished",
    stage: "冠绝杯 S2 总决赛",
    time: "已完赛",
    result: "3 : 1",
    homeTeamSlug: "scarlet-crown",
    awayTeamSlug: "scarlet-crown",
    summary: "冠绝杯冠军夜，沉锋的终局接管成为本赛季封面记忆点。",
    highlightedPlayers: ["chen-feng"]
  },
  {
    slug: "ember-vs-violet-scrim",
    name: "余烬舰队 vs 紫序公会 训练赛",
    seasonSlug: "legend-s3",
    scope: "legend",
    status: "finished",
    stage: "跨杯赛训练赛",
    time: "04-12 19:30",
    result: "2 : 1",
    homeTeamSlug: "ember-fleet",
    awayTeamSlug: "violet-order",
    summary: "用于测试邀请训练赛链路的代表比赛。",
    highlightedPlayers: ["nanting", "zhi-geng"]
  }
];

export const homeModules = [
  {
    title: "比赛中心",
    description: "查看当前赛季、焦点对阵和已录入结果。",
    items: matches.slice(0, 3).map((match) => ({
      title: match.name,
      meta: `${match.stage} · ${match.time}`,
      sub: match.result,
      href: `/matches/${match.slug}`
    }))
  },
  {
    title: "人物档案",
    description: "从认证选手、位置标签和代表比赛进入人物页。",
    items: players.slice(0, 3).map((player) => ({
      title: player.name,
      meta: `${player.positions.join(" / ")} · ${player.opendota}`,
      sub: player.heroes.join(" / "),
      href: `/players/${player.slug}`
    }))
  },
  {
    title: "战队名册",
    description: "按阵容、杯赛归属和近期战绩浏览战队。",
    items: teams.slice(0, 3).map((team) => ({
      title: team.name,
      meta: `${team.record} · ${scopes.find((scope) => scope.value === team.scope)?.label ?? "当前赛道"}`,
      sub: team.headline,
      href: `/teams/${team.slug}`
    }))
  },
  {
    title: "身份链路",
    description: "登录后继续完成认领、建队、入队和邀请处理。",
    items: [
      {
        title: "登录账号",
        meta: "先保留个人入口，再继续认领与邀请处理。",
        sub: "登录后身份进度会固定收口到个人页。",
        href: "/login"
      },
      {
        title: "认领选手",
        meta: "提交 Steam 与身份说明，通过后进入正式人物链路。",
        sub: "审核进度在个人页持续可见。",
        href: "/guide"
      },
      {
        title: "建立队伍",
        meta: "完成认领后创建战队，开始处理阵容与邀请。",
        sub: "队长动作统一收口到个人页。",
        href: "/guide"
      }
    ]
  }
];

export const viewerProfiles = {
  visitor: {
    title: "先登录后继续",
    account: "未登录",
    summary: "你可以先浏览比赛、选手、战队和规则，登录后再完成认领、组队和邀请处理。"
  },
  user: {
    title: "已登录用户",
    account: "账号已创建",
    summary: "现在可以提交选手认领申请，审核进度会同步显示在认领历史里。"
  },
  player: {
    title: "认证选手",
    account: "已通过认领",
    summary: "你已经完成选手认领，可以查看战绩摘要、创建战队并管理自己的比赛身份。"
  },
  captain: {
    title: "队长",
    account: "已拥有队伍",
    summary: "现在可以邀请选手入队、约训练赛，并在队伍页集中处理阵容和重要操作。"
  }
} as const;

export const claimRecords: ClaimRecord[] = [
  {
    id: "CLAIM-240401",
    playerName: "南庭",
    scope: "pioneer",
    status: "approved",
    submittedAt: "2026-04-01 13:20",
    nextStep: "已通过，可进入我的页查看选手能力。",
    note: "已绑定 Steam 与近期比赛截图。"
  },
  {
    id: "CLAIM-240410",
    playerName: "陆岚",
    scope: "pioneer",
    status: "processing",
    submittedAt: "2026-04-10 22:05",
    nextStep: "等待管理员核验战绩截图与 Steam 绑定。",
    note: "建议补充近 30 天 OpenDota 报告。"
  },
  {
    id: "CLAIM-240328",
    playerName: "知更",
    scope: "legend",
    status: "rejected",
    submittedAt: "2026-03-28 17:48",
    nextStep: "补充队伍证明后重新提交。",
    note: "当前截图无法证明队长身份。"
  }
];

export const invitations: InvitationRecord[] = [
  {
    id: "INV-01",
    type: "team",
    title: "邀请加入余烬舰队",
    from: "南庭",
    status: "pending",
    summary: "希望你以四号位加入先锋杯阵容，周三晚统一试训。",
    cta: "接受入队"
  },
  {
    id: "INV-02",
    type: "scrim",
    title: "紫序公会训练赛邀请",
    from: "知更",
    status: "accepted",
    summary: "计划在周末安排一场传奇杯强度训练赛。",
    cta: "查看训练赛"
  },
  {
    id: "INV-03",
    type: "team",
    title: "邀请加入绯冠议会青训",
    from: "沉锋",
    status: "declined",
    summary: "冠绝杯青训轮换名单邀请，已被拒绝。",
    cta: "查看来源"
  }
];

export const ruleSections = [
  {
    id: "joining",
    title: "入群与语音",
    body:
      "先把名字和语音入口处理清楚，方便大家叫人、认人，也方便临时开黑和比赛集合。",
    items: [
      {
        title: "群昵称格式",
        meta: "进群后请把昵称改成“昵称 + Steam 游戏 ID”，便于组局、核对和后续认领。"
      },
      {
        title: "Kook 语音入口",
        meta: "Kook 服务器 ID 为 27119463；浏览器打开语音频道链接后，双击“公共”即可进入语音。"
      },
      {
        title: "新人可以直接问",
        meta: "不会切换东南亚或国服，不会进入 Kook，都可以在群里直接问，社区默认有人接你一把。"
      }
    ]
  },
  {
    id: "activities",
    title: "活动与参赛",
    body:
      "这里不只有正式比赛，也有固定对黑、临时接龙和娱乐房；规则页要先把社区怎么一起玩讲清楚。",
    items: [
      {
        title: "每周三晚对黑",
        meta: "固定在每周三晚 8 点开无分段限制对黑，默认洗牌，方便新人和老人都能上桌。"
      },
      {
        title: "每周五晚比赛",
        meta: "固定在每周五晚 9 点开比赛，常驻有先锋杯、传奇杯、冠绝杯三条线，整体以娱乐和稳定参与为主。"
      },
      {
        title: "随时组局与娱乐房",
        meta: "平时可以随时接龙对黑，也会开 ships 杯、震撼杯等娱乐房；发起人按当场情况选择模式和征召。"
      },
      {
        title: "固定队与资源支持",
        meta: "欢迎固定队建公会；需要公用 Steam 账号池时，可以联系啵酱该吃饭了协助处理。",
        sub: "当前社区已有 see！！、神仙、桂花树、我是天子、粉红绒绒兔 等固定队或公会名字。"
      }
    ]
  },
  {
    id: "order",
    title: "社区秩序",
    body:
      "社区默认是来一起玩，不是来互相上压力；底线和处罚需要在规则页写明。",
    items: [
      {
        title: "恶意吵架与恶意压力",
        meta: "对黑或开黑时出现恶意吵架、恶意压力，会被请出社区，不按“只是情绪上头”轻轻带过。"
      },
      {
        title: "观战与语音秩序",
        meta: "进入 Kook 语音频道观战时，不要讲话打扰场上选手，让比赛沟通保持清楚。"
      },
      {
        title: "互相理解",
        meta: "高手菜鸟都是人，男人女人都是人；开玩笑可以，但要注意分寸，不拿身份、水平和失误当持续消耗别人的理由。"
      },
      {
        title: "禁止事项",
        meta: "禁止违法，禁止广告；遇到恶意引战、骚扰或越界内容时，管理员会优先处理。"
      }
    ]
  },
  {
    id: "tips",
    title: "日常提醒",
    body:
      "群公告里那些看起来碎碎念的内容，其实是在保护大家的体验和安全感，规则页也要保留下来。",
    items: [
      {
        title: "叫人方式",
        meta: "群里平时会帮忙叫人并 @ 所有人；如果你怕吵，可以把群聊折叠，不影响继续参与。"
      },
      {
        title: "个人安全",
        meta: "人多手杂，出门在外注意保护自己；涉及个人隐私、线下接触和账号安全时，先保护自己再处理别的。"
      },
      {
        title: "社区文化",
        meta: "玩的开心比什么都重要，社区文化靠每个人一起维持。"
      }
    ]
  }
];

export const guideSteps = [
  {
    title: "创建账号",
    detail: "先完成基础注册，再进入我的页查看身份状态。"
  },
  {
    title: "绑定 Steam",
    detail: "提交 SteamID 与近期战绩，作为成为选手审核的基础证据。"
  },
  {
    title: "提交认领",
    detail: "在比赛或选手页发起成为选手申请，审核期间统一到认领历史查看进度。"
  },
  {
    title: "建立队伍或处理邀请",
    detail: "审核通过后可建队，也可在邀请收件箱处理入队和训练赛邀请。"
  }
];

export const guideFaq = [
  {
    q: "我还不是选手，能做什么？",
    a: "你可以浏览所有公开对象页，创建账号并发起成为选手申请。"
  },
  {
    q: "队长动作在哪里？",
    a: "邀请入队、邀请训练赛和解散队伍都在详情页右栏或我的队伍工作台中触发。"
  },
  {
    q: "为什么频道页不直接写表单？",
    a: "频道页先解决对象浏览与范围认知，操作流统一放到右栏动作和对应工作台。"
  }
];

export const adminMetrics = [
  { label: "待审认领", value: "12" },
  { label: "今日变更", value: "08" },
  { label: "高风险待办", value: "03" },
  { label: "当前赛季", value: "03" }
];

export const adminModules = [
  { title: "认领审核", href: "/admin/claims", summary: "先处理身份链路与证据不足项。" },
  { title: "选手维护", href: "/admin/players", summary: "焦点位、资格、队伍关系与展示顺序。" },
  { title: "战队维护", href: "/admin/teams", summary: "阵容、招募、训练赛入口与荣誉标识。" },
  { title: "比赛维护", href: "/admin/matches", summary: "比赛状态、比分和对阵图更新。" },
  { title: "赛季维护", href: "/admin/seasons", summary: "阶段、统计、冠军页与下一季 CTA。" },
  { title: "赛事维护", href: "/admin/tournaments", summary: "先锋杯、传奇杯、冠绝杯的入口与说明。" }
];

export function resolveScope(input?: string): Scope {
  return scopes.some((scope) => scope.value === input) ? (input as Scope) : "all";
}

export function resolveRole(input?: string): Role {
  return ["visitor", "user", "player", "captain"].includes(input ?? "")
    ? (input as Role)
    : "visitor";
}

export function resolveClaimState(input?: string): ClaimState {
  return input === "pending" ? "pending" : "open";
}

export function getScopeMeta(scope: Scope) {
  return scopes.find((item) => item.value === scope) ?? scopes[0];
}

export function getSeason(slug: string) {
  return seasons.find((item) => item.slug === slug);
}

export function getMatch(slug: string) {
  return matches.find((item) => item.slug === slug);
}

export function getPlayer(slug: string) {
  return players.find((item) => item.slug === slug);
}

export function getTeam(slug: string) {
  return teams.find((item) => item.slug === slug);
}

export function filterMatches(scope: Scope) {
  return scope === "all" ? matches : matches.filter((item) => item.scope === scope);
}

export function filterPlayers(scope: Scope) {
  return scope === "all"
    ? players
    : players.filter((item) => item.scopes.includes(scope as Exclude<Scope, "all">));
}

export function filterTeams(scope: Scope) {
  return scope === "all" ? teams : teams.filter((item) => item.scope === scope);
}

export function getSearchIndex() {
  return [
    ...matches.map((match) => ({
      title: match.name,
      href: `/matches/${match.slug}`,
      group: "比赛",
      meta: `${match.stage} · ${match.result}`
    })),
    ...seasons.map((season) => ({
      title: season.name,
      href: `/matches/seasons/${season.slug}`,
      group: "赛季",
      meta: `${season.phase} · ${season.format}`
    })),
    ...players.map((player) => ({
      title: player.name,
      href: `/players/${player.slug}`,
      group: "选手",
      meta: `${player.positions.join(" / ")} · ${player.opendota}`
    })),
    ...teams.map((team) => ({
      title: team.name,
      href: `/teams/${team.slug}`,
      group: "战队",
      meta: `${team.honor} · ${team.status}`
    })),
    { title: "社区文化", href: "/rules", group: "阅读", meta: "处罚、边界与社区安全" },
    { title: "新手指引", href: "/guide", group: "阅读", meta: "账号、认领与参赛流程" },
    { title: "我的主页", href: "/my", group: "操作", meta: "身份状态、队伍与邀请" }
  ];
}