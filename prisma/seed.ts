import { PrismaClient, TournamentKind, MatchStatus } from "@prisma/client";

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
      seasonId: season.id,
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
      seasonId: season.id,
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

  await prisma.match.upsert({
    where: { slug: "pioneer-cup-s11-final" },
    update: {},
    create: {
      seasonId: season.id,
      title: "第十一届先锋杯总决赛",
      slug: "pioneer-cup-s11-final",
      format: "BO3",
      status: MatchStatus.SCHEDULED,
      homeTeamId: teamA.id,
      awayTeamId: teamB.id,
      summary: "从旧海报迁移而来的默认总决赛数据。"
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
