import { PrismaClient, MatchStatus, TournamentKind } from "@prisma/client";
import { historicalTournamentData } from "./historical-data";

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
            slogan: teamData.slogan,
            seasonId: season.id
          },
          create: {
            name: teamData.name,
            slug: teamData.slug,
            slogan: teamData.slogan,
            seasonId: season.id
          }
        });

        teamIdBySlug.set(teamData.slug, team.id);
      }

      for (const matchData of seasonData.matches) {
        await prisma.match.upsert({
          where: { slug: matchData.slug },
          update: {
            title: matchData.title,
            format: matchData.format,
            status: toMatchStatus(matchData.status),
            participantTeamNames: [matchData.homeTeamSlug, matchData.awayTeamSlug],
            homeTeamId: teamIdBySlug.get(matchData.homeTeamSlug),
            awayTeamId: teamIdBySlug.get(matchData.awayTeamSlug),
            scoreHome: matchData.scoreHome,
            scoreAway: matchData.scoreAway,
            summary: matchData.summary,
            seasonId: season.id
          },
          create: {
            title: matchData.title,
            slug: matchData.slug,
            format: matchData.format,
            status: toMatchStatus(matchData.status),
            participantTeamNames: [matchData.homeTeamSlug, matchData.awayTeamSlug],
            homeTeamId: teamIdBySlug.get(matchData.homeTeamSlug),
            awayTeamId: teamIdBySlug.get(matchData.awayTeamSlug),
            scoreHome: matchData.scoreHome,
            scoreAway: matchData.scoreAway,
            summary: matchData.summary,
            seasonId: season.id
          }
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
