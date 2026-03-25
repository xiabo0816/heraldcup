import { MatchParticipantResult, MatchStageType, MatchStatus, PrismaClient, TournamentKind } from "@prisma/client";
import {
  ensureSeasonTeams,
  inferBestOf,
  upsertMatchStage,
  upsertStructuredMatch
} from "./match-structure";

const prisma = new PrismaClient();

async function main() {
  const tournament = await prisma.tournament.upsert({
    where: { slug: "pioneer-cup" },
    update: {},
    create: {
      name: "先锋杯",
      slug: "pioneer-cup",
      kind: TournamentKind.PIONEER,
      description: "今晚就来社区的赛季制 Dota2 赛事。"
    }
  });

  const season = await prisma.tournamentSeason.upsert({
    where: { slug: "pioneer-cup-s11" },
    update: {},
    create: {
      tournamentId: tournament.id,
      title: "第十一届先锋杯",
      slug: "pioneer-cup-s11",
      seasonNumber: 11,
      statusLabel: "总决赛周",
      themeColor: "cyan",
      featured: true,
      summary: "新系统的默认示例赛季。"
    }
  });

  const players = await Promise.all([
    prisma.player.upsert({
      where: { slug: "cook" },
      update: {},
      create: {
        displayName: "cook",
        slug: "cook",
        primaryRole: "Carry",
        heroPool: ["Juggernaut", "Slark", "Phantom Assassin"],
        highlightMatchIds: ["pioneer-cup-s11-final"],
        bio: "高光时刻交给比赛，信息维护交给系统。"
      }
    }),
    prisma.player.upsert({
      where: { slug: "koi" },
      update: {},
      create: {
        displayName: "koi",
        slug: "koi",
        primaryRole: "Support",
        heroPool: ["Rubick", "Lion", "Disruptor"],
        highlightMatchIds: ["pioneer-cup-s11-final"],
        bio: "示例选手，用于后台与 OpenDota 绑定流程演示。"
      }
    })
  ]);

  const teamA = await prisma.team.upsert({
    where: { slug: "patient" },
    update: {},
    create: {
      name: "患者",
      slug: "patient",
      slogan: "绝活儿守高地",
      coach: "荒 / 辉夜",
      captain: "cook",
      summary: "当前示例队伍 A。"
    }
  });

  const teamB = await prisma.team.upsert({
    where: { slug: "no-overtime" },
    update: {},
    create: {
      name: "今晚不加班",
      slug: "no-overtime",
      slogan: "兄弟们再冲一次",
      coach: "koi",
      captain: "koi",
      summary: "当前示例队伍 B。"
    }
  });

  await prisma.teamMember.upsert({
    where: {
      teamId_playerId_isCurrent: {
        teamId: teamA.id,
        playerId: players[0].id,
        isCurrent: true
      }
    },
    update: {},
    create: {
      teamId: teamA.id,
      playerId: players[0].id,
      inGameRole: "Carry",
      isCurrent: true
    }
  });

  const seasonTeamIds = await ensureSeasonTeams(prisma, season.id, [teamA, teamB]);

  await prisma.teamMember.upsert({
    where: {
      teamId_playerId_isCurrent: {
        teamId: teamB.id,
        playerId: players[1].id,
        isCurrent: true
      }
    },
    update: {},
    create: {
      teamId: teamB.id,
      playerId: players[1].id,
      inGameRole: "Coach / Support",
      isCurrent: true
    }
  });

  await prisma.announcement.upsert({
    where: { slug: "pioneer-cup-s11-finals-tonight" },
    update: {},
    create: {
      title: "第十一届先锋杯总决赛今晚开打",
      slug: "pioneer-cup-s11-finals-tonight",
      excerpt: "今晚主赛、赛后战报和社区讨论都会围绕总决赛展开。",
      body: {
        content: "总决赛将于今晚开始，首页、比赛页和社区页会同步更新赛程、结果与赛后内容。"
      },
      featured: true
    }
  });

  const [tonightFocusTopic, , teamRecruitmentTopic] = await Promise.all([
    prisma.communityTopic.upsert({
      where: { slug: "tonight-focus" },
      update: {},
      create: {
        title: "今晚焦点",
        slug: "tonight-focus",
        description: "今晚最值得看的比赛、阵容和赛后复盘都会聚到这里。",
        activityNote: "总决赛周",
        featured: true
      }
    }),
    prisma.communityTopic.upsert({
      where: { slug: "champion-talk" },
      update: {},
      create: {
        title: "冠军讨论",
        slug: "champion-talk",
        description: "谁最可能夺冠，哪场比赛最值得回看。",
        activityNote: "热门",
        featured: true
      }
    }),
    prisma.communityTopic.upsert({
      where: { slug: "team-recruitment" },
      update: {},
      create: {
        title: "战队招募",
        slug: "team-recruitment",
        description: "需要补位、找队、找固定搭子的内容优先聚合在这里。",
        activityNote: "长期开放",
        featured: false
      }
    })
  ]);

  const finalStage = await upsertMatchStage(prisma, {
    seasonId: season.id,
    name: "总决赛",
    slug: "final",
    stageType: MatchStageType.FINAL,
    sortOrder: 10,
    bestOf: 3,
    advanceRule: "两支队伍直接进行 BO3"
  });

  const match = await upsertStructuredMatch(prisma, {
    seasonId: season.id,
    stageId: finalStage.id,
    topicId: tonightFocusTopic.id,
    title: "第十一届先锋杯总决赛",
    slug: "pioneer-cup-s11-final",
    format: "BO3",
    bestOf: inferBestOf("BO3"),
    status: MatchStatus.SCHEDULED,
    summary: "从旧海报迁移而来的默认总决赛数据。",
    participants: [
      {
        teamId: teamA.id,
        seasonTeamId: seasonTeamIds.get(teamA.id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        result: MatchParticipantResult.PENDING
      },
      {
        teamId: teamB.id,
        seasonTeamId: seasonTeamIds.get(teamB.id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        result: MatchParticipantResult.PENDING
      }
    ]
  });

  await prisma.contentPage.upsert({
    where: { slug: "pioneer-cup-s11-final-poster" },
    update: {
      topicId: tonightFocusTopic.id,
      matchId: match.id,
      pageType: "poster",
      excerpt: "总决赛对阵海报与观赛信息。",
      body: {
        content: "患者 vs 今晚不加班，BO3，总决赛之夜。"
      },
      featured: true
    },
    create: {
      title: "第十一届先锋杯总决赛海报",
      slug: "pioneer-cup-s11-final-poster",
      pageType: "poster",
      excerpt: "总决赛对阵海报与观赛信息。",
      body: {
        content: "患者 vs 今晚不加班，BO3，总决赛之夜。"
      },
      featured: true,
      matchId: match.id,
      topicId: tonightFocusTopic.id
    }
  });

  await prisma.recruitmentPost.upsert({
    where: { slug: "patient-support-recruitment" },
    update: {
      topicId: teamRecruitmentTopic.id
    },
    create: {
      title: "患者招募 4/5 号位补位",
      slug: "patient-support-recruitment",
      topicId: teamRecruitmentTopic.id,
      teamName: teamA.name,
      contact: "站内联系管理员",
      neededRoles: ["Support", "Hard Support"],
      status: "OPEN",
      excerpt: "固定训练时间优先，欢迎会沟通的辅助位来聊。",
      featured: true
    }
  });

  await prisma.communityEvent.upsert({
    where: { slug: "s11-finals-watch-party" },
    update: {
      topicId: tonightFocusTopic.id,
      summary: "围绕总决赛组织观赛、预测和赛后复盘，活动入口先集中放在这里。",
      body: {
        content: "今晚 8 点开始总决赛观赛夜，观赛、预测和赛后复盘会统一回到社区页和话题页。"
      },
      location: "社区首页 / 话题页",
      status: "UPCOMING",
      ctaLabel: "进入今晚焦点",
      ctaHref: "/community/topics/tonight-focus",
      featured: true
    },
    create: {
      title: "总决赛观赛夜",
      slug: "s11-finals-watch-party",
      topicId: tonightFocusTopic.id,
      summary: "围绕总决赛组织观赛、预测和赛后复盘，活动入口先集中放在这里。",
      body: {
        content: "今晚 8 点开始总决赛观赛夜，观赛、预测和赛后复盘会统一回到社区页和话题页。"
      },
      location: "社区首页 / 话题页",
      status: "UPCOMING",
      ctaLabel: "进入今晚焦点",
      ctaHref: "/community/topics/tonight-focus",
      featured: true
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
