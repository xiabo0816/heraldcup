import { MatchStatus, PrismaClient, TournamentKind } from "@prisma/client";
import { communityArchiveCups, communityArchivePlayers, communityArchiveTeams } from "./community-archive-data";

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

  return `item-${Buffer.from(value).toString("hex").slice(0, 12)}`;
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

async function main() {
  const tournament = await prisma.tournament.upsert({
    where: { slug: "pioneer-cup" },
    update: {
      name: "先锋杯",
      kind: TournamentKind.PIONEER,
      description: "今晚就来社区的先锋杯历史档案。"
    },
    create: {
      name: "先锋杯",
      slug: "pioneer-cup",
      kind: TournamentKind.PIONEER,
      description: "今晚就来社区的先锋杯历史档案。"
    }
  });

  const playerIdByName = new Map<string, string>();
  for (const playerData of communityArchivePlayers) {
    const existingPlayer = await prisma.player.findFirst({ where: { displayName: playerData.name } });
    const player = existingPlayer
      ? await prisma.player.update({
          where: { id: existingPlayer.id },
          data: {
            slug: isStableAsciiSlug(existingPlayer.slug) ? existingPlayer.slug : toSlug(playerData.name),
            championshipCount: playerData.championshipCount,
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
            heroPool: [],
            highlightMatchIds: [],
            active: true,
            avatarUrl: avatarUrl(playerData.name),
            bio: `${playerData.formerTeamNames.join(" / ")} 的社区老将。`
          }
        });

    playerIdByName.set(playerData.name, player.id);
  }

  const teamIdByName = new Map<string, string>();
  for (const teamData of communityArchiveTeams) {
    const existingTeam = await prisma.team.findFirst({ where: { name: teamData.name } });
    const team = existingTeam
      ? await prisma.team.update({
          where: { id: existingTeam.id },
          data: {
            slug: isStableAsciiSlug(existingTeam.slug) ? existingTeam.slug : toSlug(teamData.name),
            championshipCount: teamData.championshipCount,
            summary: `${teamData.name} 在社区赛事中累计夺冠 ${teamData.championshipCount} 次。`
          }
        })
      : await prisma.team.create({
          data: {
            name: teamData.name,
            slug: toSlug(teamData.name),
            championshipCount: teamData.championshipCount,
            summary: `${teamData.name} 在社区赛事中累计夺冠 ${teamData.championshipCount} 次。`
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

  for (const cupData of communityArchiveCups) {
    const seasonNumber = extractSeasonNumber(cupData.title);
    const season = await prisma.tournamentSeason.upsert({
      where: { slug: `pioneer-cup-s${seasonNumber}` },
      update: {
        title: cupData.title,
        seasonNumber,
        statusLabel: "已完赛",
        summary: `${cupData.title} 参赛队伍：${cupData.participantTeamNames.join("、")}，冠军：${cupData.championTeamName}。`
      },
      create: {
        tournamentId: tournament.id,
        title: cupData.title,
        slug: `pioneer-cup-s${seasonNumber}`,
        seasonNumber,
        startDate: new Date(cupData.scheduledAt),
        endDate: new Date(cupData.scheduledAt),
        statusLabel: "已完赛",
        summary: `${cupData.title} 参赛队伍：${cupData.participantTeamNames.join("、")}，冠军：${cupData.championTeamName}。`
      }
    });

    const championTeamId = teamIdByName.get(cupData.championTeamName) ?? null;
    const homeTeamId = teamIdByName.get(cupData.participantTeamNames[0]) ?? null;
    const awayTeamId = teamIdByName.get(cupData.participantTeamNames[1]) ?? null;

    await prisma.match.upsert({
      where: { slug: `pioneer-cup-s${seasonNumber}-archive` },
      update: {
        title: cupData.title,
        scheduledAt: new Date(cupData.scheduledAt),
        format: cupData.participantTeamNames.length > 2 ? "淘汰赛阶段" : "BO3",
        status: MatchStatus.FINISHED,
        summary: `${cupData.title} 参赛队伍：${cupData.participantTeamNames.join("、")}，冠军队伍：${cupData.championTeamName}。`,
        participantTeamNames: [...cupData.participantTeamNames],
        seasonId: season.id,
        homeTeamId,
        awayTeamId,
        championTeamId
      },
      create: {
        title: cupData.title,
        slug: `pioneer-cup-s${seasonNumber}-archive`,
        scheduledAt: new Date(cupData.scheduledAt),
        format: cupData.participantTeamNames.length > 2 ? "淘汰赛阶段" : "BO3",
        status: MatchStatus.FINISHED,
        summary: `${cupData.title} 参赛队伍：${cupData.participantTeamNames.join("、")}，冠军队伍：${cupData.championTeamName}。`,
        participantTeamNames: [...cupData.participantTeamNames],
        seasonId: season.id,
        homeTeamId,
        awayTeamId,
        championTeamId
      }
    });
  }

  console.log(`已导入 ${communityArchiveTeams.length} 支战队、${communityArchivePlayers.length} 名选手、${communityArchiveCups.length} 届先锋杯历史数据。`);
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