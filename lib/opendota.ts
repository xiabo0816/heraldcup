const API_BASE = process.env.OPENDOTA_API_BASE_URL || "https://api.opendota.com/api";
const STEAM_ID_64_OFFSET = 76561197960265728n;

type OpenDotaProfile = {
  profile?: {
    account_id?: number;
    personaname?: string;
    avatarfull?: string;
  };
  rank_tier?: number;
  leaderboard_rank?: number | null;
  mmr_estimate?: {
    estimate?: number;
  };
};

type OpenDotaHeroStats = {
  hero_id: number;
  games: number;
  win: number;
};

export type OpenDotaRecentMatch = {
  match_id: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  player_slot: number;
  radiant_win: boolean;
  game_mode: number;
  start_time: number;
  duration?: number;
};

type OpenDotaWinLoss = {
  win: number;
  lose: number;
};

export type OpenDotaTopHero = {
  heroId: number;
  games: number;
  wins: number;
  winRate: number;
};

export type OpenDotaPlayerSummary = {
  accountId: number | null;
  personaName: string | null;
  avatarUrl: string | null;
  rankTier: number | null;
  leaderboardRank: number | null;
  mmrEstimate: number | null;
  recentMatchCount: number;
  generatedFrom: "opendota";
  lifetimeWins: number | null;
  lifetimeLosses: number | null;
  recentWinCount: number;
  recentLossCount: number;
  recentAverageKda: number | null;
};

export type OpenDotaPlayerReport = {
  summary: OpenDotaPlayerSummary;
  topHeroes: OpenDotaTopHero[];
  recentMatches: OpenDotaRecentMatch[];
  rawPayload: {
    profile: OpenDotaProfile;
    heroStats: OpenDotaHeroStats[];
    recentMatches: OpenDotaRecentMatch[];
    winLoss: OpenDotaWinLoss;
  };
};

function calculateRecentMatchWin(match: OpenDotaRecentMatch) {
  const isRadiant = match.player_slot < 128;
  return (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
}

function calculateAverageKda(matches: OpenDotaRecentMatch[]) {
  if (!matches.length) {
    return null;
  }

  const total = matches.reduce((sum, match) => sum + ((match.kills + match.assists) / Math.max(match.deaths, 1)), 0);
  return Number((total / matches.length).toFixed(2));
}

export function resolveOpenDotaAccountId(steamIdOrAccountId: string) {
  const normalized = steamIdOrAccountId.trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error("SteamID 格式无效，必须是纯数字。");
  }

  const numericId = BigInt(normalized);

  if (normalized.length >= 16) {
    if (numericId < STEAM_ID_64_OFFSET) {
      throw new Error("SteamID64 格式无效，无法转换为 OpenDota account_id。");
    }

    return (numericId - STEAM_ID_64_OFFSET).toString();
  }

  return normalized;
}

async function openDotaFetch<T>(path: string): Promise<T> {
  const normalizedBase = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(normalizedPath, normalizedBase);
  if (process.env.OPENDOTA_API_KEY) {
    url.searchParams.set("api_key", process.env.OPENDOTA_API_KEY);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: { revalidate: 60 * 30 }
  });

  if (!response.ok) {
    throw new Error(`OpenDota request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function buildPlayerReport(steamId: string): Promise<OpenDotaPlayerReport> {
  const accountId = resolveOpenDotaAccountId(steamId);

  const [profile, heroStats, recentMatches, winLoss] = await Promise.all([
    openDotaFetch<OpenDotaProfile>(`/players/${accountId}`),
    openDotaFetch<OpenDotaHeroStats[]>(`/players/${accountId}/heroes`),
    openDotaFetch<OpenDotaRecentMatch[]>(`/players/${accountId}/recentMatches`),
    openDotaFetch<OpenDotaWinLoss>(`/players/${accountId}/wl`)
  ]);

  const recentWindow = recentMatches.slice(0, 10);
  const recentWinCount = recentWindow.filter(calculateRecentMatchWin).length;
  const recentLossCount = Math.max(recentWindow.length - recentWinCount, 0);

  const topHeroes = heroStats
    .sort((left, right) => right.games - left.games)
    .slice(0, 5)
    .map((hero) => ({
      heroId: hero.hero_id,
      games: hero.games,
      wins: hero.win,
      winRate: hero.games > 0 ? Number(((hero.win / hero.games) * 100).toFixed(1)) : 0
    }));

  const summary: OpenDotaPlayerSummary = {
    accountId: profile.profile?.account_id ?? null,
    personaName: profile.profile?.personaname ?? null,
    avatarUrl: profile.profile?.avatarfull ?? null,
    rankTier: profile.rank_tier ?? null,
    leaderboardRank: profile.leaderboard_rank ?? null,
    mmrEstimate: profile.mmr_estimate?.estimate ?? null,
    recentMatchCount: recentWindow.length,
    lifetimeWins: winLoss.win ?? null,
    lifetimeLosses: winLoss.lose ?? null,
    recentWinCount,
    recentLossCount,
    recentAverageKda: calculateAverageKda(recentWindow),
    generatedFrom: "opendota"
  };

  return {
    summary,
    topHeroes,
    recentMatches: recentWindow,
    rawPayload: {
      profile,
      heroStats: heroStats.slice(0, 20),
      recentMatches,
      winLoss
    }
  };
}
