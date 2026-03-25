import {
  MatchParticipantResult,
  MatchStatus,
  MatchType,
  MatchStageType,
  PrismaClient,
  Team
} from "@prisma/client";

type PrismaLike = PrismaClient;

export type StructuredParticipantInput = {
  teamId: string;
  seasonTeamId?: string | null;
  slotNumber: number;
  sideLabel?: string | null;
  score?: number | null;
  rank?: number | null;
  result?: MatchParticipantResult;
  pointsAwarded?: number | null;
  isWinner?: boolean;
  isAdvanced?: boolean;
  isEliminated?: boolean;
  note?: string | null;
};

export type UpsertStructuredMatchInput = {
  seasonId?: string | null;
  stageId?: string | null;
  topicId?: string | null;
  title: string;
  slug: string;
  externalMatchId?: string | null;
  scheduledAt?: Date | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  format?: string | null;
  bestOf?: number | null;
  roundNumber?: number | null;
  sequenceNumber?: number | null;
  matchType?: MatchType;
  status: MatchStatus;
  streamUrl?: string | null;
  summary?: string | null;
  participants: StructuredParticipantInput[];
  winnerTeamId?: string | null;
  games?: StructuredGameInput[];
};

export type StructuredGameParticipantInput = {
  teamId: string;
  slotNumber: number;
  sideLabel?: string | null;
  score?: number | null;
  rank?: number | null;
  result?: MatchParticipantResult;
  note?: string | null;
};

export type StructuredGameInput = {
  gameNumber: number;
  externalGameId?: string | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  status?: MatchStatus;
  winnerTeamId?: string | null;
  summary?: string | null;
  participants?: StructuredGameParticipantInput[];
};

export type UpsertMatchStageInput = {
  seasonId: string;
  name: string;
  slug: string;
  stageType?: MatchStageType;
  sortOrder?: number;
  bestOf?: number | null;
  advanceRule?: string | null;
};

export function inferBestOf(format: string | null | undefined) {
  if (!format) {
    return null;
  }

  const matched = format.match(/BO(\d+)/i);
  if (!matched) {
    return null;
  }

  const value = Number.parseInt(matched[1] ?? "", 10);
  return Number.isNaN(value) ? null : value;
}

export function inferMatchType(participantCount: number) {
  return participantCount <= 2 ? MatchType.HEAD_TO_HEAD : MatchType.FREE_FOR_ALL;
}

export function inferHeadToHeadResults(scoreA: number | null | undefined, scoreB: number | null | undefined) {
  if (scoreA === null || scoreA === undefined || scoreB === null || scoreB === undefined) {
    return {
      first: MatchParticipantResult.PENDING,
      second: MatchParticipantResult.PENDING,
      winnerIndex: null as number | null
    };
  }

  if (scoreA === scoreB) {
    return {
      first: MatchParticipantResult.DRAW,
      second: MatchParticipantResult.DRAW,
      winnerIndex: null as number | null
    };
  }

  return scoreA > scoreB
    ? {
        first: MatchParticipantResult.WIN,
        second: MatchParticipantResult.LOSS,
        winnerIndex: 0
      }
    : {
        first: MatchParticipantResult.LOSS,
        second: MatchParticipantResult.WIN,
        winnerIndex: 1
      };
}

export async function ensureSeasonTeams(prisma: PrismaLike, seasonId: string, teams: Array<Pick<Team, "id">>) {
  const entries = await Promise.all(
    teams.map((team) =>
      prisma.seasonTeam.upsert({
        where: {
          seasonId_teamId: {
            seasonId,
            teamId: team.id
          }
        },
        update: {},
        create: {
          seasonId,
          teamId: team.id
        }
      })
    )
  );

  return new Map(entries.map((entry) => [entry.teamId, entry.id]));
}

export async function upsertMatchStage(prisma: PrismaLike, input: UpsertMatchStageInput) {
  return prisma.matchStage.upsert({
    where: {
      seasonId_slug: {
        seasonId: input.seasonId,
        slug: input.slug
      }
    },
    update: {
      name: input.name,
      stageType: input.stageType ?? MatchStageType.CUSTOM,
      sortOrder: input.sortOrder ?? 0,
      bestOf: input.bestOf ?? null,
      advanceRule: input.advanceRule ?? null
    },
    create: {
      seasonId: input.seasonId,
      name: input.name,
      slug: input.slug,
      stageType: input.stageType ?? MatchStageType.CUSTOM,
      sortOrder: input.sortOrder ?? 0,
      bestOf: input.bestOf ?? null,
      advanceRule: input.advanceRule ?? null
    }
  });
}

async function replaceMatchGames(prisma: PrismaLike, matchId: string, games: StructuredGameInput[]) {
  await prisma.matchGame.deleteMany({
    where: {
      matchId
    }
  });

  if (!games.length) {
    return;
  }

  const participants = await prisma.matchParticipant.findMany({
    where: {
      matchId
    },
    orderBy: {
      slotNumber: "asc"
    }
  });

  const participantIdByTeamId = new Map(participants.map((participant) => [participant.teamId, participant.id]));

  for (const game of games) {
    const createdGame = await prisma.matchGame.create({
      data: {
        matchId,
        gameNumber: game.gameNumber,
        externalGameId: game.externalGameId ?? null,
        startedAt: game.startedAt ?? null,
        endedAt: game.endedAt ?? null,
        status: game.status ?? MatchStatus.DRAFT,
        winnerTeamId: game.winnerTeamId ?? null,
        summary: game.summary ?? null
      }
    });

    if (!game.participants?.length) {
      continue;
    }

    await prisma.matchGameParticipant.createMany({
      data: game.participants.map((participant) => ({
        gameId: createdGame.id,
        participantId: participantIdByTeamId.get(participant.teamId) ?? null,
        teamId: participant.teamId,
        slotNumber: participant.slotNumber,
        sideLabel: participant.sideLabel ?? null,
        score: participant.score ?? null,
        rank: participant.rank ?? null,
        result: participant.result ?? MatchParticipantResult.PENDING,
        note: participant.note ?? null
      }))
    });
  }
}

export async function upsertStructuredMatch(prisma: PrismaLike, input: UpsertStructuredMatchInput) {
  const match = await prisma.match.upsert({
    where: { slug: input.slug },
    update: {
      seasonId: input.seasonId ?? null,
      stageId: input.stageId ?? null,
      topicId: input.topicId ?? null,
      title: input.title,
      externalMatchId: input.externalMatchId ?? null,
      scheduledAt: input.scheduledAt ?? null,
      startedAt: input.startedAt ?? null,
      endedAt: input.endedAt ?? null,
      format: input.format ?? null,
      bestOf: input.bestOf ?? null,
      roundNumber: input.roundNumber ?? null,
      sequenceNumber: input.sequenceNumber ?? null,
      matchType: input.matchType ?? inferMatchType(input.participants.length),
      status: input.status,
      streamUrl: input.streamUrl ?? null,
      summary: input.summary ?? null,
      winnerTeamId: input.winnerTeamId ?? null
    },
    create: {
      seasonId: input.seasonId ?? null,
      stageId: input.stageId ?? null,
      topicId: input.topicId ?? null,
      title: input.title,
      slug: input.slug,
      externalMatchId: input.externalMatchId ?? null,
      scheduledAt: input.scheduledAt ?? null,
      startedAt: input.startedAt ?? null,
      endedAt: input.endedAt ?? null,
      format: input.format ?? null,
      bestOf: input.bestOf ?? null,
      roundNumber: input.roundNumber ?? null,
      sequenceNumber: input.sequenceNumber ?? null,
      matchType: input.matchType ?? inferMatchType(input.participants.length),
      status: input.status,
      streamUrl: input.streamUrl ?? null,
      summary: input.summary ?? null,
      winnerTeamId: input.winnerTeamId ?? null
    }
  });

  await prisma.matchParticipant.deleteMany({
    where: {
      matchId: match.id
    }
  });

  if (input.participants.length > 0) {
    await prisma.matchParticipant.createMany({
      data: input.participants.map((participant) => ({
        matchId: match.id,
        seasonTeamId: participant.seasonTeamId ?? null,
        teamId: participant.teamId,
        slotNumber: participant.slotNumber,
        sideLabel: participant.sideLabel ?? null,
        score: participant.score ?? null,
        rank: participant.rank ?? null,
        result: participant.result ?? MatchParticipantResult.PENDING,
        pointsAwarded: participant.pointsAwarded ?? null,
        isWinner: participant.isWinner ?? false,
        isAdvanced: participant.isAdvanced ?? false,
        isEliminated: participant.isEliminated ?? false,
        note: participant.note ?? null
      }))
    });
  }

  if (input.games) {
    await replaceMatchGames(prisma, match.id, input.games);
  }

  return match;
}