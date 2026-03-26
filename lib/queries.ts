import { db } from "@/lib/db";
import { demoAnnouncements, demoCommunityEvents, demoCommunityTopics, demoContentPages, demoHomeData, demoMatches, demoPlayerReviews, demoPlayers, demoRecruitmentPosts, demoTeams } from "@/lib/demo-data";
import { playerPath, teamPath } from "@/lib/routes";
import { inferTournamentKind } from "@/lib/tournament-theme";

const dbRuntime = db as unknown as {
  tournamentSeason: {
    findFirst: (args: unknown) => Promise<unknown>;
  };
  team: {
    findMany: (args: unknown) => Promise<unknown>;
    findFirst: (args: unknown) => Promise<unknown>;
  };
  match: {
    findMany: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
  contentPage: {
    findMany: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
  communityEvent: {
    findUnique: (args: unknown) => Promise<unknown>;
  };
  communityTopic: {
    findUnique: (args: unknown) => Promise<unknown>;
  };
  recruitmentPost: {
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

export type HeroCard = {
  label: string;
  slug: string | null;
  iconUrl: string | null;
  imageUrl: string | null;
};

export type HeroDirectoryEntry = {
  id: string;
  heroId: number | null;
  name: string;
  slug: string;
  localizedName: string;
  primaryAttr: string | null;
  attackType: string | null;
  roles: string[];
  iconUrl: string | null;
  imageUrl: string | null;
};

export type SiteSearchItem = {
  id: string;
  type: "player" | "team" | "match" | "content" | "announcement" | "topic" | "recruitment" | "event";
  title: string;
  subtitle: string;
  href: string;
  keywords: string[];
};

type HeroRecord = {
  id?: string;
  heroId?: number | null;
  name: string;
  slug: string;
  localizedName: string;
  primaryAttr?: string | null;
  attackType?: string | null;
  roles?: string[];
  iconUrl: string | null;
  imageUrl: string | null;
};

const heroPrimaryAttrRank: Record<string, number> = {
  str: 0,
  agi: 1,
  int: 2,
  all: 3
};

const heroNameCollator = new Intl.Collator("zh-CN", {
  sensitivity: "base",
  numeric: true
});

type TeamDetailMember = {
  id: string;
  displayName: string;
  slug: string;
  avatarUrl: string | null;
  primaryRole: string | null;
  heroPool: string[];
  heroCards: HeroCard[];
};

type TeamDetailMatch = {
  slug: string;
  title: string;
  status: string;
  format: string | null;
  summary: string | null;
  scoreHome: number | null;
  scoreAway: number | null;
  opponentName: string;
  isHome: boolean;
  seasonTitle: string | null;
};

export type TeamDetail = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  slogan: string | null;
  coach: string | null;
  captain: string | null;
  honorPoints: number;
  championshipCount: number;
  honorScore: number;
  wins: number;
  losses: number;
  draws: number;
  summary: string | null;
  seasonTitle: string | null;
  tournamentName: string | null;
  members: TeamDetailMember[];
  matches: TeamDetailMatch[];
};

type MatchParticipantLike = {
  teamId: string;
  slotNumber?: number | null;
  score?: number | null;
  rank?: number | null;
  result?: string | null;
  isWinner?: boolean | null;
  isAdvanced?: boolean | null;
  isEliminated?: boolean | null;
  note?: string | null;
  seasonTeam?: {
    seedNumber?: number | null;
  } | null;
  team?: {
    id: string;
    name: string;
    slug?: string | null;
    slogan?: string | null;
    logoUrl?: string | null;
    coach?: string | null;
    captain?: string | null;
    summary?: string | null;
    members?: Array<{
      isCurrent?: boolean;
      player: {
        id: string;
        displayName: string;
        slug: string;
        avatarUrl?: string | null;
        primaryRole?: string | null;
      };
    }>;
  };
};

type MatchLike = {
  id?: string;
  title: string;
  slug: string;
  status: string;
  format?: string | null;
  bestOf?: number | null;
  roundNumber?: number | null;
  sequenceNumber?: number | null;
  summary?: string | null;
  scheduledAt?: Date | string | null;
  streamUrl?: string | null;
  externalMatchId?: string | null;
  winnerTeamId?: string | null;
  season?: {
    id?: string;
    title?: string | null;
    tournament?: {
      name?: string | null;
      kind?: string | null;
    };
  } | null;
  stage?: {
    id?: string;
    name?: string | null;
    slug?: string | null;
    stageType?: string | null;
    sortOrder?: number | null;
    bestOf?: number | null;
    advanceRule?: string | null;
  } | null;
  topic?: {
    title?: string | null;
    slug?: string | null;
  } | null;
  games?: Array<{
    id?: string;
    gameNumber: number;
    status: string;
    summary?: string | null;
    winnerTeamId?: string | null;
    winnerTeam?: {
      id?: string;
      name?: string | null;
    } | null;
  }>;
  contentPages?: Array<{
    id: string;
  }>;
  participants?: MatchParticipantLike[];
};

export type MatchSeasonGraphSeries = {
  id: string;
  slug: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  format: string | null;
  bestOf: number;
  summary: string | null;
  roundNumber: number | null;
  sequenceNumber: number | null;
  stageName: string | null;
  stageSlug: string | null;
  stageType: string | null;
  winnerTeamId: string | null;
  winnerTeamName: string | null;
  participantTeamNames: string[];
  participantTeamIds: string[];
  participants: ParticipantView[];
  games: Array<{
    gameNumber: number;
    status: string;
    summary: string | null;
    winnerTeamId: string | null;
    winnerTeamName: string | null;
  }>;
  contentCount: number;
};

export type MatchSeasonGraph = {
  id: string;
  slug: string;
  title: string;
  featured: boolean;
  statusLabel: string | null;
  summary: string | null;
  tournamentName: string | null;
  tournamentKind: string | null;
  layout: "DIRECT_BO3" | "GAUNTLET" | "FINAL_FOUR" | "ROUND_ROBIN" | "GENERIC";
  participants: Array<{
    teamId: string;
    teamName: string;
    teamSlug: string | null;
    logoUrl: string | null;
    slogan: string | null;
    seedNumber: number | null;
    finalRank: number | null;
    wins: number;
    losses: number;
  }>;
  stages: Array<{
    id: string;
    name: string;
    slug: string;
    stageType: string | null;
    bestOf: number | null;
    advanceRule: string | null;
    matches: MatchSeasonGraphSeries[];
  }>;
};

type GenericMember = {
  isCurrent?: boolean;
  player: {
    id: string;
    displayName: string;
    slug: string;
    avatarUrl?: string | null;
    primaryRole?: string | null;
    heroPool?: string[];
  };
};

type GenericPageLink = {
  id: string;
  slug: string;
  title: string;
  pageType?: string;
  excerpt?: string | null;
  featured?: boolean;
};

type GenericRecruitmentLink = {
  id: string;
  slug: string;
  title: string;
  teamName: string;
  excerpt?: string | null;
  status?: string;
  neededRoles?: string[];
  featured?: boolean;
};

type GenericHighlight = {
  id: string;
  title: string;
  description: string | null;
  player?: {
    displayName?: string | null;
  } | null;
};

type TeamListRecord = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  slogan: string | null;
  summary: string | null;
  honorPoints: number;
  championshipCount: number;
  captain: string | null;
  captainPlayerId: string | null;
  members: GenericMember[];
  matchParticipants: Array<{ match: MatchLike }>;
};

type TeamDetailRecord = TeamListRecord & {
  coach: string | null;
  seasonEntries?: Array<{
    season?: {
      title?: string | null;
      tournament?: {
        name?: string | null;
      } | null;
    } | null;
  }>;
};

type HomeDashboardSeasonRecord = {
  title: string;
  statusLabel?: string | null;
  summary?: string | null;
  tournament: {
    name: string;
  };
  matches: MatchLike[];
};

type ContentPageListRecord = {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  excerpt: string | null;
  featured: boolean;
  publishedAt: Date | null;
  topic?: {
    title?: string | null;
    slug?: string | null;
  } | null;
  match?: MatchLike | null;
};

type ParticipantView = {
  teamId: string | null;
  teamName: string;
  teamSlug: string | null;
  slogan: string | null;
  logoUrl: string | null;
  coach: string | null;
  captain: string | null;
  summary: string | null;
  seedNumber: number | null;
  note: string | null;
  result: string | null;
  score: number | null;
  rank: number | null;
  isWinner: boolean;
  isAdvanced: boolean;
  isEliminated: boolean;
  members: Array<{
    id: string;
    displayName: string;
    slug: string;
    primaryRole: string | null;
    avatarUrl: string | null;
  }>;
};

function inferBestOfValue(format: string | null | undefined, bestOf: number | null | undefined) {
  if (bestOf && bestOf > 0) {
    return bestOf;
  }

  if (!format) {
    return 3;
  }

  const matched = format.match(/BO(\d+)/i);
  if (!matched) {
    return 3;
  }

  const parsed = Number.parseInt(matched[1] ?? "", 10);
  return Number.isNaN(parsed) ? 3 : parsed;
}

function toParticipantViews(match: MatchLike): ParticipantView[] {
  const participants = [...(match.participants ?? [])]
    .sort((left, right) => (left.slotNumber ?? 999) - (right.slotNumber ?? 999))
    .map((participant) => {
      const visibleMembers = participant.team?.members?.filter((member) => member.isCurrent).length
        ? (participant.team?.members ?? []).filter((member) => member.isCurrent)
        : (participant.team?.members ?? []);

      return {
        teamId: participant.team?.id ?? participant.teamId ?? null,
        teamName: participant.team?.name ?? "待定",
        teamSlug: participant.team?.slug ?? null,
        slogan: participant.team?.slogan ?? null,
        logoUrl: participant.team?.logoUrl ?? null,
        coach: participant.team?.coach ?? null,
        captain: participant.team?.captain ?? null,
        summary: participant.team?.summary ?? null,
        seedNumber: participant.seasonTeam?.seedNumber ?? null,
        note: participant.note ?? null,
        result: participant.result ?? null,
        score: participant.score ?? null,
        rank: participant.rank ?? null,
        isWinner:
          Boolean(participant.isWinner) ||
          participant.teamId === match.winnerTeamId ||
          participant.result === "WIN" ||
          participant.rank === 1,
        isAdvanced: Boolean(participant.isAdvanced),
        isEliminated: Boolean(participant.isEliminated),
        members: visibleMembers.map((member) => ({
          id: member.player.id,
          displayName: member.player.displayName,
          slug: member.player.slug,
          primaryRole: member.player.primaryRole ?? null,
          avatarUrl: member.player.avatarUrl ?? null
        }))
      };
    });

  if (participants.length >= 2) {
    const hasAnyScore = participants.some((participant) => participant.score !== null);
    if (!hasAnyScore) {
      const winnerIndex = participants.findIndex((participant) => participant.isWinner);
      const resolvedWinnerIndex = winnerIndex >= 0 ? winnerIndex : 0;
      const bestOf = inferBestOfValue(match.format, match.bestOf);
      const targetWins = Math.max(2, Math.ceil(bestOf / 2));

      participants.forEach((participant, index) => {
        participant.score = index === resolvedWinnerIndex ? targetWins : 0;
      });
    }
  }

  return participants;
}

function toLegacyMatchView(match: MatchLike) {
  const participants = toParticipantViews(match);
  const participantTeamNames = participants.map((participant) => participant.teamName);
  const home = participants[0] ?? null;
  const away = participants[1] ?? null;
  const winner = participants.find((participant) => participant.isWinner) ?? home;

  return {
    id: match.id ?? match.slug,
    title: match.title,
    slug: match.slug,
    scheduledAt: match.scheduledAt ?? null,
    status: match.status,
    format: match.format ?? `BO${inferBestOfValue(match.format, match.bestOf)}`,
    bestOf: inferBestOfValue(match.format, match.bestOf),
    scoreHome: home?.score ?? null,
    scoreAway: away?.score ?? null,
    summary: match.summary ?? null,
    streamUrl: match.streamUrl ?? null,
    externalMatchId: match.externalMatchId ?? null,
    participantTeamNames,
    participantTeamIds: participants.map((participant) => participant.teamId).filter((value): value is string => Boolean(value)),
    participants,
    championTeamName: winner?.teamName ?? null,
    championTeamId: winner?.teamId ?? null,
    championTeamSlug: winner?.teamSlug ?? null,
    homeTeamName: home?.teamName ?? "待定",
    homeTeamId: home?.teamId ?? null,
    homeTeamSlug: home?.teamSlug ?? null,
    homeTeamSlogan: home?.slogan ?? null,
    homeTeamLogoUrl: home?.logoUrl ?? null,
    homeTeamCoach: home?.coach ?? null,
    homeTeamCaptain: home?.captain ?? null,
    homeTeamSummary: home?.summary ?? null,
    homeTeamMembers: home?.members ?? [],
    awayTeamName: away?.teamName ?? (participants.length > 1 ? "待定" : "轮空"),
    awayTeamId: away?.teamId ?? null,
    awayTeamSlug: away?.teamSlug ?? null,
    awayTeamSlogan: away?.slogan ?? null,
    awayTeamLogoUrl: away?.logoUrl ?? null,
    awayTeamCoach: away?.coach ?? null,
    awayTeamCaptain: away?.captain ?? null,
    awayTeamSummary: away?.summary ?? null,
    awayTeamMembers: away?.members ?? []
  };
}

function toSeriesGames(match: MatchLike, participants: ParticipantView[]) {
  const orderedGames = [...(match.games ?? [])].sort((left, right) => left.gameNumber - right.gameNumber);

  if (orderedGames.length) {
    return orderedGames.map((game) => ({
      gameNumber: game.gameNumber,
      status: game.status,
      summary: game.summary ?? null,
      winnerTeamId: game.winnerTeamId ?? null,
      winnerTeamName: game.winnerTeam?.name ?? participants.find((participant) => participant.teamId === game.winnerTeamId)?.teamName ?? null
    }));
  }

  if ((match.status === "FINISHED" || match.status === "ARCHIVED") && participants.length === 2) {
    const winner = participants.find((participant) => participant.isWinner) ?? null;

    if (!winner?.teamId) {
      return [];
    }

    return [1, 2].map((gameNumber) => ({
      gameNumber,
      status: "FINISHED",
      summary: `BO3 第 ${gameNumber} 局，按 2 比 0 的默认结果补齐。`,
      winnerTeamId: winner.teamId,
      winnerTeamName: winner.teamName
    }));
  }

  return [];
}

function toSeasonGraphSeries(match: MatchLike): MatchSeasonGraphSeries {
  const participants = toParticipantViews(match);
  const winner = participants.find((participant) => participant.isWinner) ?? null;

  return {
    id: match.id ?? match.slug,
    slug: match.slug,
    title: match.title,
    status: match.status,
    scheduledAt: match.scheduledAt ?? null,
    format: match.format ?? `BO${inferBestOfValue(match.format, match.bestOf)}`,
    bestOf: inferBestOfValue(match.format, match.bestOf),
    summary: match.summary ?? null,
    roundNumber: match.roundNumber ?? null,
    sequenceNumber: match.sequenceNumber ?? null,
    stageName: match.stage?.name ?? null,
    stageSlug: match.stage?.slug ?? null,
    stageType: match.stage?.stageType ?? null,
    winnerTeamId: winner?.teamId ?? match.winnerTeamId ?? null,
    winnerTeamName: winner?.teamName ?? null,
    participantTeamNames: participants.map((participant) => participant.teamName),
    participantTeamIds: participants.map((participant) => participant.teamId).filter((value): value is string => Boolean(value)),
    participants,
    games: toSeriesGames(match, participants),
    contentCount: match.contentPages?.length ?? 0
  };
}

function resolveSeasonGraphLayout(source: {
  participantCount: number;
  stages: Array<{
    slug: string;
    stageType: string | null;
    matches: MatchSeasonGraphSeries[];
  }>;
}): MatchSeasonGraph["layout"] {
  const hasLeagueStage = source.stages.some((stage) => stage.stageType === "LEAGUE" || stage.slug.includes("round-robin"));
  const hasSemifinalStage = source.stages.some((stage) => stage.slug === "semifinal");
  const totalMatches = source.stages.reduce((sum, stage) => sum + stage.matches.length, 0);

  if (hasLeagueStage) {
    return "ROUND_ROBIN";
  }

  if (source.participantCount === 2 && totalMatches <= 1) {
    return "DIRECT_BO3";
  }

  if (source.participantCount === 3) {
    return "GAUNTLET";
  }

  if (source.participantCount === 4 && hasSemifinalStage) {
    return "FINAL_FOUR";
  }

  if (source.participantCount === 4) {
    return "ROUND_ROBIN";
  }

  return "GENERIC";
}

function sortSeriesForGraph(left: MatchSeasonGraphSeries, right: MatchSeasonGraphSeries) {
  const leftRound = left.roundNumber ?? Number.MAX_SAFE_INTEGER;
  const rightRound = right.roundNumber ?? Number.MAX_SAFE_INTEGER;

  if (leftRound !== rightRound) {
    return leftRound - rightRound;
  }

  const leftSequence = left.sequenceNumber ?? Number.MAX_SAFE_INTEGER;
  const rightSequence = right.sequenceNumber ?? Number.MAX_SAFE_INTEGER;

  if (leftSequence !== rightSequence) {
    return leftSequence - rightSequence;
  }

  const leftTime = left.scheduledAt ? new Date(left.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
  const rightTime = right.scheduledAt ? new Date(right.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;

  if (leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  return left.title.localeCompare(right.title, "zh-CN");
}

function buildSeasonGraph(source: {
  id: string;
  slug: string;
  title: string;
  featured?: boolean;
  statusLabel?: string | null;
  summary?: string | null;
  tournament?: {
    name?: string | null;
    kind?: string | null;
  } | null;
  participants: Array<{
    team: {
      id: string;
      name: string;
      slug: string;
      logoUrl: string | null;
      slogan: string | null;
    };
    seedNumber?: number | null;
    finalRank?: number | null;
    wins?: number | null;
    losses?: number | null;
  }>;
  stages: Array<{
    id: string;
    name: string;
    slug: string;
    stageType?: string | null;
    bestOf?: number | null;
    advanceRule?: string | null;
    matches: MatchLike[];
  }>;
}): MatchSeasonGraph {
  const stageMaps = source.stages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    slug: stage.slug,
    stageType: stage.stageType ?? null,
    bestOf: stage.bestOf ?? null,
    advanceRule: stage.advanceRule ?? null,
    matches: stage.matches.map((match) => toSeasonGraphSeries(match)).sort(sortSeriesForGraph)
  })).filter((stage) => stage.matches.length);
  const layout = resolveSeasonGraphLayout({
    participantCount: source.participants.length,
    stages: stageMaps
  });

  const participantRows = source.participants.map((entry) => ({
    teamId: entry.team.id,
    teamName: entry.team.name,
    teamSlug: entry.team.slug,
    logoUrl: entry.team.logoUrl,
    slogan: entry.team.slogan,
    seedNumber: entry.seedNumber ?? null,
    finalRank: entry.finalRank ?? null,
    wins: entry.wins ?? 0,
    losses: entry.losses ?? 0
  }));

  for (const stage of stageMaps) {
    for (const match of stage.matches) {
      if (!match.winnerTeamId) {
        continue;
      }

      participantRows.forEach((participant) => {
        if (!match.participantTeamIds.includes(participant.teamId)) {
          return;
        }

        if (participant.teamId === match.winnerTeamId) {
          participant.wins += 1;
        } else {
          participant.losses += 1;
        }
      });
    }
  }

  participantRows.sort((left, right) => {
    const leftRank = left.finalRank ?? Number.MAX_SAFE_INTEGER;
    const rightRank = right.finalRank ?? Number.MAX_SAFE_INTEGER;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    if (left.wins !== right.wins) {
      return right.wins - left.wins;
    }

    return left.teamName.localeCompare(right.teamName, "zh-CN");
  });

  return {
    id: source.id,
    slug: source.slug,
    title: source.title,
    featured: Boolean(source.featured),
    statusLabel: source.statusLabel ?? null,
    summary: source.summary ?? null,
    tournamentName: source.tournament?.name ?? null,
    tournamentKind: source.tournament?.kind ?? inferTournamentKind(source.title),
    layout,
    participants: participantRows,
    stages: stageMaps
  };
}

function buildMatchLabel(match: MatchLike) {
  const participants = toParticipantViews(match);
  const names = participants.map((participant) => participant.teamName).filter(Boolean);

  if (!names.length) {
    return "待定";
  }

  if (names.length === 2) {
    return `${names[0]} vs ${names[1]}`;
  }

  return names.join(" / ");
}

function resolveParticipantResultForTeam(match: MatchLike, teamId: string) {
  const participants = toParticipantViews(match);
  const target = participants.find((participant) => participant.teamId === teamId);
  if (!target) {
    return null;
  }

  if (target.isWinner) {
    return "win";
  }

  const comparableParticipants = participants.filter((participant) => participant.score !== null);
  if (comparableParticipants.length >= 2) {
    const maxScore = Math.max(...comparableParticipants.map((participant) => participant.score ?? 0));
    const minScore = Math.min(...comparableParticipants.map((participant) => participant.score ?? 0));

    if ((target.score ?? null) === maxScore && maxScore === minScore) {
      return "draw";
    }

    if ((target.score ?? -1) < maxScore) {
      return "loss";
    }
  }

  return target.rank && target.rank > 1 ? "loss" : "draw";
}

function computeTeamHonorStats(teamId: string, championshipCount: number, memberCount: number, basePoints: number, matches: MatchLike[]) {
  const results = matches.map((match) => resolveParticipantResultForTeam(match, teamId)).filter(Boolean);
  const wins = results.filter((result) => result === "win").length;
  const draws = results.filter((result) => result === "draw").length;
  const losses = results.filter((result) => result === "loss").length;

  return {
    wins,
    draws,
    losses,
    honorScore: basePoints + championshipCount * 100 + wins * 12 + draws * 4 + memberCount * 3
  };
}

function resolveDemoMatchBySlug(slug: string) {
  return demoMatches.find((match) => match.slug === slug) ?? null;
}

function resolveDemoTopicBySlug(slug: string) {
  return demoCommunityTopics.find((topic) => topic.slug === slug) ?? null;
}

function resolveDemoTopicById(id: string | null | undefined) {
  if (!id) {
    return null;
  }

  return demoCommunityTopics.find((topic) => topic.id === id) ?? null;
}

function resolveDemoEventBySlug(slug: string) {
  return demoCommunityEvents.find((event) => event.slug === slug) ?? null;
}

function normalizeHeroKey(value: string) {
  return value.trim().toLowerCase();
}

function heroSlugFromName(value: string) {
  return normalizeHeroKey(value)
    .replace(/^npc_dota_hero_/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function heroNpcNameFromValue(value: string) {
  return `npc_dota_hero_${heroSlugFromName(value).replace(/-/g, "_")}`;
}

async function buildHeroLookup(heroNames: string[]) {
  const uniqueHeroNames = [...new Set(heroNames.map((name) => name.trim()).filter(Boolean))];

  if (!uniqueHeroNames.length) {
    return new Map<string, HeroRecord>();
  }

  try {
    const heroSlugs = uniqueHeroNames.map(heroSlugFromName).filter(Boolean);
    const heroNpcNames = uniqueHeroNames.map(heroNpcNameFromValue);
    const heroes = await db.hero.findMany({
      where: {
        OR: [
          { localizedName: { in: uniqueHeroNames } },
          { slug: { in: heroSlugs } },
          { name: { in: heroNpcNames } }
        ]
      },
      select: {
        id: true,
        heroId: true,
        name: true,
        slug: true,
        localizedName: true,
        primaryAttr: true,
        attackType: true,
        roles: true,
        iconUrl: true,
        imageUrl: true
      }
    });

    const heroLookup = new Map<string, HeroRecord>();

    for (const hero of heroes) {
      const keys = [
        normalizeHeroKey(hero.localizedName),
        normalizeHeroKey(hero.slug),
        normalizeHeroKey(hero.name),
        normalizeHeroKey(heroSlugFromName(hero.localizedName)),
        normalizeHeroKey(heroNpcNameFromValue(hero.localizedName))
      ];

      for (const key of keys) {
        heroLookup.set(key, hero);
      }
    }

    return heroLookup;
  } catch {
    return new Map<string, HeroRecord>();
  }
}

function mapHeroPool(heroNames: string[], heroLookup: Map<string, HeroRecord>): HeroCard[] {
  return heroNames.map((heroName) => {
    const hero =
      heroLookup.get(normalizeHeroKey(heroName)) ??
      heroLookup.get(normalizeHeroKey(heroSlugFromName(heroName))) ??
      heroLookup.get(normalizeHeroKey(heroNpcNameFromValue(heroName))) ??
      null;

    return {
      label: hero?.localizedName ?? heroName,
      slug: hero?.slug ?? null,
      iconUrl: hero?.iconUrl ?? null,
      imageUrl: hero?.imageUrl ?? null
    };
  });
}

export async function getHomeDashboard() {
  try {
    const featuredSeason = await dbRuntime.tournamentSeason.findFirst({
      where: { featured: true },
      include: {
        tournament: true,
        matches: {
          include: {
            participants: {
              include: {
                team: true
              }
            }
          },
          take: 3
        }
      }
    }) as HomeDashboardSeasonRecord | null;

    if (!featuredSeason) {
      return demoHomeData;
    }

    return {
      featuredSeason: {
        title: featuredSeason.title,
        subtitle: featuredSeason.tournament.name,
        statusLabel: featuredSeason.statusLabel ?? "进行中",
        summary: featuredSeason.summary ?? "使用数据库驱动的赛事首页。"
      },
      featuredMatch: featuredSeason.matches[0]
        ? {
            title: featuredSeason.matches[0].title,
            format: toLegacyMatchView(featuredSeason.matches[0]).format,
            homeTeamName: toLegacyMatchView(featuredSeason.matches[0]).homeTeamName,
            awayTeamName: toLegacyMatchView(featuredSeason.matches[0]).awayTeamName,
            homeTeamSlogan: toLegacyMatchView(featuredSeason.matches[0]).homeTeamSlogan,
            awayTeamSlogan: toLegacyMatchView(featuredSeason.matches[0]).awayTeamSlogan
          }
        : demoHomeData.featuredMatch,
      metrics: [
        { label: "赛事系列", value: String(await db.tournament.count()) },
        { label: "选手池", value: String(await db.player.count()) },
        { label: "队伍池", value: String(await db.team.count()) },
        { label: "比赛池", value: String(await db.match.count()) }
      ],
      priorities: demoHomeData.priorities,
      adminSections: demoHomeData.adminSections
    };
  } catch {
    return demoHomeData;
  }
}

export async function getPlayers() {
  try {
    const players = await db.player.findMany({
      include: {
        teamMemberships: {
          include: {
            team: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });
    const heroLookup = await buildHeroLookup(players.flatMap((player) => player.heroPool));

    return players.map((player) => {
      const featuredPlayer = player as typeof player & { featured?: boolean };

      return {
      currentMembership: player.teamMemberships.find((membership) => membership.isCurrent) ?? null,
      id: player.id,
      displayName: player.displayName,
      slug: player.slug,
      steamId: player.steamId,
      avatarUrl: player.avatarUrl,
      primaryRole: player.primaryRole,
      preferredRoles: player.preferredRoles,
      heroPool: player.heroPool,
      heroCards: mapHeroPool(player.heroPool, heroLookup),
      ladderScore: player.ladderScore,
      gameYears: player.gameYears,
      playStyles: player.playStyles,
      highlightMatchIds: player.highlightMatchIds,
      championshipCount: player.championshipCount,
      featured: featuredPlayer.featured ?? false,
      gameUnderstanding: player.gameUnderstanding,
      teamName: player.teamMemberships.find((membership) => membership.isCurrent)?.team.name ?? "自由选手",
      teamId: player.teamMemberships.find((membership) => membership.isCurrent)?.team.id ?? null,
      teamSlug: player.teamMemberships.find((membership) => membership.isCurrent)?.team.slug ?? null,
      formerTeams: player.teamMemberships
        .filter((membership) => !membership.isCurrent)
        .map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug
        }))
      };
    });
  } catch {
    return demoPlayers.map((player) => ({
      ...player,
      steamId: null,
      avatarUrl: null,
      heroCards: mapHeroPool(player.heroPool, new Map()),
      preferredRoles: player.preferredRoles ?? [],
      ladderScore: player.ladderScore ?? null,
      gameYears: player.gameYears ?? null,
      playStyles: player.playStyles ?? [],
      highlightMatchIds: player.highlightMatchIds ?? [],
      teamId: demoTeams.find((team) => team.name === player.teamName)?.id ?? null,
      teamSlug: demoTeams.find((team) => team.name === player.teamName)?.slug ?? null,
      championshipCount: 0,
      featured: player.featured ?? false,
      gameUnderstanding: player.gameUnderstanding ?? null,
      formerTeams: player.teamName
        ? [{
            id: demoTeams.find((team) => team.name === player.teamName)?.id ?? player.id,
            name: player.teamName,
            slug: demoTeams.find((team) => team.name === player.teamName)?.slug ?? player.slug
          }]
        : []
    }));
  }
}

export async function getHeroDirectory(): Promise<HeroDirectoryEntry[]> {
  try {
    const heroes = await db.hero.findMany({
      select: {
        id: true,
        heroId: true,
        name: true,
        slug: true,
        localizedName: true,
        primaryAttr: true,
        attackType: true,
        roles: true,
        iconUrl: true,
        imageUrl: true
      }
    });

    return heroes.sort((left, right) => {
      const leftRank = heroPrimaryAttrRank[left.primaryAttr ?? "all"] ?? 99;
      const rightRank = heroPrimaryAttrRank[right.primaryAttr ?? "all"] ?? 99;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      const leftHeroId = left.heroId ?? Number.MAX_SAFE_INTEGER;
      const rightHeroId = right.heroId ?? Number.MAX_SAFE_INTEGER;

      if (leftHeroId !== rightHeroId) {
        return leftHeroId - rightHeroId;
      }

      return heroNameCollator.compare(left.localizedName, right.localizedName);
    });
  } catch {
    return [];
  }
}

export async function getTeams() {
  try {
    const teams = await dbRuntime.team.findMany({
      include: {
        captainPlayer: true,
        members: {
          include: { player: true }
        },
        matchParticipants: {
          include: {
            match: {
              include: {
                participants: {
                  include: {
                    team: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "asc" }
    }) as TeamListRecord[];

    return teams.map((team) => {
      const visibleMembers = team.members.filter((member: GenericMember) => member.isCurrent).length ? team.members.filter((member: GenericMember) => member.isCurrent) : team.members;
      const completedMatches = team.matchParticipants
        .map((participant: { match: MatchLike }) => participant.match)
        .filter((match: MatchLike) => match.status === "FINISHED" || match.status === "ARCHIVED");
      const stats = computeTeamHonorStats(team.id, team.championshipCount, visibleMembers.length, team.honorPoints, completedMatches);

      return {
        id: team.id,
        name: team.name,
        slug: team.slug,
        logoUrl: team.logoUrl,
        slogan: team.slogan,
        summary: team.summary,
        honorPoints: team.honorPoints,
        championshipCount: team.championshipCount,
        captain: team.captain,
        captainPlayerId: team.captainPlayerId,
        honorScore: stats.honorScore,
        wins: stats.wins,
        losses: stats.losses,
        draws: stats.draws,
        memberCount: visibleMembers.length,
        members: visibleMembers.map((member: GenericMember) => ({
          id: member.player.id,
          displayName: member.player.displayName,
          slug: member.player.slug
        }))
      };
    });
  } catch {
    return demoTeams.map((team) => ({
      ...team,
      logoUrl: null,
      summary: null,
      honorPoints: 0,
      championshipCount: 0,
      captain: team.captain ?? null,
      captainPlayerId: team.captainPlayerId ?? null,
      honorScore: team.members.length * 3,
      wins: 0,
      losses: 0,
      draws: 0,
      memberCount: team.members.length
    }));
  }
}

export async function getTeamDetailById(routeKey: string): Promise<TeamDetail | null> {
  try {
    const team = await dbRuntime.team.findFirst({
      where: {
        OR: [{ id: routeKey }, { slug: routeKey }]
      },
      include: {
        seasonEntries: {
          include: {
            season: {
              include: {
                tournament: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        },
        members: {
          include: {
            player: true
          },
          orderBy: {
            joinedAt: "asc"
          }
        },
        matchParticipants: {
          include: {
            match: {
              include: {
                season: true,
                participants: {
                  include: {
                    team: true
                  }
                }
              }
            }
          }
        }
      }
    }) as TeamDetailRecord | null;

    if (!team) {
      return null;
    }

    const visibleMembers = team.members.filter((member: GenericMember) => member.isCurrent).length ? team.members.filter((member: GenericMember) => member.isCurrent) : team.members;
    const heroLookup = await buildHeroLookup(visibleMembers.flatMap((member: GenericMember) => member.player.heroPool ?? []));
    const relatedMatches = team.matchParticipants.map((participant: { match: MatchLike }) => participant.match);
    const completedMatches = relatedMatches.filter((match: MatchLike) => match.status === "FINISHED" || match.status === "ARCHIVED");
    const stats = computeTeamHonorStats(team.id, team.championshipCount, visibleMembers.length, team.honorPoints, completedMatches);
    const latestSeason = team.seasonEntries?.[0]?.season ?? null;

    const matches = relatedMatches
      .map((match: MatchLike) => {
        const legacy = toLegacyMatchView(match);
        return {
          slug: match.slug,
          title: match.title,
          status: match.status,
          format: legacy.format,
          summary: match.summary ?? null,
          scoreHome: legacy.scoreHome,
          scoreAway: legacy.scoreAway,
          opponentName: legacy.participants.find((participant) => participant.teamId !== team.id)?.teamName ?? "待定",
          isHome: legacy.homeTeamId === team.id,
          seasonTitle: match.season?.title ?? null
        };
      })
      .sort((left, right) => left.slug.localeCompare(right.slug))
      .slice(0, 8);

    return {
      id: team.id,
      name: team.name,
      slug: team.slug,
      logoUrl: team.logoUrl,
      slogan: team.slogan,
      coach: team.coach,
      captain: team.captain,
      honorPoints: team.honorPoints,
      championshipCount: team.championshipCount,
      honorScore: stats.honorScore,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      summary: team.summary,
      seasonTitle: latestSeason?.title ?? null,
      tournamentName: latestSeason?.tournament?.name ?? null,
      members: visibleMembers.map((member: GenericMember) => ({
        id: member.player.id,
        displayName: member.player.displayName,
        slug: member.player.slug,
        avatarUrl: member.player.avatarUrl ?? null,
        primaryRole: member.player.primaryRole ?? null,
        heroPool: member.player.heroPool ?? [],
        heroCards: mapHeroPool(member.player.heroPool ?? [], heroLookup)
      })),
      matches
    };
  } catch {
    const team = demoTeams.find((item) => item.id === routeKey || item.slug === routeKey);
    if (!team) {
      return null;
    }

    return {
      id: team.id,
      name: team.name,
      slug: team.slug,
      logoUrl: null,
      slogan: team.slogan,
      coach: null,
      captain: null,
      honorPoints: 0,
      championshipCount: 0,
      honorScore: team.members.length * 3,
      wins: 0,
      losses: 0,
      draws: 0,
      summary: null,
      seasonTitle: null,
      tournamentName: null,
      members: team.members.map((member) => ({
        id: demoPlayers.find((player) => player.slug === member.slug)?.id ?? member.slug,
        displayName: member.displayName,
        slug: member.slug,
        avatarUrl: null,
        primaryRole: demoPlayers.find((player) => player.slug === member.slug)?.primaryRole ?? null,
        heroPool: demoPlayers.find((player) => player.slug === member.slug)?.heroPool ?? [],
        heroCards: mapHeroPool(demoPlayers.find((player) => player.slug === member.slug)?.heroPool ?? [], new Map())
      })),
      matches: demoMatches
        .filter((match) => match.homeTeamName === team.name || match.awayTeamName === team.name)
        .map((match) => ({
          slug: match.slug,
          title: match.title,
          status: match.status,
          format: match.format,
          summary: match.summary,
          scoreHome: match.scoreHome,
          scoreAway: match.scoreAway,
          opponentName: match.homeTeamName === team.name ? match.awayTeamName : match.homeTeamName,
          isHome: match.homeTeamName === team.name,
          seasonTitle: null
        }))
    };
  }
}

export async function getMatches() {
  try {
    const matches = await dbRuntime.match.findMany({
      include: {
        season: {
          include: {
            tournament: true
          }
        },
        topic: true,
        winnerTeam: true,
        contentPages: {
          select: {
            id: true
          }
        },
        participants: {
          include: {
            team: true
          }
        }
      },
      orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }]
    }) as MatchLike[];

    return matches.map((match) => {
      const legacy = toLegacyMatchView(match);
      return {
        ...legacy,
        topicTitle: match.topic?.title ?? null,
        topicSlug: match.topic?.slug ?? null,
        tournamentName: match.season?.tournament?.name ?? null,
        tournamentKind: match.season?.tournament?.kind ?? inferTournamentKind(match.title),
        seasonTitle: match.season?.title ?? null,
        contentCount: match.contentPages?.length ?? 0
      };
    });
  } catch {
    return demoMatches.map((match) => ({
      ...match,
      scheduledAt: null,
      participantTeamNames: [match.homeTeamName, match.awayTeamName],
      participantTeamIds: [
        demoTeams.find((team) => team.name === match.homeTeamName)?.id,
        demoTeams.find((team) => team.name === match.awayTeamName)?.id
      ].filter((value): value is string => Boolean(value)),
      championTeamName: null,
      championTeamId: null,
      championTeamSlug: null,
      topicTitle: resolveDemoTopicById(match.topicId)?.title ?? null,
      topicSlug: resolveDemoTopicById(match.topicId)?.slug ?? null,
      tournamentName: null,
      tournamentKind: inferTournamentKind(match.title),
      seasonTitle: null,
      contentCount: 0,
      homeTeamId: demoTeams.find((team) => team.name === match.homeTeamName)?.id ?? null,
      homeTeamSlug: demoTeams.find((team) => team.name === match.homeTeamName)?.slug ?? null,
      awayTeamId: demoTeams.find((team) => team.name === match.awayTeamName)?.id ?? null,
      awayTeamSlug: demoTeams.find((team) => team.name === match.awayTeamName)?.slug ?? null
    }));
  }
}

async function getMatchSeasonGraphBySeasonId(seasonId: string): Promise<MatchSeasonGraph | null> {
  const season = await db.tournamentSeason.findUnique({
    where: { id: seasonId },
    include: {
      tournament: true,
      participants: {
        include: {
          team: true
        },
        orderBy: [{ finalRank: "asc" }, { seedNumber: "asc" }, { createdAt: "asc" }]
      },
      stages: {
        include: {
          matches: {
            include: {
              stage: true,
              winnerTeam: true,
              topic: true,
              contentPages: {
                select: {
                  id: true
                }
              },
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
            orderBy: [{ roundNumber: "asc" }, { sequenceNumber: "asc" }, { scheduledAt: "asc" }, { createdAt: "asc" }]
          }
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    }
  });

  if (!season) {
    return null;
  }

  return buildSeasonGraph({
    id: season.id,
    slug: season.slug,
    title: season.title,
    featured: season.featured,
    statusLabel: season.statusLabel,
    summary: season.summary,
    tournament: season.tournament,
    participants: season.participants,
    stages: season.stages.map((stage) => ({
      id: stage.id,
      name: stage.name,
      slug: stage.slug,
      stageType: stage.stageType,
      bestOf: stage.bestOf,
      advanceRule: stage.advanceRule,
      matches: stage.matches as MatchLike[]
    }))
  });
}

export async function getMatchSeasonGraphs(): Promise<MatchSeasonGraph[]> {
  try {
    const seasons = await db.tournamentSeason.findMany({
      include: {
        tournament: true,
        participants: {
          include: {
            team: true
          },
          orderBy: [{ finalRank: "asc" }, { seedNumber: "asc" }, { createdAt: "asc" }]
        },
        stages: {
          include: {
            matches: {
              include: {
                stage: true,
                winnerTeam: true,
                topic: true,
                contentPages: {
                  select: {
                    id: true
                  }
                },
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
              orderBy: [{ roundNumber: "asc" }, { sequenceNumber: "asc" }, { scheduledAt: "asc" }, { createdAt: "asc" }]
            }
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
        }
      },
      orderBy: [{ featured: "desc" }, { seasonNumber: "desc" }, { createdAt: "desc" }]
    });

    return seasons
      .map((season) => buildSeasonGraph({
        id: season.id,
        slug: season.slug,
        title: season.title,
        featured: season.featured,
        statusLabel: season.statusLabel,
        summary: season.summary,
        tournament: season.tournament,
        participants: season.participants,
        stages: season.stages.map((stage) => ({
          id: stage.id,
          name: stage.name,
          slug: stage.slug,
          stageType: stage.stageType,
          bestOf: stage.bestOf,
          advanceRule: stage.advanceRule,
          matches: stage.matches as MatchLike[]
        }))
      }))
      .filter((season) => season.stages.length || season.participants.length);
  } catch {
    return [];
  }
}

export async function getContentPages() {
  try {
    const pages = await dbRuntime.contentPage.findMany({
      include: {
        topic: true,
        match: {
          include: {
            participants: {
              include: {
                team: true
              }
            },
            season: {
              include: {
                tournament: true
              }
            }
          }
        }
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
    }) as ContentPageListRecord[];

    return pages.map((page) => {
      const legacy = page.match ? toLegacyMatchView(page.match) : null;
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        excerpt: page.excerpt,
        featured: page.featured,
        publishedAt: page.publishedAt,
        topicTitle: page.topic?.title ?? null,
        topicSlug: page.topic?.slug ?? null,
        matchSlug: page.match?.slug ?? null,
        matchTitle: page.match?.title ?? null,
        homeTeamName: legacy?.homeTeamName ?? null,
        homeTeamId: legacy?.homeTeamId ?? null,
        homeTeamSlug: legacy?.homeTeamSlug ?? null,
        awayTeamName: legacy?.awayTeamName ?? null,
        awayTeamId: legacy?.awayTeamId ?? null,
        awayTeamSlug: legacy?.awayTeamSlug ?? null,
        seasonTitle: page.match?.season?.title ?? null,
        tournamentName: page.match?.season?.tournament?.name ?? null
      };
    });
  } catch {
    return demoContentPages.map((page) => {
      const match = demoMatches.find((item) => item.slug === page.matchSlug);

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        excerpt: page.excerpt,
        featured: page.featured,
        publishedAt: page.publishedAt,
        topicTitle: resolveDemoTopicById(page.topicId)?.title ?? null,
        topicSlug: resolveDemoTopicById(page.topicId)?.slug ?? null,
        matchSlug: page.matchSlug,
        matchTitle: match?.title ?? null,
        homeTeamName: match?.homeTeamName ?? null,
        homeTeamId: demoTeams.find((team) => team.name === match?.homeTeamName)?.id ?? null,
        homeTeamSlug: demoTeams.find((team) => team.name === match?.homeTeamName)?.slug ?? null,
        awayTeamName: match?.awayTeamName ?? null,
        awayTeamId: demoTeams.find((team) => team.name === match?.awayTeamName)?.id ?? null,
        awayTeamSlug: demoTeams.find((team) => team.name === match?.awayTeamName)?.slug ?? null,
        seasonTitle: null,
        tournamentName: null
      };
    });
  }
}

export async function getSiteSearchIndex(): Promise<SiteSearchItem[]> {
  try {
    const [players, teams, matches, pages, announcements, topics, recruitments, events] = await Promise.all([
      db.player.findMany({
        select: {
          id: true,
          displayName: true,
          slug: true,
          primaryRole: true,
          teamMemberships: {
            where: { isCurrent: true },
            take: 1,
            select: {
              team: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "asc" }
      }),
      db.team.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          summary: true,
          slogan: true
        },
        orderBy: { createdAt: "asc" }
      }),
      dbRuntime.match.findMany({
        select: {
          slug: true,
          title: true,
          status: true,
          format: true,
          bestOf: true,
          winnerTeamId: true,
          participants: {
            select: {
              teamId: true,
              slotNumber: true,
              score: true,
              rank: true,
              result: true,
              isWinner: true,
              team: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          },
          season: {
            select: {
              title: true,
              tournament: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
        take: 40
      }) as Promise<MatchLike[]>,
      db.contentPage.findMany({
        select: {
          slug: true,
          title: true,
          pageType: true,
          topic: {
            select: {
              title: true
            }
          },
          match: {
            select: {
              title: true
            }
          }
        },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        take: 40
      }),
      db.announcement.findMany({
        select: {
          slug: true,
          title: true,
          excerpt: true,
          featured: true
        },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        take: 20
      }),
      db.communityTopic.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          activityNote: true,
          _count: {
            select: {
              matches: true,
              contentPages: true,
              recruitmentPosts: true
            }
          }
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 20
      }),
      db.recruitmentPost.findMany({
        select: {
          slug: true,
          title: true,
          teamName: true,
          status: true,
          topic: {
            select: {
              title: true
            }
          }
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 20
      }),
      db.communityEvent.findMany({
        select: {
          slug: true,
          title: true,
          summary: true,
          status: true,
          topic: {
            select: {
              title: true
            }
          }
        },
        orderBy: [{ featured: "desc" }, { startsAt: "desc" }, { createdAt: "desc" }],
        take: 20
      })
    ]);

    return [
      ...players.map((player) => ({
        id: `player:${player.id}`,
        type: "player" as const,
        title: player.displayName,
        subtitle: `${player.primaryRole ?? "社区选手"} · ${player.teamMemberships[0]?.team.name ?? "自由选手"}`,
        href: playerPath(player.id),
        keywords: [player.slug, player.primaryRole ?? "", player.teamMemberships[0]?.team.name ?? ""]
      })),
      ...teams.map((team) => ({
        id: `team:${team.id}`,
        type: "team" as const,
        title: team.name,
        subtitle: team.summary ?? team.slogan ?? "社区战队档案",
        href: teamPath(team.id),
        keywords: [team.slug, team.summary ?? "", team.slogan ?? ""]
      })),
      ...matches.map((match: MatchLike) => ({
        id: `match:${match.slug}`,
        type: "match" as const,
        title: match.title,
        subtitle: `${buildMatchLabel(match)} · ${match.season?.title ?? match.season?.tournament?.name ?? match.status}`,
        href: `/matches/${match.slug}`,
        keywords: [match.status, ...toParticipantViews(match).map((participant) => participant.teamName), match.season?.title ?? "", match.season?.tournament?.name ?? ""]
      })),
      ...pages.map((page) => ({
        id: `content:${page.slug}`,
        type: "content" as const,
        title: page.title,
        subtitle: `${page.pageType} · ${page.topic?.title ?? page.match?.title ?? "社区内容"}`,
        href: `/content/${page.slug}`,
        keywords: [page.pageType, page.match?.title ?? "", page.topic?.title ?? ""]
      })),
      ...announcements.map((announcement) => ({
        id: `announcement:${announcement.slug}`,
        type: "announcement" as const,
        title: announcement.title,
        subtitle: announcement.excerpt ?? "社区公告",
        href: `/community/announcements/${announcement.slug}`,
        keywords: [announcement.excerpt ?? "", announcement.featured ? "重点公告" : "公告", "社区"]
      })),
      ...topics.map((topic) => ({
        id: `topic:${topic.id}`,
        type: "topic" as const,
        title: `#${topic.title}`,
        subtitle: topic.description ?? `${topic._count.matches} 场比赛 · ${topic._count.contentPages} 条内容 · ${topic._count.recruitmentPosts} 条招募`,
        href: `/community/topics/${topic.slug}`,
        keywords: [topic.title, topic.activityNote ?? "", topic.description ?? "", "话题", "社区"]
      })),
      ...recruitments.map((post) => ({
        id: `recruitment:${post.slug}`,
        type: "recruitment" as const,
        title: post.title,
        subtitle: `${post.teamName} · ${post.topic?.title ?? post.status}`,
        href: `/community/recruitments/${post.slug}`,
        keywords: [post.teamName, post.status, post.topic?.title ?? "", "招募", "组队"]
      })),
      ...events.map((event) => ({
        id: `event:${event.slug}`,
        type: "event" as const,
        title: event.title,
        subtitle: `${event.topic?.title ?? event.status} · ${event.summary ?? "社区活动"}`,
        href: `/community/activities/${event.slug}`,
        keywords: [event.topic?.title ?? "", event.status, event.summary ?? "", "活动", "社区"]
      }))
    ];
  } catch {
    return [
      ...demoPlayers.map((player) => ({
        id: `player:${player.id}`,
        type: "player" as const,
        title: player.displayName,
        subtitle: `${player.primaryRole ?? "社区选手"} · ${player.teamName}`,
        href: playerPath(player.id),
        keywords: [player.slug, player.primaryRole ?? "", player.teamName]
      })),
      ...demoTeams.map((team) => ({
        id: `team:${team.id}`,
        type: "team" as const,
        title: team.name,
        subtitle: team.slogan ?? "社区战队档案",
        href: teamPath(team.id),
        keywords: [team.slug, team.slogan ?? ""]
      })),
      ...demoMatches.map((match) => ({
        id: `match:${match.slug}`,
        type: "match" as const,
        title: match.title,
        subtitle: `${match.homeTeamName} vs ${match.awayTeamName} · ${match.status}`,
        href: `/matches/${match.slug}`,
        keywords: [match.status, match.homeTeamName, match.awayTeamName]
      })),
      ...demoContentPages.map((page) => ({
        id: `content:${page.slug}`,
        type: "content" as const,
        title: page.title,
        subtitle: `${page.pageType} · ${resolveDemoTopicById(page.topicId)?.title ?? page.excerpt ?? "社区内容"}`,
        href: `/content/${page.slug}`,
        keywords: [page.pageType, page.excerpt ?? "", resolveDemoTopicById(page.topicId)?.title ?? ""]
      })),
      ...demoAnnouncements.map((announcement) => ({
        id: `announcement:${announcement.slug}`,
        type: "announcement" as const,
        title: announcement.title,
        subtitle: announcement.excerpt ?? "社区公告",
        href: `/community/announcements/${announcement.slug}`,
        keywords: [announcement.excerpt ?? "", announcement.featured ? "重点公告" : "公告", "社区"]
      })),
      ...demoCommunityTopics.map((topic) => ({
        id: `topic:${topic.id}`,
        type: "topic" as const,
        title: `#${topic.title}`,
        subtitle: topic.description ?? "社区话题",
        href: `/community/topics/${topic.slug}`,
        keywords: [topic.title, topic.activityNote ?? "", topic.description ?? "", "话题", "社区"]
      })),
      ...demoRecruitmentPosts.map((post) => ({
        id: `recruitment:${post.slug}`,
        type: "recruitment" as const,
        title: post.title,
        subtitle: `${post.teamName} · ${resolveDemoTopicById(post.topicId)?.title ?? post.status}`,
        href: `/community/recruitments/${post.slug}`,
        keywords: [post.teamName, post.status, resolveDemoTopicById(post.topicId)?.title ?? "", "招募", "组队"]
      })),
      ...demoCommunityEvents.map((event) => ({
        id: `event:${event.slug}`,
        type: "event" as const,
        title: event.title,
        subtitle: `${resolveDemoTopicById(event.topicId)?.title ?? event.status} · ${event.summary ?? "社区活动"}`,
        href: `/community/activities/${event.slug}`,
        keywords: [resolveDemoTopicById(event.topicId)?.title ?? "", event.status, event.summary ?? "", "活动", "社区"]
      }))
    ];
  }
}

export async function getCommunityEvents() {
  try {
    const events = await db.communityEvent.findMany({
      include: {
        topic: true
      },
      orderBy: [{ featured: "desc" }, { startsAt: "desc" }, { createdAt: "desc" }]
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      summary: event.summary,
      bodyText: typeof event.body === "object" && event.body && "content" in (event.body as Record<string, unknown>)
        ? String((event.body as Record<string, unknown>).content ?? "")
        : JSON.stringify(event.body),
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      location: event.location,
      status: event.status,
      ctaLabel: event.ctaLabel,
      ctaHref: event.ctaHref,
      featured: event.featured,
      topicTitle: event.topic?.title ?? null,
      topicSlug: event.topic?.slug ?? null
    }));
  } catch {
    return demoCommunityEvents.map((event) => ({
      ...event,
      bodyText: event.body,
      topicTitle: resolveDemoTopicById(event.topicId)?.title ?? null,
      topicSlug: resolveDemoTopicById(event.topicId)?.slug ?? null
    }));
  }
}

export async function getCommunityEventBySlug(slug: string) {
  try {
    const event = await dbRuntime.communityEvent.findUnique({
      where: { slug },
      include: {
        topic: {
          include: {
            matches: {
              include: {
                participants: {
                  include: {
                    team: true
                  }
                }
              },
              orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
              take: 3
            },
            contentPages: {
              orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
              take: 3
            },
            recruitmentPosts: {
              orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
              take: 3
            }
          }
        }
      }
    }) as {
      id: string;
      title: string;
      slug: string;
      summary: string | null;
      body: unknown;
      startsAt: Date | null;
      endsAt: Date | null;
      location: string | null;
      status: string;
      ctaLabel: string | null;
      ctaHref: string | null;
      featured: boolean;
      topic?: {
        title: string;
        slug: string;
        description: string | null;
        activityNote: string | null;
        matches?: MatchLike[];
        contentPages?: GenericPageLink[];
        recruitmentPosts?: GenericRecruitmentLink[];
      } | null;
    } | null;

    if (!event) {
      return null;
    }

    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      summary: event.summary,
      bodyText: typeof event.body === "object" && event.body && "content" in (event.body as Record<string, unknown>)
        ? String((event.body as Record<string, unknown>).content ?? "")
        : JSON.stringify(event.body),
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      location: event.location,
      status: event.status,
      ctaLabel: event.ctaLabel,
      ctaHref: event.ctaHref,
      featured: event.featured,
      topic: event.topic ? {
        title: event.topic.title,
        slug: event.topic.slug,
        description: event.topic.description,
        activityNote: event.topic.activityNote
      } : null,
      relatedMatches: (event.topic?.matches ?? []).map((match: MatchLike) => {
        const legacy = toLegacyMatchView(match);
        return {
          id: match.id,
          slug: match.slug,
          title: match.title,
          status: match.status,
          homeTeamName: legacy.homeTeamName,
          awayTeamName: legacy.awayTeamName,
          participantTeamNames: legacy.participantTeamNames
        };
      }),
      relatedContentPages: (event.topic?.contentPages ?? []).map((page: GenericPageLink) => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        excerpt: page.excerpt
      })),
      relatedRecruitments: (event.topic?.recruitmentPosts ?? []).map((post: GenericRecruitmentLink) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        teamName: post.teamName,
        excerpt: post.excerpt,
        status: post.status
      }))
    };
  } catch {
    const event = resolveDemoEventBySlug(slug);

    if (!event) {
      return null;
    }

    const topic = resolveDemoTopicById(event.topicId);
    return {
      ...event,
      bodyText: event.body,
      topic: topic ? {
        title: topic.title,
        slug: topic.slug,
        description: topic.description,
        activityNote: topic.activityNote
      } : null,
      relatedMatches: demoMatches.filter((match) => match.topicId === event.topicId).map((match) => ({
        id: match.id,
        slug: match.slug,
        title: match.title,
        status: match.status,
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName
      })),
      relatedContentPages: demoContentPages.filter((page) => page.topicId === event.topicId).map((page) => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        excerpt: page.excerpt
      })),
      relatedRecruitments: demoRecruitmentPosts.filter((post) => post.topicId === event.topicId).map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        teamName: post.teamName,
        excerpt: post.excerpt,
        status: post.status
      }))
    };
  }
}

export async function getAnnouncements() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
    });

    return announcements.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      bodyText: typeof item.body === "object" && item.body && "content" in (item.body as Record<string, unknown>)
        ? String((item.body as Record<string, unknown>).content ?? "")
        : JSON.stringify(item.body),
      publishedAt: item.publishedAt,
      featured: item.featured
    }));
  } catch {
    return demoAnnouncements.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      bodyText: item.body,
      publishedAt: item.publishedAt,
      featured: item.featured
    }));
  }
}

export async function getAnnouncementBySlug(slug: string) {
  try {
    const item = await db.announcement.findUnique({
      where: { slug }
    });

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      bodyText: typeof item.body === "object" && item.body && "content" in (item.body as Record<string, unknown>)
        ? String((item.body as Record<string, unknown>).content ?? "")
        : JSON.stringify(item.body),
      publishedAt: item.publishedAt,
      featured: item.featured
    };
  } catch {
    const item = demoAnnouncements.find((announcement) => announcement.slug === slug);

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      bodyText: item.body,
      publishedAt: item.publishedAt,
      featured: item.featured
    };
  }
}

export async function getCommunityTopics() {
  try {
    const topics = await db.communityTopic.findMany({
      include: {
        _count: {
          select: {
            matches: true,
            contentPages: true,
            recruitmentPosts: true
          }
        }
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    return topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      activityNote: topic.activityNote,
      featured: topic.featured,
      matchCount: topic._count.matches,
      contentCount: topic._count.contentPages,
      recruitmentCount: topic._count.recruitmentPosts
    }));
  } catch {
    return demoCommunityTopics.map((topic) => ({
      ...topic,
      matchCount: demoMatches.filter((match) => match.topicId === topic.id).length,
      contentCount: demoContentPages.filter((page) => page.topicId === topic.id).length,
      recruitmentCount: demoRecruitmentPosts.filter((post) => post.topicId === topic.id).length
    }));
  }
}

export async function getCommunityTopicBySlug(slug: string) {
  try {
    const topic = await dbRuntime.communityTopic.findUnique({
      where: { slug },
      include: {
        matches: {
          include: {
            participants: {
              include: {
                team: true
              }
            }
          },
          orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
          take: 4
        },
        contentPages: {
          orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
          take: 6
        },
        recruitmentPosts: {
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 4
        }
      }
    }) as {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      activityNote: string | null;
      featured: boolean;
      matches: MatchLike[];
      contentPages: GenericPageLink[];
      recruitmentPosts: GenericRecruitmentLink[];
    } | null;

    if (!topic) {
      return null;
    }

    return {
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      activityNote: topic.activityNote,
      featured: topic.featured,
      matches: topic.matches.map((match: MatchLike) => {
        const legacy = toLegacyMatchView(match);
        return {
          id: match.id,
          slug: match.slug,
          title: match.title,
          status: match.status,
          summary: match.summary,
          homeTeamName: legacy.homeTeamName,
          awayTeamName: legacy.awayTeamName,
          participantTeamNames: legacy.participantTeamNames
        };
      }),
      contentPages: topic.contentPages.map((page: GenericPageLink) => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        excerpt: page.excerpt,
        featured: page.featured
      })),
      recruitmentPosts: topic.recruitmentPosts.map((post: GenericRecruitmentLink) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        teamName: post.teamName,
        status: post.status,
        excerpt: post.excerpt,
        neededRoles: post.neededRoles,
        featured: post.featured
      }))
    };
  } catch {
    const topic = resolveDemoTopicBySlug(slug);

    if (!topic) {
      return null;
    }

    return {
      ...topic,
      matches: demoMatches
        .filter((match) => match.topicId === topic.id)
        .map((match) => ({
          id: match.id,
          slug: match.slug,
          title: match.title,
          status: match.status,
          summary: match.summary,
          homeTeamName: match.homeTeamName,
          awayTeamName: match.awayTeamName
        })),
      contentPages: demoContentPages
        .filter((page) => page.topicId === topic.id)
        .map((page) => ({
          id: page.id,
          slug: page.slug,
          title: page.title,
          pageType: page.pageType,
          excerpt: page.excerpt,
          featured: page.featured
        })),
      recruitmentPosts: demoRecruitmentPosts
        .filter((post) => post.topicId === topic.id)
        .map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          teamName: post.teamName,
          status: post.status,
          excerpt: post.excerpt,
          neededRoles: post.neededRoles,
          featured: post.featured
        }))
    };
  }
}

export async function getRecruitmentPosts() {
  try {
    const posts = await db.recruitmentPost.findMany({
      include: {
        topic: true
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      teamName: post.teamName,
      contact: post.contact,
      neededRoles: post.neededRoles,
      status: post.status,
      excerpt: post.excerpt,
      featured: post.featured,
      topicTitle: post.topic?.title ?? null,
      topicSlug: post.topic?.slug ?? null
    }));
  } catch {
    return demoRecruitmentPosts.map((post) => ({
      ...post,
      topicTitle: resolveDemoTopicById(post.topicId)?.title ?? null,
      topicSlug: resolveDemoTopicById(post.topicId)?.slug ?? null
    }));
  }
}

export async function getRecruitmentPostBySlug(slug: string) {
  try {
    const post = await dbRuntime.recruitmentPost.findUnique({
      where: { slug },
      include: {
        topic: {
          include: {
            matches: {
              include: {
                participants: {
                  include: {
                    team: true
                  }
                }
              },
              orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
              take: 3
            },
            contentPages: {
              orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
              take: 4
            },
            recruitmentPosts: {
              orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
              take: 4
            }
          }
        }
      }
    }) as {
      id: string;
      title: string;
      slug: string;
      teamName: string;
      contact: string | null;
      neededRoles: string[];
      status: string;
      excerpt: string | null;
      featured: boolean;
      topic?: {
        title: string;
        slug: string;
        activityNote: string | null;
        description: string | null;
        matches?: MatchLike[];
        contentPages?: GenericPageLink[];
        recruitmentPosts?: GenericRecruitmentLink[];
      } | null;
    } | null;

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      teamName: post.teamName,
      contact: post.contact,
      neededRoles: post.neededRoles,
      status: post.status,
      excerpt: post.excerpt,
      featured: post.featured,
      topic: post.topic
        ? {
            title: post.topic.title,
            slug: post.topic.slug,
            activityNote: post.topic.activityNote,
            description: post.topic.description
          }
        : null,
      relatedMatches: (post.topic?.matches ?? []).map((match: MatchLike) => {
        const legacy = toLegacyMatchView(match);
        return {
          id: match.id,
          slug: match.slug,
          title: match.title,
          status: match.status,
          homeTeamName: legacy.homeTeamName,
          awayTeamName: legacy.awayTeamName,
          participantTeamNames: legacy.participantTeamNames
        };
      }),
      relatedContentPages: (post.topic?.contentPages ?? []).map((page: GenericPageLink) => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        excerpt: page.excerpt
      })),
      siblingRecruitments: (post.topic?.recruitmentPosts ?? [])
        .filter((item: GenericRecruitmentLink) => item.slug !== post.slug)
        .map((item: GenericRecruitmentLink) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          teamName: item.teamName,
          excerpt: item.excerpt
        }))
    };
  } catch {
    const post = demoRecruitmentPosts.find((item) => item.slug === slug);

    if (!post) {
      return null;
    }

    const topic = resolveDemoTopicById(post.topicId);

    return {
      ...post,
      topic: topic
        ? {
            title: topic.title,
            slug: topic.slug,
            activityNote: topic.activityNote,
            description: topic.description
          }
        : null,
      relatedMatches: demoMatches
        .filter((match) => match.topicId === post.topicId)
        .map((match) => ({
          id: match.id,
          slug: match.slug,
          title: match.title,
          status: match.status,
          homeTeamName: match.homeTeamName,
          awayTeamName: match.awayTeamName
        })),
      relatedContentPages: demoContentPages
        .filter((page) => page.topicId === post.topicId)
        .map((page) => ({
          id: page.id,
          slug: page.slug,
          title: page.title,
          pageType: page.pageType,
          excerpt: page.excerpt
        })),
      siblingRecruitments: demoRecruitmentPosts
        .filter((item) => item.topicId === post.topicId && item.slug !== post.slug)
        .map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          teamName: item.teamName,
          excerpt: item.excerpt
        }))
    };
  }
}

export async function getPlayerDetailById(routeKey: string) {
  try {
    const player = await db.player.findFirst({
      where: {
        OR: [{ id: routeKey }, { slug: routeKey }]
      },
      include: {
        teamMemberships: {
          include: {
            team: true
          }
        },
        receivedReviews: {
          where: {
            showOnProfile: true
          },
          include: {
            authorPlayer: {
              include: {
                teamMemberships: {
                  where: { isCurrent: true },
                  include: { team: true },
                  take: 1
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!player) {
      return null;
    }

    const heroLookup = await buildHeroLookup(player.heroPool);

    const highlightMatches = player.highlightMatchIds.length
      ? await dbRuntime.match.findMany({
          where: {
            slug: {
              in: player.highlightMatchIds
            }
          },
          include: {
            participants: {
              include: {
                team: true
              }
            },
            season: true
          }
        }) as MatchLike[]
      : [];

    const highlightMap = new Map<string, MatchLike>(highlightMatches.map((match: MatchLike) => [match.slug, match] as const));

    return {
      id: player.id,
      displayName: player.displayName,
      slug: player.slug,
      avatarUrl: player.avatarUrl,
      steamId: player.steamId,
      primaryRole: player.primaryRole,
      preferredRoles: player.preferredRoles,
      heroPool: player.heroPool,
      heroCards: mapHeroPool(player.heroPool, heroLookup),
      ladderScore: player.ladderScore,
      gameYears: player.gameYears,
      playStyles: player.playStyles,
      championshipCount: player.championshipCount,
      bio: player.bio,
      gameUnderstanding: player.gameUnderstanding,
      teamName: player.teamMemberships.find((membership) => membership.isCurrent)?.team.name ?? "自由选手",
      teamId: player.teamMemberships.find((membership) => membership.isCurrent)?.team.id ?? null,
      teamSlug: player.teamMemberships.find((membership) => membership.isCurrent)?.team.slug ?? null,
      formerTeams: player.teamMemberships
        .filter((membership) => !membership.isCurrent)
        .map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug
        })),
      publicReviews: player.receivedReviews.map((review) => ({
        id: review.id,
        content: review.content,
        createdAt: review.createdAt,
        authorPlayerId: review.authorPlayer.id,
        authorPlayerName: review.authorPlayer.displayName,
        authorPlayerSlug: review.authorPlayer.slug,
        authorPlayerAvatarUrl: review.authorPlayer.avatarUrl,
        authorPrimaryRole: review.authorPlayer.primaryRole,
        authorTeamName: review.authorPlayer.teamMemberships[0]?.team.name ?? "自由选手",
        authorTeamId: review.authorPlayer.teamMemberships[0]?.team.id ?? null,
        authorTeamSlug: review.authorPlayer.teamMemberships[0]?.team.slug ?? null
      })),
      highlightMatches: player.highlightMatchIds.map((matchSlug) => {
        const match = highlightMap.get(matchSlug) ?? null;
        const legacy = match ? toLegacyMatchView(match) : null;
        return {
          slug: matchSlug,
          title: match?.title ?? matchSlug,
          status: match?.status ?? null,
          format: match?.format ?? null,
          summary: match?.summary ?? null,
          homeTeamName: legacy?.homeTeamName ?? null,
          awayTeamName: legacy?.awayTeamName ?? null,
          seasonTitle: match?.season?.title ?? null
        };
      })
    };
  } catch {
    const player = demoPlayers.find((item) => item.id === routeKey || item.slug === routeKey);
    if (!player) {
      return null;
    }

    return {
      id: player.id,
      displayName: player.displayName,
      slug: player.slug,
      avatarUrl: null,
      steamId: null,
      primaryRole: player.primaryRole,
      preferredRoles: player.preferredRoles ?? [],
      heroPool: player.heroPool,
      heroCards: mapHeroPool(player.heroPool, new Map()),
      ladderScore: player.ladderScore ?? null,
      gameYears: player.gameYears ?? null,
      playStyles: player.playStyles ?? [],
      championshipCount: 0,
      bio: null,
      gameUnderstanding: player.gameUnderstanding ?? null,
      teamName: player.teamName,
      teamId: demoTeams.find((team) => team.name === player.teamName)?.id ?? null,
      teamSlug: demoTeams.find((team) => team.name === player.teamName)?.slug ?? null,
      formerTeams: player.teamName
        ? [{
            id: demoTeams.find((team) => team.name === player.teamName)?.id ?? player.id,
            name: player.teamName,
            slug: demoTeams.find((team) => team.name === player.teamName)?.slug ?? player.slug
          }]
        : [],
      publicReviews: demoPlayerReviews
        .filter((review) => review.targetPlayerId === player.id && review.showOnProfile)
        .map((review) => ({
          id: review.id,
          content: review.content,
          createdAt: review.createdAt,
          authorPlayerId: review.authorPlayerId,
          authorPlayerName: review.authorPlayerName,
          authorPlayerSlug: review.authorPlayerSlug,
          authorPlayerAvatarUrl: null,
          authorPrimaryRole: demoPlayers.find((item) => item.id === review.authorPlayerId)?.primaryRole ?? null,
          authorTeamName: review.authorTeamName,
          authorTeamId: demoTeams.find((team) => team.name === review.authorTeamName)?.id ?? null,
          authorTeamSlug: demoTeams.find((team) => team.name === review.authorTeamName)?.slug ?? null
        })),
      highlightMatches: player.highlightMatchIds.map((matchSlug) => {
        const match = resolveDemoMatchBySlug(matchSlug);
        return {
          slug: matchSlug,
          title: match?.title ?? matchSlug,
          status: match?.status ?? null,
          format: match?.format ?? null,
          summary: match?.summary ?? null,
          homeTeamName: match?.homeTeamName ?? null,
          awayTeamName: match?.awayTeamName ?? null,
          seasonTitle: null
        };
      })
    };
  }
}

export async function getPlayerReviews() {
  try {
    const reviews = await db.playerReview.findMany({
      include: {
        authorPlayer: true,
        targetPlayer: true
      },
      orderBy: [{ createdAt: "desc" }]
    });

    return reviews.map((review) => ({
      id: review.id,
      authorPlayerId: review.authorPlayerId,
      authorPlayerName: review.authorPlayer.displayName,
      authorPlayerSlug: review.authorPlayer.slug,
      targetPlayerId: review.targetPlayerId,
      targetPlayerName: review.targetPlayer.displayName,
      targetPlayerSlug: review.targetPlayer.slug,
      content: review.content,
      showOnProfile: review.showOnProfile,
      createdAt: review.createdAt.toISOString()
    }));
  } catch {
    return demoPlayerReviews.map((review) => ({
      id: review.id,
      authorPlayerId: review.authorPlayerId,
      authorPlayerName: review.authorPlayerName,
      authorPlayerSlug: review.authorPlayerSlug,
      targetPlayerId: review.targetPlayerId,
      targetPlayerName: review.targetPlayerName,
      targetPlayerSlug: review.targetPlayerSlug,
      content: review.content,
      showOnProfile: review.showOnProfile,
      createdAt: review.createdAt
    }));
  }
}

export async function getMatchDetailBySlug(slug: string) {
  try {
    const match = await dbRuntime.match.findUnique({
      where: { slug },
      include: {
        season: {
          include: {
            tournament: true
          }
        },
        stage: true,
        winnerTeam: true,
        participants: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    player: true
                  },
                  orderBy: {
                    joinedAt: "asc"
                  }
                }
              }
            },
            seasonTeam: true
          }
        },
        games: {
          include: {
            winnerTeam: true
          },
          orderBy: {
            gameNumber: "asc"
          }
        },
        topic: {
          include: {
            recruitmentPosts: {
              orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
              take: 3
            },
            contentPages: {
              orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
              take: 6
            }
          }
        },
        contentPages: true,
        highlights: {
          include: {
            player: true
          }
        }
      }
    }) as (MatchLike & {
      season?: {
        title?: string | null;
        tournament?: {
          name?: string | null;
          kind?: string | null;
        } | null;
      } | null;
      topic?: {
        title?: string | null;
        slug?: string | null;
        recruitmentPosts?: GenericRecruitmentLink[];
        contentPages?: GenericPageLink[];
      } | null;
      contentPages: GenericPageLink[];
      highlights: GenericHighlight[];
    }) | null;

    if (!match) {
      return null;
    }

    const featuredPlayers = await db.player.findMany({
      where: {
        highlightMatchIds: {
          has: slug
        }
      },
      orderBy: { createdAt: "asc" }
    });

    const legacy = toLegacyMatchView(match);
  const series = toSeasonGraphSeries(match);
  const seasonGraph = match.season?.id ? await getMatchSeasonGraphBySeasonId(match.season.id) : null;

    return {
      id: match.id,
      title: match.title,
      slug: match.slug,
      status: match.status,
      format: legacy.format,
      bestOf: series.bestOf,
      scoreHome: legacy.scoreHome,
      scoreAway: legacy.scoreAway,
      summary: match.summary,
      streamUrl: match.streamUrl,
      externalMatchId: match.externalMatchId,
      scheduledAt: match.scheduledAt,
      seasonTitle: match.season?.title ?? null,
      tournamentName: match.season?.tournament?.name ?? null,
      tournamentKind: match.season?.tournament?.kind ?? inferTournamentKind(match.title),
      stageName: match.stage?.name ?? null,
      stageType: match.stage?.stageType ?? null,
      stageAdvanceRule: match.stage?.advanceRule ?? null,
      roundNumber: match.roundNumber ?? null,
      sequenceNumber: match.sequenceNumber ?? null,
      games: series.games,
      seasonGraph,
      participants: legacy.participants,
      topic: match.topic
        ? {
            title: typeof match.topic.title === "string" ? match.topic.title : "",
            slug: typeof match.topic.slug === "string" ? match.topic.slug : "",
            activityNote: "activityNote" in match.topic && typeof match.topic.activityNote === "string" ? match.topic.activityNote : null,
            description: "description" in match.topic && typeof match.topic.description === "string" ? match.topic.description : null
          }
        : null,
      homeTeamName: legacy.homeTeamName,
      homeTeamId: legacy.homeTeamId,
      homeTeamSlug: legacy.homeTeamSlug,
      homeTeamSlogan: legacy.homeTeamSlogan,
      homeTeamLogoUrl: legacy.homeTeamLogoUrl,
      homeTeamCoach: legacy.homeTeamCoach,
      homeTeamCaptain: legacy.homeTeamCaptain,
      homeTeamSummary: legacy.homeTeamSummary,
      homeTeamMembers: legacy.homeTeamMembers,
      awayTeamName: legacy.awayTeamName,
      awayTeamId: legacy.awayTeamId,
      awayTeamSlug: legacy.awayTeamSlug,
      awayTeamSlogan: legacy.awayTeamSlogan,
      awayTeamLogoUrl: legacy.awayTeamLogoUrl,
      awayTeamCoach: legacy.awayTeamCoach,
      awayTeamCaptain: legacy.awayTeamCaptain,
      awayTeamSummary: legacy.awayTeamSummary,
      awayTeamMembers: legacy.awayTeamMembers,
      championTeamName: legacy.championTeamName,
      championTeamId: legacy.championTeamId,
      contentPages: match.contentPages.map((page: GenericPageLink) => ({
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        excerpt: page.excerpt
      })),
      relatedRecruitments: (match.topic?.recruitmentPosts ?? []).map((post: GenericRecruitmentLink) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        teamName: post.teamName,
        excerpt: post.excerpt,
        status: post.status
      })),
      topicContentPages: (match.topic?.contentPages ?? [])
        .filter((page: GenericPageLink) => page.slug !== match.contentPages.find((item: GenericPageLink) => item.slug === page.slug)?.slug)
        .map((page: GenericPageLink) => ({
          title: page.title,
          slug: page.slug,
          pageType: page.pageType,
          excerpt: page.excerpt
        })),
      featuredPlayers: featuredPlayers.map((player) => ({
        id: player.id,
        displayName: player.displayName,
        slug: player.slug,
        primaryRole: player.primaryRole
      })),
      highlights: match.highlights.map((highlight: GenericHighlight) => ({
        id: highlight.id,
        title: highlight.title,
        description: highlight.description,
        playerName: highlight.player?.displayName ?? null
      }))
    };
  } catch {
    const match = resolveDemoMatchBySlug(slug);
    if (!match) {
      return null;
    }

    return {
      id: match.id,
      title: match.title,
      slug: match.slug,
      status: match.status,
      format: match.format,
      bestOf: inferBestOfValue(match.format, null),
      scoreHome: match.scoreHome,
      scoreAway: match.scoreAway,
      summary: match.summary,
      streamUrl: null,
      externalMatchId: null,
      scheduledAt: null,
      seasonTitle: null,
      tournamentName: null,
      tournamentKind: inferTournamentKind(match.title),
      stageName: null,
      stageType: null,
      stageAdvanceRule: null,
      roundNumber: null,
      sequenceNumber: null,
      games: [],
      seasonGraph: null,
      topic: resolveDemoTopicById(match.topicId)
        ? {
            title: resolveDemoTopicById(match.topicId)?.title ?? null,
            slug: resolveDemoTopicById(match.topicId)?.slug ?? null,
            activityNote: resolveDemoTopicById(match.topicId)?.activityNote ?? null,
            description: resolveDemoTopicById(match.topicId)?.description ?? null
          }
        : null,
      homeTeamName: match.homeTeamName,
      homeTeamId: demoTeams.find((team) => team.name === match.homeTeamName)?.id ?? null,
      homeTeamSlug: demoTeams.find((team) => team.name === match.homeTeamName)?.slug ?? null,
      homeTeamSlogan: demoTeams.find((team) => team.name === match.homeTeamName)?.slogan ?? null,
      homeTeamLogoUrl: null,
      homeTeamCoach: null,
      homeTeamCaptain: null,
      homeTeamSummary: null,
      homeTeamMembers: (demoTeams.find((team) => team.name === match.homeTeamName)?.members ?? []).map((member) => ({
        id: member.id,
        displayName: member.displayName,
        slug: member.slug,
        primaryRole: demoPlayers.find((player) => player.slug === member.slug)?.primaryRole ?? null,
        avatarUrl: null
      })),
      awayTeamName: match.awayTeamName,
      awayTeamId: demoTeams.find((team) => team.name === match.awayTeamName)?.id ?? null,
      awayTeamSlug: demoTeams.find((team) => team.name === match.awayTeamName)?.slug ?? null,
      awayTeamSlogan: demoTeams.find((team) => team.name === match.awayTeamName)?.slogan ?? null,
      awayTeamLogoUrl: null,
      awayTeamCoach: null,
      awayTeamCaptain: null,
      awayTeamSummary: null,
      awayTeamMembers: (demoTeams.find((team) => team.name === match.awayTeamName)?.members ?? []).map((member) => ({
        id: member.id,
        displayName: member.displayName,
        slug: member.slug,
        primaryRole: demoPlayers.find((player) => player.slug === member.slug)?.primaryRole ?? null,
        avatarUrl: null
      })),
      championTeamName: null,
      championTeamId: null,
      contentPages: demoContentPages
        .filter((page) => page.matchSlug === slug)
        .map((page) => ({
          title: page.title,
          slug: page.slug,
          pageType: page.pageType,
          excerpt: page.excerpt
        })),
      relatedRecruitments: demoRecruitmentPosts
        .filter((post) => post.topicId === match.topicId)
        .map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          teamName: post.teamName,
          excerpt: post.excerpt,
          status: post.status
        })),
      topicContentPages: demoContentPages
        .filter((page) => page.topicId === match.topicId && page.matchSlug !== slug)
        .map((page) => ({
          title: page.title,
          slug: page.slug,
          pageType: page.pageType,
          excerpt: page.excerpt
        })),
      featuredPlayers: demoPlayers
        .filter((player) => player.highlightMatchIds.includes(slug))
        .map((player) => ({
          id: player.id,
          displayName: player.displayName,
          slug: player.slug,
          primaryRole: player.primaryRole
        })),
      highlights: []
    };
  }
}

export async function getContentPageBySlug(slug: string) {
  try {
    const page = await dbRuntime.contentPage.findUnique({
      where: { slug },
      include: {
        match: {
          include: {
            winnerTeam: true,
            participants: {
              include: {
                team: true
              }
            },
            season: {
              include: {
                tournament: true
              }
            }
          }
        },
        topic: {
          include: {
            recruitmentPosts: {
              orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
              take: 3
            },
            contentPages: {
              orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
              take: 6
            },
            matches: {
              include: {
                participants: {
                  include: {
                    team: true
                  }
                }
              },
              orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
              take: 3
            }
          }
        }
      }
    }) as {
      id: string;
      title: string;
      slug: string;
      pageType: string;
      excerpt: string | null;
      featured: boolean;
      publishedAt: Date | null;
      body: unknown;
      topic?: {
        title: string;
        slug: string;
        activityNote: string | null;
        description: string | null;
        recruitmentPosts?: GenericRecruitmentLink[];
        contentPages?: GenericPageLink[];
        matches?: MatchLike[];
      } | null;
      match?: (MatchLike & {
        season?: {
          title?: string | null;
          tournament?: {
            name?: string | null;
            kind?: string | null;
          } | null;
        } | null;
      }) | null;
    } | null;

    if (!page) {
      return null;
    }

    const legacy = page.match ? toLegacyMatchView(page.match) : null;

    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      pageType: page.pageType,
      excerpt: page.excerpt,
      bodyText:
        typeof page.body === "object" && page.body && "content" in (page.body as Record<string, unknown>)
          ? String((page.body as Record<string, unknown>).content ?? "")
          : JSON.stringify(page.body),
      publishedAt: page.publishedAt,
      featured: page.featured,
      matchSlug: page.match?.slug ?? null,
      matchTitle: page.match?.title ?? null,
      homeTeamName: legacy?.homeTeamName ?? null,
      homeTeamId: legacy?.homeTeamId ?? null,
      homeTeamSlug: legacy?.homeTeamSlug ?? null,
      awayTeamName: legacy?.awayTeamName ?? null,
      awayTeamId: legacy?.awayTeamId ?? null,
      awayTeamSlug: legacy?.awayTeamSlug ?? null,
      championTeamName: legacy?.championTeamName ?? null,
      championTeamId: legacy?.championTeamId ?? null,
      participantTeamNames: legacy?.participantTeamNames ?? [],
      scheduledAt: page.match?.scheduledAt ?? null,
      format: legacy?.format ?? page.match?.format ?? null,
      scoreHome: legacy?.scoreHome ?? null,
      scoreAway: legacy?.scoreAway ?? null,
      seasonTitle: page.match?.season?.title ?? null,
      tournamentName: page.match?.season?.tournament?.name ?? null,
      tournamentKind: page.match?.season?.tournament?.kind ?? inferTournamentKind(page.title),
      topic: page.topic
        ? {
            title: typeof page.topic.title === "string" ? page.topic.title : "",
            slug: typeof page.topic.slug === "string" ? page.topic.slug : "",
            activityNote: typeof page.topic.activityNote === "string" ? page.topic.activityNote : null,
            description: typeof page.topic.description === "string" ? page.topic.description : null
          }
        : null,
      relatedRecruitments: (page.topic?.recruitmentPosts ?? []).map((post: GenericRecruitmentLink) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        teamName: post.teamName,
        excerpt: post.excerpt,
        status: post.status
      })),
      relatedTopicPages: (page.topic?.contentPages ?? [])
        .filter((item: GenericPageLink) => item.slug !== page.slug)
        .map((item: GenericPageLink) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          pageType: item.pageType,
          excerpt: item.excerpt
        })),
      relatedTopicMatches: (page.topic?.matches ?? []).map((match: MatchLike) => {
        const relatedLegacy = toLegacyMatchView(match);
        return {
          id: match.id,
          slug: match.slug,
          title: match.title,
          status: match.status,
          homeTeamName: relatedLegacy.homeTeamName,
          awayTeamName: relatedLegacy.awayTeamName,
          participantTeamNames: relatedLegacy.participantTeamNames
        };
      })
    };
  } catch {
    const page = demoContentPages.find((item) => item.slug === slug);
    if (!page) {
      return null;
    }

    const match = demoMatches.find((item) => item.slug === page.matchSlug);

    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      pageType: page.pageType,
      excerpt: page.excerpt,
      bodyText: page.body,
      publishedAt: null,
      featured: page.featured,
      matchSlug: page.matchSlug,
      matchTitle: match?.title ?? null,
      homeTeamName: match?.homeTeamName ?? null,
      homeTeamId: demoTeams.find((team) => team.name === match?.homeTeamName)?.id ?? null,
      homeTeamSlug: demoTeams.find((team) => team.name === match?.homeTeamName)?.slug ?? null,
      awayTeamName: match?.awayTeamName ?? null,
      awayTeamId: demoTeams.find((team) => team.name === match?.awayTeamName)?.id ?? null,
      awayTeamSlug: demoTeams.find((team) => team.name === match?.awayTeamName)?.slug ?? null,
      championTeamName: null,
      championTeamId: null,
      scheduledAt: null,
      format: match?.format ?? null,
      scoreHome: match?.scoreHome ?? null,
      scoreAway: match?.scoreAway ?? null,
      seasonTitle: null,
      tournamentName: null,
      tournamentKind: inferTournamentKind(page.title),
      topic: resolveDemoTopicById(page.topicId)
        ? {
            title: resolveDemoTopicById(page.topicId)?.title ?? null,
            slug: resolveDemoTopicById(page.topicId)?.slug ?? null,
            activityNote: resolveDemoTopicById(page.topicId)?.activityNote ?? null,
            description: resolveDemoTopicById(page.topicId)?.description ?? null
          }
        : null,
      relatedRecruitments: demoRecruitmentPosts
        .filter((post) => post.topicId === page.topicId)
        .map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          teamName: post.teamName,
          excerpt: post.excerpt,
          status: post.status
        })),
      relatedTopicPages: demoContentPages
        .filter((item) => item.topicId === page.topicId && item.slug !== page.slug)
        .map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          pageType: item.pageType,
          excerpt: item.excerpt
        })),
      relatedTopicMatches: demoMatches
        .filter((item) => item.topicId === page.topicId)
        .map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          status: item.status,
          homeTeamName: item.homeTeamName,
          awayTeamName: item.awayTeamName
        }))
    };
  }
}
