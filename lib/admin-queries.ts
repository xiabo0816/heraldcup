import { db } from "@/lib/db";
import { demoAnnouncements, demoCommunityEvents, demoCommunityTopics, demoContentPages, demoMatches, demoPlayers, demoRecruitmentPosts, demoTeams } from "@/lib/demo-data";

const dbRuntime = db as unknown as {
  team: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  };
  tournamentSeason: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  };
  matchStage: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  };
  match: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  };
  communityTopic: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  };
};

const demoSeasons = [
  {
    id: "season-pioneer-s11",
    title: "第十一届先锋杯"
  }
];

const demoTopicOptions = demoCommunityTopics.map((topic) => ({
  id: topic.id,
  title: topic.title
}));

export async function getAdminTeamsData() {
  try {
    const [teams, seasons] = await Promise.all([
      dbRuntime.team.findMany({
        include: {
          seasonEntries: {
            include: {
              season: true
            },
            orderBy: {
              createdAt: "desc"
            }
          },
          members: {
            where: { isCurrent: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      dbRuntime.tournamentSeason.findMany({
        orderBy: [{ tournamentId: "asc" }, { seasonNumber: "desc" }]
      })
    ]);

    return {
      teams: teams.map((team) => {
        const seasonEntries = Array.isArray(team.seasonEntries) ? team.seasonEntries as Array<{ season?: { title?: string | null } | null }> : [];
        const members = Array.isArray(team.members) ? team.members : [];

        return {
          id: String(team.id),
          name: String(team.name),
          slug: String(team.slug),
          slogan: typeof team.slogan === "string" ? team.slogan : null,
          logoUrl: typeof team.logoUrl === "string" ? team.logoUrl : null,
          honorPoints: typeof team.honorPoints === "number" ? team.honorPoints : 0,
          coach: typeof team.coach === "string" ? team.coach : null,
          captain: typeof team.captain === "string" ? team.captain : null,
          summary: typeof team.summary === "string" ? team.summary : null,
          latestSeasonTitle: seasonEntries[0]?.season?.title ?? "未关联赛季",
          seasonCount: seasonEntries.length,
          memberCount: members.length
        };
      }),
      seasons: seasons.map((season) => ({
        id: String(season.id),
        title: String(season.title)
      }))
    };
  } catch {
    return {
      teams: demoTeams.map((team) => ({
        id: team.id,
        name: team.name,
        slug: team.slug,
        slogan: team.slogan,
        logoUrl: null,
        honorPoints: 0,
        coach: null,
        captain: null,
        summary: null,
        latestSeasonTitle: "未关联赛季",
        seasonCount: 0,
        memberCount: team.members.length
      })),
      seasons: demoSeasons
    };
  }
}

export async function getAdminPlayersData() {
  try {
    const players = await db.player.findMany({
      include: {
        teamMemberships: {
          where: { isCurrent: true },
          include: {
            team: true
          },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return players.map((player) => {
      const featuredPlayer = player as typeof player & { featured?: boolean };

      return {
      id: player.id,
      displayName: player.displayName,
      slug: player.slug,
      steamId: player.steamId,
      primaryRole: player.primaryRole,
      preferredRoles: player.preferredRoles,
      heroPool: player.heroPool,
      ladderScore: player.ladderScore,
      gameYears: player.gameYears,
      playStyles: player.playStyles,
      highlightMatchIds: player.highlightMatchIds,
      bio: player.bio,
      gameUnderstanding: player.gameUnderstanding,
      active: player.active,
      featured: featuredPlayer.featured ?? false,
      teamName: player.teamMemberships[0]?.team.name ?? "自由选手"
      };
    });
  } catch {
    return demoPlayers.map((player) => ({
      id: player.id,
      displayName: player.displayName,
      slug: player.slug,
      steamId: null,
      primaryRole: player.primaryRole,
      preferredRoles: player.preferredRoles ?? [],
      heroPool: player.heroPool,
      ladderScore: player.ladderScore ?? null,
      gameYears: player.gameYears ?? null,
      playStyles: player.playStyles ?? [],
      highlightMatchIds: player.highlightMatchIds,
      bio: null,
      gameUnderstanding: player.gameUnderstanding ?? null,
      active: true,
      featured: player.featured ?? false,
      teamName: player.teamName
    }));
  }
}

export async function getAdminClaimRequestsData() {
  try {
    const claimRequests = await db.claimRequest.findMany({
      include: {
        user: true,
        player: {
          include: {
            teamMemberships: {
              where: { isCurrent: true },
              include: { team: true },
              take: 1
            }
          }
        },
        binding: true,
        reviewedBy: true
      },
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }]
    });

    return claimRequests
      .sort((left, right) => {
        if (left.status === right.status) {
          return right.submittedAt.getTime() - left.submittedAt.getTime();
        }

        if (left.status === "PENDING") {
          return -1;
        }

        if (right.status === "PENDING") {
          return 1;
        }

        return right.submittedAt.getTime() - left.submittedAt.getTime();
      })
      .map((claim) => ({
        id: claim.id,
        status: claim.status,
        submittedAt: claim.submittedAt.toISOString(),
        reviewedAt: claim.reviewedAt?.toISOString() ?? null,
        submittedSteamId: claim.submittedSteamId,
        note: claim.note,
        reviewNote: claim.reviewNote,
        applicant: {
          id: claim.user.id,
          name: claim.user.name,
          email: claim.user.email
        },
        player: {
          id: claim.player.id,
          displayName: claim.player.displayName,
          slug: claim.player.slug,
          teamName: claim.player.teamMemberships[0]?.team.name ?? "自由选手"
        },
        binding: {
          id: claim.binding.id,
          steamId: claim.binding.steamId,
          status: claim.binding.status,
          lastBoundAt: claim.binding.lastBoundAt?.toISOString() ?? null
        },
        reviewerName: claim.reviewedBy?.name ?? null
      }));
  } catch {
    return [];
  }
}

export async function getAdminClaimRequestDetailData(claimRequestId: string) {
  try {
    const claim = await db.claimRequest.findUnique({
      where: { id: claimRequestId },
      include: {
        user: true,
        player: {
          include: {
            teamMemberships: {
              where: { isCurrent: true },
              include: { team: true },
              take: 1
            }
          }
        },
        binding: true,
        reviewedBy: true
      }
    });

    if (!claim) {
      return null;
    }

    return {
      id: claim.id,
      status: claim.status,
      submittedAt: claim.submittedAt.toISOString(),
      reviewedAt: claim.reviewedAt?.toISOString() ?? null,
      submittedSteamId: claim.submittedSteamId,
      note: claim.note,
      reviewNote: claim.reviewNote,
      applicant: {
        id: claim.user.id,
        name: claim.user.name,
        email: claim.user.email,
        role: claim.user.role,
        createdAt: claim.user.createdAt.toISOString()
      },
      player: {
        id: claim.player.id,
        displayName: claim.player.displayName,
        slug: claim.player.slug,
        steamId: claim.player.steamId,
        teamName: claim.player.teamMemberships[0]?.team.name ?? "自由选手",
        teamId: claim.player.teamMemberships[0]?.team.id ?? null,
        teamSlug: claim.player.teamMemberships[0]?.team.slug ?? null
      },
      binding: {
        id: claim.binding.id,
        steamId: claim.binding.steamId,
        openDotaId: claim.binding.openDotaId,
        status: claim.binding.status,
        lastBoundAt: claim.binding.lastBoundAt?.toISOString() ?? null,
        lastError: claim.binding.lastError
      },
      reviewer: claim.reviewedBy ? {
        id: claim.reviewedBy.id,
        name: claim.reviewedBy.name,
        email: claim.reviewedBy.email
      } : null
    };
  } catch {
    return null;
  }
}

export async function getAdminMatchesData() {
  try {
    const [matches, seasons, teams, topics, stages] = await Promise.all([
      dbRuntime.match.findMany({
        include: {
          season: true,
          stage: true,
          topic: true,
          winnerTeam: true,
          participants: {
            include: {
              team: true,
              seasonTeam: true
            },
            orderBy: {
              slotNumber: "asc"
            }
          },
          games: {
            include: {
              winnerTeam: true
            },
            orderBy: {
              gameNumber: "asc"
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      dbRuntime.tournamentSeason.findMany({
        orderBy: [{ tournamentId: "asc" }, { seasonNumber: "desc" }]
      }),
      dbRuntime.team.findMany({
        orderBy: { name: "asc" }
      }),
      dbRuntime.communityTopic.findMany({
        orderBy: [{ featured: "desc" }, { title: "asc" }]
      }),
      dbRuntime.matchStage.findMany({
        include: {
          season: true
        },
        orderBy: [{ seasonId: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
      })
    ]);

    return {
      matches: matches.map((match) => {
        const participants = Array.isArray(match.participants)
          ? match.participants as Array<{
              score?: number | null;
              rank?: number | null;
              team?: { id?: string; name?: string } | null;
              seasonTeam?: { seedNumber?: number | null } | null;
            }>
          : [];
        const first = participants[0] ?? null;
        const second = participants[1] ?? null;
        const third = participants[2] ?? null;
        const fourth = participants[3] ?? null;
        const season = (match.season ?? null) as { id?: string; title?: string } | null;
        const stage = (match.stage ?? null) as { id?: string; name?: string; slug?: string | null; advanceRule?: string | null } | null;
        const topic = (match.topic ?? null) as { id?: string; title?: string } | null;
        const games = Array.isArray(match.games)
          ? match.games as Array<{ gameNumber?: number; externalGameId?: string | null; status?: string; summary?: string | null; winnerTeamId?: string | null; winnerTeam?: { name?: string | null } | null }>
          : [];

        return {
          id: String(match.id),
          title: String(match.title),
          slug: String(match.slug),
          externalMatchId: typeof match.externalMatchId === "string" ? match.externalMatchId : null,
          scheduledAt: match.scheduledAt instanceof Date ? match.scheduledAt.toISOString().slice(0, 16) : "",
          format: typeof match.format === "string" ? match.format : null,
          status: String(match.status),
          scoreHome: typeof first?.score === "number" ? first.score : null,
          scoreAway: typeof second?.score === "number" ? second.score : null,
          streamUrl: typeof match.streamUrl === "string" ? match.streamUrl : null,
          summary: typeof match.summary === "string" ? match.summary : null,
          topicId: topic?.id ?? "",
          topicTitle: topic?.title ?? "未关联话题",
          seasonId: season?.id ?? "",
          seasonTitle: season?.title ?? "未关联赛季",
          stageId: stage?.id ?? "",
          stageName: stage?.name ?? "未分阶段",
          stageSlug: typeof stage?.slug === "string" ? stage.slug : "",
          stageAdvanceRule: typeof stage?.advanceRule === "string" ? stage.advanceRule : null,
          roundNumber: typeof match.roundNumber === "number" ? match.roundNumber : null,
          sequenceNumber: typeof match.sequenceNumber === "number" ? match.sequenceNumber : null,
            winnerTeamId: typeof match.winnerTeamId === "string" ? match.winnerTeamId : "",
            winnerTeamName: typeof (match.winnerTeam as { name?: string | null } | null | undefined)?.name === "string"
              ? String((match.winnerTeam as { name?: string | null }).name)
              : null,
            participantLabel: participants.map((participant) => participant.team?.name ?? "待定").join(participants.length > 2 ? " / " : " vs "),
            homeTeamId: first?.team?.id ?? "",
            homeTeamName: first?.team?.name ?? "待定",
            awayTeamId: second?.team?.id ?? "",
            awayTeamName: second?.team?.name ?? "待定",
            teamAId: first?.team?.id ?? "",
            teamAName: first?.team?.name ?? "待定",
            seedA: typeof first?.seasonTeam?.seedNumber === "number" ? first.seasonTeam.seedNumber : null,
            scoreA: typeof first?.score === "number" ? first.score : null,
            rankA: typeof first?.rank === "number" ? first.rank : null,
            teamBId: second?.team?.id ?? "",
            teamBName: second?.team?.name ?? "待定",
            seedB: typeof second?.seasonTeam?.seedNumber === "number" ? second.seasonTeam.seedNumber : null,
            scoreB: typeof second?.score === "number" ? second.score : null,
            rankB: typeof second?.rank === "number" ? second.rank : null,
            teamCId: third?.team?.id ?? "",
            teamCName: third?.team?.name ?? "待定",
            seedC: typeof third?.seasonTeam?.seedNumber === "number" ? third.seasonTeam.seedNumber : null,
            scoreC: typeof third?.score === "number" ? third.score : null,
            rankC: typeof third?.rank === "number" ? third.rank : null,
            teamDId: fourth?.team?.id ?? "",
            teamDName: fourth?.team?.name ?? "待定",
            seedD: typeof fourth?.seasonTeam?.seedNumber === "number" ? fourth.seasonTeam.seedNumber : null,
            scoreD: typeof fourth?.score === "number" ? fourth.score : null,
            rankD: typeof fourth?.rank === "number" ? fourth.rank : null,
            games: [1, 2, 3, 4, 5].map((gameNumber) => {
              const game = games.find((item) => item.gameNumber === gameNumber);

              return {
                gameNumber,
                externalGameId: typeof game?.externalGameId === "string" ? game.externalGameId : "",
                status: typeof game?.status === "string" ? game.status : "DRAFT",
                winnerTeamId: typeof game?.winnerTeamId === "string" ? game.winnerTeamId : "",
                winnerTeamName: game?.winnerTeam?.name ?? null,
                summary: typeof game?.summary === "string" ? game.summary : ""
              };
            })
        };
      }),
      seasons: seasons.map((season) => ({
        id: String(season.id),
        title: String(season.title)
      })),
      teams: teams.map((team) => ({
        id: String(team.id),
        name: String(team.name)
      })),
      topics: topics.map((topic) => ({
        id: String(topic.id),
        title: String(topic.title)
      })),
      stages: stages.map((stage) => ({
        id: String(stage.id),
        seasonId: String(stage.seasonId),
        seasonTitle: typeof (stage.season as { title?: string | null } | undefined)?.title === "string"
          ? String((stage.season as { title?: string | null }).title)
          : "未命名赛季",
        name: String(stage.name)
      }))
    };
  } catch {
    return {
      matches: demoMatches.map((match) => ({
        id: match.id,
        title: match.title,
        slug: match.slug,
        externalMatchId: null,
        scheduledAt: "",
        format: match.format,
        status: match.status,
        scoreHome: null,
        scoreAway: null,
        streamUrl: null,
        summary: null,
        topicId: "",
        topicTitle: "未关联话题",
        seasonId: "",
        seasonTitle: "第十一届先锋杯",
        stageId: "",
        stageName: "总决赛",
        stageSlug: "final",
        stageAdvanceRule: null,
        roundNumber: 1,
        sequenceNumber: 1,
        winnerTeamId: "",
        winnerTeamName: null,
        participantLabel: `${match.homeTeamName} vs ${match.awayTeamName}`,
        teamAId: "",
        teamAName: match.homeTeamName,
        seedA: null,
        scoreA: match.scoreHome ?? null,
        rankA: null,
        teamBId: "",
        teamBName: match.awayTeamName,
        seedB: null,
        scoreB: match.scoreAway ?? null,
        rankB: null,
        teamCId: "",
        teamCName: "待定",
        seedC: null,
        scoreC: null,
        rankC: null,
        teamDId: "",
        teamDName: "待定",
        seedD: null,
        scoreD: null,
        rankD: null,
        games: [1, 2, 3, 4, 5].map((gameNumber) => ({
          gameNumber,
          externalGameId: "",
          status: "DRAFT",
          winnerTeamId: "",
          winnerTeamName: null,
          summary: ""
        }))
      })),
      seasons: demoSeasons,
      teams: demoTeams.map((team) => ({
        id: team.id,
        name: team.name
      })),
      topics: demoTopicOptions,
      stages: []
    };
  }
}

export async function getAdminTournamentsData() {
  try {
    const seasons = await dbRuntime.tournamentSeason.findMany({
      include: {
        tournament: true,
        participants: true,
        matches: true
      },
      orderBy: [{ tournamentId: "asc" }, { seasonNumber: "desc" }]
    });

    return seasons.map((season) => {
      const tournament = (season.tournament ?? {}) as {
        id?: string;
        name?: string;
        slug?: string;
        kind?: string;
        description?: string | null;
      };
      const participants = Array.isArray(season.participants) ? season.participants : [];
      const matches = Array.isArray(season.matches) ? season.matches : [];

      return {
        id: String(season.id),
        tournamentId: String(tournament.id ?? season.tournamentId ?? ""),
        tournamentName: tournament.name ?? "未命名赛事",
        tournamentSlug: tournament.slug ?? "",
        tournamentKind: tournament.kind ?? "CUSTOM",
        tournamentDescription: tournament.description ?? null,
        title: String(season.title),
        slug: String(season.slug),
        seasonNumber: typeof season.seasonNumber === "number" ? season.seasonNumber : 0,
        statusLabel: typeof season.statusLabel === "string" ? season.statusLabel : null,
        themeColor: typeof season.themeColor === "string" ? season.themeColor : null,
        summary: typeof season.summary === "string" ? season.summary : null,
        featured: Boolean(season.featured),
        teamCount: participants.length,
        matchCount: matches.length
      };
    });
  } catch {
    return [
      {
        id: "season-pioneer-s11",
        tournamentId: "tournament-pioneer",
        tournamentName: "先锋杯",
        tournamentSlug: "pioneer-cup",
        tournamentKind: "PIONEER",
        tournamentDescription: "今晚就来社区的赛季制 Dota2 赛事。",
        title: "第十一届先锋杯",
        slug: "pioneer-cup-s11",
        seasonNumber: 11,
        statusLabel: "总决赛周",
        themeColor: "cyan",
        summary: "当前首页正在使用的默认赛季。",
        featured: true,
        teamCount: 2,
        matchCount: 1
      }
    ];
  }
}

export async function getAdminContentPagesData() {
  try {
    const [pages, matches, topics] = await Promise.all([
      db.contentPage.findMany({
        include: {
          match: true,
          topic: true
        },
        orderBy: { createdAt: "desc" }
      }),
      db.match.findMany({
        orderBy: { title: "asc" }
      }),
      db.communityTopic.findMany({
        orderBy: [{ featured: "desc" }, { title: "asc" }]
      })
    ]);

    return {
      pages: pages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        excerpt: page.excerpt,
        bodyText: typeof page.body === "object" && page.body && "content" in (page.body as Record<string, unknown>)
          ? String((page.body as Record<string, unknown>).content ?? "")
          : JSON.stringify(page.body),
        publishedAt: page.publishedAt ? page.publishedAt.toISOString().slice(0, 16) : "",
        featured: page.featured,
        matchId: page.match?.id ?? "",
        matchTitle: page.match?.title ?? "未关联比赛",
        topicId: page.topic?.id ?? "",
        topicTitle: page.topic?.title ?? "未关联话题"
      })),
      matches: matches.map((match) => ({
        id: match.id,
        title: match.title
      })),
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title
      }))
    };
  } catch {
    return {
      pages: demoContentPages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        excerpt: page.excerpt,
        bodyText: page.body,
        publishedAt: "",
        featured: page.featured,
        matchId: "",
        matchTitle: demoMatches.find((match) => match.slug === page.matchSlug)?.title ?? "未关联比赛",
        topicId: page.topicId ?? "",
        topicTitle: demoCommunityTopics.find((topic) => topic.id === page.topicId)?.title ?? "未关联话题"
      })),
      matches: demoMatches.map((match) => ({
        id: match.id,
        title: match.title
      })),
      topics: demoTopicOptions
    };
  }
}

export async function getAdminAnnouncementsData() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    return announcements.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      bodyText: typeof item.body === "object" && item.body && "content" in (item.body as Record<string, unknown>)
        ? String((item.body as Record<string, unknown>).content ?? "")
        : JSON.stringify(item.body),
      publishedAt: item.publishedAt ? item.publishedAt.toISOString().slice(0, 16) : "",
      featured: item.featured
    }));
  } catch {
    return demoAnnouncements.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      bodyText: item.body,
      publishedAt: "",
      featured: item.featured
    }));
  }
}

export async function getAdminCommunityTopicsData() {
  try {
    const topics = await db.communityTopic.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    return topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      activityNote: topic.activityNote,
      featured: topic.featured
    }));
  } catch {
    return demoCommunityTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      activityNote: topic.activityNote,
      featured: topic.featured
    }));
  }
}

export async function getAdminRecruitmentPostsData() {
  try {
    const posts = await db.recruitmentPost.findMany({
      include: {
        topic: true
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    const topics = await db.communityTopic.findMany({
      orderBy: [{ featured: "desc" }, { title: "asc" }]
    });

    return {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        teamName: post.teamName,
        contact: post.contact,
        neededRoles: post.neededRoles,
        status: post.status,
        excerpt: post.excerpt,
        featured: post.featured,
        topicId: post.topic?.id ?? "",
        topicTitle: post.topic?.title ?? "未关联话题"
      })),
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title
      }))
    };
  } catch {
    return {
      posts: demoRecruitmentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        teamName: post.teamName,
        contact: post.contact,
        neededRoles: post.neededRoles,
        status: post.status,
        excerpt: post.excerpt,
        featured: post.featured,
        topicId: post.topicId ?? "",
        topicTitle: demoCommunityTopics.find((topic) => topic.id === post.topicId)?.title ?? "未关联话题"
      })),
      topics: demoTopicOptions
    };
  }
}

export async function getAdminCommunityEventsData() {
  try {
    const [events, topics] = await Promise.all([
      db.communityEvent.findMany({
        include: {
          topic: true
        },
        orderBy: [{ featured: "desc" }, { startsAt: "desc" }, { createdAt: "desc" }]
      }),
      db.communityTopic.findMany({
        orderBy: [{ featured: "desc" }, { title: "asc" }]
      })
    ]);

    return {
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        topicId: event.topic?.id ?? "",
        topicTitle: event.topic?.title ?? "未关联话题",
        summary: event.summary,
        bodyText: typeof event.body === "object" && event.body && "content" in (event.body as Record<string, unknown>)
          ? String((event.body as Record<string, unknown>).content ?? "")
          : JSON.stringify(event.body),
        startsAt: event.startsAt ? event.startsAt.toISOString().slice(0, 16) : "",
        endsAt: event.endsAt ? event.endsAt.toISOString().slice(0, 16) : "",
        location: event.location,
        status: event.status,
        ctaLabel: event.ctaLabel,
        ctaHref: event.ctaHref,
        featured: event.featured
      })),
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title
      }))
    };
  } catch {
    return {
      events: demoCommunityEvents.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        topicId: event.topicId ?? "",
        topicTitle: demoCommunityTopics.find((topic) => topic.id === event.topicId)?.title ?? "未关联话题",
        summary: event.summary,
        bodyText: event.body,
        startsAt: "",
        endsAt: "",
        location: event.location,
        status: event.status,
        ctaLabel: event.ctaLabel,
        ctaHref: event.ctaHref,
        featured: event.featured
      })),
      topics: demoTopicOptions
    };
  }
}
