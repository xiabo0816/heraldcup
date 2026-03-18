export const historicalTournamentData = [
  {
    tournament: {
      name: "先锋杯",
      slug: "pioneer-cup",
      kind: "PIONEER",
      description: "今晚就来社区的赛季制 Dota2 赛事。"
    },
    seasons: [
      {
        title: "第八届先锋杯",
        slug: "pioneer-cup-s8",
        seasonNumber: 8,
        statusLabel: "已完赛",
        themeColor: "emerald",
        summary: "历史赛季初始化样例，可继续扩展导入更多往届数据。",
        teams: [
          {
            name: "患者",
            slug: "patient-s8",
            slogan: "绝活儿守高地"
          },
          {
            name: "花开富贵",
            slug: "prosperity-s8",
            slogan: "稳住阵脚，后程发力"
          }
        ],
        matches: [
          {
            title: "第八届先锋杯决赛",
            slug: "pioneer-cup-s8-final",
            format: "BO3",
            status: "FINISHED",
            homeTeamSlug: "patient-s8",
            awayTeamSlug: "prosperity-s8",
            scoreHome: 2,
            scoreAway: 1,
            summary: "历史决赛样例数据。"
          }
        ]
      }
    ]
  }
] as const;
