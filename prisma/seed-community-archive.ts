import { MatchParticipantResult, MatchStageType, MatchStatus, PrismaClient, TournamentKind } from "@prisma/client";
import { communityArchiveTournaments, type ArchiveCup, type ArchiveTournamentKind } from "./community-archive-data";
import {
  ensureSeasonTeams,
  inferBestOf,
  upsertMatchStage,
  upsertStructuredMatch
} from "./match-structure";

const prisma = new PrismaClient();

function toSlug(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized && /^[a-z0-9-]+$/.test(normalized) && /[a-z]/.test(normalized) && normalized.length >= 4) {
    return normalized;
  }

  return `item-${Buffer.from(value).toString("hex")}`;
}

function isStableAsciiSlug(value: string | null | undefined) {
  return Boolean(value && /^[a-z0-9-]+$/.test(value) && /[a-z]/.test(value) && value.length >= 4);
}

function avatarUrl(displayName: string) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(displayName)}&backgroundType=gradientLinear`;
}

function extractSeasonNumber(title: string) {
  const digits = title.match(/第([一二三四五六七八九十0-9]+)届/);
  if (!digits) {
    return 0;
  }

  const value = digits[1];
  const chineseMap: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10
  };

  if (/^[0-9]+$/.test(value)) {
    return Number(value);
  }

  if (value === "十") {
    return 10;
  }

  if (value.startsWith("十")) {
    return 10 + (chineseMap[value.slice(1)] ?? 0);
  }

  if (value.endsWith("十")) {
    return (chineseMap[value.slice(0, 1)] ?? 0) * 10;
  }

  if (value.includes("十")) {
    const [left, right] = value.split("十");
    return (chineseMap[left] ?? 0) * 10 + (chineseMap[right] ?? 0);
  }

  return chineseMap[value] ?? 0;
}

function toTournamentKind(kind: ArchiveTournamentKind) {
  return TournamentKind[kind];
}

function toThemeColor(kind: ArchiveTournamentKind) {
  if (kind === "LEGEND") {
    return "violet";
  }

  if (kind === "GUANJUE") {
    return "rose";
  }

  return "emerald";
}

function resolveCupStatus(cupData: ArchiveCup) {
  if (cupData.status) {
    return MatchStatus[cupData.status];
  }

  return cupData.championTeamName ? MatchStatus.FINISHED : MatchStatus.SCHEDULED;
}

function buildCupSummary(cupData: ArchiveCup) {
  if (cupData.summary) {
    return cupData.summary;
  }

  if (cupData.championTeamName) {
    return `${cupData.title} 参赛队伍：${cupData.participantTeamNames.join("、")}，冠军队伍：${cupData.championTeamName}。`;
  }

  return `${cupData.title} 对阵：${cupData.participantTeamNames.join(" vs ")}。`;
}

function buildSeasonSummary(cupData: ArchiveCup) {
  if (cupData.championTeamName) {
    return `${cupData.title} 参赛队伍：${cupData.participantTeamNames.join("、")}，冠军：${cupData.championTeamName}。`;
  }

  return cupData.summary ?? `${cupData.title} 对阵：${cupData.participantTeamNames.join(" vs ")}。`;
}

type ParticipantEntry = {
  name: string;
  teamId: string;
};

type GeneratedSeries = {
  title: string;
  slug: string;
  stageName: string;
  stageSlug: string;
  stageType: MatchStageType;
  stageSortOrder: number;
  advanceRule?: string | null;
  scheduledAt: Date | null;
  format: string;
  bestOf: number;
  status: MatchStatus;
  summary: string;
  roundNumber: number;
  sequenceNumber: number;
  winnerTeamId: string | null;
  participants: Array<{
    teamId: string;
    slotNumber: number;
    sideLabel: string;
    score: number | null;
    rank: number | null;
    result: MatchParticipantResult;
    isWinner: boolean;
  }>;
  games: Array<{
    gameNumber: number;
    status: MatchStatus;
    winnerTeamId: string | null;
    summary: string;
    participants: Array<{
      teamId: string;
      slotNumber: number;
      sideLabel: string;
      score: number;
      rank: number;
      result: MatchParticipantResult;
    }>;
  }>;
};

function createSeriesGames(participants: ParticipantEntry[], winnerTeamId: string | null, status: MatchStatus) {
  if (!winnerTeamId || status !== MatchStatus.FINISHED) {
    return [];
  }

  return [1, 2].map((gameNumber) => ({
    gameNumber,
    status: MatchStatus.FINISHED,
    winnerTeamId,
    summary: `BO3 第 ${gameNumber} 局，按 2 比 0 补齐的模拟结果。`,
    participants: participants.map((participant, index) => ({
      teamId: participant.teamId,
      slotNumber: index + 1,
      sideLabel: String.fromCharCode(65 + index),
      score: participant.teamId === winnerTeamId ? 1 : 0,
      rank: participant.teamId === winnerTeamId ? 1 : 2,
      result: participant.teamId === winnerTeamId ? MatchParticipantResult.WIN : MatchParticipantResult.LOSS
    }))
  }));
}

function createSeriesParticipants(participants: ParticipantEntry[], winnerTeamId: string | null, status: MatchStatus) {
  return participants.map((participant, index) => ({
    teamId: participant.teamId,
    slotNumber: index + 1,
    sideLabel: String.fromCharCode(65 + index),
    score: winnerTeamId && status === MatchStatus.FINISHED ? (participant.teamId === winnerTeamId ? 2 : 0) : null,
    rank: winnerTeamId && status === MatchStatus.FINISHED ? (participant.teamId === winnerTeamId ? 1 : 2) : null,
    result: winnerTeamId && status === MatchStatus.FINISHED
      ? (participant.teamId === winnerTeamId ? MatchParticipantResult.WIN : MatchParticipantResult.LOSS)
      : MatchParticipantResult.PENDING,
    isWinner: participant.teamId === winnerTeamId
  }));
}

function buildHeadToHeadSeries(cupData: ArchiveCup, seasonSlug: string, participants: ParticipantEntry[], winnerTeamId: string | null, status: MatchStatus): GeneratedSeries[] {
  const bestOf = inferBestOf(cupData.format ?? "BO3") ?? 3;
  const format = cupData.format ?? `BO${bestOf}`;

  return [
    {
      title: `${cupData.title} 总决赛`,
      slug: `${seasonSlug}-final`,
      stageName: "总决赛",
      stageSlug: "final",
      stageType: MatchStageType.FINAL,
      stageSortOrder: 10,
      scheduledAt: cupData.scheduledAt ? new Date(cupData.scheduledAt) : null,
      format,
      bestOf,
      status,
      summary: cupData.summary ?? `${participants[0]?.name ?? "待定"} 对阵 ${participants[1]?.name ?? "待定"}。`,
      roundNumber: 1,
      sequenceNumber: 1,
      winnerTeamId,
      participants: createSeriesParticipants(participants, winnerTeamId, status),
      games: createSeriesGames(participants, winnerTeamId, status)
    }
  ];
}

function buildGauntletSeries(cupData: ArchiveCup, seasonSlug: string, participants: ParticipantEntry[], winnerTeamId: string | null, status: MatchStatus): GeneratedSeries[] {
  const bestOf = inferBestOf(cupData.format ?? "BO3") ?? 3;
  const format = cupData.format ?? `BO${bestOf}`;
  const defender = participants[0];
  const challengers = participants.slice(1);

  if (!defender || challengers.length < 2) {
    return [];
  }

  const preliminaryWinner = status === MatchStatus.FINISHED ? (winnerTeamId === defender.teamId ? challengers[0].teamId : winnerTeamId) : null;
  const preliminaryParticipants = [challengers[0], challengers[1]];
  const series: GeneratedSeries[] = [
    {
      title: `${cupData.title} 擂台预选`,
      slug: `${seasonSlug}-gauntlet-qualifier`,
      stageName: "擂台赛",
      stageSlug: "gauntlet",
      stageType: MatchStageType.BRACKET,
      stageSortOrder: 10,
      advanceRule: "预选胜者挑战擂主",
      scheduledAt: cupData.scheduledAt ? new Date(cupData.scheduledAt) : null,
      format,
      bestOf,
      status,
      summary: `${challengers[0].name} 与 ${challengers[1].name} 先打一轮，胜者再挑战擂主 ${defender.name}。`,
      roundNumber: 1,
      sequenceNumber: 1,
      winnerTeamId: preliminaryWinner,
      participants: createSeriesParticipants(preliminaryParticipants, preliminaryWinner, status),
      games: createSeriesGames(preliminaryParticipants, preliminaryWinner, status)
    }
  ];

  if (status === MatchStatus.FINISHED && preliminaryWinner) {
    const finalist = participants.find((participant) => participant.teamId === preliminaryWinner);

    if (finalist) {
      const finalParticipants = [defender, finalist];
      series.push({
        title: `${cupData.title} 擂主战`,
        slug: `${seasonSlug}-gauntlet-final`,
        stageName: "擂台赛",
        stageSlug: "gauntlet",
        stageType: MatchStageType.BRACKET,
        stageSortOrder: 10,
        advanceRule: "擂主与预选胜者进行 BO3 决胜",
        scheduledAt: cupData.scheduledAt ? new Date(cupData.scheduledAt) : null,
        format,
        bestOf,
        status,
        summary: `${defender.name} 守擂，对阵 ${finalist.name}。`,
        roundNumber: 2,
        sequenceNumber: 2,
        winnerTeamId,
        participants: createSeriesParticipants(finalParticipants, winnerTeamId, status),
        games: createSeriesGames(finalParticipants, winnerTeamId, status)
      });
    }
  }

  return series;
}

function buildFinalFourSeries(cupData: ArchiveCup, seasonSlug: string, participants: ParticipantEntry[], winnerTeamId: string | null, status: MatchStatus): GeneratedSeries[] {
  const bestOf = inferBestOf(cupData.format ?? "BO3") ?? 3;
  const format = cupData.format ?? `BO${bestOf}`;
  const semifinalOneParticipants = [participants[0], participants[3]].filter(Boolean) as ParticipantEntry[];
  const semifinalTwoParticipants = [participants[1], participants[2]].filter(Boolean) as ParticipantEntry[];

  if (semifinalOneParticipants.length < 2 || semifinalTwoParticipants.length < 2) {
    return [];
  }

  const semifinalOneWinner = status === MatchStatus.FINISHED
    ? (semifinalOneParticipants.some((participant) => participant.teamId === winnerTeamId)
      ? winnerTeamId
      : semifinalOneParticipants[0]?.teamId ?? null)
    : null;
  const semifinalTwoWinner = status === MatchStatus.FINISHED
    ? (semifinalTwoParticipants.some((participant) => participant.teamId === winnerTeamId)
      ? semifinalTwoParticipants.find((participant) => participant.teamId !== winnerTeamId)?.teamId ?? semifinalTwoParticipants[0]?.teamId ?? null
      : semifinalTwoParticipants[0]?.teamId ?? null)
    : null;

  const series: GeneratedSeries[] = [
    {
      title: `${cupData.title} 半决赛 1`,
      slug: `${seasonSlug}-semifinal-1`,
      stageName: "半决赛",
      stageSlug: "semifinal",
      stageType: MatchStageType.BRACKET,
      stageSortOrder: 20,
      advanceRule: "两场半决赛胜者晋级总决赛",
      scheduledAt: cupData.scheduledAt ? new Date(cupData.scheduledAt) : null,
      format,
      bestOf,
      status,
      summary: `${semifinalOneParticipants[0].name} 对阵 ${semifinalOneParticipants[1].name}。`,
      roundNumber: 1,
      sequenceNumber: 1,
      winnerTeamId: semifinalOneWinner,
      participants: createSeriesParticipants(semifinalOneParticipants, semifinalOneWinner, status),
      games: createSeriesGames(semifinalOneParticipants, semifinalOneWinner, status)
    },
    {
      title: `${cupData.title} 半决赛 2`,
      slug: `${seasonSlug}-semifinal-2`,
      stageName: "半决赛",
      stageSlug: "semifinal",
      stageType: MatchStageType.BRACKET,
      stageSortOrder: 20,
      advanceRule: "两场半决赛胜者晋级总决赛",
      scheduledAt: cupData.scheduledAt ? new Date(cupData.scheduledAt) : null,
      format,
      bestOf,
      status,
      summary: `${semifinalTwoParticipants[0].name} 对阵 ${semifinalTwoParticipants[1].name}。`,
      roundNumber: 1,
      sequenceNumber: 2,
      winnerTeamId: semifinalTwoWinner,
      participants: createSeriesParticipants(semifinalTwoParticipants, semifinalTwoWinner, status),
      games: createSeriesGames(semifinalTwoParticipants, semifinalTwoWinner, status)
    }
  ];

  if (status === MatchStatus.FINISHED && semifinalOneWinner && semifinalTwoWinner) {
    const finalParticipants = [
      participants.find((participant) => participant.teamId === semifinalOneWinner),
      participants.find((participant) => participant.teamId === semifinalTwoWinner)
    ].filter(Boolean) as ParticipantEntry[];

    if (finalParticipants.length === 2) {
      series.push({
        title: `${cupData.title} 总决赛`,
        slug: `${seasonSlug}-final`,
        stageName: "总决赛",
        stageSlug: "final",
        stageType: MatchStageType.FINAL,
        stageSortOrder: 30,
        advanceRule: "半决赛胜者争冠",
        scheduledAt: cupData.scheduledAt ? new Date(cupData.scheduledAt) : null,
        format,
        bestOf,
        status,
        summary: `${finalParticipants[0].name} 与 ${finalParticipants[1].name} 会师总决赛。`,
        roundNumber: 2,
        sequenceNumber: 1,
        winnerTeamId,
        participants: createSeriesParticipants(finalParticipants, winnerTeamId, status),
        games: createSeriesGames(finalParticipants, winnerTeamId, status)
      });
    }
  }

  return series;
}

function buildSeriesForCup(cupData: ArchiveCup, seasonSlug: string, participants: ParticipantEntry[], winnerTeamId: string | null, status: MatchStatus) {
  if (participants.length === 2) {
    return buildHeadToHeadSeries(cupData, seasonSlug, participants, winnerTeamId, status);
  }

  if (participants.length === 3) {
    return buildGauntletSeries(cupData, seasonSlug, participants, winnerTeamId, status);
  }

  if (participants.length === 4) {
    return buildFinalFourSeries(cupData, seasonSlug, participants, winnerTeamId, status);
  }

  return [];
}

function buildSeasonStandings(participants: ParticipantEntry[], series: GeneratedSeries[], winnerTeamId: string | null) {
  const table = new Map(participants.map((participant) => [participant.teamId, {
    wins: 0,
    losses: 0,
    finalRank: null as number | null
  }]));

  for (const item of series) {
    if (!item.winnerTeamId) {
      continue;
    }

    for (const participant of item.participants) {
      const row = table.get(participant.teamId);

      if (!row) {
        continue;
      }

      if (participant.teamId === item.winnerTeamId) {
        row.wins += 1;
      } else {
        row.losses += 1;
      }
    }
  }

  const ranking = winnerTeamId
    ? [winnerTeamId, ...participants.map((participant) => participant.teamId).filter((teamId) => teamId !== winnerTeamId)]
    : participants.map((participant) => participant.teamId);

  ranking.forEach((teamId, index) => {
    const row = table.get(teamId);

    if (row) {
      row.finalRank = index + 1;
    }
  });

  return table;
}

async function main() {
  const playerIdByName = new Map<string, string>();
  const teamIdByName = new Map<string, string>();

  let importedTeamCount = 0;
  let importedPlayerCount = 0;
  let importedCupCount = 0;

  for (const archive of communityArchiveTournaments) {
    const tournament = await prisma.tournament.upsert({
      where: { slug: archive.tournament.slug },
      update: {
        name: archive.tournament.name,
        kind: toTournamentKind(archive.tournament.kind),
        description: archive.tournament.description
      },
      create: {
        name: archive.tournament.name,
        slug: archive.tournament.slug,
        kind: toTournamentKind(archive.tournament.kind),
        description: archive.tournament.description
      }
    });

    for (const playerData of archive.players) {
      const existingPlayer = await prisma.player.findFirst({
        where: {
          displayName: {
            equals: playerData.name,
            mode: "insensitive"
          }
        }
      });
      const player = existingPlayer
        ? await prisma.player.update({
            where: { id: existingPlayer.id },
            data: {
              displayName: playerData.name,
              slug: isStableAsciiSlug(existingPlayer.slug) ? existingPlayer.slug : toSlug(playerData.name),
              championshipCount: playerData.championshipCount,
              ladderScore: playerData.ladderScore ?? existingPlayer.ladderScore ?? null,
              active: true,
              avatarUrl: existingPlayer.avatarUrl ?? avatarUrl(playerData.name),
              bio: `${playerData.formerTeamNames.join(" / ")} 的社区老将。`
            }
          })
        : await prisma.player.create({
            data: {
              displayName: playerData.name,
              slug: toSlug(playerData.name),
              championshipCount: playerData.championshipCount,
              ladderScore: playerData.ladderScore ?? null,
              heroPool: [],
              highlightMatchIds: [],
              active: true,
              avatarUrl: avatarUrl(playerData.name),
              bio: `${playerData.formerTeamNames.join(" / ")} 的社区老将。`
            }
          });

      playerIdByName.set(playerData.name, player.id);
    }

    for (const teamData of archive.teams) {
      const existingTeam = await prisma.team.findFirst({ where: { name: teamData.name } });
      const team = existingTeam
        ? await prisma.team.update({
            where: { id: existingTeam.id },
            data: {
              slug: isStableAsciiSlug(existingTeam.slug) ? existingTeam.slug : toSlug(teamData.name),
              slogan: teamData.slogan ?? existingTeam.slogan ?? null,
              championshipCount: teamData.championshipCount,
              summary: `${teamData.name} 已收录到 ${archive.tournament.name} 档案，累计夺冠 ${teamData.championshipCount} 次。`
            }
          })
        : await prisma.team.create({
            data: {
              name: teamData.name,
              slug: toSlug(teamData.name),
              slogan: teamData.slogan ?? null,
              championshipCount: teamData.championshipCount,
              summary: `${teamData.name} 已收录到 ${archive.tournament.name} 档案，累计夺冠 ${teamData.championshipCount} 次。`
            }
          });

      teamIdByName.set(teamData.name, team.id);

      for (const playerName of teamData.players) {
        const playerId = playerIdByName.get(playerName);
        if (!playerId) {
          continue;
        }

        await prisma.teamMember.upsert({
          where: {
            teamId_playerId_isCurrent: {
              teamId: team.id,
              playerId,
              isCurrent: false
            }
          },
          update: {
            isCurrent: false
          },
          create: {
            teamId: team.id,
            playerId,
            isCurrent: false
          }
        });
      }
    }

    for (const cupData of archive.cups) {
      const seasonNumber = extractSeasonNumber(cupData.title);
      const scheduledAt = cupData.scheduledAt ? new Date(cupData.scheduledAt) : null;
      const status = resolveCupStatus(cupData);
      const season = await prisma.tournamentSeason.upsert({
        where: { slug: `${archive.tournament.slug}-s${seasonNumber}` },
        update: {
          title: cupData.title,
          seasonNumber,
          startDate: scheduledAt,
          endDate: status === MatchStatus.FINISHED ? scheduledAt : null,
          statusLabel: status === MatchStatus.FINISHED ? "已完赛" : "待开赛",
          themeColor: toThemeColor(archive.tournament.kind),
          summary: buildSeasonSummary(cupData)
        },
        create: {
          tournamentId: tournament.id,
          title: cupData.title,
          slug: `${archive.tournament.slug}-s${seasonNumber}`,
          seasonNumber,
          startDate: scheduledAt,
          endDate: status === MatchStatus.FINISHED ? scheduledAt : null,
          statusLabel: status === MatchStatus.FINISHED ? "已完赛" : "待开赛",
          themeColor: toThemeColor(archive.tournament.kind),
          summary: buildSeasonSummary(cupData)
        }
      });

      const participantTeams = cupData.participantTeamNames
        .map((teamName) => {
          const teamId = teamIdByName.get(teamName);
          return teamId ? { name: teamName, teamId } : null;
        })
        .filter((entry): entry is { name: string; teamId: string } => Boolean(entry));

      const participantTeamIds = participantTeams.map((entry) => entry.teamId);

      await prisma.match.deleteMany({
        where: {
          seasonId: season.id
        }
      });

      await prisma.matchStage.deleteMany({
        where: {
          seasonId: season.id
        }
      });

      await prisma.seasonTeam.deleteMany({
        where: {
          seasonId: season.id,
          teamId: {
            notIn: participantTeamIds
          }
        }
      });

      const seasonTeamIds = await ensureSeasonTeams(
        prisma,
        season.id,
        participantTeams.map((entry) => ({ id: entry.teamId }))
      );

      const winnerTeamId = cupData.championTeamName ? (teamIdByName.get(cupData.championTeamName) ?? null) : null;

      const seasonSlug = `${archive.tournament.slug}-s${seasonNumber}`;
      const generatedSeries = buildSeriesForCup(cupData, seasonSlug, participantTeams, winnerTeamId, status);
      const standings = buildSeasonStandings(participantTeams, generatedSeries, winnerTeamId);

      for (const participant of participantTeams) {
        const standing = standings.get(participant.teamId);

        await prisma.seasonTeam.update({
          where: {
            seasonId_teamId: {
              seasonId: season.id,
              teamId: participant.teamId
            }
          },
          data: {
            finalRank: standing?.finalRank ?? null,
            wins: standing?.wins ?? null,
            losses: standing?.losses ?? null,
            note: participant.teamId === winnerTeamId ? "冠军" : null
          }
        });
      }

      for (const [index, stageSpec] of [...new Map(generatedSeries.map((series) => [series.stageSlug, {
        name: series.stageName,
        slug: series.stageSlug,
        stageType: series.stageType,
        sortOrder: series.stageSortOrder,
        bestOf: series.bestOf,
        advanceRule: series.advanceRule ?? null
      }])).values()].entries()) {
        await upsertMatchStage(prisma, {
          seasonId: season.id,
          name: stageSpec.name,
          slug: stageSpec.slug,
          stageType: stageSpec.stageType,
          sortOrder: stageSpec.sortOrder + index,
          bestOf: stageSpec.bestOf,
          advanceRule: stageSpec.advanceRule
        });
      }

      const stages = await prisma.matchStage.findMany({
        where: {
          seasonId: season.id
        }
      });
      const stageIdBySlug = new Map(stages.map((stage) => [stage.slug, stage.id]));

      for (const series of generatedSeries) {
        const stageId = stageIdBySlug.get(series.stageSlug);

        if (!stageId) {
          continue;
        }

        await upsertStructuredMatch(prisma, {
          title: series.title,
          slug: series.slug,
          seasonId: season.id,
          stageId,
          scheduledAt: series.scheduledAt,
          format: series.format,
          bestOf: series.bestOf,
          roundNumber: series.roundNumber,
          sequenceNumber: series.sequenceNumber,
          status: series.status,
          summary: series.summary,
          winnerTeamId: series.winnerTeamId,
          participants: series.participants.map((participant) => ({
            ...participant,
            seasonTeamId: seasonTeamIds.get(participant.teamId) ?? null
          })),
          games: series.games
        });
      }
    }

    importedTeamCount += archive.teams.length;
    importedPlayerCount += archive.players.length;
    importedCupCount += archive.cups.length;
  }

  console.log(`已导入 ${communityArchiveTournaments.length} 个赛事系列、${importedTeamCount} 支战队、${importedPlayerCount} 名选手、${importedCupCount} 场社区赛事档案。`);
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