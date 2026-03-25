"use server";

import { revalidatePath } from "next/cache";
import { MatchParticipantResult, MatchStageType, MatchStatus, Prisma, type MatchStatus as MatchStatusValue } from "@prisma/client";
import type { MatchFormState } from "@/app/admin/matches/form-state";
import { db } from "@/lib/db";
import { ensureSeasonTeams, inferBestOf, upsertMatchStage } from "@/prisma/match-structure";
import { createMatchSchema, createMatchTemplateSchema, deleteMatchSchema, updateMatchSchema } from "@/lib/validators";

type ParticipantDraft = {
  teamId?: string;
  sideLabel: string;
  score?: number;
  rank?: number;
};

type ParticipantInput = {
  teamId: string;
  sideLabel: string;
  score?: number;
  rank?: number;
};

type StructuredParticipant = {
  teamId: string;
  slotNumber: number;
  sideLabel: string;
  score: number | null;
  rank: number | null;
  result: MatchParticipantResult;
  isWinner: boolean;
  note?: string | null;
  isAdvanced?: boolean;
  isEliminated?: boolean;
};

type StructuredGame = {
  gameNumber: number;
  externalGameId: string | null;
  status: MatchStatusValue;
  winnerTeamId: string | null;
  summary: string | null;
  participants: Array<{
    teamId: string;
    slotNumber: number;
    sideLabel: string;
    score: number | null;
    rank: number | null;
    result: MatchParticipantResult;
  }>;
};

function normalizeDateTime(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function revalidateMatchViews() {
  revalidatePath("/admin/matches");
  revalidatePath("/matches");
  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/community/topics");
}

function inferWinnerTeamId(participants: Array<{ teamId: string; score: number | null; rank: number | null }>, winnerTeamId?: string) {
  if (winnerTeamId) {
    return winnerTeamId;
  }

  const rankWinner = participants.find((participant) => participant.rank === 1);
  if (rankWinner) {
    return rankWinner.teamId;
  }

  const comparable = participants.filter((participant) => participant.score !== null);
  if (comparable.length < 2) {
    return null;
  }

  const maxScore = Math.max(...comparable.map((participant) => participant.score ?? 0));
  const winners = comparable.filter((participant) => participant.score === maxScore);
  return winners.length === 1 ? winners[0]?.teamId ?? null : null;
}

function inferTargetWins(bestOf: number | null | undefined) {
  const resolvedBestOf = bestOf && bestOf > 0 ? bestOf : 3;
  return Math.max(1, Math.ceil(resolvedBestOf / 2));
}

function buildPendingGameParticipants(participants: StructuredParticipant[]) {
  return participants.map((participant) => ({
    teamId: participant.teamId,
    slotNumber: participant.slotNumber,
    sideLabel: participant.sideLabel,
    score: null,
    rank: null,
    result: MatchParticipantResult.PENDING
  }));
}

function buildFinishedGameParticipants(participants: StructuredParticipant[], winnerTeamId: string | null) {
  return participants.map((participant) => ({
    teamId: participant.teamId,
    slotNumber: participant.slotNumber,
    sideLabel: participant.sideLabel,
    score: participant.teamId === winnerTeamId ? 1 : 0,
    rank: participant.teamId === winnerTeamId ? 1 : 2,
    result: participant.teamId === winnerTeamId ? MatchParticipantResult.WIN : MatchParticipantResult.LOSS
  }));
}

function buildGameInputs(payload: {
  status: MatchStatusValue | "DRAFT" | "SCHEDULED" | "LIVE" | "FINISHED" | "ARCHIVED";
  bestOf: number | null;
  participants: StructuredParticipant[];
  winnerTeamId: string | null;
  gameExternalMatchId1?: string;
  gameExternalMatchId2?: string;
  gameExternalMatchId3?: string;
  gameExternalMatchId4?: string;
  gameExternalMatchId5?: string;
  gameWinnerTeamId1?: string;
  gameWinnerTeamId2?: string;
  gameWinnerTeamId3?: string;
  gameWinnerTeamId4?: string;
  gameWinnerTeamId5?: string;
  gameStatus1?: MatchStatusValue;
  gameStatus2?: MatchStatusValue;
  gameStatus3?: MatchStatusValue;
  gameStatus4?: MatchStatusValue;
  gameStatus5?: MatchStatusValue;
  gameSummary1?: string;
  gameSummary2?: string;
  gameSummary3?: string;
  gameSummary4?: string;
  gameSummary5?: string;
}): StructuredGame[] {
  const resolvedBestOf = payload.bestOf && payload.bestOf > 0 ? payload.bestOf : 3;
  const targetWins = inferTargetWins(resolvedBestOf);
  const defaultPlannedStatus = payload.status === "SCHEDULED" ? MatchStatus.SCHEDULED : MatchStatus.DRAFT;
  const externalGameIds = [
    payload.gameExternalMatchId1,
    payload.gameExternalMatchId2,
    payload.gameExternalMatchId3,
    payload.gameExternalMatchId4,
    payload.gameExternalMatchId5
  ];
  const winnerTeamIds = [
    payload.gameWinnerTeamId1,
    payload.gameWinnerTeamId2,
    payload.gameWinnerTeamId3,
    payload.gameWinnerTeamId4,
    payload.gameWinnerTeamId5
  ];
  const gameStatuses = [
    payload.gameStatus1,
    payload.gameStatus2,
    payload.gameStatus3,
    payload.gameStatus4,
    payload.gameStatus5
  ];
  const gameSummaries = [
    payload.gameSummary1,
    payload.gameSummary2,
    payload.gameSummary3,
    payload.gameSummary4,
    payload.gameSummary5
  ];

  return [1, 2, 3, 4, 5]
    .filter((gameNumber) => gameNumber <= resolvedBestOf)
    .map((gameNumber) => {
      const index = gameNumber - 1;
      const externalGameId = externalGameIds[index] || null;
      const manualWinnerTeamId = winnerTeamIds[index] || null;
      const summary = gameSummaries[index] || null;
      const manualStatus = gameStatuses[index];

      const autoWinnerTeamId = payload.status === "FINISHED" || payload.status === "ARCHIVED"
        ? (gameNumber <= targetWins ? payload.winnerTeamId : null)
        : null;
      const winnerTeamId = manualWinnerTeamId || autoWinnerTeamId;
      const status = manualStatus
        ?? (winnerTeamId ? MatchStatus.FINISHED : defaultPlannedStatus);

      return {
        gameNumber,
        externalGameId,
        status,
        winnerTeamId,
        summary,
        participants: winnerTeamId && status === MatchStatus.FINISHED
          ? buildFinishedGameParticipants(payload.participants, winnerTeamId)
          : buildPendingGameParticipants(payload.participants)
      };
    });
}

async function replaceMatchGames(matchId: string, games: StructuredGame[]) {
  await db.matchGame.deleteMany({
    where: { matchId }
  });

  if (!games.length) {
    return;
  }

  const participants = await db.matchParticipant.findMany({
    where: { matchId },
    orderBy: { slotNumber: "asc" }
  });
  const participantIdByTeamId = new Map(participants.map((participant) => [participant.teamId, participant.id]));

  for (const game of games) {
    const createdGame = await db.matchGame.create({
      data: {
        matchId,
        gameNumber: game.gameNumber,
        externalGameId: game.externalGameId,
        status: game.status,
        winnerTeamId: game.winnerTeamId,
        summary: game.summary
      }
    });

    await db.matchGameParticipant.createMany({
      data: game.participants.map((participant) => ({
        gameId: createdGame.id,
        participantId: participantIdByTeamId.get(participant.teamId) ?? null,
        teamId: participant.teamId,
        slotNumber: participant.slotNumber,
        sideLabel: participant.sideLabel,
        score: participant.score,
        rank: participant.rank,
        result: participant.result
      }))
    });
  }
}

async function replaceMatchStructure(matchId: string, participants: StructuredParticipant[], games: StructuredGame[], seasonId?: string) {
  const existingParticipants = await db.matchParticipant.findMany({
    where: { matchId },
    select: {
      teamId: true,
      slotNumber: true,
      note: true,
      isAdvanced: true,
      isEliminated: true
    }
  });

  await db.matchParticipant.deleteMany({
    where: { matchId }
  });

  const existingByTeamId = new Map(existingParticipants.map((participant) => [participant.teamId, participant]));
  const existingBySlot = new Map(existingParticipants.map((participant) => [participant.slotNumber, participant]));

  const seasonTeamIds = seasonId
    ? await ensureSeasonTeams(db, seasonId, participants.map((participant) => ({ id: participant.teamId })))
    : new Map<string, string>();

  await db.matchParticipant.createMany({
    data: participants.map((participant) => {
      const existingParticipant = existingByTeamId.get(participant.teamId) ?? existingBySlot.get(participant.slotNumber);

      return {
        matchId,
        seasonTeamId: seasonId ? (seasonTeamIds.get(participant.teamId) ?? null) : null,
        teamId: participant.teamId,
        slotNumber: participant.slotNumber,
        sideLabel: participant.sideLabel,
        score: participant.score,
        rank: participant.rank,
        result: participant.result,
        isWinner: participant.isWinner,
        isAdvanced: participant.isAdvanced ?? existingParticipant?.isAdvanced ?? false,
        isEliminated: participant.isEliminated ?? existingParticipant?.isEliminated ?? false,
        note: participant.note ?? existingParticipant?.note ?? null
      };
    })
  });

  await replaceMatchGames(matchId, games);
}

function normalizeTemplateDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatSeededTeamLabel(teamId: string | undefined, seedNumber: number, teamNameById: Map<string, string>) {
  if (!teamId) {
    return `${seedNumber} 号种子`;
  }

  return `${seedNumber} 号种子 ${teamNameById.get(teamId) ?? "待定队伍"}`;
}

function buildTemplateGames(participants: Array<{ teamId: string; slotNumber: number; sideLabel: string }>, bestOf: number, status: MatchStatusValue) {
  return Array.from({ length: Math.min(bestOf, 5) }, (_, index) => ({
    gameNumber: index + 1,
    externalGameId: null,
    status: status === MatchStatus.SCHEDULED ? MatchStatus.SCHEDULED : MatchStatus.DRAFT,
    winnerTeamId: null,
    summary: null,
    participants: participants.map((participant) => ({
      teamId: participant.teamId,
      slotNumber: participant.slotNumber,
      sideLabel: participant.sideLabel,
      score: null,
      rank: null,
      result: MatchParticipantResult.PENDING
    }))
  }));
}

async function syncGeneratedBracketMatches(seasonId: string) {
  const season = await db.tournamentSeason.findUnique({
    where: { id: seasonId },
    include: {
      participants: {
        include: {
          team: true
        },
        orderBy: [{ seedNumber: "asc" }, { createdAt: "asc" }]
      },
      stages: {
        include: {
          matches: {
            include: {
              participants: {
                orderBy: { slotNumber: "asc" }
              }
            },
            orderBy: [{ roundNumber: "asc" }, { sequenceNumber: "asc" }, { createdAt: "asc" }]
          }
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    }
  });

  if (!season) {
    return;
  }

  const seededTeams = season.participants.filter((entry) => entry.teamId);
  const gauntletStage = season.stages.find((stage) => stage.slug === "gauntlet");
  if (gauntletStage && seededTeams.length >= 3) {
    const defender = seededTeams[0];
    const qualifier = gauntletStage.matches.find((match) => match.roundNumber === 1) ?? gauntletStage.matches[0] ?? null;
    const finalMatch = gauntletStage.matches.find((match) => match.roundNumber === 2) ?? null;
    const qualifierWinnerId = qualifier?.winnerTeamId ?? null;
    const qualifierWinner = seededTeams.find((team) => team.teamId === qualifierWinnerId) ?? null;
    const gauntletFinalSummary = qualifierWinner
      ? `1 号种子 ${defender.team.name} 以擂主身份守擂，对阵 ${qualifierWinner.team.name}（预选胜者）。`
      : `1 号种子 ${defender.team.name} 以擂主身份守擂，等待预选胜者挑战。`;

    if (defender && qualifierWinnerId && qualifierWinnerId !== defender.teamId) {
      await db.match.upsert({
        where: { slug: `${season.slug}-gauntlet-final` },
        update: {
          seasonId: season.id,
          stageId: gauntletStage.id,
          title: `${season.title} 擂主战`,
          format: qualifier?.format ?? `BO${gauntletStage.bestOf ?? 3}`,
          bestOf: qualifier?.bestOf ?? gauntletStage.bestOf ?? 3,
          roundNumber: 2,
          sequenceNumber: 2,
          status: finalMatch?.status ?? MatchStatus.SCHEDULED,
          summary: gauntletFinalSummary,
          winnerTeamId: finalMatch?.winnerTeamId ?? null,
          scheduledAt: finalMatch?.scheduledAt ?? qualifier?.scheduledAt ?? null
        },
        create: {
          seasonId: season.id,
          stageId: gauntletStage.id,
          title: `${season.title} 擂主战`,
          slug: `${season.slug}-gauntlet-final`,
          format: qualifier?.format ?? `BO${gauntletStage.bestOf ?? 3}`,
          bestOf: qualifier?.bestOf ?? gauntletStage.bestOf ?? 3,
          roundNumber: 2,
          sequenceNumber: 2,
          status: MatchStatus.SCHEDULED,
          summary: gauntletFinalSummary,
          scheduledAt: qualifier?.scheduledAt ?? null,
          winnerTeamId: null
        }
      });

      const syncedFinal = await db.match.findUnique({
        where: { slug: `${season.slug}-gauntlet-final` },
        select: { id: true, bestOf: true, status: true }
      });

      if (syncedFinal) {
        await replaceMatchStructure(
          syncedFinal.id,
          [
            {
              teamId: defender.teamId,
              slotNumber: 1,
              sideLabel: "A",
              score: null,
              rank: null,
              result: MatchParticipantResult.PENDING,
              isWinner: false,
              note: "1 号种子 / 擂主"
            },
            {
              teamId: qualifierWinnerId,
              slotNumber: 2,
              sideLabel: "B",
              score: null,
              rank: null,
              result: MatchParticipantResult.PENDING,
              isWinner: false,
              note: "预选胜者"
            }
          ],
          buildTemplateGames([
            { teamId: defender.teamId, slotNumber: 1, sideLabel: "A" },
            { teamId: qualifierWinnerId, slotNumber: 2, sideLabel: "B" }
          ], syncedFinal.bestOf ?? 3, syncedFinal.status),
          season.id
        );
      }
    } else if (finalMatch) {
      await db.match.delete({
        where: { id: finalMatch.id }
      });
    }
  }

  const semifinalStage = season.stages.find((stage) => stage.slug === "semifinal");
  const finalStage = season.stages.find((stage) => stage.slug === "final");
  if (semifinalStage && seededTeams.length >= 4) {
    const semifinals = [...semifinalStage.matches].sort((left, right) => (left.sequenceNumber ?? 999) - (right.sequenceNumber ?? 999));
    const leftWinnerId = semifinals[0]?.winnerTeamId ?? null;
    const rightWinnerId = semifinals[1]?.winnerTeamId ?? null;
    const existingFinal = finalStage?.matches.find((match) => match.slug === `${season.slug}-final`) ?? null;
    const leftWinner = seededTeams.find((team) => team.teamId === leftWinnerId) ?? null;
    const rightWinner = seededTeams.find((team) => team.teamId === rightWinnerId) ?? null;
    const semifinalFinalSummary = leftWinner && rightWinner
      ? `${leftWinner.team.name}（半决赛 1 胜者）对阵 ${rightWinner.team.name}（半决赛 2 胜者）。`
      : "两场半决赛胜者会师总决赛。";

    if (leftWinnerId && rightWinnerId) {
      const ensuredFinalStage = finalStage ?? await upsertMatchStage(db, {
        seasonId: season.id,
        name: "总决赛",
        slug: "final",
        stageType: MatchStageType.FINAL,
        sortOrder: 30,
        bestOf: 3,
        advanceRule: "两场半决赛胜者进入总决赛"
      });

      await db.match.upsert({
        where: { slug: `${season.slug}-final` },
        update: {
          seasonId: season.id,
          stageId: ensuredFinalStage.id,
          title: `${season.title} 总决赛`,
          format: existingFinal?.format ?? `BO${ensuredFinalStage.bestOf ?? 3}`,
          bestOf: existingFinal?.bestOf ?? ensuredFinalStage.bestOf ?? 3,
          roundNumber: 2,
          sequenceNumber: 1,
          status: existingFinal?.status ?? MatchStatus.SCHEDULED,
          summary: semifinalFinalSummary,
          winnerTeamId: existingFinal?.winnerTeamId ?? null,
          scheduledAt: existingFinal?.scheduledAt ?? semifinals[1]?.scheduledAt ?? semifinals[0]?.scheduledAt ?? null
        },
        create: {
          seasonId: season.id,
          stageId: ensuredFinalStage.id,
          title: `${season.title} 总决赛`,
          slug: `${season.slug}-final`,
          format: `BO${ensuredFinalStage.bestOf ?? 3}`,
          bestOf: ensuredFinalStage.bestOf ?? 3,
          roundNumber: 2,
          sequenceNumber: 1,
          status: MatchStatus.SCHEDULED,
          summary: semifinalFinalSummary,
          scheduledAt: semifinals[1]?.scheduledAt ?? semifinals[0]?.scheduledAt ?? null,
          winnerTeamId: null
        }
      });

      const syncedFinal = await db.match.findUnique({
        where: { slug: `${season.slug}-final` },
        select: { id: true, bestOf: true, status: true }
      });

      if (syncedFinal) {
        await replaceMatchStructure(
          syncedFinal.id,
          [
            {
              teamId: leftWinnerId,
              slotNumber: 1,
              sideLabel: "A",
              score: null,
              rank: null,
              result: MatchParticipantResult.PENDING,
              isWinner: false,
              note: "半决赛 1 胜者"
            },
            {
              teamId: rightWinnerId,
              slotNumber: 2,
              sideLabel: "B",
              score: null,
              rank: null,
              result: MatchParticipantResult.PENDING,
              isWinner: false,
              note: "半决赛 2 胜者"
            }
          ],
          buildTemplateGames([
            { teamId: leftWinnerId, slotNumber: 1, sideLabel: "A" },
            { teamId: rightWinnerId, slotNumber: 2, sideLabel: "B" }
          ], syncedFinal.bestOf ?? 3, syncedFinal.status),
          season.id
        );
      }
    } else if (existingFinal) {
      await db.match.delete({
        where: { id: existingFinal.id }
      });
    }
  }
}

function hasTeamId(participant: ParticipantDraft): participant is ParticipantInput {
  return typeof participant.teamId === "string" && participant.teamId.length > 0;
}

function buildParticipantInputs(payload: {
  title: string;
  slug: string;
  externalMatchId?: string;
  scheduledAt?: string;
  format?: string;
  status: MatchStatus | "DRAFT" | "SCHEDULED" | "LIVE" | "FINISHED" | "ARCHIVED";
  streamUrl?: string;
  summary?: string;
  topicId?: string;
  seasonId?: string;
  winnerTeamId?: string;
  teamAId?: string;
  teamBId?: string;
  teamCId?: string;
  teamDId?: string;
  scoreA?: number;
  scoreB?: number;
  scoreC?: number;
  scoreD?: number;
  rankA?: number;
  rankB?: number;
  rankC?: number;
  rankD?: number;
}) {
  const participantDrafts: ParticipantDraft[] = [
    { teamId: payload.teamAId, sideLabel: "A", score: payload.scoreA, rank: payload.rankA },
    { teamId: payload.teamBId, sideLabel: "B", score: payload.scoreB, rank: payload.rankB },
    { teamId: payload.teamCId, sideLabel: "C", score: payload.scoreC, rank: payload.rankC },
    { teamId: payload.teamDId, sideLabel: "D", score: payload.scoreD, rank: payload.rankD }
  ];
  const participants = participantDrafts.filter(hasTeamId);

  const resolvedWinnerTeamId = inferWinnerTeamId(
    participants.map((participant) => ({
      teamId: participant.teamId,
      score: participant.score ?? null,
      rank: participant.rank ?? null
    })),
    payload.winnerTeamId || undefined
  );

  const isDraw = participants.length === 2
    && participants.every((participant) => participant.score !== undefined && participant.score !== null)
    && participants[0]?.score === participants[1]?.score
    && !resolvedWinnerTeamId;

  return {
    participants: participants.map((participant, index) => ({
      teamId: participant.teamId,
      slotNumber: index + 1,
      sideLabel: participant.sideLabel,
      score: participant.score ?? null,
      rank: participant.rank ?? null,
      result: isDraw
        ? MatchParticipantResult.DRAW
        : participant.teamId === resolvedWinnerTeamId
          ? MatchParticipantResult.WIN
          : resolvedWinnerTeamId
            ? MatchParticipantResult.LOSS
            : MatchParticipantResult.PENDING,
      isWinner: participant.teamId === resolvedWinnerTeamId
    })),
    winnerTeamId: resolvedWinnerTeamId,
    bestOf: inferBestOf(payload.format)
  };
}

function toMatchData(payload: {
  title: string;
  slug: string;
  externalMatchId?: string;
  scheduledAt?: string;
  format?: string;
  status: MatchStatus | "DRAFT" | "SCHEDULED" | "LIVE" | "FINISHED" | "ARCHIVED";
  streamUrl?: string;
  summary?: string;
  topicId?: string;
  seasonId?: string;
  stageId?: string;
  roundNumber?: number;
  sequenceNumber?: number;
  winnerTeamId?: string | null;
  bestOf?: number | null;
}) {
  return {
    title: payload.title,
    slug: payload.slug,
    externalMatchId: payload.externalMatchId || null,
    scheduledAt: normalizeDateTime(payload.scheduledAt),
    format: payload.format || null,
    bestOf: payload.bestOf ?? null,
    status: payload.status,
    streamUrl: payload.streamUrl || null,
    summary: payload.summary || null,
    topicId: payload.topicId || null,
    seasonId: payload.seasonId || null,
    stageId: payload.stageId || null,
    roundNumber: payload.roundNumber ?? null,
    sequenceNumber: payload.sequenceNumber ?? null,
    winnerTeamId: payload.winnerTeamId || null
  };
}

export async function generateMatchTemplateAction(_: MatchFormState, formData: FormData): Promise<MatchFormState> {
  const payload = createMatchTemplateSchema.safeParse({
    seasonId: formData.get("seasonId"),
    template: formData.get("template"),
    bestOf: formData.get("bestOf"),
    scheduledAt: formData.get("scheduledAt"),
    replaceExisting: formData.get("replaceExisting"),
    teamAId: formData.get("teamAId"),
    teamBId: formData.get("teamBId"),
    teamCId: formData.get("teamCId"),
    teamDId: formData.get("teamDId")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "赛程模板校验失败。"
    };
  }

  const season = await db.tournamentSeason.findUnique({
    where: { id: payload.data.seasonId },
    select: { id: true, slug: true, title: true }
  });

  if (!season) {
    return {
      status: "error",
      message: "所选赛季不存在。"
    };
  }

  const scheduledAt = normalizeTemplateDate(payload.data.scheduledAt || undefined);
  const participantTeamIds = [payload.data.teamAId, payload.data.teamBId, payload.data.teamCId, payload.data.teamDId]
    .filter((teamId): teamId is string => Boolean(teamId));
  const selectedTeams = participantTeamIds.length
    ? await db.team.findMany({
        where: {
          id: {
            in: participantTeamIds
          }
        },
        select: {
          id: true,
          name: true
        }
      })
    : [];
  const teamNameById = new Map(selectedTeams.map((team) => [team.id, team.name]));

  await ensureSeasonTeams(db, season.id, participantTeamIds.map((teamId) => ({ id: teamId })));

  await Promise.all(
    participantTeamIds.map((teamId, index) =>
      db.seasonTeam.update({
        where: {
          seasonId_teamId: {
            seasonId: season.id,
            teamId
          }
        },
        data: {
          seedNumber: index + 1
        }
      })
    )
  );

  if (payload.data.replaceExisting) {
    await db.match.deleteMany({
      where: { seasonId: season.id }
    });
    await db.matchStage.deleteMany({
      where: { seasonId: season.id }
    });
  }

  const bestOf = payload.data.bestOf;
  const format = `BO${bestOf}`;
  const directSummary = `${formatSeededTeamLabel(payload.data.teamAId, 1, teamNameById)} 对阵 ${formatSeededTeamLabel(payload.data.teamBId, 2, teamNameById)}，直接进入 BO${bestOf} 总决赛。`;
  const gauntletQualifierSummary = `${formatSeededTeamLabel(payload.data.teamBId, 2, teamNameById)} 与 ${formatSeededTeamLabel(payload.data.teamCId, 3, teamNameById)} 先打预选，胜者挑战 ${formatSeededTeamLabel(payload.data.teamAId, 1, teamNameById)}。`;
  const semifinalOneSummary = `${formatSeededTeamLabel(payload.data.teamAId, 1, teamNameById)} 对阵 ${formatSeededTeamLabel(payload.data.teamDId, 4, teamNameById)}，胜者进入总决赛席位 A。`;
  const semifinalTwoSummary = `${formatSeededTeamLabel(payload.data.teamBId, 2, teamNameById)} 对阵 ${formatSeededTeamLabel(payload.data.teamCId, 3, teamNameById)}，胜者进入总决赛席位 B。`;

  if (payload.data.template === "DIRECT_BO3") {
    const stage = await upsertMatchStage(db, {
      seasonId: season.id,
      name: "总决赛",
      slug: "final",
      stageType: MatchStageType.FINAL,
      sortOrder: 30,
      bestOf,
      advanceRule: "两支队伍直接进行 BO3"
    });

    const match = await db.match.upsert({
      where: { slug: `${season.slug}-final` },
      update: {
        seasonId: season.id,
        stageId: stage.id,
        title: `${season.title} 总决赛`,
        format,
        bestOf,
        roundNumber: 1,
        sequenceNumber: 1,
        status: MatchStatus.SCHEDULED,
        summary: directSummary,
        scheduledAt,
        winnerTeamId: null
      },
      create: {
        seasonId: season.id,
        stageId: stage.id,
        title: `${season.title} 总决赛`,
        slug: `${season.slug}-final`,
        format,
        bestOf,
        roundNumber: 1,
        sequenceNumber: 1,
        status: MatchStatus.SCHEDULED,
        summary: directSummary,
        scheduledAt,
        winnerTeamId: null
      }
    });

    const leftTeamId = payload.data.teamAId;
    const rightTeamId = payload.data.teamBId;
    if (leftTeamId && rightTeamId) {
      await replaceMatchStructure(
        match.id,
        [
          { teamId: leftTeamId, slotNumber: 1, sideLabel: "A", score: null, rank: null, result: MatchParticipantResult.PENDING, isWinner: false, note: "1 号种子" },
          { teamId: rightTeamId, slotNumber: 2, sideLabel: "B", score: null, rank: null, result: MatchParticipantResult.PENDING, isWinner: false, note: "2 号种子" }
        ],
        buildTemplateGames([
          { teamId: leftTeamId, slotNumber: 1, sideLabel: "A" },
          { teamId: rightTeamId, slotNumber: 2, sideLabel: "B" }
        ], bestOf, MatchStatus.SCHEDULED),
        season.id
      );
    }
  }

  if (payload.data.template === "GAUNTLET") {
    const stage = await upsertMatchStage(db, {
      seasonId: season.id,
      name: "擂台赛",
      slug: "gauntlet",
      stageType: MatchStageType.BRACKET,
      sortOrder: 20,
      bestOf,
      advanceRule: "预选胜者挑战擂主"
    });

    const challengerAId = payload.data.teamBId;
    const challengerBId = payload.data.teamCId;

    if (challengerAId && challengerBId) {
      const qualifier = await db.match.upsert({
        where: { slug: `${season.slug}-gauntlet-qualifier` },
        update: {
          seasonId: season.id,
          stageId: stage.id,
          title: `${season.title} 擂台预选`,
          format,
          bestOf,
          roundNumber: 1,
          sequenceNumber: 1,
          status: MatchStatus.SCHEDULED,
          summary: gauntletQualifierSummary,
          scheduledAt,
          winnerTeamId: null
        },
        create: {
          seasonId: season.id,
          stageId: stage.id,
          title: `${season.title} 擂台预选`,
          slug: `${season.slug}-gauntlet-qualifier`,
          format,
          bestOf,
          roundNumber: 1,
          sequenceNumber: 1,
          status: MatchStatus.SCHEDULED,
          summary: gauntletQualifierSummary,
          scheduledAt,
          winnerTeamId: null
        }
      });

      await replaceMatchStructure(
        qualifier.id,
        [
          { teamId: challengerAId, slotNumber: 1, sideLabel: "A", score: null, rank: null, result: MatchParticipantResult.PENDING, isWinner: false, note: "2 号种子" },
          { teamId: challengerBId, slotNumber: 2, sideLabel: "B", score: null, rank: null, result: MatchParticipantResult.PENDING, isWinner: false, note: "3 号种子" }
        ],
        buildTemplateGames([
          { teamId: challengerAId, slotNumber: 1, sideLabel: "A" },
          { teamId: challengerBId, slotNumber: 2, sideLabel: "B" }
        ], bestOf, MatchStatus.SCHEDULED),
        season.id
      );
    }
  }

  if (payload.data.template === "FINAL_FOUR") {
    const semifinalStage = await upsertMatchStage(db, {
      seasonId: season.id,
      name: "半决赛",
      slug: "semifinal",
      stageType: MatchStageType.BRACKET,
      sortOrder: 20,
      bestOf,
      advanceRule: "两场半决赛胜者晋级总决赛"
    });
    await upsertMatchStage(db, {
      seasonId: season.id,
      name: "总决赛",
      slug: "final",
      stageType: MatchStageType.FINAL,
      sortOrder: 30,
      bestOf,
      advanceRule: "半决赛胜者争冠"
    });

    const semiPairs = [
      { slug: `${season.slug}-semifinal-1`, title: `${season.title} 半决赛 1`, leftTeamId: payload.data.teamAId, rightTeamId: payload.data.teamDId, sequenceNumber: 1 },
      { slug: `${season.slug}-semifinal-2`, title: `${season.title} 半决赛 2`, leftTeamId: payload.data.teamBId, rightTeamId: payload.data.teamCId, sequenceNumber: 2 }
    ];

    for (const pair of semiPairs) {
      if (!pair.leftTeamId || !pair.rightTeamId) {
        continue;
      }

      const semifinal = await db.match.upsert({
        where: { slug: pair.slug },
        update: {
          seasonId: season.id,
          stageId: semifinalStage.id,
          title: pair.title,
          format,
          bestOf,
          roundNumber: 1,
          sequenceNumber: pair.sequenceNumber,
          status: MatchStatus.SCHEDULED,
          summary: pair.sequenceNumber === 1 ? semifinalOneSummary : semifinalTwoSummary,
          scheduledAt,
          winnerTeamId: null
        },
        create: {
          seasonId: season.id,
          stageId: semifinalStage.id,
          title: pair.title,
          slug: pair.slug,
          format,
          bestOf,
          roundNumber: 1,
          sequenceNumber: pair.sequenceNumber,
          status: MatchStatus.SCHEDULED,
          summary: pair.sequenceNumber === 1 ? semifinalOneSummary : semifinalTwoSummary,
          scheduledAt,
          winnerTeamId: null
        }
      });

      await replaceMatchStructure(
        semifinal.id,
        [
          {
            teamId: pair.leftTeamId,
            slotNumber: 1,
            sideLabel: "A",
            score: null,
            rank: null,
            result: MatchParticipantResult.PENDING,
            isWinner: false,
            note: pair.sequenceNumber === 1 ? "1 号种子" : "2 号种子"
          },
          {
            teamId: pair.rightTeamId,
            slotNumber: 2,
            sideLabel: "B",
            score: null,
            rank: null,
            result: MatchParticipantResult.PENDING,
            isWinner: false,
            note: pair.sequenceNumber === 1 ? "4 号种子" : "3 号种子"
          }
        ],
        buildTemplateGames([
          { teamId: pair.leftTeamId, slotNumber: 1, sideLabel: "A" },
          { teamId: pair.rightTeamId, slotNumber: 2, sideLabel: "B" }
        ], bestOf, MatchStatus.SCHEDULED),
        season.id
      );
    }
  }

  await syncGeneratedBracketMatches(season.id);
  revalidateMatchViews();

  return {
    status: "success",
    message: `${season.title} 已按模板生成赛程。`
  };
}

export async function createMatchAction(_: MatchFormState, formData: FormData): Promise<MatchFormState> {
  const payload = createMatchSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    externalMatchId: formData.get("externalMatchId"),
    scheduledAt: formData.get("scheduledAt"),
    format: formData.get("format"),
    status: formData.get("status"),
    streamUrl: formData.get("streamUrl"),
    summary: formData.get("summary"),
    topicId: formData.get("topicId"),
    seasonId: formData.get("seasonId"),
    stageId: formData.get("stageId"),
    roundNumber: formData.get("roundNumber"),
    sequenceNumber: formData.get("sequenceNumber"),
    winnerTeamId: formData.get("winnerTeamId"),
    teamAId: formData.get("teamAId"),
    teamBId: formData.get("teamBId"),
    teamCId: formData.get("teamCId"),
    teamDId: formData.get("teamDId"),
    scoreA: formData.get("scoreA"),
    scoreB: formData.get("scoreB"),
    scoreC: formData.get("scoreC"),
    scoreD: formData.get("scoreD"),
    rankA: formData.get("rankA"),
    rankB: formData.get("rankB"),
    rankC: formData.get("rankC"),
    rankD: formData.get("rankD"),
    gameExternalMatchId1: formData.get("gameExternalMatchId1"),
    gameExternalMatchId2: formData.get("gameExternalMatchId2"),
    gameExternalMatchId3: formData.get("gameExternalMatchId3"),
    gameExternalMatchId4: formData.get("gameExternalMatchId4"),
    gameExternalMatchId5: formData.get("gameExternalMatchId5"),
    gameWinnerTeamId1: formData.get("gameWinnerTeamId1"),
    gameWinnerTeamId2: formData.get("gameWinnerTeamId2"),
    gameWinnerTeamId3: formData.get("gameWinnerTeamId3"),
    gameWinnerTeamId4: formData.get("gameWinnerTeamId4"),
    gameWinnerTeamId5: formData.get("gameWinnerTeamId5"),
    gameStatus1: formData.get("gameStatus1") || undefined,
    gameStatus2: formData.get("gameStatus2") || undefined,
    gameStatus3: formData.get("gameStatus3") || undefined,
    gameStatus4: formData.get("gameStatus4") || undefined,
    gameStatus5: formData.get("gameStatus5") || undefined,
    gameSummary1: formData.get("gameSummary1"),
    gameSummary2: formData.get("gameSummary2"),
    gameSummary3: formData.get("gameSummary3"),
    gameSummary4: formData.get("gameSummary4"),
    gameSummary5: formData.get("gameSummary5")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "表单校验失败。"
    };
  }

  try {
    const participantData = buildParticipantInputs(payload.data);
    const games = buildGameInputs({
      ...payload.data,
      bestOf: participantData.bestOf,
      participants: participantData.participants,
      winnerTeamId: participantData.winnerTeamId
    });

    const match = await db.match.create({
      data: toMatchData({
        ...payload.data,
        winnerTeamId: participantData.winnerTeamId,
        bestOf: participantData.bestOf
      })
    });

    await replaceMatchStructure(match.id, participantData.participants, games, payload.data.seasonId || undefined);

    if (payload.data.seasonId) {
      await syncGeneratedBracketMatches(payload.data.seasonId);
    }

    revalidateMatchViews();

    return {
      status: "success",
      message: `比赛 ${payload.data.title} 已创建。`
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        status: "error",
        message: "slug 已存在，请更换一个新的 slug。"
      };
    }

    return {
      status: "error",
      message: "创建比赛失败，请检查数据库连接或稍后重试。"
    };
  }
}

export async function updateMatchAction(formData: FormData) {
  const payload = updateMatchSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    externalMatchId: formData.get("externalMatchId"),
    scheduledAt: formData.get("scheduledAt"),
    format: formData.get("format"),
    status: formData.get("status"),
    streamUrl: formData.get("streamUrl"),
    summary: formData.get("summary"),
    topicId: formData.get("topicId"),
    seasonId: formData.get("seasonId"),
    stageId: formData.get("stageId"),
    roundNumber: formData.get("roundNumber"),
    sequenceNumber: formData.get("sequenceNumber"),
    winnerTeamId: formData.get("winnerTeamId"),
    teamAId: formData.get("teamAId"),
    teamBId: formData.get("teamBId"),
    teamCId: formData.get("teamCId"),
    teamDId: formData.get("teamDId"),
    scoreA: formData.get("scoreA"),
    scoreB: formData.get("scoreB"),
    scoreC: formData.get("scoreC"),
    scoreD: formData.get("scoreD"),
    rankA: formData.get("rankA"),
    rankB: formData.get("rankB"),
    rankC: formData.get("rankC"),
    rankD: formData.get("rankD"),
    gameExternalMatchId1: formData.get("gameExternalMatchId1"),
    gameExternalMatchId2: formData.get("gameExternalMatchId2"),
    gameExternalMatchId3: formData.get("gameExternalMatchId3"),
    gameExternalMatchId4: formData.get("gameExternalMatchId4"),
    gameExternalMatchId5: formData.get("gameExternalMatchId5"),
    gameWinnerTeamId1: formData.get("gameWinnerTeamId1"),
    gameWinnerTeamId2: formData.get("gameWinnerTeamId2"),
    gameWinnerTeamId3: formData.get("gameWinnerTeamId3"),
    gameWinnerTeamId4: formData.get("gameWinnerTeamId4"),
    gameWinnerTeamId5: formData.get("gameWinnerTeamId5"),
    gameStatus1: formData.get("gameStatus1") || undefined,
    gameStatus2: formData.get("gameStatus2") || undefined,
    gameStatus3: formData.get("gameStatus3") || undefined,
    gameStatus4: formData.get("gameStatus4") || undefined,
    gameStatus5: formData.get("gameStatus5") || undefined,
    gameSummary1: formData.get("gameSummary1"),
    gameSummary2: formData.get("gameSummary2"),
    gameSummary3: formData.get("gameSummary3"),
    gameSummary4: formData.get("gameSummary4"),
    gameSummary5: formData.get("gameSummary5")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "更新比赛失败。");
  }

  const participantData = buildParticipantInputs(payload.data);
  const games = buildGameInputs({
    ...payload.data,
    bestOf: participantData.bestOf,
    participants: participantData.participants,
    winnerTeamId: participantData.winnerTeamId
  });

  await db.match.update({
    where: { id: payload.data.id },
    data: toMatchData({
      ...payload.data,
      winnerTeamId: participantData.winnerTeamId,
      bestOf: participantData.bestOf
    })
  });

  await replaceMatchStructure(payload.data.id, participantData.participants, games, payload.data.seasonId || undefined);

  if (payload.data.seasonId) {
    await syncGeneratedBracketMatches(payload.data.seasonId);
  }

  revalidateMatchViews();
}

export async function deleteMatchAction(formData: FormData) {
  const payload = deleteMatchSchema.safeParse({
    id: formData.get("id")
  });

  if (!payload.success) {
    throw new Error(payload.error.issues[0]?.message ?? "删除比赛失败。");
  }

  await db.match.delete({
    where: { id: payload.data.id }
  });

  revalidateMatchViews();
}
