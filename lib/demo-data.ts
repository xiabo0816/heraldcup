export const demoHomeData = {
  featuredSeason: {
    title: "第十一届先锋杯",
    subtitle: "今晚就来社区 · 先锋杯 / 冠绝杯",
    statusLabel: "总决赛周",
    summary: "社区赛事继续保留海报、赛程、冠军和战报的门面，同时补齐小后台、选手绑定和数据化管理。"
  },
  featuredMatch: {
    title: "第十一届先锋杯总决赛",
    format: "BO3",
    homeTeamName: "患者",
    awayTeamName: "今晚不加班",
    homeTeamSlogan: "绝活儿守高地",
    awayTeamSlogan: "兄弟们再冲一次"
  },
  metrics: [
    { label: "赛事系列", value: "2" },
    { label: "历史赛季", value: "10+" },
    { label: "社区战队", value: "20+" },
    { label: "Dota2 英雄库", value: "126" }
  ],
  priorities: [
    "今晚就来社区是前台门面，小后台只负责维护内容和赛程",
    "先锋杯与冠绝杯继续作为用户最关心的首页焦点",
    "选手资料不再只是文字，擅长英雄要对应 Dota2 英雄头像",
    "SteamID 绑定后仍由服务端生成 OpenDota 报告"
  ],
  adminSections: [
    { title: "选手管理", description: "维护 SteamID、位置、擅长英雄和高光比赛。" },
    { title: "队伍管理", description: "维护队长、教练、现役成员和赛季归属。" },
    { title: "比赛管理", description: "维护赛程、比分、解说入口与关联内容页。" },
    { title: "赛事管理", description: "维护赛事系列、届次、首页推荐和状态流转。" }
  ]
};

export const demoPlayers = [
  {
    id: "player-cook",
    displayName: "cook",
    slug: "cook",
    featured: true,
    primaryRole: "Carry",
    preferredRoles: ["1 号位", "2 号位"],
    heroPool: ["Juggernaut", "Slark", "Phantom Assassin"],
    ladderScore: 6820,
    gameYears: 9,
    playStyles: ["埋头猛冲的战斗狂人", "后期接管者"],
    highlightMatchIds: ["pioneer-cup-s11-final"],
    gameUnderstanding: "我喜欢把前中期每一波资源都变成推进窗口，打到能逼对手回防为止。",
    teamName: "患者"
  },
  {
    id: "player-koi",
    displayName: "koi",
    slug: "koi",
    featured: true,
    primaryRole: "Support",
    preferredRoles: ["4 号位", "5 号位"],
    heroPool: ["Rubick", "Lion", "Disruptor"],
    ladderScore: 5980,
    gameYears: 7,
    playStyles: ["视野调度者", "反手保护型辅助"],
    highlightMatchIds: ["pioneer-cup-s11-final"],
    gameUnderstanding: "比起单点操作，我更看重团战站位和技能交换，让核心能稳定打满输出。",
    teamName: "今晚不加班"
  }
];

export const demoPlayerReviews = [
  {
    id: "review-koi-to-cook",
    authorPlayerId: "player-koi",
    authorPlayerName: "koi",
    authorPlayerSlug: "koi",
    authorTeamName: "今晚不加班",
    targetPlayerId: "player-cook",
    targetPlayerName: "cook",
    targetPlayerSlug: "cook",
    content: "打团敢接、刷钱也稳，到了关键局总能把节奏重新拉回自己这边。",
    showOnProfile: true,
    createdAt: "2026-03-20T20:00:00.000Z"
  }
];

export const demoTeams = [
  {
    id: "team-patient",
    name: "患者",
    slug: "patient",
    slogan: "绝活儿守高地",
    captain: "cook",
    captainPlayerId: "player-cook",
    members: [{ id: "player-cook", displayName: "cook", slug: "cook" }]
  },
  {
    id: "team-no-overtime",
    name: "今晚不加班",
    slug: "no-overtime",
    slogan: "兄弟们再冲一次",
    captain: "koi",
    captainPlayerId: "player-koi",
    members: [{ id: "player-koi", displayName: "koi", slug: "koi" }]
  }
];

export const demoMatches = [
  {
    id: "match-s11-final",
    title: "第十一届先锋杯总决赛",
    slug: "pioneer-cup-s11-final",
    topicId: "topic-finals-watch",
    status: "SCHEDULED",
    format: "BO3",
    scoreHome: null,
    scoreAway: null,
    summary: "从旧海报迁移而来的默认总决赛数据。",
    homeTeamName: "患者",
    awayTeamName: "今晚不加班"
  }
];

export const demoContentPages = [
  {
    id: "content-s11-final-poster",
    title: "第十一届先锋杯总决赛海报",
    slug: "pioneer-cup-s11-final-poster",
    topicId: "topic-finals-watch",
    pageType: "poster",
    excerpt: "总决赛对阵海报与观赛信息。",
    body: "患者 vs 今晚不加班，BO3，总决赛之夜。",
    publishedAt: null,
    featured: true,
    matchSlug: "pioneer-cup-s11-final"
  }
];

export const demoAnnouncements = [
  {
    id: "announcement-s11-finals",
    title: "第十一届先锋杯总决赛今晚开打",
    slug: "pioneer-cup-s11-finals-tonight",
    excerpt: "今晚主赛、赛后战报和社区讨论都会围绕总决赛展开。",
    body: "总决赛将于今晚开始，首页、比赛页和社区页会同步更新赛程与赛后内容。",
    publishedAt: null,
    featured: true
  }
];

export const demoCommunityTopics = [
  {
    id: "topic-finals-watch",
    title: "今晚焦点",
    slug: "tonight-focus",
    description: "今晚最值得看的比赛、阵容和赛后复盘都挂在这里。",
    activityNote: "总决赛周",
    featured: true
  },
  {
    id: "topic-champion-talk",
    title: "冠军讨论",
    slug: "champion-talk",
    description: "谁最可能夺冠、哪场比赛最值得回看。",
    activityNote: "热门",
    featured: true
  },
  {
    id: "topic-team-recruitment",
    title: "战队招募",
    slug: "team-recruitment",
    description: "需要补位、组队和找固定班底的内容优先聚合在这里。",
    activityNote: "长期开放",
    featured: false
  }
];

export const demoRecruitmentPosts = [
  {
    id: "recruitment-patient-support",
    title: "患者招募 4/5 号位补位",
    slug: "patient-support-recruitment",
    topicId: "topic-team-recruitment",
    teamName: "患者",
    contact: "站内联系管理员",
    neededRoles: ["Support", "Hard Support"],
    status: "OPEN",
    excerpt: "固定训练时间优先，欢迎会沟通的辅助位来聊。",
    featured: true
  }
];

export const demoCommunityEvents = [
  {
    id: "event-finals-watch-party",
    title: "总决赛观赛夜",
    slug: "s11-finals-watch-party",
    topicId: "topic-finals-watch",
    summary: "围绕总决赛组织观赛、预测和赛后复盘，活动入口先集中放在这里。",
    body: "今晚 8 点开始总决赛观赛夜，观赛、预测和赛后复盘会统一回到社区页和话题页。",
    startsAt: null,
    endsAt: null,
    location: "社区首页 / 话题页",
    status: "UPCOMING",
    ctaLabel: "进入今晚焦点",
    ctaHref: "/community/topics/tonight-focus",
    featured: true
  }
];
