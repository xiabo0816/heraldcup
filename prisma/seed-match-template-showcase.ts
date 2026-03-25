import {
  MatchParticipantResult,
  MatchStageType,
  MatchStatus,
  PrismaClient,
  TournamentKind
} from "@prisma/client";
import { ensureSeasonTeams, upsertMatchStage, upsertStructuredMatch } from "./match-structure";

const prisma = new PrismaClient();

type DemoTeamSpec = {
  slug: string;
  name: string;
  slogan: string;
  coach: string;
  captain: string;
  summary: string;
  playerSlug: string;
  playerName: string;
  primaryRole: string;
};

type DemoTeamMap = Record<string, Awaited<ReturnType<typeof upsertDemoTeam>>>;

const demoTeamSpecs: DemoTeamSpec[] = [
  {
    slug: "template-bo3-north-harbor",
    name: "北港夜航",
    slogan: "控好肉山再接正面",
    coach: "周策",
    captain: "岚舟",
    summary: "两队 BO3 演示里的 1 号种子，主打稳线与后期团战。",
    playerSlug: "template-player-lanzhou",
    playerName: "岚舟",
    primaryRole: "Carry"
  },
  {
    slug: "template-bo3-silver-station",
    name: "银轨月台",
    slogan: "先抢节奏点",
    coach: "叶直",
    captain: "迟星",
    summary: "两队 BO3 演示里的 2 号种子，强调十分钟后的连续进攻。",
    playerSlug: "template-player-chixing",
    playerName: "迟星",
    primaryRole: "Mid"
  },
  {
    slug: "template-gauntlet-guardian",
    name: "守擂人",
    slogan: "擂台在这，不服来战",
    coach: "顾衡",
    captain: "顾衡",
    summary: "三队擂台演示中的 1 号种子，直接守擂等待预选胜者。",
    playerSlug: "template-player-guheng",
    playerName: "顾衡",
    primaryRole: "Offlane"
  },
  {
    slug: "template-gauntlet-southwind",
    name: "南风三连",
    slogan: "赢一轮再赢一轮",
    coach: "林澈",
    captain: "林澈",
    summary: "三队擂台演示中的 2 号种子，先从预选打起。",
    playerSlug: "template-player-linche",
    playerName: "林澈",
    primaryRole: "Support"
  },
  {
    slug: "template-gauntlet-hammer",
    name: "重锤试炼",
    slogan: "先把第一轮打穿",
    coach: "岳沉",
    captain: "岳沉",
    summary: "三队擂台演示中的 3 号种子，负责承接预选对局。",
    playerSlug: "template-player-yuechen",
    playerName: "岳沉",
    primaryRole: "Carry"
  },
  {
    slug: "template-four-fogport",
    name: "雾港一队",
    slogan: "一号种子不让位",
    coach: "唐屿",
    captain: "唐屿",
    summary: "四队淘汰赛演示中的 1 号种子。",
    playerSlug: "template-player-tangyu",
    playerName: "唐屿",
    primaryRole: "Carry"
  },
  {
    slug: "template-four-crimson",
    name: "赤潮二队",
    slogan: "二号种子压前期",
    coach: "沈烈",
    captain: "沈烈",
    summary: "四队淘汰赛演示中的 2 号种子。",
    playerSlug: "template-player-shenlie",
    playerName: "沈烈",
    primaryRole: "Mid"
  },
  {
    slug: "template-four-reef",
    name: "远礁三队",
    slogan: "拉满换线博弈",
    coach: "顾川",
    captain: "顾川",
    summary: "四队淘汰赛演示中的 3 号种子。",
    playerSlug: "template-player-guchuan",
    playerName: "顾川",
    primaryRole: "Support"
  },
  {
    slug: "template-four-deepforest",
    name: "深林四队",
    slogan: "四号种子也能冲线",
    coach: "陆森",
    captain: "陆森",
    summary: "四队淘汰赛演示中的 4 号种子。",
    playerSlug: "template-player-lusen",
    playerName: "陆森",
    primaryRole: "Offlane"
  }
];

async function upsertDemoTeam(spec: DemoTeamSpec) {
  const player = await prisma.player.upsert({
    where: { slug: spec.playerSlug },
    update: {
      displayName: spec.playerName,
      primaryRole: spec.primaryRole,
      active: true
    },
    create: {
      displayName: spec.playerName,
      slug: spec.playerSlug,
      primaryRole: spec.primaryRole,
      heroPool: [],
      highlightMatchIds: [],
      active: true,
      bio: `${spec.name} 的模板演示选手。`
    }
  });

  const team = await prisma.team.upsert({
    where: { slug: spec.slug },
    update: {
      name: spec.name,
      slogan: spec.slogan,
      coach: spec.coach,
      captain: spec.captain,
      summary: spec.summary
    },
    create: {
      name: spec.name,
      slug: spec.slug,
      slogan: spec.slogan,
      coach: spec.coach,
      captain: spec.captain,
      summary: spec.summary
    }
  });

  await prisma.teamMember.upsert({
    where: {
      teamId_playerId_isCurrent: {
        teamId: team.id,
        playerId: player.id,
        isCurrent: true
      }
    },
    update: {
      inGameRole: spec.primaryRole
    },
    create: {
      teamId: team.id,
      playerId: player.id,
      inGameRole: spec.primaryRole,
      isCurrent: true
    }
  });

  return team;
}

function finishedGameParticipants(teamAId: string, teamBId: string, winnerTeamId: string) {
  return [
    {
      teamId: teamAId,
      slotNumber: 1,
      sideLabel: "A",
      score: winnerTeamId === teamAId ? 1 : 0,
      rank: winnerTeamId === teamAId ? 1 : 2,
      result: winnerTeamId === teamAId ? MatchParticipantResult.WIN : MatchParticipantResult.LOSS
    },
    {
      teamId: teamBId,
      slotNumber: 2,
      sideLabel: "B",
      score: winnerTeamId === teamBId ? 1 : 0,
      rank: winnerTeamId === teamBId ? 1 : 2,
      result: winnerTeamId === teamBId ? MatchParticipantResult.WIN : MatchParticipantResult.LOSS
    }
  ];
}

function pendingGameParticipants(teamAId: string, teamBId: string) {
  return [
    {
      teamId: teamAId,
      slotNumber: 1,
      sideLabel: "A",
      score: null,
      rank: null,
      result: MatchParticipantResult.PENDING
    },
    {
      teamId: teamBId,
      slotNumber: 2,
      sideLabel: "B",
      score: null,
      rank: null,
      result: MatchParticipantResult.PENDING
    }
  ];
}

async function seedSeasonEntries(seasonId: string, teamIds: string[]) {
  const seasonTeamIds = await ensureSeasonTeams(prisma, seasonId, teamIds.map((id) => ({ id })));

  await Promise.all(
    teamIds.map((teamId, index) =>
      prisma.seasonTeam.update({
        where: {
          seasonId_teamId: {
            seasonId,
            teamId
          }
        },
        data: {
          seedNumber: index + 1,
          finalRank: null,
          wins: 0,
          losses: 0,
          draws: 0,
          note: null
        }
      })
    )
  );

  return seasonTeamIds;
}

async function updateSeasonEntry(seasonId: string, teamId: string, data: { finalRank?: number | null; wins?: number; losses?: number; note?: string | null }) {
  await prisma.seasonTeam.update({
    where: {
      seasonId_teamId: {
        seasonId,
        teamId
      }
    },
    data
  });
}

async function main() {
  const tournament = await prisma.tournament.upsert({
    where: { slug: "schedule-template-showcase" },
    update: {
      name: "赛程模板演示赛",
      kind: TournamentKind.CUSTOM,
      description: "用于后台模板生成、赛程图和比赛详情页演示的独立样例数据。"
    },
    create: {
      name: "赛程模板演示赛",
      slug: "schedule-template-showcase",
      kind: TournamentKind.CUSTOM,
      description: "用于后台模板生成、赛程图和比赛详情页演示的独立样例数据。"
    }
  });

  const topic = await prisma.communityTopic.upsert({
    where: { slug: "schedule-template-showcase" },
    update: {
      title: "赛程模板演示",
      description: "集中展示两队 BO3、三队擂台和四队淘汰赛三种模板结构。"
    },
    create: {
      title: "赛程模板演示",
      slug: "schedule-template-showcase",
      description: "集中展示两队 BO3、三队擂台和四队淘汰赛三种模板结构。",
      activityNote: "仅作演示",
      featured: false
    }
  });

  const teams = {} as DemoTeamMap;
  for (const spec of demoTeamSpecs) {
    teams[spec.slug] = await upsertDemoTeam(spec);
  }

  const bo3Season = await prisma.tournamentSeason.upsert({
    where: { slug: "template-showcase-bo3" },
    update: {
      title: "模板演示 · 两队 BO3",
      seasonNumber: 1,
      statusLabel: "已完赛演示",
      themeColor: "amber",
      summary: "两支队伍直接进入 BO3 总决赛，用于展示最简单的系列赛结构。"
    },
    create: {
      tournamentId: tournament.id,
      title: "模板演示 · 两队 BO3",
      slug: "template-showcase-bo3",
      seasonNumber: 1,
      statusLabel: "已完赛演示",
      themeColor: "amber",
      summary: "两支队伍直接进入 BO3 总决赛，用于展示最简单的系列赛结构。"
    }
  });

  const gauntletSeason = await prisma.tournamentSeason.upsert({
    where: { slug: "template-showcase-gauntlet" },
    update: {
      title: "模板演示 · 三队擂台",
      seasonNumber: 2,
      statusLabel: "预选已打完",
      themeColor: "cyan",
      summary: "1 号种子守擂，2/3 号种子先打预选，胜者再上擂台。"
    },
    create: {
      tournamentId: tournament.id,
      title: "模板演示 · 三队擂台",
      slug: "template-showcase-gauntlet",
      seasonNumber: 2,
      statusLabel: "预选已打完",
      themeColor: "cyan",
      summary: "1 号种子守擂，2/3 号种子先打预选，胜者再上擂台。"
    }
  });

  const finalFourSeason = await prisma.tournamentSeason.upsert({
    where: { slug: "template-showcase-final-four" },
    update: {
      title: "模板演示 · 四队淘汰赛",
      seasonNumber: 3,
      statusLabel: "总决赛进行中",
      themeColor: "violet",
      summary: "四强默认按 1 对 4、2 对 3 生成半决赛，双胜者会师总决赛。"
    },
    create: {
      tournamentId: tournament.id,
      title: "模板演示 · 四队淘汰赛",
      slug: "template-showcase-final-four",
      seasonNumber: 3,
      statusLabel: "总决赛进行中",
      themeColor: "violet",
      summary: "四强默认按 1 对 4、2 对 3 生成半决赛，双胜者会师总决赛。"
    }
  });

  const bo3TeamIds = [teams["template-bo3-north-harbor"].id, teams["template-bo3-silver-station"].id];
  const gauntletTeamIds = [teams["template-gauntlet-guardian"].id, teams["template-gauntlet-southwind"].id, teams["template-gauntlet-hammer"].id];
  const finalFourTeamIds = [
    teams["template-four-fogport"].id,
    teams["template-four-crimson"].id,
    teams["template-four-reef"].id,
    teams["template-four-deepforest"].id
  ];

  const bo3SeasonTeams = await seedSeasonEntries(bo3Season.id, bo3TeamIds);
  const gauntletSeasonTeams = await seedSeasonEntries(gauntletSeason.id, gauntletTeamIds);
  const finalFourSeasonTeams = await seedSeasonEntries(finalFourSeason.id, finalFourTeamIds);

  const bo3FinalStage = await upsertMatchStage(prisma, {
    seasonId: bo3Season.id,
    name: "总决赛",
    slug: "final",
    stageType: MatchStageType.FINAL,
    sortOrder: 10,
    bestOf: 3,
    advanceRule: "两支队伍直接进行 BO3"
  });

  await upsertStructuredMatch(prisma, {
    seasonId: bo3Season.id,
    stageId: bo3FinalStage.id,
    topicId: topic.id,
    title: "模板演示 · 两队 BO3 总决赛",
    slug: "template-showcase-bo3-final",
    scheduledAt: new Date("2026-03-18T12:30:00.000Z"),
    format: "BO3",
    bestOf: 3,
    roundNumber: 1,
    sequenceNumber: 1,
    status: MatchStatus.FINISHED,
    summary: "北港夜航与银轨月台直接进入 BO3 总决赛，最终由 1 号种子 2 比 1 拿下系列赛。",
    winnerTeamId: teams["template-bo3-north-harbor"].id,
    participants: [
      {
        teamId: teams["template-bo3-north-harbor"].id,
        seasonTeamId: bo3SeasonTeams.get(teams["template-bo3-north-harbor"].id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        score: 2,
        rank: 1,
        result: MatchParticipantResult.WIN,
        isWinner: true,
        note: "1 号种子"
      },
      {
        teamId: teams["template-bo3-silver-station"].id,
        seasonTeamId: bo3SeasonTeams.get(teams["template-bo3-silver-station"].id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        score: 1,
        rank: 2,
        result: MatchParticipantResult.LOSS,
        isWinner: false,
        note: "2 号种子"
      }
    ],
    games: [
      {
        gameNumber: 1,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-bo3-north-harbor"].id,
        summary: "第 1 局由北港夜航先下一城。",
        participants: finishedGameParticipants(teams["template-bo3-north-harbor"].id, teams["template-bo3-silver-station"].id, teams["template-bo3-north-harbor"].id)
      },
      {
        gameNumber: 2,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-bo3-silver-station"].id,
        summary: "第 2 局银轨月台扳平比分。",
        participants: finishedGameParticipants(teams["template-bo3-north-harbor"].id, teams["template-bo3-silver-station"].id, teams["template-bo3-silver-station"].id)
      },
      {
        gameNumber: 3,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-bo3-north-harbor"].id,
        summary: "决胜局北港夜航收下系列赛。",
        participants: finishedGameParticipants(teams["template-bo3-north-harbor"].id, teams["template-bo3-silver-station"].id, teams["template-bo3-north-harbor"].id)
      }
    ]
  });

  await updateSeasonEntry(bo3Season.id, teams["template-bo3-north-harbor"].id, { finalRank: 1, wins: 1, losses: 0, note: "冠军" });
  await updateSeasonEntry(bo3Season.id, teams["template-bo3-silver-station"].id, { finalRank: 2, wins: 0, losses: 1, note: "亚军" });

  const gauntletStage = await upsertMatchStage(prisma, {
    seasonId: gauntletSeason.id,
    name: "擂台赛",
    slug: "gauntlet",
    stageType: MatchStageType.BRACKET,
    sortOrder: 20,
    bestOf: 3,
    advanceRule: "预选胜者挑战擂主"
  });

  await upsertStructuredMatch(prisma, {
    seasonId: gauntletSeason.id,
    stageId: gauntletStage.id,
    topicId: topic.id,
    title: "模板演示 · 擂台预选",
    slug: "template-showcase-gauntlet-qualifier",
    scheduledAt: new Date("2026-03-20T11:00:00.000Z"),
    format: "BO3",
    bestOf: 3,
    roundNumber: 1,
    sequenceNumber: 1,
    status: MatchStatus.FINISHED,
    summary: "南风三连与重锤试炼先打一场预选，胜者再去挑战守擂人。",
    winnerTeamId: teams["template-gauntlet-southwind"].id,
    participants: [
      {
        teamId: teams["template-gauntlet-southwind"].id,
        seasonTeamId: gauntletSeasonTeams.get(teams["template-gauntlet-southwind"].id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        score: 2,
        rank: 1,
        result: MatchParticipantResult.WIN,
        isWinner: true,
        note: "2 号种子"
      },
      {
        teamId: teams["template-gauntlet-hammer"].id,
        seasonTeamId: gauntletSeasonTeams.get(teams["template-gauntlet-hammer"].id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        score: 1,
        rank: 2,
        result: MatchParticipantResult.LOSS,
        isWinner: false,
        isEliminated: true,
        note: "3 号种子"
      }
    ],
    games: [
      {
        gameNumber: 1,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-gauntlet-southwind"].id,
        summary: "南风三连先拿第 1 局。",
        participants: finishedGameParticipants(teams["template-gauntlet-southwind"].id, teams["template-gauntlet-hammer"].id, teams["template-gauntlet-southwind"].id)
      },
      {
        gameNumber: 2,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-gauntlet-hammer"].id,
        summary: "重锤试炼追回一局。",
        participants: finishedGameParticipants(teams["template-gauntlet-southwind"].id, teams["template-gauntlet-hammer"].id, teams["template-gauntlet-hammer"].id)
      },
      {
        gameNumber: 3,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-gauntlet-southwind"].id,
        summary: "决胜局由南风三连拿下，获得挑战权。",
        participants: finishedGameParticipants(teams["template-gauntlet-southwind"].id, teams["template-gauntlet-hammer"].id, teams["template-gauntlet-southwind"].id)
      }
    ]
  });

  await upsertStructuredMatch(prisma, {
    seasonId: gauntletSeason.id,
    stageId: gauntletStage.id,
    topicId: topic.id,
    title: "模板演示 · 擂主战",
    slug: "template-showcase-gauntlet-final",
    scheduledAt: new Date("2026-03-22T12:00:00.000Z"),
    format: "BO3",
    bestOf: 3,
    roundNumber: 2,
    sequenceNumber: 2,
    status: MatchStatus.SCHEDULED,
    summary: "守擂人作为 1 号种子守擂，等待南风三连上台挑战。",
    participants: [
      {
        teamId: teams["template-gauntlet-guardian"].id,
        seasonTeamId: gauntletSeasonTeams.get(teams["template-gauntlet-guardian"].id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        result: MatchParticipantResult.PENDING,
        note: "1 号种子 / 擂主"
      },
      {
        teamId: teams["template-gauntlet-southwind"].id,
        seasonTeamId: gauntletSeasonTeams.get(teams["template-gauntlet-southwind"].id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        result: MatchParticipantResult.PENDING,
        note: "预选胜者"
      }
    ],
    games: [1, 2, 3].map((gameNumber) => ({
      gameNumber,
      status: MatchStatus.SCHEDULED,
      summary: `第 ${gameNumber} 局待开赛。`,
      participants: pendingGameParticipants(teams["template-gauntlet-guardian"].id, teams["template-gauntlet-southwind"].id)
    }))
  });

  await updateSeasonEntry(gauntletSeason.id, teams["template-gauntlet-southwind"].id, { wins: 1, losses: 0, note: "预选胜者" });
  await updateSeasonEntry(gauntletSeason.id, teams["template-gauntlet-hammer"].id, { wins: 0, losses: 1, finalRank: 3, note: "预选出局" });

  const semifinalStage = await upsertMatchStage(prisma, {
    seasonId: finalFourSeason.id,
    name: "半决赛",
    slug: "semifinal",
    stageType: MatchStageType.BRACKET,
    sortOrder: 20,
    bestOf: 3,
    advanceRule: "两场半决赛胜者晋级总决赛"
  });
  const finalStage = await upsertMatchStage(prisma, {
    seasonId: finalFourSeason.id,
    name: "总决赛",
    slug: "final",
    stageType: MatchStageType.FINAL,
    sortOrder: 30,
    bestOf: 3,
    advanceRule: "半决赛胜者争冠"
  });

  await upsertStructuredMatch(prisma, {
    seasonId: finalFourSeason.id,
    stageId: semifinalStage.id,
    topicId: topic.id,
    title: "模板演示 · 半决赛 1",
    slug: "template-showcase-final-four-semifinal-1",
    scheduledAt: new Date("2026-03-24T11:00:00.000Z"),
    format: "BO3",
    bestOf: 3,
    roundNumber: 1,
    sequenceNumber: 1,
    status: MatchStatus.FINISHED,
    summary: "雾港一队对阵深林四队，胜者进入总决赛席位 A。",
    winnerTeamId: teams["template-four-fogport"].id,
    participants: [
      {
        teamId: teams["template-four-fogport"].id,
        seasonTeamId: finalFourSeasonTeams.get(teams["template-four-fogport"].id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        score: 2,
        rank: 1,
        result: MatchParticipantResult.WIN,
        isWinner: true,
        isAdvanced: true,
        note: "1 号种子"
      },
      {
        teamId: teams["template-four-deepforest"].id,
        seasonTeamId: finalFourSeasonTeams.get(teams["template-four-deepforest"].id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        score: 0,
        rank: 2,
        result: MatchParticipantResult.LOSS,
        isWinner: false,
        isEliminated: true,
        note: "4 号种子"
      }
    ],
    games: [
      {
        gameNumber: 1,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-fogport"].id,
        summary: "雾港一队先拿首局。",
        participants: finishedGameParticipants(teams["template-four-fogport"].id, teams["template-four-deepforest"].id, teams["template-four-fogport"].id)
      },
      {
        gameNumber: 2,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-fogport"].id,
        summary: "雾港一队 2 比 0 结束系列赛。",
        participants: finishedGameParticipants(teams["template-four-fogport"].id, teams["template-four-deepforest"].id, teams["template-four-fogport"].id)
      }
    ]
  });

  await upsertStructuredMatch(prisma, {
    seasonId: finalFourSeason.id,
    stageId: semifinalStage.id,
    topicId: topic.id,
    title: "模板演示 · 半决赛 2",
    slug: "template-showcase-final-four-semifinal-2",
    scheduledAt: new Date("2026-03-24T13:30:00.000Z"),
    format: "BO3",
    bestOf: 3,
    roundNumber: 1,
    sequenceNumber: 2,
    status: MatchStatus.FINISHED,
    summary: "赤潮二队对阵远礁三队，胜者进入总决赛席位 B。",
    winnerTeamId: teams["template-four-crimson"].id,
    participants: [
      {
        teamId: teams["template-four-crimson"].id,
        seasonTeamId: finalFourSeasonTeams.get(teams["template-four-crimson"].id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        score: 2,
        rank: 1,
        result: MatchParticipantResult.WIN,
        isWinner: true,
        isAdvanced: true,
        note: "2 号种子"
      },
      {
        teamId: teams["template-four-reef"].id,
        seasonTeamId: finalFourSeasonTeams.get(teams["template-four-reef"].id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        score: 1,
        rank: 2,
        result: MatchParticipantResult.LOSS,
        isWinner: false,
        isEliminated: true,
        note: "3 号种子"
      }
    ],
    games: [
      {
        gameNumber: 1,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-crimson"].id,
        summary: "赤潮二队先下一局。",
        participants: finishedGameParticipants(teams["template-four-crimson"].id, teams["template-four-reef"].id, teams["template-four-crimson"].id)
      },
      {
        gameNumber: 2,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-reef"].id,
        summary: "远礁三队把比分拖回 1 比 1。",
        participants: finishedGameParticipants(teams["template-four-crimson"].id, teams["template-four-reef"].id, teams["template-four-reef"].id)
      },
      {
        gameNumber: 3,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-crimson"].id,
        summary: "决胜局由赤潮二队收下总决赛门票。",
        participants: finishedGameParticipants(teams["template-four-crimson"].id, teams["template-four-reef"].id, teams["template-four-crimson"].id)
      }
    ]
  });

  await upsertStructuredMatch(prisma, {
    seasonId: finalFourSeason.id,
    stageId: finalStage.id,
    topicId: topic.id,
    title: "模板演示 · 总决赛",
    slug: "template-showcase-final-four-final",
    scheduledAt: new Date("2026-03-25T12:00:00.000Z"),
    format: "BO3",
    bestOf: 3,
    roundNumber: 2,
    sequenceNumber: 1,
    status: MatchStatus.LIVE,
    summary: "雾港一队与赤潮二队会师总决赛，当前系列赛已经打到 1 比 1。",
    participants: [
      {
        teamId: teams["template-four-fogport"].id,
        seasonTeamId: finalFourSeasonTeams.get(teams["template-four-fogport"].id) ?? null,
        slotNumber: 1,
        sideLabel: "A",
        score: 1,
        rank: null,
        result: MatchParticipantResult.PENDING,
        note: "半决赛 1 胜者"
      },
      {
        teamId: teams["template-four-crimson"].id,
        seasonTeamId: finalFourSeasonTeams.get(teams["template-four-crimson"].id) ?? null,
        slotNumber: 2,
        sideLabel: "B",
        score: 1,
        rank: null,
        result: MatchParticipantResult.PENDING,
        note: "半决赛 2 胜者"
      }
    ],
    games: [
      {
        gameNumber: 1,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-fogport"].id,
        summary: "雾港一队先拿总决赛首局。",
        participants: finishedGameParticipants(teams["template-four-fogport"].id, teams["template-four-crimson"].id, teams["template-four-fogport"].id)
      },
      {
        gameNumber: 2,
        status: MatchStatus.FINISHED,
        winnerTeamId: teams["template-four-crimson"].id,
        summary: "赤潮二队在第二局扳平系列赛。",
        participants: finishedGameParticipants(teams["template-four-fogport"].id, teams["template-four-crimson"].id, teams["template-four-crimson"].id)
      },
      {
        gameNumber: 3,
        status: MatchStatus.LIVE,
        summary: "决胜局进行中。",
        participants: pendingGameParticipants(teams["template-four-fogport"].id, teams["template-four-crimson"].id)
      }
    ]
  });

  await updateSeasonEntry(finalFourSeason.id, teams["template-four-fogport"].id, { wins: 1, losses: 0, note: "已进入总决赛" });
  await updateSeasonEntry(finalFourSeason.id, teams["template-four-crimson"].id, { wins: 1, losses: 0, note: "已进入总决赛" });
  await updateSeasonEntry(finalFourSeason.id, teams["template-four-reef"].id, { wins: 0, losses: 1, finalRank: 3, note: "半决赛止步" });
  await updateSeasonEntry(finalFourSeason.id, teams["template-four-deepforest"].id, { wins: 0, losses: 1, finalRank: 4, note: "半决赛止步" });

  console.log("已写入赛程模板演示数据：两队 BO3、三队擂台、四队淘汰赛。");
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });