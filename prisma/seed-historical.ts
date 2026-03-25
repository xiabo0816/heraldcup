import { MatchStatus, PrismaClient, TournamentKind } from "@prisma/client";
import { historicalTournamentData } from "./historical-data";
import {
  ensureSeasonTeams,
  inferBestOf,
  inferHeadToHeadResults,
  upsertStructuredMatch
} from "./match-structure";

const prisma = new PrismaClient();

function toTournamentKind(kind: (typeof historicalTournamentData)[number]["tournament"]["kind"]) {
  return TournamentKind[kind];
}

function toMatchStatus(status: (typeof historicalTournamentData)[number]["seasons"][number]["matches"][number]["status"]) {
  return MatchStatus[status];
}

async function main() {
  for (const item of historicalTournamentData) {
    const tournament = await prisma.tournament.upsert({
      where: { slug: item.tournament.slug },
      update: {
        description: item.tournament.description,
        kind: toTournamentKind(item.tournament.kind)
      },
      create: {
        name: item.tournament.name,
        slug: item.tournament.slug,
        kind: toTournamentKind(item.tournament.kind),
        description: item.tournament.description
      }
    });

    for (const seasonData of item.seasons) {
      const existingSeason = await prisma.tournamentSeason.findUnique({
        where: { slug: seasonData.slug },
        select: { id: true }
      });

      if (existingSeason) {
        continue;
      }

      const season = await prisma.tournamentSeason.upsert({
        where: { slug: seasonData.slug },
        update: {
          title: seasonData.title,
          seasonNumber: seasonData.seasonNumber,
          statusLabel: seasonData.statusLabel,
          themeColor: seasonData.themeColor,
          summary: seasonData.summary
        },
        create: {
          tournamentId: tournament.id,
          title: seasonData.title,
          slug: seasonData.slug,
          seasonNumber: seasonData.seasonNumber,
          statusLabel: seasonData.statusLabel,
          themeColor: seasonData.themeColor,
          summary: seasonData.summary
        }
      });

      const teamIdBySlug = new Map<string, string>();

      for (const teamData of seasonData.teams) {
        const team = await prisma.team.upsert({
          where: { slug: teamData.slug },
          update: {
            name: teamData.name,
            slogan: teamData.slogan
          },
          create: {
            name: teamData.name,
            slug: teamData.slug,
            slogan: teamData.slogan
          }
        });

        teamIdBySlug.set(teamData.slug, team.id);
      }

      const seasonTeamIds = await ensureSeasonTeams(
        prisma,
        season.id,
        [...teamIdBySlug.values()].map((teamId) => ({ id: teamId }))
      );

      for (const matchData of seasonData.matches) {
        const homeTeamId = teamIdBySlug.get(matchData.homeTeamSlug);
        const awayTeamId = teamIdBySlug.get(matchData.awayTeamSlug);

        if (!homeTeamId || !awayTeamId) {
          continue;
        }

        const result = inferHeadToHeadResults(matchData.scoreHome, matchData.scoreAway);
        const winnerTeamId = result.winnerIndex === 0 ? homeTeamId : result.winnerIndex === 1 ? awayTeamId : null;

        await upsertStructuredMatch(prisma, {
          title: matchData.title,
          slug: matchData.slug,
          format: matchData.format,
          bestOf: inferBestOf(matchData.format),
          status: toMatchStatus(matchData.status),
          summary: matchData.summary,
          seasonId: season.id,
          winnerTeamId,
          participants: [
            {
              teamId: homeTeamId,
              seasonTeamId: seasonTeamIds.get(homeTeamId) ?? null,
              slotNumber: 1,
              sideLabel: "A",
              score: matchData.scoreHome,
              rank: result.winnerIndex === null ? null : result.winnerIndex === 0 ? 1 : 2,
              result: result.first,
              isWinner: result.winnerIndex === 0
            },
            {
              teamId: awayTeamId,
              seasonTeamId: seasonTeamIds.get(awayTeamId) ?? null,
              slotNumber: 2,
              sideLabel: "B",
              score: matchData.scoreAway,
              rank: result.winnerIndex === null ? null : result.winnerIndex === 1 ? 1 : 2,
              result: result.second,
              isWinner: result.winnerIndex === 1
            }
          ]
        });
      }
    }
  }
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
